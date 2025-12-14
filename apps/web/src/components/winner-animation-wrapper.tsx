'use client';

import { useState, useEffect } from 'react';
import { WinnerAnimation } from './winner-animation';

type WinnerAnimationWrapperProps = {
  participantName?: string;
  winnerName?: string;
  scheduledTime?: string;
  animationTitle?: string;
  animationId?: string;
  isActive?: boolean;
  oldInactiveAnimationIds?: string[];
};

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Helper function to set cookie
function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Helper function to check if animation has been seen (synchronous)
function hasSeenAnimationCookie(animationId: string | undefined, oldInactiveAnimationIds: string[], isActive: boolean): boolean {
  console.log('animationId', animationId);
  console.log('oldInactiveAnimationIds', oldInactiveAnimationIds);
  console.log('isActive', isActive);
  if (!animationId || typeof document === 'undefined') return false;
  
  // If there are old inactive animations, don't check for cookie
/*   if (oldInactiveAnimationIds.length > 0) {
    return false;
  } */
  
  // Only check cookie for active animations
  if (!isActive) {
    return false;
  }
  
  const cookieName = `winner_animation_viewed`;
  const viewed = getCookie(cookieName);

  console.log('viewed', viewed);
  console.log('animationId', animationId);
  return viewed === animationId;
}

export function WinnerAnimationWrapper({ 
  participantName, 
  winnerName, 
  scheduledTime,
  animationTitle,
  animationId,
  isActive = true,
  oldInactiveAnimationIds = []
}: WinnerAnimationWrapperProps) {
  // Check cookie immediately on mount to prevent race condition
  const initialHasSeenAnimation = hasSeenAnimationCookie(animationId, oldInactiveAnimationIds, isActive);
  
console.log('initialHasSeenAnimation', initialHasSeenAnimation);

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showAnimation, setShowAnimation] = useState(false);
  const [hasSeenAnimation, setHasSeenAnimation] = useState(initialHasSeenAnimation);

  // Clear cookies from old inactive animations if they exist
  // Also clear the current animation's cookie if there are old inactive animations that passed
  // This ensures the new active animation shows even if user has seen it before
  useEffect(() => {
    if (oldInactiveAnimationIds.length > 0 && typeof document !== 'undefined') {
      // Clear cookies from old inactive animations
      oldInactiveAnimationIds.forEach((oldId) => {
        const cookieName = `animation_viewed_${oldId}`;
        // Clear the cookie by setting it to expire in the past
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
      });
      
      // Also clear the current animation's cookie so it shows again
      if (animationId) {
        const currentCookieName = `animation_viewed_${animationId}`;
        document.cookie = `${currentCookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        setHasSeenAnimation(false);
      }
    }
  }, [oldInactiveAnimationIds, animationId]);

  // Check if user has already seen this animation (re-check on prop changes)
  useEffect(() => {
    if (!animationId) {
      setHasSeenAnimation(false);
      return;
    }
    
    // If there are old inactive animations, don't check for cookie (it's been cleared)
    if (oldInactiveAnimationIds.length > 0) {
      setHasSeenAnimation(false);
      return;
    }
    
    // Only check cookie for active animations
    // Inactive animations should show winners if time has passed (handled in WeekWinnersSection)
    if (!isActive) {
      setHasSeenAnimation(false);
      return;
    }
    
    const cookieName = `animation_viewed_${animationId}`;
    const viewed = getCookie(cookieName);
    setHasSeenAnimation(viewed === 'true');
  }, [animationId, oldInactiveAnimationIds, isActive]);

  // Callback when animation completes
  const handleAnimationComplete = () => {
    if (animationId) {
      // Use animation ID as the cookie identifier
      const cookieName = `winner_animation_viewed`;
      setCookie(cookieName, animationId, 365);
      setHasSeenAnimation(true);
      // Immediately prevent auto-play on next render
      setShowAnimation(false);
    }
  };

  useEffect(() => {
    // Don't auto-start animation if user has already seen it
    // Check cookie again to ensure we have the latest state
    const hasSeen = hasSeenAnimationCookie(animationId, oldInactiveAnimationIds, isActive);
    if (hasSeen) {
      setShowAnimation(false);
      setHasSeenAnimation(true);
      return;
    }

    if (!scheduledTime) {
      // No scheduled time, show animation immediately (only if not seen)
      setShowAnimation(!hasSeen);
      return;
    }

    const scheduleTime = new Date(scheduledTime).getTime();
    const timeUntilStart = scheduleTime - currentTime;

    if (timeUntilStart <= 0) {
      // Time has passed, show animation (only if not seen)
      setShowAnimation(!hasSeen);
    } else {
      // Time is in the future, show countdown
      setShowAnimation(false);
      // Update current time every second to keep countdown accurate
      const intervalId = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [scheduledTime, currentTime, hasSeenAnimation, animationId, oldInactiveAnimationIds, isActive]);

  // Update showAnimation when time passes
  useEffect(() => {
    if (!scheduledTime) return;
    
    // Check cookie again to ensure we have the latest state
    const hasSeen = hasSeenAnimationCookie(animationId, oldInactiveAnimationIds, isActive);
    if (hasSeen) {
      setShowAnimation(false);
      setHasSeenAnimation(true);
      return;
    }

    const scheduleTime = new Date(scheduledTime).getTime();
    const timeUntilStart = scheduleTime - currentTime;

    if (timeUntilStart <= 0 && !showAnimation) {
      setShowAnimation(true);
    }
  }, [scheduledTime, currentTime, showAnimation, hasSeenAnimation, animationId, oldInactiveAnimationIds, isActive]);

  // Determine if animation should auto-start (only if not viewed and time is right)
  // Double-check cookie before auto-starting
  const hasSeen = hasSeenAnimationCookie(animationId, oldInactiveAnimationIds, isActive);
  const shouldAutoStart = !hasSeen && !hasSeenAnimation && showAnimation;

  // If no scheduled time, auto-start only if not viewed
  if (!scheduledTime) {
    return (
      <WinnerAnimation 
        participantName={participantName}
        winnerName={winnerName}
        scheduledTime={scheduledTime}
        onAnimationComplete={handleAnimationComplete}
        autoStart={!hasSeen && !hasSeenAnimation}
      />
    );
  }

  const scheduleTime = new Date(scheduledTime).getTime();
  const isFuture = scheduleTime > currentTime;

  if (isFuture && !showAnimation) {
    return (
      <div className="text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">
          Neste trekning: {animationTitle}
        </h2>
        <p className="text-xl text-white/90">
          {new Date(scheduledTime).toLocaleString('no-NO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    );
  }

  // Final check before rendering - ensure we don't auto-start if cookie exists
  const finalHasSeen = hasSeenAnimationCookie(animationId, oldInactiveAnimationIds, isActive);
  const finalShouldAutoStart = !finalHasSeen && !hasSeenAnimation && showAnimation;

  return (
    <WinnerAnimation 
      participantName={participantName}
      winnerName={winnerName}
      scheduledTime={scheduledTime}
      onAnimationComplete={handleAnimationComplete}
      autoStart={finalShouldAutoStart}
      animationTitle={animationTitle}
    />
  );
}

