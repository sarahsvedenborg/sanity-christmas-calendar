/* import { notFound } from "next/navigation";

import { PageBuilder } from "@/components/pagebuilder";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { querySlugPageData, querySlugPagePaths } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";

async function fetchSlugPageData(slug: string, stega = true) {
  return await sanityFetch({
    query: querySlugPageData,
    params: { slug: `/${slug}` },
    stega,
  });
}

async function fetchSlugPagePaths() {
  try {
    const slugs = await client.fetch(querySlugPagePaths);

    // If no slugs found, return empty array to prevent build errors
    if (!Array.isArray(slugs) || slugs.length === 0) {
      return [];
    }

    const paths: { slug: string[] }[] = [];
    for (const slug of slugs) {
      if (!slug) {
        continue;
      }
      const parts = slug.split("/").filter(Boolean);
      paths.push({ slug: parts });
    }
    return paths;
  } catch (error) {
    console.error("Error fetching slug paths:", error);
    // Return empty array to allow build to continue
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugString = slug.join("/");
  const { data: pageData } = await fetchSlugPageData(slugString, false);
  return getSEOMetadata(
    pageData
      ? {
          title: pageData?.title ?? pageData?.seoTitle ?? "",
          description: pageData?.description ?? pageData?.seoDescription ?? "",
          slug: pageData?.slug,
          contentId: pageData?._id,
          contentType: pageData?._type,
        }
      : {}
  );
}

export async function generateStaticParams() {
  const paths = await fetchSlugPagePaths();
  return paths;
}

// Allow dynamic params for paths not generated at build time
export const dynamicParams = true;

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugString = slug.join("/");
  const { data: pageData } = await fetchSlugPageData(slugString);

  if (!pageData) {
    return notFound();
  }

  const { title, pageBuilder, _id, _type } = pageData ?? {};

  return !Array.isArray(pageBuilder) || pageBuilder?.length === 0 ? (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 font-semibold text-2xl capitalize">{title}</h1>
      <p className="mb-6 text-muted-foreground">
        This page has no content blocks yet.
      </p>
    </div>
  ) : (
    <PageBuilder id={_id} pageBuilder={pageBuilder} type={_type} />
  );
}
 */

import { notFound } from "next/navigation";

import { CalendarDay } from "@/components/calendar-day";
import { sanityFetch } from "@/lib/sanity/live";
import { queryCalendarDayData } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";

async function fetchCalendarDayData(slug: string) {
  return await sanityFetch({
    query: queryCalendarDayData,
    params: { slug },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ daySlug: string }>;
}) {
  const { daySlug } = await params;
  const { data: dayData } = await fetchCalendarDayData(daySlug);

  if (!dayData) {
    return {};
  }

  return getSEOMetadata({
    title: `Day ${dayData.dayNumber} - ${dayData.title}`,
    description: dayData.description ?? "",
    slug: daySlug,
    contentId: dayData._id,
    contentType: dayData._type,
  });
}

export default async function CalendarDayPage({
  params,
}: {
  params: Promise<{ daySlug: string }>;
}) {
  const { daySlug } = await params;
  const { data: dayData } = await fetchCalendarDayData(daySlug);

  if (!dayData) {
    return notFound();
  }

  // Extract calendar slug from somewhere - we'll need to fetch it or pass it
  // For now, we can extract it from the slug or fetch from Sanity
  // This is a placeholder - you may need to adjust based on your slug structure
  const calendarSlug = "christmas-calendar"; // This should be dynamic

  return (
    <main className="">
      <CalendarDay calendarSlug={calendarSlug} data={dayData} />
    </main>
  );
}

