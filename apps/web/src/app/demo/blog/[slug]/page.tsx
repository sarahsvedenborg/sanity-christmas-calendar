import { notFound } from "next/navigation";

import { RichText } from "@/components/elements/rich-text";
import { SanityImage } from "@/components/elements/sanity-image";
import { TableOfContent } from "@/components/elements/table-of-content";
import { ArticleJsonLd } from "@/components/json-ld";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { queryDemoBlogPaths, queryDemoBlogSlugPageData } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import { Snowflakes } from "@/components/Snowflakes";

async function fetchDemoBlogSlugPageData(slug: string, stega = true) {
  // Try different slug formats
  const slugVariants = [
    `/demo/blog/${slug}`,
    `/blog/${slug}`,
    slug,
  ];

   const result = await sanityFetch({
      query: queryDemoBlogSlugPageData,
      params: { slug: "min-test-blog" },
      stega,
    });

    if (result.data) {
      return result;
    }
  
  for (const slugVariant of slugVariants) {
    const result = await sanityFetch({
      query: queryDemoBlogSlugPageData,
      params: { slug: "min-test-blog" },
      stega,
    });
    if (result.data) {
      return result;
    }
  }
  
  return { data: null };
}

async function fetchDemoBlogPaths() {
  try {
    const slugs = await client.fetch(queryDemoBlogPaths);

    // If no slugs found, return empty array to prevent build errors
    if (!Array.isArray(slugs) || slugs.length === 0) {
      return [];
    }

    const paths: { slug: string }[] = [];
    for (const slug of slugs) {
      if (!slug) {
        continue;
      }
      // Extract the slug part - handle different formats
      const parts = slug.split("/").filter(Boolean);
      
      // If slug contains "demo" and "blog", extract the part after blog
      const blogIndex = parts.indexOf("blog");
      if (blogIndex !== -1 && parts[blogIndex + 1]) {
        paths.push({ slug: parts[blogIndex + 1] });
      } else if (parts.length > 0) {
        // Fallback: use the last part
        paths.push({ slug: parts[parts.length - 1] });
      }
    }
    return paths;
  } catch (error) {
    console.error("Error fetching demo blog paths:", error);
    // Return empty array to allow build to continue
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchDemoBlogSlugPageData(slug, false);
  return getSEOMetadata(
    data
      ? {
          title: data?.title ?? data?.seoTitle ?? "",
          description: data?.description ?? data?.seoDescription ?? "",
          slug: data?.slug,
          contentId: data?._id,
          contentType: data?._type,
          pageType: "article",
        }
      : {}
  );
}

export async function generateStaticParams() {
  const paths = await fetchDemoBlogPaths();
  return paths;
}

// Allow dynamic params for paths not generated at build time
export const dynamicParams = true;

export default async function DemoBlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
   
  const { slug } = await params;
  const { data } = await fetchDemoBlogSlugPageData(slug);
  if (!data) {
     return notFound(); 
 
  }
  const { title, description, image, richText } = data ?? {};

  return (
    <main className="min-h-screen">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8">
        <article className="space-y-6">
          <header className="max-w-4xl  flex flex-col gap-4 py-8 md:flex-row md:items-start md:gap-6">
            <div className="flex-1 space-y-3">
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                {title}
              </h1>
              {description && (
                <p className="text-lg leading-relaxed text-white/90 md:text-xl">
                  {description}
                </p>
              )}
            </div>
            {image && (
              <div className="flex-shrink-0 overflow-hidden rounded-xl md:w-64">
                <SanityImage
                  alt={title}
                  className="h-auto w-full object-contain"
                  height={280}
                  image={image}
                  loading="eager"
                  width={280}
                />
              </div>
            )}
          </header>
          <p className="text-sm text-white/90">Publisert: {data._createdAt}</p>
          <hr />
          <div className=" mx-auto max-w-2xl prose prose-invert prose-lg ">
            <RichText richText={richText} tone="light"/>
          </div>
        </article>
      </div>
    </main>
  );
}

