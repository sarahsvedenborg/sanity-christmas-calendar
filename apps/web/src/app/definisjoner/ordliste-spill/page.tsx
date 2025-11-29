import { sanityFetch } from "@/lib/sanity/live";
import { queryDefinitionsData } from "@/lib/sanity/query";
import { Snowflakes } from "@/components/elements/snowflakes";
import { PairingGame } from "@/components/pairing-game";

export const revalidate = 10;

export default async function PairingGamePage() {
  const { data } = await sanityFetch({
    query: queryDefinitionsData,
    stega: true,
  });

  type Definition = {
    _id: string;
    title: string;
    shortDescription?: string | null;
    description: string;
  };

  const definitions: Definition[] = Array.isArray(data)
    ? data
        .filter((definition): definition is Definition => {
          return Boolean(
            definition &&
              typeof definition._id === "string" &&
              typeof definition.title === "string" &&
              definition.title.trim() &&
              definition.shortDescription
          );
        })
        .map((def) => ({
          _id: def._id,
          title: def.title,
          description: def.shortDescription || "",
        }))
    : [];

    console.log(definitions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">
           Spill ordlistespillet 🎯
          </h1>
          <p className="mt-3 text-lg text-white/80">
            Match begrepet med riktig definisjon!
          </p>
        </header>

        {definitions.length === 0 ? (
          <div className="rounded-2xl border border-amber-300/60 bg-white/90 p-8 text-center shadow-sm backdrop-blur dark:border-amber-700/50 dark:bg-green-950/80">
            <p className="text-lg text-green-900 dark:text-white/70">
              Det er ingen definisjoner tilgjengelig for spillet. Kom tilbake senere!
            </p>
          </div>
        ) : (
          <PairingGame definitions={definitions} />
        )}
      </div>
    </div>
  );
}

