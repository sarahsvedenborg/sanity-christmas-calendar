"use client";

import { useEffect, useMemo } from "react";

type Snowflake = {
  left: number;
  delay: number;
  duration: number;
  size: number;
};

const TOTAL_SNOWFLAKES = 50;

export function Snowflakes() {
  const flakes = useMemo<Snowflake[]>(() => {
    return Array.from({ length: TOTAL_SNOWFLAKES }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20,
      size: 10 + Math.random() * 20,
    }));
  }, []);

  useEffect(() => {
    // Ensures animations run after hydration
  }, []);

  return (
    <>
      {flakes.map((flake, index) => (
        <div
          key={index}
          className="absolute animate-snowfall"
          style={{
            left: `${flake.left}%`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
          }}
        >
          <div
            className="text-white/50"
            style={{
              fontSize: `${flake.size}px`,
            }}
          >
            ❄️
          </div>
        </div>
      ))}
    </>
  );
}


