import { Snowflakes } from "@/components/Snowflakes";
import { RichText } from "@/components/elements/rich-text";
import { sanityFetch } from "@/lib/sanity/live";
import { queryDemoDocumentationData } from "@/lib/sanity/query";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Docs",
  description: "Documentation for the demo studio",
};

export default async function DemoDocsPage() {
  const { data: documentation } = await sanityFetch({
    query: queryDemoDocumentationData,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">
            {documentation?.title || "Dokumentasjon for Demo Studio"}
          </h1>
          {documentation?.description && (
            <p className="mt-3 text-lg text-white/80">
              {documentation.description}
            </p>
          )}
        </header>

        <div className="space-y-10">
          {!documentation ? (
            <section className="rounded-2xl border border-amber-300/60 bg-white/95 p-8 shadow-md backdrop-blur dark:border-amber-700/50 dark:bg-green-950/85">
              <p className="text-center text-green-900/80 dark:text-white/70">
                Ingen dokumentasjon tilgjengelig for øyeblikket.
              </p>
            </section>
          ) : (
            <section className="rounded-2xl border border-amber-300/60 bg-white/95 p-8 shadow-md backdrop-blur dark:border-amber-700/50 dark:bg-green-950/85">
              {documentation.content && documentation.content.length > 0 && (
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <RichText richText={documentation.content} />
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

