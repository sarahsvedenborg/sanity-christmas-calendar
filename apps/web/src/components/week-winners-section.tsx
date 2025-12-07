'use client';

import { LogoBronzeNew } from "@/logos/LogoBronzeNew";
import { LogoSilverNew } from "@/logos/LogoSilverNew";
import { LogoGoldNew } from "@/logos/LogoGoldNew";
import { useState, useEffect } from 'react';

type WeekWinner = {
  name: string;
  email?: string;
  prize?: string;
};

type WeekWinners = {
  week: number;
  title: string;
  winners: WeekWinner[];
};

type WeekWinnersSectionProps = {
  weekWinners: WeekWinners[];
  animationId?: string;
};

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Category background colors matching the homepage
const categoryBgColors = {
  1: "#E5B18E", // Bronze
  2: "#D9D9D9", // Silver
  3: "#E5C68D", // Gold
};

// Get logo for each week
const getWeekLogo = (week: number) => {
  switch (week) {
    case 1:
      return <LogoBronzeNew width={80} height={80} />;
    case 2:
      return <LogoSilverNew width={80} height={80} />;
    case 3:
      return <LogoGoldNew width={80} height={80} />;
    default:
      return null;
  }
};

export function WeekWinnersSection({ weekWinners, animationId }: WeekWinnersSectionProps) {
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false);

  // Check if user has already seen this animation
  useEffect(() => {
    if (!animationId) {
      // If no animation ID, show all winners
      setHasSeenAnimation(true);
      return;
    }
    
    const cookieName = `animation_viewed_${animationId}`;
    const viewed = getCookie(cookieName);
    if (viewed === 'true') {
      setHasSeenAnimation(true);
    }

    // Also listen for storage events in case cookie is set in another tab
    const checkCookie = () => {
      const viewed = getCookie(cookieName);
      if (viewed === 'true') {
        setHasSeenAnimation(true);
      }
    };

    // Check cookie periodically
    const intervalId = setInterval(checkCookie, 500);

    return () => clearInterval(intervalId);
  }, [animationId]);

  // Filter week winners - hide week 1 if animation hasn't been viewed
  const visibleWeekWinners = weekWinners.map((week) => {
    if (week.week === 1 && !hasSeenAnimation) {
      return {
        ...week,
        winners: [], // Hide winners but keep the week card
      };
    }
    return week;
  });

  return (
    <section>
      <h2 className="mb-10 text-center text-3xl font-bold text-white">
        🏆 Vinnere per uke
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {visibleWeekWinners.map((week) => (
          <div
            key={week.week}
            className="rounded-2xl border border-amber-300/60 p-6 shadow-sm backdrop-blur dark:border-amber-700/50"
            style={{ backgroundColor: categoryBgColors[week.week as keyof typeof categoryBgColors] || "#E5B18E" }}
          >
            <div className="mt-[-50px] mb-4 flex justify-center">
              {getWeekLogo(week.week)}
            </div>
            <h3 className="mb-6 text-center text-2xl font-semibold text-green-950 dark:text-white">
              {week.title}
            </h3>
            {week.winners.length === 0 ? (
              <p className="text-center text-green-900/70 dark:text-white/60">
                {week.week === 1 && !hasSeenAnimation
                  ? "Vent på trekningen for å se vinnerne"
                  : "Ingen vinnere enda"}
              </p>
            ) : (
              <ul className="space-y-4">
                {week.winners.map((winner, index) => (
                  <li
                    key={index}
                    className="rounded-lg border border-amber-200/50 bg-amber-50/50 p-4 dark:border-amber-700/30 dark:bg-green-900/30"
                  >
                    <p className="font-semibold text-green-950 dark:text-white">
                      {winner.name}
                    </p>
                    {winner.prize && (
                      <p className="mt-1 text-sm text-green-900/70 dark:text-white/60">
                        {winner.prize}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

