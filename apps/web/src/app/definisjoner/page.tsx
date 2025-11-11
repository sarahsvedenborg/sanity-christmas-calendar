import { sanityFetch } from "@/lib/sanity/live";
import { queryDefinitionsData } from "@/lib/sanity/query";

import { RichText } from "@/components/elements/rich-text";
import { Snowflakes } from "@/components/elements/snowflakes";

export default async function DefinisjonerPage() {
  const { data } = await sanityFetch({
    query: queryDefinitionsData,
    stega: true,
  });

  type Definition = NonNullable<typeof data>[number] & {
    title: string;
    description?: string | null;
    content?: unknown;
    _id: string;
  };

  const definitions: Definition[] = Array.isArray(data)
    ? data.filter((definition): definition is Definition => {
        return Boolean(
          definition &&
            typeof definition._id === "string" &&
            Boolean(definition.title?.trim())
        );
      })
    : [];

  const groupedDefinitions = definitions.reduce(
    (acc: Record<string, Definition[]>, definition) => {
      const title = definition.title ?? "";
      const letter = title.trim().charAt(0).toUpperCase() || "#";
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(definition);
      return acc;
    },
    {}
  );

  const sortedLetters = Object.keys(groupedDefinitions).sort((a, b) =>
    a.localeCompare(b, "no-NO")
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>
 
      <div className="relative mx-auto max-w-5xl px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">
            Definisjoner
          </h1>
          <p className="mt-3 text-lg text-white/80">
            Et ordliste over typiske sanity begreper brukt i julekalenderen.
          </p>
        </header>

        {definitions.length === 0 ? (
          <div className="rounded-2xl border border-amber-300/60 bg-white/90 p-8 text-center shadow-sm backdrop-blur dark:border-amber-700/50 dark:bg-green-950/80">
            <p className="text-lg text-green-900 dark:text-white/70">
              Det er ingen definisjoner publisert enda. Kom tilbake senere!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedLetters.map((letter) => (
              <section key={letter} className="space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-3xl font-bold">{letter}</span>
                  <span className="h-px flex-1 bg-gradient-to-r from-amber-300/70 to-transparent" />
                </div>

                <ul className="space-y-6">
                  {(groupedDefinitions[letter] ?? [])
                    .sort((a, b) => a.title.localeCompare(b.title, "no-NO"))
                    .map((definition) => (
                      <li
                        key={definition._id}
                        className="rounded-2xl border border-amber-300/60 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-amber-700/50 dark:bg-green-950/85"
                      >
                        <h2 className="text-2xl font-semibold text-green-950 dark:text-white">
                          {definition.title}
                        </h2>
                        {definition.description && (
                          <p className="mt-2 text-lg text-green-900/80 dark:text-white/70">
                            {definition.description}
                          </p>
                        )}
                        {definition.content && (
                          <div className="mt-4 text-lg leading-relaxed text-green-900 dark:text-white/85 md:text-xl">
                            <RichText className="text-lg md:text-xl" richText={definition.content} />
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}