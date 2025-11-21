import { notFound } from "next/navigation";
import { CalendarDay } from "@/components/calendar-day";
import { sanityFetch } from "@/lib/sanity/live";
import { client } from "@/lib/sanity/client";
import { queryCalendarDayData, queryCalendarDayPaths } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import { Snowflakes } from "@/components/Snowflakes";
import { SanityImage } from "@/components/elements/sanity-image";
import { CalendarLogoBronze } from "@/logos/CalendarLogoBronze";
import { CalendarLogoSilver } from "@/logos/CalendarLogoSilver";
import { CalendarLogoGold } from "@/logos/CalendarLogoGold";
import { DayHeader } from "./components/DayHeader";
import BreakDayContent from "@/components/BreakDayContent";
import { DayLesson } from "./components/DayLesson";
import { RichText } from "@/components/elements/rich-text";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { auth } from "@/auth";

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

function canOpenDay(dayNumber: number | undefined, startDate: string | undefined | null, hasAdminAccess: boolean): boolean {
  // If user has admin access (verified server-side), allow all days
  if (hasAdminAccess) {
    return true;
  }

  if (!dayNumber || !startDate) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayDate = new Date(startDate);
  dayDate.setDate(dayDate.getDate() + dayNumber - 1);
  dayDate.setHours(0, 0, 0, 0);

  return today >= dayDate;
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

  const session = await auth();
  const userEmail = session?.user?.email;
  
  // Server-side check: determine if user has admin access
  // This is secure because it's calculated server-side and never exposed to the client
  const adminEmail = process.env.ADMIN_ACCESS_EMAIL;
  const hasAdminAccess = Boolean(
    adminEmail && userEmail && userEmail.toLowerCase() === adminEmail.toLowerCase()
  );

  const startDate = (dayData as any).startDate as string | undefined | null;
  const dayNumber = dayData.dayNumber;
  const isFutureDay = !canOpenDay(dayNumber, startDate, hasAdminAccess);

  if (isFutureDay) {
    const dayDate = startDate ? new Date(startDate) : null;
    if (dayDate && dayNumber) {
      dayDate.setDate(dayDate.getDate() + dayNumber - 1);
    }

    return (
      <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <Snowflakes />
        </div>
        <div className="container relative mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-32">
          <div className="rounded-2xl border-2 border-amber-300/60 bg-white/95 p-12 text-center shadow-2xl backdrop-blur dark:border-amber-700/50 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
            <div className="mb-6 text-6xl animate-bounce">⏰</div>
            <h1 className="mb-4 text-3xl font-bold text-green-950 dark:text-white">
         {/*      Oi, der gikk du litt for fort! 🏃‍♀️💨 */}
              Er du litt tidlig ute? 
            </h1>
            <p className="mb-4 text-lg text-green-900/80 dark:text-white/70">
              Det er supert at du er spent og ivrig - det liker vi! 😄
            </p>
            <p className="mb-4 text-lg text-green-900/80 dark:text-white/70">
              Men denne kalenderluken låser seg opp <strong>{dayDate ? dayDate.toLocaleDateString("no-NO", {
                day: "numeric",
                month: "long",
                year: "numeric"
              }) : "snart"}</strong>.
            </p>
           {/*  <p className="mb-2 text-base text-green-900/70 dark:text-white/60">
              Vi vet det er vanskelig å vente, men antisipering er en del av moroa! 🎁
            </p> */}
            <p className="mb-8 text-base font-semibold text-amber-600 dark:text-amber-400">
              Gleder oss til å se deg igjen når luker en åpen! 📅
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-green-950 transition hover:bg-amber-300"
            >
              Tilbake til kalenderen
            </Link>
          </div>
        </div>
      </main>
    );
  }

     const previousDay = (dayData as any).previousDay as
    | { slug?: string; dayNumber?: number; title?: string }
    | null
    | undefined;
  const nextDay = (dayData as any).nextDay as
    | { slug?: string; dayNumber?: number; title?: string }
    | null
    | undefined;


  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>
      <div className="container relative mx-auto max-w-6xl px-4 py-16">
        <DayHeader dayData={dayData} />
        {(dayData as any).isBreak && (dayData as any).breakContent && (dayData as any).breakContent.length > 0 ? (
          <BreakDayContent breakContent={(dayData as any).breakContent} />
        ): <DayLesson data={dayData} />}
         {/* Conclusion */}
        {dayData.conclusion && dayData.conclusion.length > 0 && (
          <div className="mt-16 rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl dark:border-amber-700/50 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
            <h2 className="mb-4 flex items-center gap-2 font-bold text-2xl text-green-950 dark:text-white">
              🎯 Konklusjon
            </h2>
            <RichText richText={dayData.conclusion} />
          </div>
        )}
         {/* Day Navigation */}
        <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {previousDay?.slug ? (
            <Link
              className="group flex w-full items-center justify-center gap-3 rounded-full border-2 border-amber-300 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-200 md:w-auto"
              href={`/${previousDay.slug}`}
            >
              <ArrowLeft className="size-5 transition group-hover:-translate-x-1" />
              <span className="text-center">
                Forrige dag{previousDay.dayNumber ? `: ${previousDay.dayNumber}` : ""}{" "}
                {previousDay.title ? `— ${previousDay.title}` : ""}
              </span>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}

          {nextDay?.slug ? (
            <Link
              className="group flex w-full items-center justify-center gap-3 rounded-full border-2 border-amber-300 bg-red-700/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-900 md:w-auto"
              href={`/${nextDay.slug}`}
            >
              <span className="text-center">
                Neste dag{nextDay.dayNumber ? `: ${nextDay.dayNumber}` : ""}{" "}
                {nextDay.title ? `— ${nextDay.title}` : ""}
              </span>
              <ArrowRight className="size-5 transition group-hover:translate-x-1" />
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>
      </div>
    </main>
  );
}

