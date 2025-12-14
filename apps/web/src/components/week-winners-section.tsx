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
  isActive?: boolean;
  scheduledTime?: string;
  oldInactiveAnimationIds?: string[];
  animationsByWeek?: Record<number, { id?: string; isActive?: boolean; time?: string }>;
};

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Helper function to delete cookie
function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
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

export function WeekWinnersSection({ weekWinners, animationId, isActive = true, scheduledTime, oldInactiveAnimationIds = [], animationsByWeek = {} }: WeekWinnersSectionProps) {
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false);
  const [week2HasSeenAnimation, setWeek2HasSeenAnimation] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Clear cookies from old inactive animations if they exist
  // Also clear the current animation's cookie if there are old inactive animations that passed
  // This ensures winners show even if user has seen the animation before
/*   useEffect(() => {
    if (oldInactiveAnimationIds.length > 0) {
      // Clear cookies from old inactive animations
      oldInactiveAnimationIds.forEach((oldId) => {
        const cookieName = `animation_viewed_${oldId}`;
        deleteCookie(cookieName);
      });
      
      // Also clear the current animation's cookie so winners show
      if (animationId) {
        const currentCookieName = `animation_viewed_${animationId}`;
        deleteCookie(currentCookieName);
      }
    }
  }, [oldInactiveAnimationIds, animationId]);
 */
  // Check if winners should be displayed
  // Winners should be shown if:
  // 1. Animation has been seen (cookie exists), OR
  // 2. Animation is inactive AND time has passed
  useEffect(() => {
    if (!animationId) {
      // If no animation ID, show all winners
      setHasSeenAnimation(true);
      return;
    }
    
    // If there are old inactive animations, show winners (cookies have been cleared)
   /*  if (oldInactiveAnimationIds.length > 0) {
      setHasSeenAnimation(true);
      return;
    } */
    
    // If animation is inactive and time has passed, show winners
    if (!isActive && scheduledTime) {
      const scheduleTime = new Date(scheduledTime).getTime();
      if (scheduleTime <= currentTime) {
        setHasSeenAnimation(true);
        return;
      }
    }
    
    // For active animations, check if user has seen it
    if (isActive) {
      const cookieName = `winner_animation_viewed`;
      const viewed = getCookie(cookieName);
      if (viewed === animationId) {
        setHasSeenAnimation(true);
      }

      // Also listen for storage events in case cookie is set in another tab
      const checkCookie = () => {
        const viewed = getCookie(cookieName);
        if (viewed === animationId) {
          setHasSeenAnimation(true);
        }
      };

      // Check cookie periodically
      const intervalId = setInterval(checkCookie, 500);

      return () => clearInterval(intervalId);
    }
  }, [animationId, oldInactiveAnimationIds, isActive, scheduledTime, currentTime]);

  // Check if week 2 animation has been seen or is inactive and passed
  useEffect(() => {
    const week2Animation = animationsByWeek[2];
   /*  if (!week2Animation?.id) {
      // No week 2 animation, show winners
      setWeek2HasSeenAnimation(true);
      return;
    } */

    const checkWeek2Cookie = () => {
      // Check cookie for week 2 animation
      const cookieName = `winner_animation_viewed`;
      const viewedAnimationId = getCookie(cookieName);
          setWeek2HasSeenAnimation(viewedAnimationId ===  'week-two');
      
      // Check if cookie matches week-2 or the week 2 animation ID
     /*  if (viewedAnimationId === 'week-two') {
        setWeek2HasSeenAnimation(true);
        return;
      } */

      // If week 2 animation is inactive and time has passed, show winners
     /*  if (!week2Animation.isActive && week2Animation.time) {
        const scheduleTime = new Date(week2Animation.time).getTime();
        if (scheduleTime <= currentTime) {
          setWeek2HasSeenAnimation(true);
          return;
        }
      }
 */
     // setWeek2HasSeenAnimation(false);
    };

    // Check immediately
    checkWeek2Cookie();

    // Check cookie periodically in case it's set in another tab
    const intervalId = setInterval(checkWeek2Cookie, 500);

    return () => clearInterval(intervalId);
  }, [animationsByWeek, currentTime]);

  // Filter week winners
  // Week 1: hide if animation hasn't been viewed
  // Week 2: hide if animation hasn't been viewed AND it's not inactive and passed
  const visibleWeekWinners = weekWinners.map((week) => {
   /*  if (week.week === 1 && !hasSeenAnimation) {
      return {
        ...week,
        winners: [], // Hide winners but keep the week card
      };
    } */
    if (week.week === 2 && !week2HasSeenAnimation) {
      return {
        ...week,
        winners: [], // Hide winners but keep the week card
      };
    }
     if (week.week === 3 ) {
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
                {(week.week === 1 && !hasSeenAnimation) || (week.week === 2 && !week2HasSeenAnimation)
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

