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
  const [showConfetti, setShowConfetti] = useState(false);
  const sparkles = useMemo(() => SPARKLES, []);

  const openEnvelope = () => {
    setIsOpen(true);
  };

  const resetEnvelope = () => {
    setIsOpen(false);
    setShowConfetti(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      openEnvelope();
    }, 300);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setShowConfetti(true);
    const timer = window.setTimeout(() => setShowConfetti(false), 2400);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative mb-16 overflow-hidden rounded-3xl border-2 border-amber-300/60 bg-gradient-to-br from-white/96 via-amber-50/85 to-white/96 p-8 text-center shadow-2xl backdrop-blur-md dark:border-amber-700/60 dark:from-green-950/90 dark:via-green-900/80 dark:to-green-950/90"
      style={{ borderColor: "#D4AF37" }}
    >
  <div className="envlope-wrapper">
    <div id="envelope" className="close">
        <div className="front flap"></div>
        <div className="front pocket"></div>
        <div className="letter">
            <div className="words line1"></div>
            <div className="words line2"></div>
            <div className="words line3"></div>
            <div className="words line4"></div>
        </div>
        <div className="hearts">
            <div className="heart a1"></div>
            <div className="heart a2"></div>
            <div className="heart a3"></div>
        </div>
    </div>
</div>
<div className="reset">
    <button id="open" className="open">Open</button>
    <button id="reset" className="reset">Reset</button>
