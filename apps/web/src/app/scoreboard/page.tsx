import { sanityFetch } from "@/lib/sanity/live";
import { queryScoreboardData } from "@/lib/sanity/query";
import { Snowflakes } from "@/components/elements/snowflakes";
import { ScoreboardContent } from "@/components/scoreboard-content";
import { Info } from "lucide-react";

export const revalidate = 10;

type ScoreboardUser = {
  _id: string;
  name?: string;
  email?: string;
  participantType?: string;
  taskCompletionStatus?: Array<{
    completed?: boolean;
    calendarDay?: {
      _id: string;
      dayNumber?: number;
      title?: string;
      isBreak?: boolean;
    } | null;
  }>;
};

function calculateProgress(user: ScoreboardUser) {
  // Filter out break days and only count actual tasks
  const tasks = user.taskCompletionStatus?.filter(
    (status) => status.calendarDay?._id && !status.calendarDay?.isBreak
  ) ?? [];
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const percentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return {
    totalTasks,
    completedTasks,
    percentage,
  };
}

export default async function ScoreboardPage() {
  const { data } = await sanityFetch({
    query: queryScoreboardData,
    stega: true,
  });

  const users = (Array.isArray(data) ? data : []) as ScoreboardUser[];

  // Calculate progress for each user and sort by percentage (highest first)
  const usersWithProgress = users
    .map((user) => ({
      ...user,
      progress: calculateProgress(user),
    }))
    .sort((a, b) => {
      // Sort by percentage (descending), then by completed tasks, then by name
      if (b.progress.percentage !== a.progress.percentage) {
        return b.progress.percentage - a.progress.percentage;
      }
      if (b.progress.completedTasks !== a.progress.completedTasks) {
        return b.progress.completedTasks - a.progress.completedTasks;
      }
      return (a.name || "").localeCompare(b.name || "");
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">
            🏆 Scoreboard
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="group relative inline-flex cursor-help items-center">
              <span className="text-white/70 text-md">Hvorfor er jeg tagget med denne kategorien?{' '}</span>
              <Info className="ml-2 h-5 w-5 text-white/70 transition-colors hover:text-white" />
              <span
                className=" pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden w-80 -translate-x-1/2 rounded-xl border border-amber-300/70 bg-white/95 p-4 text-left text-sm text-green-900 shadow-xl transition-all group-hover:block group-focus-within:block dark:border-amber-700/50 dark:bg-green-950/95 dark:text-amber-100"
                role="tooltip"
              >
                Du blir tagget i systement med den rollen som passer best til avdelingen du tilhører. Alle står fritt til å velge de oppgavene man vil, men man vil dukke opp under den kategorien man er tagget med. Dersom du ønsker å tagges i den andre kategorien, si i fra til Sarah Svedenborg.
              </span>
            </span>
          </div>
        </header>

        {usersWithProgress.length === 0 ? (
          <div className="rounded-2xl border border-amber-300/60 bg-white/90 p-8 text-center shadow-sm backdrop-blur dark:border-amber-700/50 dark:bg-green-950/80">
            <p className="text-lg text-green-900 dark:text-white/70">
              Ingen deltakere har valgt å være med på scoreboardet enda.
            </p>
          </div>
        ) : (
          <ScoreboardContent users={usersWithProgress} />
        )}
      </div>
    </div>
  );
}

