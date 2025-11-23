import Link from "next/link";

import { SanityImage } from "@/components/elements/sanity-image";
import { sanityFetch } from "@/lib/sanity/live";
import { queryDemoBlogIndex } from "@/lib/sanity/query";
import { Snowflakes } from "@/components/Snowflakes";

async function fetchDemoBlogs() {
  return await sanityFetch({ query: queryDemoBlogIndex });
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("no-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function DemoBlogIndexPage() {
  const { data: blogs = [] } = await fetchDemoBlogs();

  return (
    <main className="min-h-screen">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <header className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            Demo Blog
          </h1>
          <p className="text-lg leading-relaxed text-white/90 md:text-xl">
            Se alle demo blogginnlegg
          </p>
        </header>

        {blogs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-white/70">
              Ingen blogginnlegg tilgjengelig for øyeblikket.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {blogs.map((blog:any) => (
              <Link
                key={blog._id}
                href={`/demo/blog/${blog.slug}`}
                className="group block overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all hover:border-white/20 hover:bg-white/10"
              >
                <article className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:gap-6">
                  {blog.image && (
                    <div className="flex-shrink-0 overflow-hidden rounded-lg md:w-48">
                      <SanityImage
                        alt={blog.title ?? "Blog image"}
                        className="h-auto w-full transition-transform group-hover:scale-105"
                        height={200}
                        image={blog.image}
                        loading="lazy"
                        width={200}
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-3">
                    <h2 className="text-2xl font-bold leading-tight text-white transition-colors group-hover:text-cyan-300 md:text-3xl">
                      {blog.title}
                    </h2>
                    {blog.description && (
                      <p className="text-base leading-relaxed text-white/80 md:text-lg">
                        {blog.description}
                      </p>
                    )}
                    {blog._createdAt && (
                      <p className="text-sm text-white/60">
                        Publisert: {formatDate(blog._createdAt)}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

