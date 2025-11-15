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
import { Snowflakes } from "@/components/Snowflakes";
import { Countdown } from "@/components/Countdown";

async function fetchChristmasCalendarData() {
  return await sanityFetch({
    query: queryChristmasCalendarData,
  });
}

export const revalidate = 60;

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
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>
      <section className="relative pt-16 pb-1 md:pt-24 md:pb-2">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-balance font-bold text-5xl tracking-tight drop-shadow-lg md:text-7xl" style={{ 
              color: '#B91C1C',
              textShadow: '2px 2px 0px rgba(212, 175, 55, 0.9), -2px -2px 0px rgba(212, 175, 55, 0.9), 2px -2px 0px rgba(212, 175, 55, 0.9), -2px 2px 0px rgba(212, 175, 55, 0.9)'
            }}>
              {calendarData.title} 🎄 
                       {/*       ssssj...<br />
              Velkommen til <br/><span className="underline">S</span>arahs <span className="underline">S</span>opra <span className="underline">S</span>teria <span className="underline">S</span>anity <br/>julekalender! 🎄 */}
            </h1>
          </div>
        </div>
      </section>
      <Countdown startDate={calendarData.startDate} intro={calendarData.introContent} />
      <ChristmasCalendar data={calendarData} />
    </main>
  );
}

