'use client';

import { motion } from 'motion/react';
import { useState } from 'react';

type WinnerAnimationProps = {
  participantName?: string;
  winnerName?: string;
};

export function WinnerAnimation({ participantName, winnerName}: WinnerAnimationProps) {
  const [animationState, setAnimationState] = useState<'idle' | 'showingCard' | 'filling' | 'shaking' | 'revealing'>('idle');
  const [revealedNumber, setRevealedNumber] = useState<number>(0);

  const startAnimation = () => {
    if (participantName) {
      // If name is provided, show large card first
      setAnimationState('showingCard');
      // Pick a random number for the reveal
      setRevealedNumber(Math.floor(Math.random() * 24) + 1);
      
      // Sequence: show card -> enter hat -> other papers -> shake -> reveal
      setTimeout(() => setAnimationState('filling'), 1500);
      setTimeout(() => setAnimationState('shaking'), 4000);
      setTimeout(() => setAnimationState('revealing'), 5500);
      setTimeout(() => setAnimationState('idle'), 8000);
    } else {
      // Original flow if no name
      setAnimationState('filling');
      setRevealedNumber(Math.floor(Math.random() * 24) + 1);
      setTimeout(() => setAnimationState('shaking'), 3000);
      setTimeout(() => setAnimationState('revealing'), 4500);
      setTimeout(() => setAnimationState('idle'), 7000);
    }
  };

  const papers = [
    { delay: 0, x: -300, y: -200, rotate: -45 },
    { delay: 0.3, x: 300, y: -150, rotate: 45 },
    { delay: 0.6, x: -250, y: 200, rotate: 30 },
    { delay: 0.9, x: 350, y: 150, rotate: -60 },
    { delay: 1.2, x: 0, y: -300, rotate: 0 },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <div className="relative w-[400px] h-[400px] flex items-center justify-center">
        {/* Large card with name appearing first */}
        {participantName && animationState === 'showingCard' && (
          <motion.div
            className="absolute w-48 h-32 bg-white border-4 border-gray-800 rounded-lg shadow-2xl flex flex-col items-center justify-center z-20 p-4"
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              rotate: 0,
              y: -150
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            <span className="text-xl font-bold text-gray-800 text-center leading-tight">{participantName}</span>
          </motion.div>
        )}

        {/* Large card entering the hat */}
        {participantName && animationState === 'filling' && (
          <motion.div
            className="absolute w-48 h-32 bg-white border-4 border-gray-800 rounded-lg shadow-2xl flex flex-col items-center justify-center z-20 p-4"
            initial={{ scale: 1, opacity: 1, y: -150, rotate: 0 }}
            animate={{ 
              scale: 0.3, 
              opacity: 0, 
              y: 20,
              rotate: 360,
              x: 0
            }}
            transition={{ 
              duration: 0.8,
              delay: 0,
              ease: "easeInOut"
            }}
          >
            <span className="text-xl font-bold text-gray-800 text-center leading-tight">{participantName}</span>
          </motion.div>
        )}

        {/* Papers flying in */}
        {animationState === 'filling' && papers.map((paper, index) => (
          <motion.div
            key={index}
            className="absolute w-12 h-16 bg-white border-2 border-gray-300 rounded shadow-lg"
            initial={{ x: paper.x, y: paper.y, rotate: paper.rotate, opacity: 1 }}
            animate={{ 
              x: 0, 
              y: 20, 
              rotate: Math.random() * 360,
              opacity: 0,
              scale: 0.3
            }}
            transition={{ 
              delay: paper.delay,
              duration: 0.8,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              {Math.floor(Math.random() * 24) + 1}
            </div>
          </motion.div>
        ))}

        {/* Revealed paper */}
        {animationState === 'revealing' && (
          <motion.div
            className="absolute w-32 h-24 bg-white border-2 border-gray-800 rounded shadow-2xl flex flex-col items-center justify-center z-10 p-2"
            initial={{ y: -40, opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ 
              y: -120, 
              opacity: 1, 
              scale: 1.2,
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 1,
              ease: "easeOut"
            }}
          >
            {winnerName ? (
              <span className="text-sm font-bold text-gray-800 text-center leading-tight">{winnerName}</span>
            ) : (
              <span className="text-2xl">{revealedNumber}</span>
            )}
          </motion.div>
        )}

        {/* Top Hat */}
        <motion.svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={
            animationState === 'shaking'
              ? { 
                  rotate: [0, -8, 8, -8, 8, -5, 5, 0],
                  x: [0, -3, 3, -3, 3, -2, 2, 0]
                }
              : {}
          }
          transition={
            animationState === 'shaking'
              ? {
                  duration: 0.6,
                  ease: "easeInOut"
                }
              : {}
          }
        >
          {/* Top of cylinder (now at bottom) - drawn first */}
          <ellipse
            cx="100"
            cy="140"
            rx="50"
            ry="12"
            fill="#3a3a3a"
            stroke="#000"
            strokeWidth="2"
          />
          
          {/* Main cylinder */}
          <rect
            x="50"
            y="50"
            width="100"
            height="90"
            fill="#2a2a2a"
            stroke="#000"
            strokeWidth="2"
          />
          
          {/* Brim (now at top since upside down) */}
          <ellipse
            cx="100"
            cy="50"
            rx="80"
            ry="15"
            fill="#1a1a1a"
            stroke="#000"
            strokeWidth="2"
          />
          
          {/* Shine effect */}
          <ellipse
            cx="80"
            cy="90"
            rx="8"
            ry="15"
            fill="rgba(255, 255, 255, 0.2)"
          />
        </motion.svg>
      </div>

      <button
        onClick={startAnimation}
        disabled={animationState !== 'idle'}
        className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {animationState === 'idle' ? 'Draw a Number' : 'Drawing...'}
      </button>
    </div>
  );
}

