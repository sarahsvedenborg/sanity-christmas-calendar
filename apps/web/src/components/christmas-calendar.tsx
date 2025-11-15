"use client";

import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { QueryChristmasCalendarDataResult } from "@/lib/sanity/sanity.types";

import { RichText } from "./elements/rich-text";
import { SanityImage } from "./elements/sanity-image";
import { CalendarLogo } from "../logos/CalendarLogo";
import { CalendarLogoGold } from "../logos/CalendarLogoGold";
import { CalendarLogoSilver } from "../logos/CalendarLogoSilver";
import { CalendarLogoBronze } from "../logos/CalendarLogoBronze";

type CalendarData = NonNullable<QueryChristmasCalendarDataResult>;

type ChristmasCalendarProps = {
  data: CalendarData;
};

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

const CalendarDayCard = ({ day, isBreak, isAvailable, dayEmoji, categoryColor }: { day: any, isBreak: boolean, isAvailable: boolean, dayEmoji: string, categoryColor: string }) => {
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
    )
  }

  const CalendarCategoryGroup = ({ group, index, startDate, categoryBgColor, categoryColor }: { group: any, index: number, startDate: Date | null, categoryBgColor: string, categoryColor: string }) => {

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

return(
<div className="space-y-6">
  <div className="flex  gap-4">
                      {/* Category header */}
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
                            return <CalendarDayCard key={day.dayNumber} day={day} isBreak={isBreak} isAvailable={isAvailable} dayEmoji={dayEmoji} categoryColor={categoryColor} />
                          })}
                        </div>
                          </div>
</div>
)  
}


export function ChristmasCalendar({ data }: ChristmasCalendarProps) {
  const startDate = data.startDate ? new Date(data.startDate) : null;
  const days = data.days || [];
  
  if (days.length === 0){
    return (
      <div className="text-center text-white/80">
        <p className="text-xl">🎄 Coming soon! 🎄</p>
        <p>Calendar days are being prepared...</p>
      </div>
    )
  }

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
        
  return (
    
          <section className="relative pb-24 mt-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-bold text-3xl text-white md:text-4xl">
            ✨ Kalenderluker ✨
          </h2>
           {categories.length > 0 ? (
            <div className="mx-auto max-w-6xl space-y-12">
              {categories.map((group, index) => {
                const categoryColor = categoryColorMap.get(group.category._id) || '#D4AF37';
                   const categoryBgColor = categoryColor === '#CD7F32' 
                  ? '#E5B18E' // Bronze
                  : categoryColor === '#C0C0C0'
                  ? '#D9D9D9' // Silver
                  : '#E5C68D'; // Gold 

                   return <CalendarCategoryGroup key={group.category._id} group={group} index={index} startDate={startDate} categoryBgColor={categoryBgColor}  categoryColor={categoryColor} />
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
          </div>
          </section>
  );
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
