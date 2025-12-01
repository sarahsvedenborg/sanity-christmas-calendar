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

  // Spark colors - amber, yellow, orange, red
  const sparkColors = ['#fbbf24', '#f59e0b', '#eab308', '#f97316', '#ef4444', '#dc2626'];
  
  // Generate spark particles shooting out from the hat
  const sparkParticles = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * 360 + (Math.random() - 0.5) * 20; // Distribute around 360 degrees with wider variation
    const distance = 250 + Math.random() * 200; // How far they travel - increased for longer sparks
    const radians = (angle * Math.PI) / 180;
    return {
      id: i,
      angle,
      distance,
      startX: 0, // Hat center
      startY: -80, // Top of hat
      endX: Math.cos(radians) * distance,
      endY: -80 + Math.sin(radians) * distance,
      color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
      delay: Math.random() * 0.2,
      duration: 1.2 + Math.random() * 0.6, // Longer duration for longer travel
      size: 2 + Math.random() * 3,
    };
  });

  const startAnimation = () => {
    if (participantName) {
      // If name is provided, show large card first
      setAnimationState('showingCard');
      // Pick a random number for the reveal
      setRevealedNumber(Math.floor(Math.random() * 24) + 1);
      
      // Sequence: show card -> enter hat -> other papers -> shake -> pause -> reveal
      setTimeout(() => setAnimationState('filling'), 2500);
      setTimeout(() => setAnimationState('shaking'), 5000);
      setTimeout(() => setAnimationState('revealing'), 8000); // Delayed to allow shake to complete and return to center
      setTimeout(() => setAnimationState('idle'), 10000); // Extended to show winner card longer (5.5 seconds)
    } else {
      // Original flow if no name
      setAnimationState('filling');
      setRevealedNumber(Math.floor(Math.random() * 24) + 1);
      setTimeout(() => setAnimationState('shaking'), 3000);
      setTimeout(() => setAnimationState('revealing'), 4500);
      setTimeout(() => setAnimationState('idle'), 7000);
    }
  };

  const anonymousNames = [
    'Deltaker 1',
    'Deltaker 2',
    'Deltaker 3',
    'Deltaker 4',
    'Deltaker 5',
    'Deltaker 6',
    'Deltaker 7',
    'Deltaker 8',
    'Deltaker 9',
    'Deltaker 10',
  ];

  const papers = [
    { delay: 0, x: -300, y: -200, rotate: -45, name: anonymousNames[0] },
    { delay: 0.3, x: 300, y: -150, rotate: 45, name: anonymousNames[1] },
    { delay: 0.6, x: -250, y: 50, rotate: 30, name: anonymousNames[2] },
    { delay: 0.9, x: 150, y: 100, rotate: -60, name: anonymousNames[3] },
    { delay: 1.2, x: 0, y: -300, rotate: 0, name: anonymousNames[4] },
    { delay: 1.5, x: -100, y: -200, rotate: -45, name: anonymousNames[5] },
    { delay: 1.8, x: 150, y: -150, rotate: 45, name: anonymousNames[6] },
    { delay: 2.1, x: 250, y: -100, rotate: 30, name: anonymousNames[7] },
  /*   { delay: 2.4, x: -150, y: 100, rotate: -60, name: anonymousNames[8] },
    { delay: 2.7, x: 100, y: -200, rotate: -30, name: anonymousNames[9] }, */
 
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-[500px] h-[300px] flex items-center justify-center">
        {/* Large card with name appearing first */}
        {participantName && animationState === 'showingCard' && (
          <motion.div
            className="absolute w-72 h-44 bg-white border-4 border-gray-800 rounded-lg shadow-2xl flex flex-col items-center justify-center z-20 p-6"
            initial={{ scale: 0, opacity: 0, rotate: -180, x: 400, y: 200 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              rotate: 0,
              x: 0,
              y: -150
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeOut"
            }}
          >
            <span className="text-3xl font-bold text-gray-800 text-center leading-tight">{participantName}</span>
          </motion.div>
        )}

        {/* Large card entering the hat */}
        {participantName && animationState === 'filling' && (
          <motion.div
            className="absolute w-72 h-44 bg-white border-4 border-gray-800 rounded-lg shadow-2xl flex flex-col items-center justify-center z-20 p-6"
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
            <span className="text-3xl font-bold text-gray-800 text-center leading-tight">{participantName}</span>
          </motion.div>
        )}

        {/* Papers flying in */}
        {animationState === 'filling' && papers.map((paper, index) => (
          <motion.div
            key={index}
            className="absolute w-16 h-20 bg-white border-2 border-gray-300 rounded shadow-lg flex items-center justify-center p-1"
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
            <span className="text-[8px] font-semibold text-gray-800 text-center leading-tight">{paper.name}</span>
          </motion.div>
        ))}

        {/* Sparks shooting out of hat */}
        {animationState === 'revealing' && sparkParticles.map((spark) => (
          <motion.div
            key={spark.id}
            className="absolute rounded-full"
            style={{ 
              backgroundColor: spark.color,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              boxShadow: `0 0 ${spark.size * 2}px ${spark.color}`,
            }}
            initial={{ 
              x: spark.startX, 
              y: spark.startY, 
              opacity: 1, 
              scale: 1
            }}
            animate={{ 
              x: spark.endX,
              y: spark.endY,
              opacity: [1, 1, 0.5, 0],
              scale: [1, 1.5, 0.5, 0]
            }}
            transition={{ 
              delay: spark.delay,
              duration: spark.duration,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Revealed paper */}
        {animationState === 'revealing' && (
          <motion.div
            className="absolute w-64 h-40 bg-white border-4 border-gray-800 rounded-lg shadow-2xl flex flex-col items-center justify-center z-10 p-4"
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
              <span className="text-3xl font-bold text-gray-800 text-center leading-tight">{winnerName}</span>
            ) : (
              <span className="text-3xl">{revealedNumber}</span>
            )}
          </motion.div>
        )}

        {/* Top Hat */}
        <motion.svg
          width="350"
          height="350"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={
            animationState === 'shaking'
              ? { 
                  rotate: [0, -8, 8, -8, 8, -6, 6, -5, 5, -4, 4, -3, 3, -2, 2, 0],
                  x: [0, -3, 3, -3, 3, -2, 2, -2, 2, -1, 1, -1, 1, 0]
                }
              : { rotate: 0, x: 0 } // Return to center when not shaking
          }
          transition={
            animationState === 'shaking'
              ? {
                  duration: 2.5,
                  ease: "easeInOut"
                }
              : {
                  duration: 0.3,
                  ease: "easeOut"
                }
          }
        >
          {/* Top of cylinder (now at bottom) - drawn first */}
          <ellipse
            cx="100"
            cy="140"
            rx="50"
            ry="12"
            fill="#1a1a1a"
            stroke="#000"
            strokeWidth="2"
          />
          
          {/* Main cylinder */}
          <rect
            x="50"
            y="50"
            width="100"
            height="90"
            fill="#1a1a1a"
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
            fill="rgba(255, 255, 255, 0.05)"
          />
        </motion.svg>
      </div>

      <button
        onClick={startAnimation}
        disabled={animationState !== 'idle'}
        className="mt-2 flex items-center justify-center rounded-lg bg-amber-500 px-6 py-3 text-base font-semibold text-green-950 transition-colors hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {animationState === 'idle' ? 'Spill av trekningen på nytt' : 'Trekker...'}
      </button>
    </div>
  );
}

