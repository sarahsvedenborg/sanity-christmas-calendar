import Link from "next/link";
import { notFound } from "next/navigation";
import { ChristmasCalendar } from "@/components/christmas-calendar";
import { sanityFetch } from "@/lib/sanity/live";
import {
  queryDemoChristmasCalendarData,
} from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import { Snowflakes } from "@/components/Snowflakes";
import { Countdown } from "@/components/Countdown";
import { auth } from "@/auth";
import { QueryChristmasCalendarDataResult } from "@/lib/sanity/sanity.types";

async function fetchChristmasCalendarData() {
  return await sanityFetch({
    query: queryDemoChristmasCalendarData,
  });
}

export const revalidate = 10;

export async function generateMetadata() {
  const { data: calendarData } = await fetchChristmasCalendarData();

  if (!calendarData) {
    return {};
  }

  return getSEOMetadata({
    title: calendarData.title ?? calendarData.seoTitle ?? "Christmas Calendar",
    description:
      calendarData.description ?? calendarData.seoDescription ?? "",
    contentId: calendarData._id,
    contentType: calendarData._type,
  });
}


export default async function CalendarPage() {
  const { data: calendarData } = await fetchChristmasCalendarData();
  const session = await auth();
  const userEmail = session?.user?.email;

  console.log("calendarData", calendarData);
  
  // Server-side check: determine if user has admin access
/*   const adminEmail = process.env.ADMIN_ACCESS_EMAIL;
  const hasAdminAccess = Boolean(
    adminEmail && userEmail && userEmail.toLowerCase() === adminEmail.toLowerCase()
  ); */

  if (!calendarData) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>
      <section className="relative pt-16 pb-8 md:pt-24 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-balance font-bold text-5xl tracking-tight drop-shadow-lg md:text-7xl text-white">
             Demo Julekalender ❄️ 
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
              Denne subsiten viser alt innhold fra demo studio: <strong>demokalenderen</strong> og <strong>bloggen</strong>. Utforsk julekalenderen nedenfor eller les blogginnleggene.
            </p>
            <Link
              href="/demo/blog"
              className="group mx-auto block max-w-md rounded-xl border-2 border-cyan-400/60 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 p-6 text-center shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all hover:border-cyan-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] hover:scale-105"
            >
              <div className="flex flex-col items-center gap-3">
                <span className="text-3xl">📝</span>
                <span className="text-xl font-bold text-white md:text-2xl">
                  Les blogginnlegg
                </span>
                <span className="text-sm text-white/80 md:text-base">
                  Utforsk alle våre demo blogginnlegg
                </span>
                <span className="mt-2 text-cyan-300 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
        <ChristmasCalendar data={{days: calendarData } as NonNullable<QueryChristmasCalendarDataResult>} hasAdminAccess={true} isDemo={true}/> 
    </main>
  );
}

