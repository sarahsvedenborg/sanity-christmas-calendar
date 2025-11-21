import Link from "next/link";

import { sanityFetch } from "@/lib/sanity/live";
import { queryAnswersData, queryPublicWorkUrls } from "@/lib/sanity/query";

import { RichText } from "@/components/elements/rich-text";
import { Snowflakes } from "@/components/elements/snowflakes";

export const revalidate = 10;

export default async function BesvarelserPage() {
  const [{ data: answersData }, { data: publicWorkData }] = await Promise.all([
    sanityFetch({
      query: queryAnswersData,
      stega: true,
    }),
    sanityFetch({
      query: queryPublicWorkUrls,
      stega: true,
    }),
  ]);

  const answers = Array.isArray(answersData) ? answersData : [];
  const publicWorkUrls = Array.isArray(publicWorkData) ? publicWorkData : [];

  return (
   
       <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">
            Besvarelser
          </h1>
          <p className="mt-3 text-lg text-white/80">
            Utforsk innsendte svar og refleksjoner fra julekalenderen.
          </p>
        </header>

        <div className="space-y-10">
          {answers.length === 0 && publicWorkUrls.length === 0 ? (
            <div className="rounded-2xl border border-amber-300/60 bg-white/90 p-8 text-center shadow-sm backdrop-blur dark:border-amber-700/50 dark:bg-green-950/80">
              <p className="text-lg text-green-900 dark:text-white/70">
                Det er ingen besvarelser publisert enda. Kom tilbake senere!
              </p>
            </div>
          ) : (
            <>
              {answers.map((answer) => (
                <article
                  key={answer._id}
                  className="rounded-2xl border border-amber-300/60 bg-white/95 p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl backdrop-blur dark:border-amber-700/50 dark:bg-green-950/85"
                >
                  <header className="mb-6">
                    <h2 className="text-2xl font-semibold text-green-950 dark:text-white">
                      {answer.title}
                    </h2>
                    {answer.description && (
                      <p className="mt-2 text-green-900/80 dark:text-white/70">
                        {answer.description}
                      </p>
                    )}
                  </header>
                  <RichText className="text-left" richText={answer.content} />
                  <footer className="mt-6 text-right text-xs uppercase tracking-wide text-green-900/60 dark:text-white/40">
                    Sist oppdatert:{" "}
                    {answer._updatedAt
                      ? new Date(answer._updatedAt).toLocaleDateString("no-NO", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Ukjent"}
                  </footer>
                </article>
              ))}

              {publicWorkUrls.length > 0 && (
                <section className="rounded-2xl border border-amber-300/60 bg-white/95 p-8 shadow-md backdrop-blur dark:border-amber-700/50 dark:bg-green-950/85">
                  <header className="mb-6">
                    <h2 className="text-2xl font-semibold text-green-950 dark:text-white">
                      Delt arbeid fra deltakere
                    </h2>
                    <p className="mt-2 text-green-900/80 dark:text-white/70">
                      Utforsk arbeid som deltakere har valgt å dele offentlig.
                    </p>
                  </header>
                  <div className="space-y-4">
                    {publicWorkUrls.map((user) => (
                      <div
                        key={user._id}
                        className="rounded-lg border border-amber-200/50 bg-white/50 p-4 transition hover:border-amber-300/80 hover:bg-white/70 dark:border-amber-700/30 dark:bg-green-900/30 dark:hover:border-amber-600/50 dark:hover:bg-green-900/50"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-green-950 dark:text-white">
                              {user.name}
                            </h3>
                            {user.email && (
                              <p className="mt-1 text-sm text-green-900/70 dark:text-white/60">
                                {user.email}
                              </p>
                            )}
                          </div>
                          {user.publicworkurl && (
                            <Link
                              href={user.publicworkurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
                            >
                              Se arbeid →
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}