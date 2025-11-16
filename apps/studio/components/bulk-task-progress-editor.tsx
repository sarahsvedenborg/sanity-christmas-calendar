"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, Flex, Heading, Spinner, Stack, Switch, Text, useToast } from "@sanity/ui";
import { RefreshCw } from "lucide-react";
import type { ComponentType } from "react";
import { useClient } from "sanity";

type User = {
  _id: string;
  _rev?: string;
  name: string;
  email: string;
  taskCompletionStatus?: TaskStatus[];
};

type TaskStatus = {
  _key?: string;
  _type?: "taskStatus";
  completed?: boolean;
  calendarDay?: {
    _id: string;
    title: string;
    dayNumber?: number;
  } | {
    _type: "reference";
    _ref: string;
  };
};

type CalendarDay = {
  _id: string;
  title: string;
  dayNumber?: number;
};

const USERS_QUERY = `*[_type == "user"] | order(name asc){
  _id,
  _rev,
  name,
  email,
  taskCompletionStatus[]{
    _key,
    _type,
    completed,
    calendarDay->{
      _id,
      title,
      dayNumber
    }
  }
}`;

const CALENDAR_DAYS_QUERY = `*[_type == "christmasCalendar"] | order(orderRank asc)[0]{
  "days": days[]->{
    _id,
    title,
    dayNumber
  }
}`;

