"use client";

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

type ScoreboardListProps = {
  users: ScoreboardUser[];
};

export function ScoreboardList({ users }: ScoreboardListProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-300/60 bg-white/90 p-8 text-center shadow-sm backdrop-blur dark:border-amber-700/50 dark:bg-green-950/80">
        <p className="text-lg text-green-900 dark:text-white/70">
          Ingen deltakere i denne kategorien.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-amber-300/60 bg-white/95 shadow-md backdrop-blur dark:border-amber-700/50 dark:bg-green-950/85">
      <table className="w-full">
        <thead>
          <tr className="border-b border-amber-300/30 dark:border-amber-700/30">
            <th className="px-4 py-3 text-left text-sm font-semibold text-green-950 dark:text-white">
              Plass
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-green-950 dark:text-white">
              Navn
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-green-950 dark:text-white">
              Fullført
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-green-950 dark:text-white">
              Totalt
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-green-950 dark:text-white">
              Prosent
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-green-950 dark:text-white">
              Fremgang
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const { totalTasks, completedTasks, percentage } = user.progress;
            const rank = index + 1;
            
            // Determine medal/rank emoji
            const rankDisplay = 
           /*    rank === 1 ? "🥇" :
              rank === 2 ? "🥈" :
              rank === 3 ? "🥉" : */
              `#${rank.toString()}`;

            return (
              <tr
                key={user._id}
                className="border-b border-amber-300/20 transition-colors hover:bg-amber-50/50 dark:border-amber-700/20 dark:hover:bg-green-900/30"
              >
                <td className="px-4 py-3 text-lg font-bold text-green-950 dark:text-white">
                  {rankDisplay}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-green-950 dark:text-white">
                    {user.name || "Ukjent deltaker"}
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-lg font-bold text-green-950 dark:text-white">
                  {completedTasks}
                </td>
                <td className="px-4 py-3 text-center text-green-900/70 dark:text-white/60">
                  {totalTasks}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-lg font-semibold text-green-950 dark:text-white">
                    {percentage}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="mx-auto w-24">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-amber-200/20 dark:bg-amber-700/20">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
