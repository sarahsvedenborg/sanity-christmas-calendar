import Link from "next/link";

import { sanityFetch } from "@/lib/sanity/live";
import { queryUserProgressByEmail } from "@/lib/sanity/query";
import { Snowflakes } from "@/components/elements/snowflakes";

type TaskStatus = {
  completed?: boolean;
  calendarDay?: {
    _id: string;
    title?: string;
    dayNumber?: number;
    slug?: string;
    category?: {
      _id: string;
      title?: string;
    } | null;
  } | null;
};

type UserProgress = {
  name?: string;
  email?: string;
  taskCompletionStatus?: TaskStatus[];
} | null;

const HARD_CODED_EMAIL = "stian.svedenborg@test.no";
//const HARD_CODED_EMAIL = "sarah.svedenborg@test.no";
//const HARD_CODED_EMAIL = "test@test.no";
// const HARD_CODED_EMAIL = process.env.PROGRESJON_EMAIL ?? "";

async function fetchProgress(): Promise<UserProgress> {
  if (!HARD_CODED_EMAIL) {
    return null;
  }

  const response = await sanityFetch({
    query: queryUserProgressByEmail,
    params: { email: HARD_CODED_EMAIL },
  });

  return response.data ?? null;
}

function formatPercent(completed: number, total: number) {
  if (!total) {
    return 0;
  }
  return Math.round((completed / total) * 100);
}

export const revalidate = 60;

export default async function ProgressionPage() {
  const progress = await fetchProgress();
  const hasEmail = Boolean(HARD_CODED_EMAIL);
  const isMissingUser = hasEmail && !progress;
  const tasks =
    progress?.taskCompletionStatus?.filter(
      (status): status is Required<TaskStatus> &
        Required<Pick<TaskStatus, "calendarDay">> &
        { calendarDay: NonNullable<TaskStatus["calendarDay"]> } =>
        Boolean(status?.calendarDay?._id)
    ) ?? [];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const percent = formatPercent(completedTasks, totalTasks);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 py-16 text-white">
      <div className="pointer-events-none fixed inset-0 opacity-60" />
    {/*    <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div> */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-amber-200">
            🎯 Fremdrift
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Din julekalender-progresjon
          </h1>
            {hasEmail ? (
              <p className="text-white/80">
                Viser status for{" "}
                <span className="font-semibold text-white">
                  {progress?.name ?? "Ukjent deltaker"}
                </span>{" "}
                (
                <span className="font-mono text-amber-200">
                  {progress?.email ?? HARD_CODED_EMAIL}
                </span>
                )
              </p>
            ) : (
              <p className="text-white/80">
                Angi e-postadresse ved innlogging for å vise progresjonen din.
              </p>
            )}
        </header>

        {!hasEmail ? (
          <section className="rounded-3xl border border-white/10 bg-white/10 p-10 text-center shadow-2xl backdrop-blur">
            <p className="text-xl font-semibold text-white">
              Du er ikke logget inn.
            </p>
            <p className="mt-2 text-white/70">
              Logg inn for å se fremdriften din i julekalenderen.
            </p>
            <p className="mt-2 text-white/70">
              Kun <strong>Sopra Steria</strong>-brukere kan logge inn for å se progresjonen sin.
            </p>
             <p className="mt-2 text-white/70 max-w-lg mx-auto">
              Dersom du ikke jobber i Sopra Steria er du hjertelig velkommen til å følge julekalenderen, men du må selv holde styr på egen progresjon.
            </p>
            <div className="mt-6">
              <Link
                className="inline-flex items-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-green-950 transition hover:bg-amber-300"
                href="/login"
              >
                Gå til innlogging
              </Link>
            </div>
          </section>
        ) : isMissingUser ? (
          <section className="rounded-3xl border border-white/10 bg-white/10 p-10 text-center shadow-2xl backdrop-blur">
            <p className="text-xl font-semibold text-white">
              Denne e-postadressen er ikke registrert enda.
            </p>
            <p className="mt-2 text-white/70 max-w-lg mx-auto">
              Trykk på knappen under for å gå til registreringsskjemaet og få muligheten til å tracke progresjonen din og være med i trekningen av kule Sanitypremier.
            </p>
            
            <div className="mt-6">
              <Link
                className="inline-flex items-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-green-950 transition hover:bg-amber-300"
                href="#"
                rel="noreferrer"
                target="_blank"
              >
                Gå til registrering
              </Link>
            </div>
             <p className="mt-4 text-white/70 max-w-lg mx-auto ">
            Dersom du allerede har regisrert seg, kontakt Sarah Svedenoborg i Sopra Steria.
            </p>
          </section>
        ) : (
          <>
            <section className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm uppercase tracking-wide text-white/60">
                    Fullført
                  </p>
                  <p className="text-4xl font-semibold text-white">
                    {completedTasks}
                    <span className="text-lg text-white/70">
                      {" "}
                      / {totalTasks}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-white/60">
                    Fremdrift
                  </p>
                  <p className="text-4xl font-semibold text-white">
                    {percent}%
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-white/60">
                    Neste steg
                  </p>
                  <p className="text-lg text-white">
                    {tasks.find((task) => !task.completed)?.calendarDay
                      ?.title ?? "Alle oppgaver fullført 🎉"}
                  </p>
                </div>
              </div>
              <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">Oversikt per dag</h2>
                <p className="text-white/70">
                  Klikk på en dag for å åpne oppgaven i kalenderen.
                </p>
              </div>

              {tasks.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
                  Ingen oppgaver funnet. Legg til kalenderluker i Sanity og knytt
                  dem til brukeren.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {tasks.map((task) => {
                    const { calendarDay } = task;
                    const isComplete = Boolean(task.completed);
                    const href = calendarDay.slug ? `/${calendarDay.slug}` : "#";
                    const isClickable = Boolean(calendarDay.slug);

                    return (
                      <Link
                        key={calendarDay._id}
                        aria-disabled={!isClickable}
                        className={`group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-amber-300/60 hover:bg-white/10 ${
                          !isClickable ? "pointer-events-none opacity-70" : ""
                        }`}
                        href={href}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-sm uppercase tracking-wide text-white/60">
                              Dag {calendarDay.dayNumber ?? "?"}
                            </p>
                            <p className="text-lg font-semibold text-white">
                              {calendarDay.title ?? "Uten tittel"}
                            </p>
                            {calendarDay.category?.title ? (
                              <p className="text-sm text-white/60">
                                {calendarDay.category.title}
                              </p>
                            ) : null}
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              isComplete
                                ? "bg-emerald-400/20 text-emerald-200"
                                : "bg-white/10 text-white/80"
                            }`}
                          >
                            {isComplete ? "Ferdig" : "Ikke ferdig"}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

      </div>
    </main>
  );
}

