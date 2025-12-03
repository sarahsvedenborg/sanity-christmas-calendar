'use client';

import { useState, useEffect } from 'react';
import { WinnerAnimation } from './winner-animation';

type WinnerAnimationWrapperProps = {
  participantName?: string;
  winnerName?: string;
  scheduledTime?: string;
};

export function WinnerAnimationWrapper({ 
  participantName, 
  winnerName, 
  scheduledTime 
}: WinnerAnimationWrapperProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
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
  }, [scheduledTime, currentTime]);

  // Update showAnimation when time passes
  useEffect(() => {
    if (!scheduledTime) return;

    const scheduleTime = new Date(scheduledTime).getTime();
    const timeUntilStart = scheduleTime - currentTime;

    if (timeUntilStart <= 0 && !showAnimation) {
      setShowAnimation(true);
    }
  }, [scheduledTime, currentTime, showAnimation]);

  if (!scheduledTime) {
    return (
      <WinnerAnimation 
        participantName={participantName}
        winnerName={winnerName}
        scheduledTime={scheduledTime}
      />
    );
  }

  const scheduleTime = new Date(scheduledTime).getTime();
  const isFuture = scheduleTime > currentTime;

  if (isFuture && !showAnimation) {
    return (
      <div className="text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">
          Neste trekning
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
    />
  );
}

