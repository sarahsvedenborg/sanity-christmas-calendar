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
      <section className="relative pt-16 pb-1 md:pt-24 md:pb-2">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-balance font-bold text-5xl tracking-tight drop-shadow-lg md:text-7xl text-white">
             Demo Julekalender ❄️ 
            </h1>
          </div>
        </div>
      </section>
<p>sdfsdf</p>
        <ChristmasCalendar data={{days: calendarData}} hasAdminAccess={true} isDemo={true}/> 
    </main>
  );
}

