import { notFound } from "next/navigation";
import { ChristmasCalendar } from "@/components/christmas-calendar";
import { sanityFetch } from "@/lib/sanity/live";
import {
  queryChristmasCalendarData,
} from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import { Snowflakes } from "@/components/Snowflakes";
import { Countdown } from "@/components/Countdown";
import { auth } from "@/auth";

async function fetchChristmasCalendarData() {
  return await sanityFetch({
    query: queryChristmasCalendarData,
  });
}

export const revalidate = 10;

export async function generateMetadata() {
  const { data: calendarData } = await fetchChristmasCalendarData();

  if (!calendarData) {
    return {};
  }

/*   return getSEOMetadata({
    title: calendarData.title ?? calendarData.seoTitle ?? "Christmas Calendar",
    description:
      calendarData.description ?? calendarData.seoDescription ?? "",
    contentId: calendarData._id,
    contentType: calendarData._type,
  }); */

  const title = calendarData.title ?? calendarData.seoTitle ?? "Christmas Calendar";
  const description = calendarData.description ?? calendarData.seoDescription ?? "";
  const imageUrl = '/LogoViva.png';

    return {
    title,
    description,
    metadataBase: 'https://sanity-christmas-calendar.vercel.app/',

    robots: {
      index: false,
      follow: false,
    },
    icons: {
      icon: [
        {
          url: '/favicon.ico',
          media: '(prefers-color-scheme: light)',
        },
        {
          url: '/favicon.ico',
          media: '(prefers-color-scheme: dark)',
        },
      ],
    },
    openGraph: {
      title,
      description,
      images: imageUrl,
      type: 'website',
      url: 'https://sanity-christmas-calendar.vercel.app/',
      site_name: 'Sanity julekalender',
    },
    twitter: {
      title,
      description,
      images: imageUrl,
      url: 'https://sanity-christmas-calendar.vercel.app/',
      card: 'summary_large_image',
    },
  
  }
}

/* export async function generateStaticParams() {
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
} */

export default async function CalendarPage() {
  const { data: calendarData } = await fetchChristmasCalendarData();
  const session = await auth();
  const userEmail = session?.user?.email;
  
  // Server-side check: determine if user has admin access
  const adminEmail = process.env.ADMIN_ACCESS_EMAIL;
  const hasAdminAccess = Boolean(
    adminEmail && userEmail && userEmail.toLowerCase() === adminEmail.toLowerCase()
  );

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
         {/*  <a
            href="/auth/signup"
            target="_blank"
            rel="noopener noreferrer"
           className="relative mx-auto w-fit flex items-center justify-center rounded-md bg-[#B91C1C] border-2 border-amber-400 px-6 py-3 text-base font-bold text-white shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all hover:bg-[#991b1b] hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:scale-105"
         
          >
            Registrer deltakelse
          </a> */}
      </section>
       <Countdown startDate={calendarData.startDate} intro={calendarData.introContent} isLoggedIn={!!session} />
       <ChristmasCalendar data={calendarData} hasAdminAccess={hasAdminAccess} /> 
    </main>
  );
}