</div>

      <style jsx>{`
        .envelope-wrapper {
          --env-width: 280px;
          --env-height: 180px;
          --env-radius: 14px;
          --heart-size: 46px;
          --color-env: #0077b2;
          --color-env-2: #00669c;
          --color-flap: #00527e;
          --color-front: #0099ad;
          --color-back: #0b2447;
          --color-heart: #d00000;
          perspective: 1400px;
          padding: 36px 0 16px;
          width: var(--env-width);
          height: 220px;
          position: relative;
        }

        .envelope {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .envelope__shadow {
          position: absolute;
          bottom: 16px;
          left: 50%;
          width: 140%;
          height: 28px;
          transform: translateX(-50%);
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.22) 0%,
            rgba(0, 0, 0, 0.05) 42%,
            transparent 72%
          );
          filter: blur(2px);
          opacity: 0.75;
        }

        .envelope__back {
          position: absolute;
          bottom: 28px;
          left: 50%;
          width: calc(var(--env-width) - 30px);
          height: 160px;
          transform: translateX(-50%);
          border-radius: 16px;
          background: linear-gradient(135deg, #0f4c75 0%, var(--color-back) 100%);
          box-shadow:
            0 20px 38px rgba(11, 36, 71, 0.32),
            inset 0 0 18px rgba(255, 255, 255, 0.06);
          border: 2px solid rgba(255, 255, 255, 0.08);
        }

        .envelope__front {
          position: absolute;
          bottom: 28px;
          left: 50%;
          width: calc(var(--env-width) - 30px);
          height: 160px;
          transform: translateX(-50%);
          overflow: hidden;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--color-front) 0%, #0b7285 95%);
          clip-path: polygon(0 0, 50% 48%, 100% 0, 100% 100%, 0 100%);
          border: 2px solid rgba(255, 255, 255, 0.08);
        }

        .envelope__flap {
          position: absolute;
          bottom: 28px;
          left: 50%;
          width: calc(var(--env-width) - 30px);
          height: 160px;
          transform-origin: bottom center;
          transform: translateX(-50%) rotateX(0deg);
          transform-style: preserve-3d;
          transition: transform 1.05s cubic-bezier(0.2, 1, 0.22, 1);
          border-radius: 16px;
          clip-path: polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%);
          background: linear-gradient(135deg, var(--color-back) 0%, var(--color-flap) 90%);
          box-shadow:
            0 18px 30px rgba(11, 36, 71, 0.35),
            inset 0 0 16px rgba(255, 255, 255, 0.12);
          pointer-events: none;
        }

        .envelope__card {
          position: absolute;
          bottom: 28px;
          left: 50%;
          width: calc(var(--env-width) - 55px);
          height: 140px;
          transform: translate(-50%, 0) translateZ(1px);
          border-radius: var(--env-radius);
          background: linear-gradient(135deg, #fff7e1 0%, #ffe9c6 100%);
          box-shadow:
            0 12px 28px rgba(148, 87, 35, 0.25),
            inset 0 0 14px rgba(255, 255, 255, 0.35);
          border: 1px solid rgba(217, 119, 6, 0.22);
          transition: transform 1.15s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease, visibility 0.4s ease;
          transform-origin: bottom center;
          opacity: 0;
          visibility: hidden;
          will-change: transform, opacity;
          overflow: hidden;
        }

        .envelope__card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 22px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f4c75;
          font-weight: 600;
        }

        .envelope-wrapper.open .envelope__flap {
          transform: translateX(-50%) rotateX(-152deg);
        }

        .envelope-wrapper.open .envelope__card {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, calc(-1 * var(--env-height) / 1.4)) translateZ(22px);
        }

        .envelope-wrapper .hearts {
          position: absolute;
          top: 55%;
          left: 0;
          right: 0;
          z-index: 3;
          pointer-events: none;
        }

        .heart {
          position: absolute;
          bottom: 0;
          width: var(--heart-size);
          height: var(--heart-size);
          opacity: 0;
          transform: scale(0.6);
        }

        .heart::before,
        .heart::after {
          content: "";
          position: absolute;
          width: 50%;
          height: 80%;
          background: var(--color-heart);
          border-radius: 50%;
          transform-origin: center;
          top: 0;
        }

        .heart::before {
          left: 0;
          transform: translateX(50%) rotate(-45deg);
        }

        .heart::after {
          right: 0;
          transform: translateX(-50%) rotate(45deg);
        }

        .envelope-wrapper.open .heart {
          opacity: 1;
        }

        .envelope-wrapper.open .heart--a1 {
          left: 22%;
          animation: slideUp 4s linear forwards, sway 2s ease-in-out 4 alternate;
        }

        .envelope-wrapper.open .heart--a2 {
          left: 55%;
          transform: scale(0.9);
          animation: slideUp 5s linear forwards, sway 3.5s ease-in-out 3 alternate;
        }

        .envelope-wrapper.open .heart--a3 {
          left: 10%;
          transform: scale(0.75);
          animation: slideUp 6.5s linear forwards, sway 2.5s ease-in-out 4 alternate;
        }

        .envelope-confetti {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: visible;
          z-index: 5;
        }

        .envelope-confetti__layer {
          position: absolute;
          inset: 0;
          animation: confetti-burst 2.4s ease-out forwards;
          background-repeat: no-repeat;
        }

        .envelope-confetti__layer--primary {
          background-image:
            radial-gradient(circle at 10% 20%, rgba(255, 183, 77, 0.65) 0, transparent 42%),
            radial-gradient(circle at 80% 16%, rgba(255, 255, 255, 0.65) 0, transparent 45%),
            radial-gradient(circle at 16% 80%, rgba(217, 119, 6, 0.45) 0, transparent 36%),
            radial-gradient(circle at 90% 76%, rgba(244, 114, 182, 0.45) 0, transparent 48%);
        }

        .envelope-confetti__layer--blur {
          filter: blur(6px);
          background-image:
            radial-gradient(circle at 15% 18%, rgba(255, 213, 128, 0.55) 0, transparent 44%),
            radial-gradient(circle at 74% 12%, rgba(255, 255, 255, 0.55) 0, transparent 46%),
            radial-gradient(circle at 22% 78%, rgba(217, 70, 239, 0.35) 0, transparent 40%),
            radial-gradient(circle at 88% 82%, rgba(56, 189, 248, 0.35) 0, transparent 50%);
        }

        @keyframes slideUp {
          0% {
            top: 0;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            top: -520px;
            opacity: 0;
          }
        }

        @keyframes sway {
          0% {
            margin-left: 0;
          }
          100% {
            margin-left: 50px;
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