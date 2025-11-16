export const Snowflakes = () => {
  return (
    <>
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-snowfall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 20}s`,
          }}
        >
          <div
            className="text-white/50"
            style={{
              fontSize: `${10 + Math.random() * 20}px`,
            }}
          >
            ❄️
          </div>
        </div>
      ))}
    </>
  );
}