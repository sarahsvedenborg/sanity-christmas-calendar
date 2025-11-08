"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { RichText } from "./elements/rich-text";

type BreakDayContentProps = {
  breakContent: unknown;
};

type Sparkle = {
  left: number;
  top: number;
  delay: number;
  size: number;
};

const SPARKLES: Sparkle[] = [
  { left: 8, top: 12, delay: 0, size: 18 },
  { left: 22, top: 46, delay: 1.1, size: 14 },
  { left: 68, top: 30, delay: 0.7, size: 16 },
  { left: 82, top: 12, delay: 2.6, size: 20 },
  { left: 12, top: 72, delay: 3.1, size: 12 },
  { left: 48, top: 10, delay: 2, size: 22 },
  { left: 86, top: 58, delay: 4, size: 17 },
  { left: 64, top: 78, delay: 1.8, size: 15 },
  { left: 34, top: 86, delay: 3.8, size: 19 },
  { left: 52, top: 52, delay: 2.9, size: 13 },
];

export const BreakDayContent = ({ breakContent }: BreakDayContentProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const hasAnimatedRef = useRef(false);
  const fallbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof window === "undefined" || "IntersectionObserver" in window === false) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            setHasTriggered(true);
            hasAnimatedRef.current = true;
            window.setTimeout(() => setIsOpen(true), 250);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (hasAnimatedRef.current) return;

    fallbackTimeoutRef.current = window.setTimeout(() => {
      if (!hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        setHasTriggered(true);
        setIsOpen(true);
      }
    }, 900);

    return () => {
      if (fallbackTimeoutRef.current) {
        window.clearTimeout(fallbackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const confetti = document.createElement("div");
    confetti.className = "gift-confetti";
    containerRef.current?.appendChild(confetti);

    const timeout = window.setTimeout(() => {
      confetti.remove();
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  const sparkles = useMemo(() => SPARKLES, []);

  return (
    <div
      ref={containerRef}
      className="relative mb-16 overflow-hidden rounded-3xl border-2 border-amber-300/60 bg-gradient-to-br from-white/96 via-amber-50/85 to-white/96 p-8 text-center shadow-2xl backdrop-blur-md dark:border-amber-700/60 dark:from-green-950/90 dark:via-green-900/80 dark:to-green-950/90"
      style={{ borderColor: "#D4AF37" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-80 mix-blend-screen">
        {sparkles.map((sparkle, index) => (
          <span
            key={index}
            className="absolute inline-block animate-[float_10s_ease-in-out_infinite] text-amber-300/60 blur-[0.5px] dark:text-amber-200/60"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              animationDelay: `${sparkle.delay}s`,
              fontSize: `${sparkle.size}px`,
            }}
          >
            ✨
          </span>
        ))}
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.45em] text-amber-600 dark:text-amber-200 md:text-sm">
          <Sparkles className="size-4 animate-pulse" />
          Fun Fact Pause
          <Sparkles className="size-4 animate-pulse" />
        </div>

        <div className="gift-container relative flex flex-col items-center">
          <div
            className={cn(
              "gift-lid pointer-events-none",
              hasTriggered && "gift-lid--primed",
              isOpen && "gift-lid--open"
            )}
            aria-hidden
          >
            <div className="gift-lid__top" />
            <div className="gift-lid__bow">
              <div className="gift-lid__loop-left" />
              <div className="gift-lid__loop-right" />
            </div>
          </div>
          <div className="gift-box" aria-hidden>
            <div className="gift-box__ribbon" />
            <div className="gift-box__ribbon-horizontal" />
          </div>
          <div
            aria-live="polite"
            className={cn(
              "gift-reveal prose-sm prose text-center text-green-950 opacity-0 dark:text-white md:text-base",
              isOpen && "gift-reveal--visible"
            )}
          >
            <RichText className="mx-auto max-w-md text-center" richText={breakContent} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .gift-container {
          perspective: 1400px;
          padding-top: 52px;
        }

        .gift-box {
          position: relative;
          width: 210px;
          height: 140px;
          background: linear-gradient(140deg, #b91c1c 0%, #7f1d1d 100%);
          border-radius: 16px;
          box-shadow:
            0 18px 35px rgba(0, 0, 0, 0.28),
            inset 0 0 18px rgba(255, 255, 255, 0.08);
          transform: translateZ(0);
        }

        .gift-box::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 2px solid rgba(255, 255, 255, 0.14);
        }

        .gift-box__ribbon,
        .gift-box__ribbon-horizontal {
          position: absolute;
          background: linear-gradient(180deg, #fef9c3 0%, #facc15 100%);
          box-shadow: inset 0 0 9px rgba(0, 0, 0, 0.22);
        }

        .gift-box__ribbon {
          top: -8px;
          bottom: -8px;
          left: 50%;
          width: 30px;
          transform: translateX(-50%);
          border-radius: 10px;
        }

        .gift-box__ribbon-horizontal {
          left: -8px;
          right: -8px;
          top: 50%;
          height: 26px;
          transform: translateY(-50%);
          border-radius: 10px;
        }

        .gift-lid {
          position: absolute;
          top: -56px;
          width: 240px;
          height: 72px;
          transform-origin: bottom center;
          transform-style: preserve-3d;
          transform: rotateX(0deg) translateY(0) rotateZ(0deg);
          transition: transform 0.95s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 3;
        }

        .gift-lid--primed {
          animation: lid-prep 0.65s ease-out forwards;
        }

        .gift-lid--open {
          animation: lid-open 1.1s 0.15s cubic-bezier(0.2, 1, 0.22, 1) forwards;
        }

        .gift-lid__top {
          width: 100%;
          height: 100%;
          border-radius: 18px;
          background: linear-gradient(130deg, #7f1d1d 0%, #9a3412 85%);
          box-shadow:
            0 14px 25px rgba(0, 0, 0, 0.28),
            inset 0 0 12px rgba(255, 255, 255, 0.12);
        }

        .gift-lid__bow {
          position: absolute;
          left: 50%;
          top: 46%;
          width: 90px;
          height: 90px;
          transform: translate(-50%, -50%);
        }

        .gift-lid__loop-left,
        .gift-lid__loop-right {
          position: absolute;
          width: 72px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(125deg, #fde68a 0%, #facc15 100%);
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.18);
        }

        .gift-lid__loop-left {
          left: 0;
          transform: rotate(-18deg);
        }

        .gift-lid__loop-right {
          right: 0;
          transform: rotate(18deg);
        }

        .gift-reveal {
          position: absolute;
          top: 50%;
          width: 260px;
          transform: translate(-50%, -20px) scale(0.92);
          left: 50%;
          filter: drop-shadow(0 10px 30px rgba(212, 175, 55, 0.35));
        }

        .gift-reveal--visible {
          animation: reveal-rise 1.15s 0.15s cubic-bezier(0.32, 0.94, 0.6, 1) forwards,
            sparkle-pulse 2.4s ease-in-out infinite alternate;
        }

        @keyframes lid-prep {
          0% {
            transform: rotateX(0deg) translateY(0) rotateZ(0deg);
          }
          100% {
            transform: rotateX(-20deg) translateY(-6px) rotateZ(-2deg);
          }
        }

        @keyframes lid-open {
          0% {
            transform: rotateX(-20deg) translateY(-6px) rotateZ(-2deg);
          }
          55% {
            transform: rotateX(-120deg) translateY(-48px) rotateZ(-6deg);
          }
          100% {
            transform: rotateX(-105deg) translateY(-36px) rotateZ(-4deg);
          }
        }

        @keyframes reveal-rise {
          0% {
            opacity: 0;
            transform: translate(-50%, 60px) scale(0.7);
          }
          60% {
            opacity: 1;
            transform: translate(-50%, -60px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -92px) scale(1);
          }
        }

        @keyframes sparkle-pulse {
          from {
            filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.3));
          }
          to {
            filter: drop-shadow(0 0 28px rgba(255, 215, 0, 0.55));
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-14px);
          }
        }

        .gift-confetti {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: visible;
        }

        .gift-confetti::before,
        .gift-confetti::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(circle at 10% 20%, rgba(255, 205, 112, 0.65) 0, transparent 42%),
            radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.65) 0, transparent 45%),
            radial-gradient(circle at 20% 80%, rgba(217, 119, 6, 0.45) 0, transparent 38%),
            radial-gradient(circle at 90% 80%, rgba(244, 114, 182, 0.45) 0, transparent 48%);
          animation: confetti-burst 2.15s ease-out forwards;
        }

        .gift-confetti::after {
          filter: blur(6px);
        }

        @keyframes confetti-burst {
          0% {
            transform: scale(0.35) translateY(60px);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: scale(1.4) translateY(-80px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BreakDayContent;