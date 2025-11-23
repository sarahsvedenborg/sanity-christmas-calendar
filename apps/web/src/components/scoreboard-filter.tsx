"use client";

type FilterType = "all" | "tech" | "design";

type ScoreboardFilterProps = {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

export function ScoreboardFilter({
  activeFilter,
  onFilterChange,
}: ScoreboardFilterProps) {
  const filterButtons: Array<{ value: FilterType; label: string }> = [
    { value: "all", label: "Alle" },
    { value: "tech", label: "Tech" },
    { value: "design", label: "Design" },
  ];

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-3">
      {filterButtons.map((button) => (
        <button
          key={button.value}
          onClick={() => onFilterChange(button.value)}
          className={`rounded-lg px-6 py-2 font-semibold transition-all ${
            activeFilter === button.value
              ? "bg-amber-500 text-white shadow-lg shadow-amber-500/50"
              : "bg-white/90 text-green-950 hover:bg-white dark:bg-green-950/80 dark:text-white dark:hover:bg-green-950/90"
          }`}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}

