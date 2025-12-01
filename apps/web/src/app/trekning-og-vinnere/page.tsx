import { Snowflakes } from "@/components/elements/snowflakes";
import { WinnerAnimation } from "@/components/winner-animation";

export const revalidate = 10;

type WeekWinner = {
  name: string;
  email?: string;
  prize?: string;
};

type WeekWinners = {
  week: number;
  title: string;
  winners: WeekWinner[];
};

// Placeholder data - to be replaced with actual data from Sanity
const weekWinners: WeekWinners[] = [
  {
    week: 1,
    title: "Uke 1",
    winners: [
      // Placeholder - will be populated from Sanity
    ],
  },
  {
    week: 2,
    title: "Uke 2",
    winners: [
      // Placeholder - will be populated from Sanity
    ],
  },
  {
    week: 3,
    title: "Uke 3",
    winners: [
      // Placeholder - will be populated from Sanity
    ],
  },
];

// Category background colors matching the homepage
const categoryBgColors = {
  1: "#E5B18E", // Bronze
  2: "#D9D9D9", // Silver
  3: "#E5C68D", // Gold
};

export default async function WinnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">
            Trekning og vinnere
          </h1>
        </header>

        {/* Animation Section */}
        <section className="mb-16">
          <div className="rounded-2xl border border-amber-300/60 bg-white/90 p-12 text-center shadow-sm backdrop-blur dark:border-amber-700/50 dark:bg-green-950/80">
            <div className="flex min-h-[300px] items-center justify-center">
              <WinnerAnimation />
            </div>
          </div>
        </section>

        {/* Winners by Week Section */}
        <section>
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            🏆 Vinnere per uke
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {weekWinners.map((week) => (
              <div
                key={week.week}
                className="rounded-2xl border border-amber-300/60 p-6 shadow-sm backdrop-blur dark:border-amber-700/50"
                style={{ backgroundColor: categoryBgColors[week.week as keyof typeof categoryBgColors] || "#E5B18E" }}
              >
                <h3 className="mb-6 text-center text-2xl font-semibold text-green-950 dark:text-white">
                  {week.title}
                </h3>
                {week.winners.length === 0 ? (
                  <p className="text-center text-green-900/70 dark:text-white/60">
                    Ingen vinnere enda
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {week.winners.map((winner, index) => (
                      <li
                        key={index}
                        className="rounded-lg border border-amber-200/50 bg-amber-50/50 p-4 dark:border-amber-700/30 dark:bg-green-900/30"
                      >
                        <p className="font-semibold text-green-950 dark:text-white">
                          {winner.name}
                        </p>
                        {winner.prize && (
                          <p className="mt-1 text-sm text-green-900/70 dark:text-white/60">
                            {winner.prize}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

