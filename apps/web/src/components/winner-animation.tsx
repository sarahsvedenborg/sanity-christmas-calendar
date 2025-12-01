export function WinnerAnimation() {
  return (
    <div className="flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full max-w-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hat brim - bottom ellipse */}
        <ellipse
          cx="100"
          cy="170"
          rx="70"
          ry="12"
          fill="#1a1a1a"
          className="drop-shadow-lg"
        />
        
        {/* Hat body - tall cylinder */}
        <rect
          x="50"
          y="50"
          width="100"
          height="120"
          fill="#2d2d2d"
          className="drop-shadow-lg"
        />
        
        {/* Hat top - flat circle */}
        <ellipse
          cx="100"
          cy="50"
          rx="50"
          ry="5"
          fill="#1a1a1a"
        />
        
        {/* Decorative band around the middle */}
        <rect
          x="50"
          y="100"
          width="100"
          height="12"
          fill="#4a4a4a"
        />
        
        {/* Stars/magic sparkles coming out */}
        <g className="animate-pulse">
          <circle cx="30" cy="80" r="3" fill="#ffd700" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="170" cy="90" r="2.5" fill="#ffd700" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="40" cy="30" r="2" fill="#ffd700" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="160" cy="35" r="2.5" fill="#ffd700" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        
        {/* Additional sparkles */}
        <g className="animate-pulse">
          <path
            d="M 25 100 L 27 95 L 30 100 L 27 98 Z"
            fill="#ffd700"
            opacity="0.7"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.9;0.2"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M 175 105 L 177 100 L 180 105 L 177 103 Z"
            fill="#ffd700"
            opacity="0.7"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.9;0.2"
              dur="1.7s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
    </div>
  );
}

