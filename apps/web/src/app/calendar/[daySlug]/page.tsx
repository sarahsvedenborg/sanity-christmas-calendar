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
    <main className="pb-16">
      <CalendarDay calendarSlug={calendarSlug} data={dayData} />
    </main>
  );
}

