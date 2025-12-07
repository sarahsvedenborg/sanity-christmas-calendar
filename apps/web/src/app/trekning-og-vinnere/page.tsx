import { Snowflakes } from "@/components/elements/snowflakes";
import { WinnerAnimationWrapper } from "@/components/winner-animation-wrapper";
import { WeekWinnersSection } from "@/components/week-winners-section";
import { sanityFetch } from "@/lib/sanity/live";
import { queryWinnerAnimationData, queryDayCategoriesWithWinners } from "@/lib/sanity/query";
import { auth } from "@/auth";

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

  // Get logged-in user's name
  const session = await auth();
  const participantName = session?.user?.name || undefined;

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
        <WeekWinnersSection weekWinners={weekWinners} animationId={animationId} />
      </div>
    </div>
  );
}

