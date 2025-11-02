"use client";

import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { QueryChristmasCalendarDataResult } from "@/lib/sanity/sanity.types";

import { RichText } from "./elements/rich-text";
import { SanityImage } from "./elements/sanity-image";
import { CalendarLogo } from "./CalendarLogo";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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
                <div className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-20"></div>
              {/*   <div className="relative flex size-32 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 shadow-2xl">
                  <Sparkles className="size-16 text-white" />

                </div> */}
                  <div className="relative flex size-32 items-center justify-center rounded-full  ">
               
    <CalendarLogo />
                </div>
              </div>
            </div>
          

            <h1 className="mb-4 text-balance bg-gradient-to-r from-red-600 via-green-600 to-blue-600 bg-clip-text font-bold text-5xl tracking-tight text-transparent md:text-7xl">
              🎄 {data.title}🎄
            </h1>

            {data.description && (
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                {data.description}
              </p>
            )}

            {/* Countdown */}
            {daysUntilStart !== null && daysUntilStart > 0 && (
              <div className="mb-8 inline-block rounded-full bg-gradient-to-r from-green-600 to-blue-600 p-1 shadow-lg">
                <div className="rounded-full bg-white px-8 py-4 dark:bg-slate-950">
                  <p className="text-center font-bold text-lg text-slate-900 dark:text-white">
                    {daysUntilStart === 1
                      ? "Starting Tomorrow! 🎉"
                      : `${daysUntilStart} Days Until Start! ⏰`}
                  </p>
                </div>
              </div>
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
            {data.introContent && data.introContent.length > 0 && (
              <div className="mb-16 rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:bg-slate-900/80">
                <RichText className="text-left" richText={data.introContent} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Calendar Grid */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-bold text-3xl md:text-4xl">
            ✨ Daily Challenges ✨
          </h2>

          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {days.map((day) => {
              if (!day) return null;

              const isAvailable = canOpenDay(
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
                        ? "border-green-300 bg-gradient-to-br from-green-50 to-blue-50 shadow-lg hover:scale-105 hover:shadow-2xl dark:border-green-600 dark:from-green-950/30 dark:to-blue-950/30"
                        : "border-slate-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900"
                    )}
                  >
                    {/* Day Number */}
                    <div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-full text-2xl font-bold transition-all",
                        isAvailable
                          ? "bg-gradient-to-br from-green-500 to-blue-500 text-white shadow-md group-hover:scale-110"
                          : "bg-slate-400 text-white"
                      )}
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
                          ? "text-slate-900 group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400"
                          : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      {day.title}
                    </p>

                    {/* Reward Badge */}
                    {day.reward && isAvailable && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-xs">
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
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-400 to-green-400 opacity-75 blur-xl"></div>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Empty state if no days */}
          {days.length === 0 && (
            <div className="text-center text-muted-foreground">
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

