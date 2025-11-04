/* // import { PageBuilder } from "@/components/pagebuilder";
import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryHomePageData } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";

async function fetchHomePageData() {
  return await sanityFetch({
    query: queryHomePageData,
  });
}

export async function generateMetadata() {
  const { data: homePageData } = await fetchHomePageData();
  return getSEOMetadata(
    homePageData
      ? {
          title: homePageData?.title ?? homePageData?.seoTitle ?? "",
          description:
            homePageData?.description ?? homePageData?.seoDescription ?? "",
          slug: homePageData?.slug,
          contentId: homePageData?._id,
          contentType: homePageData?._type,
        }
      : {}
  );
}

export default async function Page() {
  const { data: homePageData } = await fetchHomePageData();

  if (!homePageData) {
    return <div>No home page data</div>;
  }

  const { _id, _type, pageBuilder } = homePageData ?? {};

  return (
    <>
      <h1>Dette er Sarhs test</h1>
      <PageBuilder id={_id} pageBuilder={pageBuilder ?? []} type={_type} />
    </>
  );
}
 */

import { notFound } from "next/navigation";

import { ChristmasCalendar } from "@/components/christmas-calendar";
import { sanityFetch } from "@/lib/sanity/live";
import {
  queryChristmasCalendarData,
  queryChristmasCalendarPaths,
} from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";

async function fetchChristmasCalendarData() {
  return await sanityFetch({
    query: queryChristmasCalendarData,
  });
}

export async function generateMetadata() {
  const { data: calendarData } = await fetchChristmasCalendarData();

  if (!calendarData) {
    return {};
  }

  return getSEOMetadata({
    title: calendarData.title ?? calendarData.seoTitle ?? "Christmas Calendar",
    description:
      calendarData.description ?? calendarData.seoDescription ?? "",
    slug: calendarData.slug ? `/${calendarData.slug}` : "/calendar",
    contentId: calendarData._id,
    contentType: calendarData._type,
  });
}

export async function generateStaticParams() {
  try {
    const { data: calendarData } = await sanityFetch({
      query: queryChristmasCalendarPaths,
    });
    const slugs = calendarData || [];

    return slugs.map((slug: string) => ({
      slug: [slug],
    }));
  } catch {
    return [];
  }
}

export default async function CalendarPage() {
  const { data: calendarData } = await fetchChristmasCalendarData();

  if (!calendarData) {
    return notFound();
  }

  return (
    <main className="pb-16">
      <ChristmasCalendar data={calendarData} />
    </main>
  );
}