export function BulkTaskProgressEditor() {
  const client = useClient({ apiVersion: "2025-01-01" });
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<
    Map<string, Map<string, boolean>>
  >(new Map());
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersResult, calendarResult] = await Promise.all([
        client.fetch<User[]>(USERS_QUERY),
        client.fetch<{ days?: CalendarDay[] }>(CALENDAR_DAYS_QUERY),
      ]);

      // Deduplicate users by email (keep the most recent one if duplicates exist)
      // This ensures each user appears only once, even if there are multiple documents with the same email
      const uniqueUsersMap = new Map<string, User>();
      (usersResult ?? []).forEach((user) => {
        const email = user.email?.toLowerCase().trim() || "";
        if (!email) return; // Skip users without email
        
        const existing = uniqueUsersMap.get(email);
        // Keep the user with the most recent _rev if duplicates by email
        if (!existing || (user._rev && existing._rev && user._rev > existing._rev)) {
          uniqueUsersMap.set(email, user);
        }
      });
      const deduplicatedUsers = Array.from(uniqueUsersMap.values()).sort((a, b) => 
        (a.name || "").localeCompare(b.name || "")
      );

      setUsers(deduplicatedUsers);
      setCalendarDays(
        (calendarResult?.days ?? []).sort(
          (a, b) => (a.dayNumber ?? 0) - (b.dayNumber ?? 0)
        )
      );
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch data";
      setError(message);
      toast.push({
        status: "error",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [client, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh when window regains focus (user might have edited in another tab)
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchData]);

  const getTaskStatus = useCallback(
    (userId: string, taskId: string): boolean => {
      // Check pending changes first
      const userChanges = pendingChanges.get(userId);
      if (userChanges?.has(taskId)) {
        return userChanges.get(taskId) ?? false;
      }

      // Otherwise check actual data
      const user = users.find((u) => u._id === userId);
      if (!user?.taskCompletionStatus) return false;

      // calendarDay is dereferenced in the query, so it has _id, not _ref
      const status = user.taskCompletionStatus.find((ts) => {
        if (!ts.calendarDay) return false;
        // Handle dereferenced object
        if ("_id" in ts.calendarDay) {
          return ts.calendarDay._id === taskId;
        }
        // Handle reference object (shouldn't happen with current query, but for safety)
        if ("_ref" in ts.calendarDay) {
          return ts.calendarDay._ref === taskId;
        }
        return false;
      });
      return status?.completed ?? false;
    },
    [users, pendingChanges]
  );

  const handleToggle = useCallback(
    (userId: string, taskId: string, currentStatus: boolean) => {
      setPendingChanges((prev) => {
        const newMap = new Map(prev);
        const userChanges = newMap.get(userId) ?? new Map<string, boolean>();
        userChanges.set(taskId, !currentStatus);
        newMap.set(userId, userChanges);
        return newMap;
      });
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (pendingChanges.size === 0) {
      toast.push({
        status: "info",
        title: "No changes",
        description: "No changes to save",
      });
      return;
    }

    setSaving(true);
    try {
      const patches = Array.from(pendingChanges.entries()).map(
        ([userId, taskChanges]) => {
          const user = users.find((u) => u._id === userId);
          if (!user) return null;

          // Get current task completion status
          const currentStatuses = user.taskCompletionStatus ?? [];

          // Apply pending changes
          // Helper to get task ID from either dereferenced (_id) or reference (_ref)
          const getTaskId = (calendarDay: TaskStatus["calendarDay"]): string | undefined => {
            if (!calendarDay) return undefined;
            if ("_id" in calendarDay) return calendarDay._id;
            if ("_ref" in calendarDay) return calendarDay._ref;
            return undefined;
          };

          const updatedStatuses = currentStatuses.map((status) => {
            const taskId = getTaskId(status.calendarDay);
            if (!taskId) return status;
            
            // Convert to reference format for saving
            const referenceStatus = {
              _key: status._key || taskId,
              _type: "taskStatus" as const,
              calendarDay: {
                _type: "reference" as const,
                _ref: taskId,
              },
              completed: taskChanges.has(taskId) 
                ? taskChanges.get(taskId) ?? status.completed ?? false
                : status.completed ?? false,
            };

            return referenceStatus;
          });

          // Add new statuses for tasks that weren't in the array
          taskChanges.forEach((completed, taskId) => {
            const exists = updatedStatuses.some((s) => {
              const existingTaskId = getTaskId(s.calendarDay);
              return existingTaskId === taskId;
            });
            if (!exists) {
              updatedStatuses.push({
                _type: "taskStatus",
                _key: taskId,
                calendarDay: {
                  _type: "reference",
                  _ref: taskId,
                },
                completed,
              });
            }
          });

          return {
            patch: {
              id: userId,
              set: {
                taskCompletionStatus: updatedStatuses,
              },
            },
          };
        }
      );

      const validPatches = patches.filter(
        (p): p is NonNullable<typeof p> => p !== null
      );

      if (validPatches.length === 0) {
        toast.push({
          status: "error",
          title: "Error",
          description: "No valid patches to apply",
        });
        return;
      }

      // Batch commit all changes
      const transaction = client.transaction();
      validPatches.forEach(({ patch }) => {
        transaction.patch(patch.id, (p) =>
          p.set({ taskCompletionStatus: patch.set.taskCompletionStatus })
        );
      });

      await transaction.commit();

      // Refresh data
      const [usersResult] = await Promise.all([
        client.fetch<User[]>(USERS_QUERY),
      ]);

      setUsers(usersResult ?? []);
      setPendingChanges(new Map());
      setSuccessMessage(`Successfully updated ${validPatches.length} user(s)`);
      setTimeout(() => setSuccessMessage(null), 5000);

      toast.push({
        status: "success",
        title: "Success",
        description: `Updated ${validPatches.length} user(s)`,
      });
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Failed to save changes";
      setError(message);
      toast.push({
        status: "error",
        title: "Error",
        description: message,
      });
    } finally {
      setSaving(false);
    }
  }, [pendingChanges, users, client, toast]);

  const completionCounts = useMemo(() => {
    if (!calendarDays.length || !users.length) {
      return new Map<string, number>();
    }
    const counts = new Map<string, number>();
    calendarDays.forEach((day) => {
      const completed = users.filter((user) =>
        getTaskStatus(user._id, day._id)
      ).length;
      counts.set(day._id, completed);
    });
    return counts;
  }, [users, calendarDays, getTaskStatus]);

  const hasChanges = pendingChanges.size > 0;

  if (loading) {
    return (
      <Box padding={4}>
        <Flex align="center" justify="center" gap={3}>
          <Spinner muted />
          <Text muted>Loading users and tasks...</Text>
        </Flex>
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={4}>
        <Card padding={4} radius={2} shadow={1} tone="critical">
          <Stack space={3}>
            <Heading size={1}>Error</Heading>
            <Text>{error}</Text>
          </Stack>
        </Card>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box padding={4}>
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={3}>
            <Heading size={1}>No users found</Heading>
            <Text muted>
              Create some users first to track their task progress.
            </Text>
          </Stack>
        </Card>
      </Box>
    );
  }

  if (calendarDays.length === 0) {
    return (
      <Box padding={4}>
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={3}>
            <Heading size={1}>No tasks found</Heading>
            <Text muted>
              Add calendar days to the Christmas calendar first.
            </Text>
          </Stack>
        </Card>
      </Box>
    );
  }

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Flex align="center" justify="space-between" gap={3}>
          <Stack space={2}>
            <Heading size={2}>Bulk Task Progress Editor</Heading>
            <Text muted size={1}>
              Toggle task completion for multiple users at once. Changes are
              saved in batch when you click "Save Changes".
            </Text>
          </Stack>
          <Flex gap={2}>
            <Button
              icon={RefreshCw}
              text="Refresh"
              mode="ghost"
              onClick={fetchData}
              disabled={loading}
              tone="default"
            />
            {hasChanges && (
              <Button
                text="Save Changes"
                tone="primary"
                onClick={handleSave}
                disabled={saving}
                loading={saving}
              />
            )}
          </Flex>
        </Flex>

        <Card padding={2} radius={2} shadow={1} style={{ overflowX: "auto" }}>
          <Box style={{ minWidth: "100%", display: "table" }}>
            <Box
              style={{
                display: "table-header-group",
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: "var(--card-bg-color)",
              }}
            >
              <Box style={{ display: "table-row" }}>
                <Box
                  style={{
                    display: "table-cell",
                    padding: "0.75rem",
                    fontWeight: 600,
                    borderBottom: "1px solid var(--card-border-color)",
                    position: "sticky",
                    left: 0,
                    zIndex: 11,
                    backgroundColor: "var(--card-bg-color)",
                    minWidth: "200px",
                  }}
                >
                  <Text weight="semibold">User</Text>
                </Box>
                {calendarDays.map((day) => (
                  <Box
                    key={day._id}
                    style={{
                      display: "table-cell",
                      padding: "0.5rem",
                      textAlign: "center",
                      borderBottom: "1px solid var(--card-border-color)",
                      minWidth: "120px",
                    }}
                  >
                    <Stack space={1}>
                      <Text size={0} weight="semibold">
                        Day {day.dayNumber ?? "?"}
                      </Text>
                      <Text size={0} muted>
                        {completionCounts.get(day._id) ?? 0}/{users.length}
                      </Text>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box style={{ display: "table-row-group" }}>
              {users.map((user) => (
                <Box key={user._id} style={{ display: "table-row" }}>
                  <Box
                    style={{
                      display: "table-cell",
                      padding: "0.75rem",
                      borderBottom: "1px solid var(--card-border-color)",
                      position: "sticky",
                      left: 0,
                      zIndex: 10,
                      backgroundColor: "var(--card-bg-color)",
                    }}
                  >
                    <Stack space={1}>
                      <Text size={1} weight="medium">
                        {user.name}
                      </Text>
                      <Text size={0} muted>
                        {user.email}
                      </Text>
                    </Stack>
                  </Box>
                  {calendarDays.map((day) => {
                    const isCompleted = getTaskStatus(user._id, day._id);
                    const hasPendingChange = pendingChanges
                      .get(user._id)
                      ?.has(day._id);
                    return (
                      <Box
                        key={day._id}
                        style={{
                          display: "table-cell",
                          padding: "0.5rem",
                          textAlign: "center",
                          borderBottom: "1px solid var(--card-border-color)",
                          backgroundColor: hasPendingChange
                            ? "var(--card-bg-color-hover)"
                            : undefined,
                        }}
                      >
                        <Flex align="center" justify="center">
                          <Switch
                            checked={isCompleted}
                            onChange={() =>
                              handleToggle(user._id, day._id, isCompleted)
                            }
                          />
                        </Flex>
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>
        </Card>

        {successMessage && (
          <Card padding={3} radius={2} shadow={1} tone="positive">
            <Flex align="center" gap={3}>
              <Text size={1} weight="medium">
                {successMessage}
              </Text>
            </Flex>
          </Card>
        )}
        {hasChanges && !successMessage && (
          <Card padding={3} radius={2} shadow={1} tone="caution">
            <Flex align="center" gap={3}>
              <Text size={1} weight="medium">
                You have unsaved changes. Click "Save Changes" to apply them.
              </Text>
            </Flex>
          </Card>
        )}
      </Stack>
    </Box>
  );
}

export default BulkTaskProgressEditor as ComponentType;

