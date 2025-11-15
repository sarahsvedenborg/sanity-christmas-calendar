import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Card, Flex, Spinner, Stack, Switch, Text } from "@sanity/ui";
import {
  type ArrayOfObjectsInputProps,
  type ReferenceValue,
  set,
  useClient,
} from "sanity";

type CalendarTask = {
  _id: string;
  title: string;
  dayNumber?: number;
};

type TaskStatusValue = {
  _key?: string;
  _type?: "taskStatus";
  completed?: boolean;
  calendarDay?: ReferenceValue;
};

const TASKS_QUERY = `
*[_type == "christmasCalendar"] | order(orderRank asc)[0]{
  "days": days[]->{
    _id,
    title,
    dayNumber
  }
}`;

export function TaskCompletionStatusInput(
  props: ArrayOfObjectsInputProps<TaskStatusValue>
) {
  const { value, onChange, readOnly } = props;
  const client = useClient({ apiVersion: "2025-01-01" });
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchTasks() {
      try {
        setLoading(true);
        const result = await client.fetch<{ days?: CalendarTask[] }>(
          TASKS_QUERY
        );
        if (!isMounted) {
          return;
        }
        setTasks(result?.days ?? []);
        setError(null);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Klarte ikke hente kalenderluker.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTasks();
    return () => {
      isMounted = false;
    };
  }, [client]);

  const normalizedStatuses = useMemo(() => {
    if (!tasks.length) {
      return [];
    }

    return tasks.map((task) => {
      const existing = (value ?? []).find(
        (item) => item?.calendarDay?._ref === task._id
      );

      if (existing) {
        return {
          ...existing,
          _key: existing._key ?? task._id,
          calendarDay: existing.calendarDay ?? {
            _type: "reference",
            _ref: task._id,
          },
        };
      }

      return {
        _type: "taskStatus",
        _key: task._id,
        calendarDay: {
          _type: "reference",
          _ref: task._id,
        },
        completed: false,
      };
    });
  }, [tasks, value]);

  useEffect(() => {
    if (!tasks.length) {
      return;
    }

    const valueLength = value?.length ?? 0;
    const needsSync =
      valueLength !== normalizedStatuses.length ||
      normalizedStatuses.some((status, index) => {
        const current = value?.[index];
        return (
          current?.calendarDay?._ref !== status.calendarDay?._ref ||
          current?._key !== status._key
        );
      });

    if (needsSync) {
      onChange(set(normalizedStatuses));
    }
  }, [normalizedStatuses, onChange, tasks.length, value]);

  const handleToggle = useCallback(
    (taskId: string) => {
      if (readOnly) {
        return;
      }

      const updated = normalizedStatuses.map((status) =>
        status.calendarDay?._ref === taskId
          ? { ...status, completed: !status.completed }
          : status
      );

      onChange(set(updated));
    },
    [normalizedStatuses, onChange, readOnly]
  );

  if (loading) {
    return (
      <Card padding={4} radius={3} shadow={1}>
        <Flex align="center" gap={3}>
          <Spinner muted />
          <Text size={1}>Henter kalenderluker …</Text>
        </Flex>
      </Card>
    );
  }

  if (error) {
    return (
      <Card padding={4} radius={3} shadow={1} tone="critical">
        <Text size={1}>{error}</Text>
      </Card>
    );
  }

  if (!tasks.length) {
    return (
      <Card padding={4} radius={3} shadow={1}>
        <Text size={1}>
          Ingen kalenderluker funnet. Legg til dager i julekalenderen først.
        </Text>
      </Card>
    );
  }

  return (
    <Stack space={3}>
      {normalizedStatuses.map((status) => {
        const task = tasks.find(
          (day) => day._id === status.calendarDay?._ref
        );
        if (!task) {
          return null;
        }

        return (
          <Card
            key={task._id}
            padding={3}
            radius={3}
            shadow={1}
            tone={status.completed ? "positive" : undefined}
          >
            <Flex align="center" justify="space-between" gap={4}>
              <Stack space={1}>
                <Text size={1} weight="semibold">
                  Dag {task.dayNumber ?? "?"}
                </Text>
                <Text size={1} muted>
                  {task.title}
                </Text>
              </Stack>
              <Box>
                <Switch
                  checked={Boolean(status.completed)}
                  disabled={readOnly}
                  onChange={() => handleToggle(task._id)}
                />
              </Box>
            </Flex>
          </Card>
        );
      })}
    </Stack>
  );
}

