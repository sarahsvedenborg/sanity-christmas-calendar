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
    <div className="space-y-4">
      {users.map((user, index) => {
        const { totalTasks, completedTasks, percentage } = user.progress;
        const rank = index + 1;
        
        // Determine medal/rank emoji
        const rankEmoji = 
          rank === 1 ? "🥇" :
          rank === 2 ? "🥈" :
          rank === 3 ? "🥉" :
          `#${rank}`;

        return (
          <div
            key={user._id}
            className="rounded-2xl border border-amber-300/60 bg-white/95 p-6 shadow-md transition hover:shadow-xl backdrop-blur dark:border-amber-700/50 dark:bg-green-950/85"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="text-3xl font-bold shrink-0">
                  {rankEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-green-950 dark:text-white truncate">
                    {user.name || "Ukjent deltaker"}
                  </h3>
                 {/*  {user.email && (
                    <p className="text-sm text-green-900/70 dark:text-white/60 truncate">
                       {user.email} {user.participantType}
                    </p>
                  )} */}
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
               {/*  <div className="text-right">
                  <p className="text-2xl font-bold text-green-950 dark:text-white">
                    {percentage}%
                  </p>
                  <p className="text-sm text-green-900/70 dark:text-white/60">
                    {completedTasks} / {totalTasks} oppgaver
                  </p>
                </div> */}
                <div className="w-24 h-24 shrink-0">
                  <div className="relative w-full h-full">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-amber-200/20 dark:text-amber-700/30"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
                        strokeLinecap="round"
                        className="text-amber-500 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-950 dark:text-white">
                        {completedTasks}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           {/*  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-amber-200/20 dark:bg-amber-700/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div> */}
          </div>
        );
      })}
    </div>
  );
}

