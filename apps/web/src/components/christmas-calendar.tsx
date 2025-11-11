"use client";

import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { QueryChristmasCalendarDataResult } from "@/lib/sanity/sanity.types";

import { RichText } from "./elements/rich-text";
import { SanityImage } from "./elements/sanity-image";
import { CalendarLogo } from "./CalendarLogo";
import { CalendarLogoGold } from "./CalendarLogoGold";
import { CalendarLogoSilver } from "./CalendarLogoSilver";
import { CalendarLogoBronze } from "./CalendarLogoBronze";

type CalendarData = NonNullable<QueryChristmasCalendarDataResult>;

type ChristmasCalendarProps = {
  data: CalendarData;
};


export function ChristmasCalendar({ data }: ChristmasCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysUntilStart, setDaysUntilStart] = useState<number | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
    if (data.startDate) {
      const start = new Date(data.startDate);
      const today = new Date();
      const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      setDaysUntilStart(diff);
    }
  }, [data.startDate]);

  const days = data.days || [];
  const startDate = data.startDate ? new Date(data.startDate) : null;

  // Group days by category
  const groupedDays = days.reduce((acc, day) => {
    if (!day) return acc;
    
    // Handle days without categories
    if (!(day as any).category) {
      const uncategorizedId = 'uncategorized';
      if (!acc[uncategorizedId]) {
        acc[uncategorizedId] = {
          category: { _id: uncategorizedId, title: 'Other Days', description: null },
          days: [],
        };
      }
      acc[uncategorizedId].days.push(day);
      return acc;
    }
    
    const categoryId = (day as any).category._id;
    if (!acc[categoryId]) {
      acc[categoryId] = {
        category: (day as any).category,
        days: [],
      };
    }
    acc[categoryId].days.push(day);
    return acc;
  }, {} as Record<string, { category: { _id: string; title: string; description: string | null }; days: typeof days }>);

  // Get all categories and assign colors
  const categories = Object.values(groupedDays);
  const categoryColors: string[] = ['#CD7F32', '#C0C0C0', '#FFD700']; // Bronze, Silver, Gold
  const categoryColorMap = new Map<string, string>();
  categories.forEach((group, index) => {
    const color = categoryColors[index % categoryColors.length] || '#D4AF37';
    categoryColorMap.set(group.category._id, color);
  });


  const getLogo = (index: number) => {
    switch (index) {
      case 0:
        return <CalendarLogoBronze width={100} height={100} />;
      case 1:
        return <CalendarLogoSilver width={100} height={100} />;
      case 2:
        return <CalendarLogoGold width={100} height={100} />;
    }
    return <CalendarLogo width={100} height={100} />;
  };

  const Countdown = () => {
   return(  <div className="mb-20 mt-20 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 text-white">
                      <div className="relative">
                            <div className="absolute inset-0 animate-ping rounded-full bg-yellow-800 opacity-20"></div> 
                  <div className="flex flex-col items-center">
                    <span className="text-7xl font-bold leading-none" style={{ color: '#D4AF37' }}>
                      {daysUntilStart}
                    </span>
                   
                    <span className="text-sm uppercase tracking-wider text-white/80">
                      {daysUntilStart === 1 ? 'dag igjen' : 'dager igjen'}
                    </span>
                     </div>
                  </div>
                </div>
              {/*   <p className="text-center text-xl font-semibold text-white/90">
                  {daysUntilStart === 1
                    ? "Starter i morgen! 🎉"
                    : "til kalenderen starter..."}
                </p> */}
              </div>)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>


      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Calendar Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
           {/*      <div className="absolute inset-0 animate-ping rounded-full bg-green-600 opacity-20"></div> */}

              {/*   <div className="relative flex size-32 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 shadow-2xl">
                  <Sparkles className="size-16 text-white" />

                </div> */}
                 {/*  <div className="relative flex size-32 items-center justify-center rounded-full  ">
               
    <CalendarLogo />
                </div> */}
              </div>
            </div>
          

          {/*   <h1 className="mb-4 text-balance font-bold text-5xl tracking-tight drop-shadow-lg md:text-7xl" style={{ 
              color: '#B91C1C',
              textShadow: '2px 2px 0px rgba(212, 175, 55, 0.9), -2px -2px 0px rgba(212, 175, 55, 0.9), 2px -2px 0px rgba(212, 175, 55, 0.9), -2px 2px 0px rgba(212, 175, 55, 0.9)'
            }}>
              🎄 {data.title}🎄
            </h1> */}
              <h1 className="mb-4 text-balance font-bold text-5xl line-height-1 tracking-tight drop-shadow-lg md:text-7xl" style={{ 
              color: '#B91C1C',
              textShadow: '2px 2px 0px rgba(212, 175, 55, 0.9), -2px -2px 0px rgba(212, 175, 55, 0.9), 2px -2px 0px rgba(212, 175, 55, 0.9), -2px 2px 0px rgba(212, 175, 55, 0.9)'
            }}>
              Sanity julekalender <br />
              - Velkommen 🎄
            </h1> 

         {/*      <h1 className="mb-4 text-balance font-bold text-5xl tracking-tight drop-shadow-lg  md:text-7xl" style={{ 
              color: '#B91C1C',
              textShadow: '2px 2px 0px rgba(212, 175, 55, 0.9), -2px -2px 0px rgba(212, 175, 55, 0.9), 2px -2px 0px rgba(212, 175, 55, 0.9), -2px 2px 0px rgba(212, 175, 55, 0.9)'
            }}>
              ssssj...<br />
              Velkommen til <br/><span className="underline">S</span>arahs <span className="underline">S</span>opra <span className="underline">S</span>teria <span className="underline">S</span>anity <br/>julekalender! 🎄
            </h1> */}

       
            {daysUntilStart !== null && daysUntilStart > 0 && (
              <>
            <Countdown />
              {data.description && (<>
              {/* <p className="mb-8 text-lg text-white/90 max-w-3xl mx-auto text-left md:text-xl">
                {data.description}
              </p> */}
              <div className="mb-8">
                <RichText
                  className="mx-auto max-w-xl text-left"
                  richText={data.introContent}
                  tone="light"
                />
              </div>
              </>
            )} 
            </>
            )}

            

            {/* Cover Image */}
            {data.coverImage && (
              <div className="mb-12 overflow-hidden rounded-3xl shadow-2xl">
                <SanityImage
                  alt={data.title}
                  className="h-auto w-full object-cover"
                  fetchPriority="high"
                  height={600}
                  image={data.coverImage}
                  loading="eager"
                  width={1200}
                />
              </div>
            )}

            {/* Introduction Content */}
         {/*    {data.introContent && data.introContent.length > 0 && (
              <div className="mb-16 rounded-2xl border-2 border-amber-200/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
                <RichText className="text-left" richText={data.introContent} />
              </div>
            )} */}
          </div>
        </div>
      </section>

      {/* Calendar Grid - Grouped by Category */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-bold text-3xl text-white md:text-4xl">
            ✨ Kalenderluker ✨
          </h2>

          {categories.length > 0 ? (
            <div className="mx-auto max-w-6xl space-y-12">
              {categories.map((group, index) => {
                const categoryColor = categoryColorMap.get(group.category._id) || '#D4AF37';
           /*      const categoryBgColor = categoryColor === '#CD7F32' 
                  ? 'rgba(205, 127, 50, 0.5)' // Bronze
                  : categoryColor === '#C0C0C0'
                  ? 'rgba(192, 192, 192, 0.9)' // Silver
                  : 'rgba(255, 215, 0, 0.5)'; // Gold */

                   const categoryBgColor = categoryColor === '#CD7F32' 
                  ? '#E5B18E' // Bronze
                  : categoryColor === '#C0C0C0'
                  ? '#D9D9D9' // Silver
                  : '#E5C68D'; // Gold 

                  

                return (
                  <div key={group.category._id} className="space-y-6">
                    {/* Category Header */}
                    <div className="flex  gap-4">
                      {/* CalendarLogo at top left */}
                     {/*  <div className="flex-shrink-0">
                        <CalendarLogo width={80} height={80} />
                      </div> */}
                      {/* Category Title and Description */}
                      <div className="flex-1 text-center">
                        <h3 className="text-2xl font-bold text-white md:text-3xl">
                          {group.category.title}
                        </h3>
                        {group.category.description && (
                          <p className="mt-2 text-white/80">
                            {group.category.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Days Grid for this Category */}
                    <div 
                      className="rounded-2xl p-6"
                      style={{ backgroundColor: categoryBgColor }}
                    >
                         <div className="mt-[-55px] ml-[-78px] scale-75 sm:mt-[-60px] sm:ml-[-60px] sm:scale-100">
                        {getLogo(index)}
                      </div> 
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {group.days.map((day) => {
                          if (!day) return null;

                          const isBreak = (day as any).isBreak || false;
                          const isAvailable = isBreak || canOpenDay(
                            day.dayNumber,
                            startDate
                          );
                          const dayEmoji = getDayEmoji(day.dayNumber);

                          return (
                            <Link
                              className={cn(
                                "group relative aspect-square rounded-xl transition-all duration-300",
                                isAvailable
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed opacity-50"
                              )}
                              href={isAvailable ? `/${day.slug}` : "#"}
                              key={day.dayNumber}
                            >
                              {/* Card */}
                              <div
                                className={cn(
                                  "relative flex h-full flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all duration-300",
                                  isAvailable
                                    ? "bg-white/95 shadow-lg hover:scale-105 hover:shadow-2xl dark:bg-green-900/40"
                                    : "border-slate-500 bg-slate-700/50 dark:border-slate-600 dark:bg-slate-800/50"
                                )}
                                style={isAvailable ? { borderColor: categoryColor } : {}}
                              >
                                {/* Day Number */}
                                <div
                                  className={cn(
                                    "flex size-12 items-center justify-center rounded-full text-2xl font-bold transition-all",
                                    isAvailable
                                      ? "text-white shadow-md group-hover:scale-110"
                                      : "bg-slate-500 text-white"
                                  )}
                                  style={isAvailable ? { backgroundColor: '#B91C1C' } : {}}
                                >
                                  {day.dayNumber}
                                </div>

                                {/* Emoji or Icon */}
                                <div className="text-4xl">
                                  {day.icon?.preview ? (
                                    <SanityImage
                                      alt=""
                                      className="size-12 object-cover"
                                      height={48}
                                      image={day.icon}
                                      width={48}
                                    />
                                  ) : (
                                    dayEmoji
                                  )}
                                </div>

                                {/* Title */}
                                <p
                                  className={cn(
                                    "line-clamp-2 text-center text-xs font-semibold transition-colors",
                                    isAvailable
                                      ? "text-green-950 group-hover:text-red-700 dark:text-white dark:group-hover:text-red-400"
                                      : "text-slate-400 dark:text-slate-500"
                                  )}
                                >
                                  {day.title}
                                </p>

                                {/* Break Day Badge */}
                                {isBreak && (
                                  <Badge className="border-2 bg-blue-200/90 text-xs text-green-950" style={{ borderColor: '#3B82F6', backgroundColor: '#DBEAFE' }}>
                                    🛑 Break Day
                                  </Badge>
                                )}

                                {/* Reward Badge */}
                                {day.reward && isAvailable && !isBreak && (
                                  <Badge className="border-2 bg-amber-200/90 text-xs text-green-950" style={{ borderColor: categoryColor, backgroundColor: '#F5DEB3' }}>
                                    🎁 {day.reward}
                                  </Badge>
                                )}

                                {/* Locked Icon */}
                                {!isAvailable && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-6xl">🔒</span>
                                  </div>
                                )}

                                {/* Shine effect on hover */}
                                {isAvailable && (
                                  <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="absolute -inset-1 opacity-75 blur-xl" style={{ background: `linear-gradient(to right, ${categoryColor}, ${categoryColor}dd, ${categoryColor})` }}></div>
                                  </div>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Fallback: Show days without grouping if no categories */
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {days.map((day) => {
                if (!day) return null;

                const isBreak = (day as any).isBreak || false;
                const isAvailable = isBreak || canOpenDay(
                  day.dayNumber,
                  startDate
                );
                const dayEmoji = getDayEmoji(day.dayNumber);

                return (
                  <Link
                    className={cn(
                      "group relative aspect-square rounded-xl transition-all duration-300",
                      isAvailable
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-50"
                    )}
                    href={isAvailable ? `/${data.slug}/${day.slug}` : "#"}
                    key={day.dayNumber}
                  >
                    {/* Card */}
                    <div
                      className={cn(
                        "relative flex h-full flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all duration-300",
                        isAvailable
                          ? "border-amber-300 bg-white/95 shadow-lg hover:scale-105 hover:shadow-2xl dark:border-amber-700 dark:bg-green-900/40"
                          : "border-slate-500 bg-slate-700/50 dark:border-slate-600 dark:bg-slate-800/50"
                      )}
                      style={isAvailable ? { borderColor: '#D4AF37' } : {}}
                    >
                      {/* Day Number */}
                      <div
                        className={cn(
                          "flex size-12 items-center justify-center rounded-full text-2xl font-bold transition-all",
                          isAvailable
                            ? "bg-red-700 text-white shadow-md group-hover:scale-110"
                            : "bg-slate-500 text-white"
                        )}
                        style={isAvailable ? { backgroundColor: '#B91C1C' } : {}}
                      >
                        {day.dayNumber}
                      </div>

                      {/* Emoji or Icon */}
                      <div className="text-4xl">
                        {day.icon?.preview ? (
                          <SanityImage
                            alt=""
                            className="size-12 object-cover"
                            height={48}
                            image={day.icon}
                            width={48}
                          />
                        ) : (
                          dayEmoji
                        )}
                      </div>

                      {/* Title */}
                      <p
                        className={cn(
                          "line-clamp-2 text-center text-xs font-semibold transition-colors",
                          isAvailable
                            ? "text-green-950 group-hover:text-red-700 dark:text-white dark:group-hover:text-red-400"
                            : "text-slate-400 dark:text-slate-500"
                        )}
                      >
                        {day.title}
                      </p>

                      {/* Break Day Badge */}
                      {isBreak && (
                        <Badge className="border-2 bg-blue-200/90 text-xs text-green-950" style={{ borderColor: '#3B82F6', backgroundColor: '#DBEAFE' }}>
                          🛑 Break Day
                        </Badge>
                      )}

                      {/* Reward Badge */}
                      {day.reward && isAvailable && !isBreak && (
                        <Badge className="border-2 border-amber-300 bg-amber-200/90 text-xs text-green-950" style={{ borderColor: '#D4AF37', backgroundColor: '#F5DEB3' }}>
                          🎁 {day.reward}
                        </Badge>
                      )}

                      {/* Locked Icon */}
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl">🔒</span>
                        </div>
                      )}

                      {/* Shine effect on hover */}
                      {isAvailable && (
                        <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="absolute -inset-1 opacity-75 blur-xl" style={{ background: 'linear-gradient(to right, #D4AF37, #F5DEB3, #D4AF37)' }}></div>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Empty state if no days */}
          {days.length === 0 && (
            <div className="text-center text-white/80">
              <p className="text-xl">🎄 Coming soon! 🎄</p>
              <p>Calendar days are being prepared...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Fun emojis for different days
function getDayEmoji(dayNumber: number): string {
  const emojis = [
    "🎄", // Day 1
    "🎁", // Day 2
    "❄️", // Day 3
    "🦌", // Day 4
    "⛄", // Day 5
    "🕯️", // Day 6
    "🎅", // Day 7
    "🌟", // Day 8
    "🎆", // Day 9
    "🔔", // Day 10
    "🎉", // Day 11
    "☃️", // Day 12
    "🛷", // Day 13
    "🎪", // Day 14
    "🎈", // Day 15
    "🎀", // Day 16
    "🍪", // Day 17
    "🎁", // Day 18
    "🎊", // Day 19
    "🎁", // Day 20
    "🎋", // Day 21
    "🎄", // Day 22
    "⭐", // Day 23
    "🎁", // Day 24
  ];
  return emojis[(dayNumber - 1) % 24] || "🎄";
}

// Check if a day can be opened
function canOpenDay(dayNumber: number, startDate: Date | null): boolean {
  if (!startDate) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayDate = new Date(startDate);
  dayDate.setDate(dayDate.getDate() + dayNumber - 1);
  dayDate.setHours(0, 0, 0, 0);

  return today >= dayDate;
}

// Snowflake animation component
function Snowflakes() {
  return (
    <>
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-snowfall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 20}s`,
          }}
        >
          <div
            className="text-white/50"
            style={{
              fontSize: `${10 + Math.random() * 20}px`,
            }}
          >
            ❄️
          </div>
        </div>
      ))}
    </>
  );
}

