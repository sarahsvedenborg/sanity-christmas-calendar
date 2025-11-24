import Link from "next/link";
import { Snowflakes } from "@/components/Snowflakes";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="mb-4 text-8xl font-bold text-white drop-shadow-lg md:text-9xl">
              404
            </h1>
            <div className="mb-6 text-6xl">🎄</div>
          </div>
          
          <div className="mx-auto max-w-md rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90">
            <h2 className="mb-4 text-2xl font-bold text-green-950 dark:text-white">
              Oops! Denne siden finnes ikke
            </h2>
            <p className="mb-6 text-base text-green-900/80 dark:text-white/70">
              Siden du leter etter har blitt flyttet, slettet eller eksisterer ikke lenger.
            </p>
            
            <Link
              href="/"
              className="inline-block rounded-lg bg-amber-500 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:bg-amber-600 dark:hover:bg-amber-700"
            >
              Tilbake til forsiden
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-white/70">
            Eller gå til{" "}
            <Link
              href="/progresjon"
              className="underline transition-colors hover:text-white"
            >
              progresjon
            </Link>
            {" "}eller{" "}
            <Link
              href="/scoreboard"
              className="underline transition-colors hover:text-white"
            >
              scoreboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
