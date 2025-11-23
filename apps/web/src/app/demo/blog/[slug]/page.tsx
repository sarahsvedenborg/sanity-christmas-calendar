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

    console.log(   "result", result);

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
     <main className="">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>
    <div className="container mx-auto my-16 px-4 md:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <main>
          <ArticleJsonLd article={data} />
          <header className="mb-8">
            <h1 className="mt-2 font-bold text-4xl text-white">{title}</h1>
            <p className="mt-4 text-lg text-white/80">{description}</p>
          </header>
          {image && (
            <div className="mb-12">
              <SanityImage
                alt={title}
                className="h-auto w-full rounded-lg"
                height={450}
                image={image}
                loading="eager"
                width={800}
              />
            </div>
          )}
          <RichText richText={richText} />
        </main>

        <div className="hidden lg:block">
          <div className="sticky top-4 rounded-lg">
            <TableOfContent richText={richText ?? []} />
          </div>
        </div>
      </div>
    </div>
    </main>
  );
}

