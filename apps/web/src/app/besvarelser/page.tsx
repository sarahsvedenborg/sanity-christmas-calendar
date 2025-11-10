import { sanityFetch } from "@/lib/sanity/live";
import { queryAnswersData } from "@/lib/sanity/query";

import { RichText } from "@/components/elements/rich-text";

export default async function BesvarelserPage() {
  const { data } = await sanityFetch({
    query: queryAnswersData,
    stega: true,
  });

  const answers = Array.isArray(data) ? data : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-green-950 dark:text-white">
          Besvarelser
        </h1>
        <p className="mt-3 text-lg text-green-900/80 dark:text-white/70">
          Utforsk innsendte svar og refleksjoner fra julekalenderen.
        </p>
      </header>

      <div className="space-y-10">
        {answers.length === 0 ? (
          <div className="rounded-2xl border border-amber-300/60 bg-white/80 p-8 text-center shadow-sm dark:border-amber-700/50 dark:bg-green-950/70">
            <p className="text-lg text-green-900 dark:text-white/70">
              Det er ingen besvarelser publisert enda. Kom tilbake senere!
            </p>
          </div>
        ) : (
          answers.map((answer) => (
            <article
              key={answer._id}
              className="rounded-2xl border border-amber-300/60 bg-white/95 p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-amber-700/50 dark:bg-green-950/85"
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
          ))
        )}
      </div>
    </div>
  );
}