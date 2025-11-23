"use client";

import { useState, useMemo } from "react";
import { ScoreboardFilter } from "./scoreboard-filter";
import { ScoreboardList } from "./scoreboard-list";

type ScoreboardUser = {
  _id: string;
  name?: string;
  email?: string;
  participantType?: string;
  progress: {
    totalTasks: number;
    completedTasks: number;
    percentage: number;
  };
};

type ScoreboardContentProps = {
  users: ScoreboardUser[];
};

export function ScoreboardContent({ users }: ScoreboardContentProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "tech" | "design">("all");

  const filteredUsers = useMemo(() => {
    let filtered: ScoreboardUser[];
    if (activeFilter === "all") {
      filtered = users;
    } else {
      filtered = users.filter(
        (user) => user.participantType === activeFilter
      );
    }

    // Re-sort filtered users
    return [...filtered].sort((a, b) => {
      if (b.progress.percentage !== a.progress.percentage) {
        return b.progress.percentage - a.progress.percentage;
      }
      if (b.progress.completedTasks !== a.progress.completedTasks) {
        return b.progress.completedTasks - a.progress.completedTasks;
      }
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [users, activeFilter]);

  return (
    <>
      <ScoreboardFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <ScoreboardList users={filteredUsers} />
    </>
  );
}

