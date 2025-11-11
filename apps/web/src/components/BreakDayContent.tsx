"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const sparkles = useMemo(() => SPARKLES, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 400);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setShowConfetti(false);
      return;
    }

    setShowConfetti(true);
    const timer = window.setTimeout(() => setShowConfetti(false), 2400);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  return (
    <div
      className="relative mb-16 overflow-hidden rounded-3xl border-2 border-amber-300/60 bg-gradient-to-br from-white/96 via-amber-50/85 to-white/96 p-10 text-center shadow-2xl backdrop-blur-md dark:border-amber-700/60 dark:from-green-950/90 dark:via-green-900/80 dark:to-green-950/90"
      style={{ borderColor: "#D4AF37" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen">
        {sparkles.map((sparkle, index) => (
          <span
            key={index}
            className="absolute inline-block animate-[float_11s_ease-in-out_infinite] text-amber-300/60 blur-[0.5px] dark:text-amber-200/60"
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

      <div className="relative mx-auto flex max-w-xl flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.45em] text-amber-600 dark:text-amber-200 md:text-sm">
          <Sparkles className="size-4 animate-pulse" />
          Julebrev
          <Sparkles className="size-4 animate-pulse" />
        </div>

        <div
          aria-live="polite"
          className={`envelope-scene ${isOpen ? "open" : "closed"}`}
          onClick={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setIsOpen(true);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="envelope">
            <div className="envelope-shadow" />
            <div className="envelope-pocket" />
            <div className="envelope-flap" />
            <div className="envelope-letter">
              <div className="envelope-letter-inner">
                <RichText className="text-center text-base md:text-lg" richText={breakContent} />
              </div>
            </div>
            <div className="envelope-hearts" aria-hidden>
              <span className="heart heart-a1" />
              <span className="heart heart-a2" />
              <span className="heart heart-a3" />
            </div>
          </div>

          {showConfetti && (
            <div className="envelope-confetti" aria-hidden>
              <div className="envelope-confetti-layer envelope-confetti-layer-primary" />
              <div className="envelope-confetti-layer envelope-confetti-layer-blur" />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .envelope-scene {
          width: 320px;
          height: 240px;
          position: relative;
          perspective: 1400px;
          cursor: pointer;
        }

        .envelope {
          --env-border: 16px;
          --env-width: 320px;
          --env-height: 200px;
          --env-pocket: linear-gradient(135deg, #0f766e 0%, #0b4f4b 100%);
          --env-flap: linear-gradient(135deg, #0b3948 0%, #073541 100%);
          --env-letter: linear-gradient(135deg, #fff7e1 0%, #ffe6b9 100%);
          position: relative;
          width: var(--env-width);
          height: var(--env-height);
          margin: 0 auto;
          transform-style: preserve-3d;
        }

        .envelope::after {
          content: "";
          position: absolute;
          bottom: -26px;
          left: 50%;
          width: 160%;
          height: 32px;
          transform: translateX(-50%);
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.24) 0%,
            rgba(0, 0, 0, 0.04) 45%,
            transparent 75%
          );
          filter: blur(2px);
          opacity: 0.6;
        }

        .envelope-pocket {
          position: absolute;
          inset: 0;
          border-radius: var(--env-border);
          background: var(--env-pocket);
          clip-path: polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%);
        }

        .envelope-flap {
          position: absolute;
          inset: 0;
          border-radius: var(--env-border);
          background: var(--env-flap);
          clip-path: polygon(0 0, 50% 60%, 100% 0, 100% 100%, 0 100%);
          transform-origin: bottom center;
          transform: rotateX(0deg);
          transform-style: preserve-3d;
          transition: transform 0.85s cubic-bezier(0.19, 1, 0.22, 1);
          z-index: 3;
        }

        .envelope-letter {
          position: absolute;
          bottom: 12px;
          left: 50%;
          width: calc(var(--env-width) - 64px);
          height: calc(var(--env-height) - 80px);
          transform: translateX(-50%) translateZ(1px) translateY(0);
          border-radius: calc(var(--env-border) - 4px);
          background: var(--env-letter);
          box-shadow:
            0 16px 32px rgba(94, 52, 16, 0.25),
            inset 0 0 16px rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(217, 119, 6, 0.25);
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
          z-index: 2;
        }

        .envelope-letter-inner {
          max-height: 100%;
          overflow-y: auto;
        }

        .envelope-shadow {
          position: absolute;
          inset: 0;
          border-radius: var(--env-border);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(0, 0, 0, 0.08));
          opacity: 0.3;
        }

        .envelope.open .envelope-flap,
        .open .envelope-flap {
          transform: rotateX(-155deg);
        }

        .envelope.open .envelope-letter,
        .open .envelope-letter {
          opacity: 1;
          transform: translateX(-50%) translateZ(18px) translateY(calc(-1 * var(--env-height) / 1.45));
        }

        .envelope-hearts {
          position: absolute;
          top: 55%;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 20px;
          pointer-events: none;
          z-index: 4;
        }

        .heart {
          position: relative;
          width: 44px;
          height: 44px;
          opacity: 0;
          transform: scale(0.6);
        }

        .heart::before,
        .heart::after {
          content: "";
          position: absolute;
          width: 50%;
          height: 80%;
          background: #f97316;
          border-radius: 50%;
          top: 0;
        }

        .heart::before {
          left: 50%;
          transform: translateX(-100%) rotate(-45deg);
        }

        .heart::after {
          right: 50%;
          transform: translateX(100%) rotate(45deg);
        }

        .open .heart {
          animation: float-up 4s ease-in forwards, sway 2.2s ease-in-out infinite alternate;
        }

        .open .heart-a1 {
          animation-delay: 0.5s;
        }

        .open .heart-a2 {
          animation-delay: 0.8s;
          animation-duration: 4.6s;
        }

        .open .heart-a3 {
          animation-delay: 1s;
          animation-duration: 5s;
        }

        .envelope-confetti {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
        }

        .envelope-confetti-layer {
          position: absolute;
          inset: 0;
          animation: confetti-burst 2.4s ease-out forwards;
          background-repeat: no-repeat;
        }

        .envelope-confetti-layer-primary {
          background-image:
            radial-gradient(circle at 12% 22%, rgba(255, 183, 77, 0.65) 0, transparent 44%),
            radial-gradient(circle at 78% 14%, rgba(255, 255, 255, 0.65) 0, transparent 48%),
            radial-gradient(circle at 20% 80%, rgba(217, 119, 6, 0.45) 0, transparent 38%),
            radial-gradient(circle at 90% 78%, rgba(244, 114, 182, 0.45) 0, transparent 50%);
        }

        .envelope-confetti-layer-blur {
          filter: blur(5px);
          background-image:
            radial-gradient(circle at 18% 18%, rgba(255, 213, 128, 0.55) 0, transparent 46%),
            radial-gradient(circle at 72% 12%, rgba(255, 255, 255, 0.55) 0, transparent 46%),
            radial-gradient(circle at 24% 76%, rgba(217, 70, 239, 0.35) 0, transparent 40%),
            radial-gradient(circle at 88% 82%, rgba(56, 189, 248, 0.35) 0, transparent 52%);
        }

        @keyframes float-up {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.6);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-260px) scale(1);
          }
        }

        @keyframes sway {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(40px);
          }
        }

        @keyframes confetti-burst {
          0% {
            transform: scale(0.45) translateY(60px);
            opacity: 0;
          }
          35% {
            opacity: 1;
          }
          100% {
            transform: scale(1.5) translateY(-100px);
            opacity: 0;
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
      `}</style>
    </div>
  );
};

export default BreakDayContent;