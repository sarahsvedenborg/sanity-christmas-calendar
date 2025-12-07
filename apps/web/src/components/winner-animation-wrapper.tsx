'use client';

import { useState, useEffect } from 'react';
import { WinnerAnimation } from './winner-animation';

type WinnerAnimationWrapperProps = {
  participantName?: string;
  winnerName?: string;
  scheduledTime?: string;
  animationTitle?: string;
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

// Helper function to set cookie
function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export function WinnerAnimationWrapper({ 
  participantName, 
  winnerName, 
  scheduledTime,
  animationTitle,
  animationId
}: WinnerAnimationWrapperProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showAnimation, setShowAnimation] = useState(false);
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false);

  // Check if user has already seen this animation
  useEffect(() => {
    if (!animationId) return;
    
    const cookieName = `animation_viewed_${animationId}`;
    const viewed = getCookie(cookieName);
    if (viewed === 'true') {
      setHasSeenAnimation(true);
    }
  }, [animationId]);

  // Callback when animation completes
  const handleAnimationComplete = () => {
    if (animationId) {
      const cookieName = `animation_viewed_${animationId}`;
      setCookie(cookieName, 'true', 365);
      setHasSeenAnimation(true);
    }
  };

  useEffect(() => {
    // Don't auto-start animation if user has already seen it
    if (hasSeenAnimation) {
      setShowAnimation(false);
      return;
    }

    if (!scheduledTime) {
      // No scheduled time, show animation immediately
      setShowAnimation(true);
      return;
    }

    const scheduleTime = new Date(scheduledTime).getTime();
    const timeUntilStart = scheduleTime - currentTime;

    if (timeUntilStart <= 0) {
      // Time has passed, show animation
      setShowAnimation(true);
    } else {
      // Time is in the future, show countdown
      setShowAnimation(false);
      // Update current time every second to keep countdown accurate
      const intervalId = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [scheduledTime, currentTime, hasSeenAnimation]);

  // Update showAnimation when time passes
  useEffect(() => {
    if (!scheduledTime || hasSeenAnimation) return;

    const scheduleTime = new Date(scheduledTime).getTime();
    const timeUntilStart = scheduleTime - currentTime;

    if (timeUntilStart <= 0 && !showAnimation) {
      setShowAnimation(true);
    }
  }, [scheduledTime, currentTime, showAnimation, hasSeenAnimation]);

  // Determine if animation should auto-start (only if not viewed and time is right)
  const shouldAutoStart = !hasSeenAnimation && showAnimation;

  // If no scheduled time, auto-start only if not viewed
  if (!scheduledTime) {
    return (
      <WinnerAnimation 
        participantName={participantName}
        winnerName={winnerName}
        scheduledTime={scheduledTime}
        onAnimationComplete={handleAnimationComplete}
        autoStart={!hasSeenAnimation}
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

  return (
    <WinnerAnimation 
      participantName={participantName}
      winnerName={winnerName}
      scheduledTime={scheduledTime}
      onAnimationComplete={handleAnimationComplete}
      autoStart={shouldAutoStart}
      animationTitle={animationTitle}
    />
  );
}

