import { Snowflakes } from "@/components/elements/snowflakes";
import { WinnerAnimationWrapper } from "@/components/winner-animation-wrapper";
import { WeekWinnersSection } from "@/components/week-winners-section";
import { sanityFetch } from "@/lib/sanity/live";
import { queryWinnerAnimationData, queryDayCategoriesWithWinners, queryUserProgressByEmail, queryInactivePassedAnimations, queryAllAnimationsByWeek } from "@/lib/sanity/query";
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

type TaskStatus = {
  completed?: boolean;
  calendarDay?: {
    _id: string;
    dayNumber?: number;
    isBreak?: boolean;
  } | null;
};

type UserProgress = {
  name?: string;
  email?: string;
  taskCompletionStatus?: TaskStatus[];
} | null;

async function fetchProgress(userEmail: string | null | undefined): Promise<UserProgress> {
  if (!userEmail) {
    return null;
  }

  const response = await sanityFetch({
    query: queryUserProgressByEmail,
    params: { email: userEmail },
  });

  return response.data ?? null;
}

function hasCompletedDaysOneToFive(progress: UserProgress): boolean {
  if (!progress?.taskCompletionStatus) {
    return false;
  }

  // Get all completed tasks for days 1-5 (excluding break days)
  const days1to5 = progress.taskCompletionStatus
    .filter((status) => {
      const dayNumber = status.calendarDay?.dayNumber;
      return dayNumber !== undefined && dayNumber >= 1 && dayNumber <= 5 && !status.calendarDay?.isBreak;
    })
    .filter((status) => status.completed === true);

  // Check if we have exactly 5 completed tasks for days 1-5
  const completedDayNumbers = days1to5
    .map((status) => status.calendarDay?.dayNumber)
    .filter((num): num is number => num !== undefined)
    .sort((a, b) => a - b);

  // Check if days 1, 2, 3, 4, 5 are all completed
  const requiredDays = [1, 2, 3, 4, 5];
  const hasAllDays = requiredDays.every((day) => completedDayNumbers.includes(day));

  return hasAllDays;
}


export default async function WinnersPage() {
  // Fetch winner animation data from Sanity
  const { data: winnerAnimationData } = await sanityFetch({
    query: queryWinnerAnimationData,
    stega: true,
  });

  // Fetch inactive animations that have passed their date
  const { data: inactivePassedAnimations } = await sanityFetch({
    query: queryInactivePassedAnimations,
    stega: true,
  });

  // Fetch all animations to map them to weeks
  const { data: allAnimations } = await sanityFetch({
    query: queryAllAnimationsByWeek,
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
  const animationId = winnerAnimationData?.id;
  const isActive = winnerAnimationData?.isActive ?? false;
  const animationCategory = winnerAnimationData?.category?.identifier?.toLowerCase();

  // Check if there are inactive animations that have passed AND a new active animation exists
  // If so, we should ignore cookies from old inactive animations
  const hasInactivePassedAnimations = inactivePassedAnimations && Array.isArray(inactivePassedAnimations) && inactivePassedAnimations.length > 0;
  const hasNewActiveAnimation = !!winnerAnimationData;
  const shouldIgnoreOldCookies = hasInactivePassedAnimations && hasNewActiveAnimation;

  // Get logged-in user's name and check if they've completed days 1-5
  const session = await auth();
  const userEmail = session?.user?.email;
  const progress = await fetchProgress(userEmail);
  
  // Use real name only if user has completed days 1-5, otherwise use "Anonym deltaker"
  const hasCompletedBronzePrize = hasCompletedDaysOneToFive(progress);
  const participantName = hasCompletedBronzePrize 
    ? (session?.user?.name || "Anonym deltaker")
    : "Anonym deltaker";

  // Map categories to weeks based on identifier
  // Assuming identifiers are: "bronze", "silver", "gold" (case-insensitive)
  const categoryMap: Record<string, number> = {
    bronze: 1,
    silver: 2,
    gold: 3,
  };

  // Map animations to weeks based on their category
  const animationsByWeek: Record<number, { id?: string; isActive?: boolean; time?: string }> = {};
  if (allAnimations && Array.isArray(allAnimations)) {
    allAnimations.forEach((anim: { category?: { identifier?: string }; id?: string; isActive?: boolean; time?: string }) => {
      const identifier = anim.category?.identifier?.toLowerCase();
      const weekNumber = identifier ? categoryMap[identifier] : null;
      if (weekNumber && anim.id) {
        animationsByWeek[weekNumber] = {
          id: anim.id,
          isActive: anim.isActive,
          time: anim.time,
        };
      }
    });
  }

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
              isActive={isActive}
              animationCategory={animationCategory}
              oldInactiveAnimationIds={shouldIgnoreOldCookies ? inactivePassedAnimations?.map((anim: { _id: string }) => anim._id) || [] : []}
            />
          </div>
        </section>

        {/* Winners by Week Section */}
        <WeekWinnersSection 
          weekWinners={weekWinners} 
          animationId={animationId}
          isActive={isActive}
          scheduledTime={scheduledTime}
          oldInactiveAnimationIds={shouldIgnoreOldCookies ? inactivePassedAnimations?.map((anim: { _id: string }) => anim._id) || [] : []}
          animationsByWeek={animationsByWeek}
        />
      </div>
    </div>
  );
}

