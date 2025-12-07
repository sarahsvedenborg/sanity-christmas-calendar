import { Snowflakes } from "@/components/elements/snowflakes";
import { WinnerAnimationWrapper } from "@/components/winner-animation-wrapper";
import { LogoBronzeNew } from "@/logos/LogoBronzeNew";
import { LogoSilverNew } from "@/logos/LogoSilverNew";
import { LogoGoldNew } from "@/logos/LogoGoldNew";
import { sanityFetch } from "@/lib/sanity/live";
import { queryWinnerAnimationData, queryDayCategoriesWithWinners } from "@/lib/sanity/query";

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

type CategoryData = {
  _id: string;
  title: string;
  identifier: string;
  winners?: string[];
};

// Category background colors matching the homepage
const categoryBgColors = {
  1: "#E5B18E", // Bronze
  2: "#D9D9D9", // Silver
  3: "#E5C68D", // Gold
};

// Get logo for each week
const getWeekLogo = (week: number) => {
  switch (week) {
    case 1:
      return <LogoBronzeNew width={80} height={80} />;
    case 2:
      return <LogoSilverNew width={80} height={80} />;
    case 3:
      return <LogoGoldNew width={80} height={80} />;
    default:
      return null;
  }
};

export default async function WinnersPage() {
  // Fetch winner animation data from Sanity
  const { data: winnerAnimationData } = await sanityFetch({
    query: queryWinnerAnimationData,
    stega: true,
  });

  // Fetch day categories with winners
  const { data: categoriesData } = await sanityFetch({
    query: queryDayCategoriesWithWinners,
    stega: true,
  });

  const winnerName = winnerAnimationData?.winnerName;
  const scheduledTime = winnerAnimationData?.time;
  const animationTitle = winnerAnimationData?.title;
  const animationId = winnerAnimationData?._id;
  const participantName = "SVEDENBORG Sarah";

  // Map categories to weeks based on identifier
  // Assuming identifiers are: "bronze", "silver", "gold" (case-insensitive)
  const categoryMap: Record<string, number> = {
    bronze: 1,
    silver: 2,
    gold: 3,
  };

  // Build week winners from categories
  const weekWinners: WeekWinners[] = [
    {
      week: 1,
      title: "Uke 1",
      winners: [],
    },
    {
      week: 2,
      title: "Uke 2",
      winners: [],
    },
    {
      week: 3,
      title: "Uke 3",
      winners: [],
    },
  ];

  // Populate winners from categories
  if (categoriesData && Array.isArray(categoriesData)) {
    categoriesData.forEach((category: CategoryData) => {
      const identifier = category.identifier?.toLowerCase();
      const weekNumber = identifier ? categoryMap[identifier] : null;

   
      if (identifier && category.winners && Array.isArray(category.winners)) {
        const winners = category.winners
          .filter((name): name is string => typeof name === 'string' && name.trim() !== '')
          .map((name) => ({
            name: name.trim(),
          }));

        
        const weekIndex = parseInt(identifier) - 1;
        if (weekWinners[weekIndex]) {
          weekWinners[weekIndex].winners.push(...winners);
        }
      }
    });
  }
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
        <section className="mt-50 mb-16">
          <div className="flex min-h-[300px] items-center justify-center">
            <WinnerAnimationWrapper 
              participantName={participantName}
              winnerName={winnerName}
              scheduledTime={scheduledTime}
              animationTitle={animationTitle}
              animationId={animationId}
            />
          </div>
        </section>

        {/* Winners by Week Section */}
        <section>
          <h2 className="mb-10 text-center text-3xl font-bold text-white">
            🏆 Vinnere per uke
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {weekWinners.map((week) => (
              <div
                key={week.week}
                className="rounded-2xl border border-amber-300/60 p-6 shadow-sm backdrop-blur dark:border-amber-700/50"
                style={{ backgroundColor: categoryBgColors[week.week as keyof typeof categoryBgColors] || "#E5B18E" }}
              >
                <div className="mt-[-50px] mb-4 flex justify-center">
                  {getWeekLogo(week.week)}
                </div>
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

