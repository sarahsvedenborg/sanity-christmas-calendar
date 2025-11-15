import { notFound } from "next/navigation";
import { CalendarDay } from "@/components/calendar-day";
import { sanityFetch } from "@/lib/sanity/live";
import { client } from "@/lib/sanity/client";
import { queryCalendarDayData, queryCalendarDayPaths } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";

export const revalidate = 10;

async function fetchCalendarDayData(slug: string, stega = true) {
  return await sanityFetch({
    query: queryCalendarDayData,
    params: { slug },
    stega
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

async function fetchCalendarDayPaths() {
  try {
    const slugs = await client.fetch(queryCalendarDayPaths);

    // If no slugs found, return empty array to prevent build errors
    if (!Array.isArray(slugs) || slugs.length === 0) {
      return [];
    }

    const paths: { slug: string }[] = [];
    for (const slug of slugs) {
      if (!slug) {
        continue;
      }
      const [, , path] = slug.split("/");
      if (path) {
        paths.push({ slug: path });
      }
    }
    return paths;
  } catch (error) {
    console.error("Error fetching blog paths:", error);
    // Return empty array to allow build to continue
    return [];
  }
}



export async function generateStaticParams() {
  const paths = await fetchCalendarDayPaths();
  return paths;
}

// Allow dynamic params for paths not generated at build time
export const dynamicParams = true;

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

