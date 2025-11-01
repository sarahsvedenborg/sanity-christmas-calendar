"use client";

import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { Code2, Palette, BookOpen, Link as LinkIcon, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { QueryCalendarDayDataResult } from "@/lib/sanity/sanity.types";
import { urlFor } from "@/lib/sanity/client";

import { RichText } from "./elements/rich-text";
import { SanityImage } from "./elements/sanity-image";

type CalendarDayData = NonNullable<QueryCalendarDayDataResult>;

type CalendarDayProps = {
  data: CalendarDayData;
  calendarSlug: string;
};

export function CalendarDay({ data, calendarSlug }: CalendarDayProps) {
  const [showSolution, setShowSolution] = useState(false);

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
    intermediate: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
    advanced: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4 py-16">
        {/* Back button */}
        <Link
          className="mb-8 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          href={`/${calendarSlug}`}
        >
          <span className="text-2xl">←</span>
          <span>Back to Calendar</span>
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 px-6 py-2 text-white shadow-lg">
            <span className="text-2xl">🎄</span>
            <span className="font-bold">Day {data.dayNumber}</span>
          </div>

          <h1 className="mb-4 text-balance bg-gradient-to-r from-red-600 via-green-600 to-blue-600 bg-clip-text font-bold text-4xl tracking-tight text-transparent md:text-6xl">
            {data.title}
          </h1>

          {data.description && (
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {data.description}
            </p>
          )}

          {data.reward && (
            <div className="mt-6 inline-block rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-3 shadow-lg">
              <p className="flex items-center gap-2 font-bold text-white">
                <span className="text-2xl">🎁</span>
                <span>Reward: {data.reward}</span>
              </p>
            </div>
          )}

          {data.icon && (
            <div className="mt-8 flex justify-center">
              <SanityImage
                className="size-32 rounded-full shadow-2xl"
                height={128}
                image={data.icon}
                width={128}
              />
            </div>
          )}
        </div>

        {/* Introduction */}
        {data.intro && data.intro.length > 0 && (
          <div className="mb-16 rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:bg-slate-900/80">
            <RichText className="text-left" richText={data.intro} />
          </div>
        )}

        {/* Shared Notes */}
        {data.sharedNotes && data.sharedNotes.length > 0 && (
          <div className="mb-16 rounded-2xl border-4 border-blue-200 bg-blue-50/80 p-8 shadow-xl backdrop-blur-sm dark:border-blue-800 dark:bg-blue-950/30">
            <h2 className="mb-4 flex items-center gap-2 font-bold text-2xl text-blue-900 dark:text-blue-100">
              📝 Shared Notes
            </h2>
            <RichText richText={data.sharedNotes} />
          </div>
        )}

        {/* Two Column Layout for Tech and Design */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Tech Activity */}
          {data.techActivity && (
            <div className="rounded-2xl border-2 border-green-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:border-green-800 dark:bg-slate-900/80">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
                  <Code2 className="size-6" />
                </div>
                <h2 className="font-bold text-2xl text-green-900 dark:text-green-100">
                  💻 Tech Activity
                </h2>
              </div>

              <h3 className="mb-4 font-bold text-xl">{data.techActivity.title}</h3>

              <div className="mb-6 flex flex-wrap gap-3">
                {data.techActivity.duration && (
                  <Badge variant="outline">⏱️ {data.techActivity.duration}</Badge>
                )}
                {data.techActivity.difficulty && (
                  <Badge
                    className={cn(
                      difficultyColors[data.techActivity.difficulty],
                      "border"
                    )}
                  >
                    {data.techActivity.difficulty.toUpperCase()}
                  </Badge>
                )}
              </div>

              {data.techActivity.objectives && data.techActivity.objectives.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold">
                    <BookOpen className="size-5" />
                    Learning Objectives
                  </h4>
                  <ul className="space-y-2">
                    {data.techActivity.objectives.map((objective, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1">✨</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.techActivity.content && data.techActivity.content.length > 0 && (
                <div className="mb-6">
                  <RichText richText={data.techActivity.content} />
                </div>
              )}

              {data.techActivity.codeExamples &&
                data.techActivity.codeExamples.length > 0 && (
                  <div className="mb-6 space-y-4">
                    {data.techActivity.codeExamples.map((example, idx) => (
                      <div key={example._key || idx}>
                        <div className="mb-2 flex items-center justify-between rounded-t-lg bg-slate-800 px-4 py-2">
                          <div className="flex items-center gap-2 text-white">
                            <Code2 className="size-4" />
                            <span className="font-mono text-sm">
                              {example.filename || `${example.language || "code"}.${example.language || "txt"}`}
                            </span>
                          </div>
                          {example.language && (
                            <Badge className="bg-slate-700 text-white" variant="outline">
                              {example.language}
                            </Badge>
                          )}
                        </div>
                        <pre className="overflow-x-auto rounded-b-lg bg-slate-950 p-4">
                          <code className="font-mono text-xs text-green-400 lg:text-sm">
                            {example.code || ""}
                          </code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

              {data.techActivity.resources &&
                data.techActivity.resources.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold">
                      <LinkIcon className="size-5" />
                      Resources
                    </h4>
                    <ul className="space-y-2">
                      {data.techActivity.resources.map((resource) => (
                        <li key={resource._key}>
                          <a
                            className="flex items-center gap-2 text-blue-600 underline transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                            href={resource.url}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <LinkIcon className="size-4" />
                            <span>{resource.title || resource.url}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {data.techActivity.hint && (
                <div className="mb-6 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950/30">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="mt-1 size-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <h4 className="mb-1 font-semibold text-yellow-900 dark:text-yellow-100">
                        Hint
                      </h4>
                      <p className="text-yellow-800 dark:text-yellow-200">
                        {data.techActivity.hint}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {data.techActivity.solution &&
                data.techActivity.solution.length > 0 && (
                  <div>
                    <button
                      className="mb-4 w-full rounded-lg bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg"
                      onClick={() => setShowSolution(!showSolution)}
                      type="button"
                    >
                      {showSolution ? "🙈 Hide Solution" : "👁️ Show Solution"}
                    </button>
                    {showSolution && (
                      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950/30">
                        <h4 className="mb-3 font-semibold text-green-900 dark:text-green-100">
                          ✅ Solution
                        </h4>
                        <RichText richText={data.techActivity.solution} />
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}

          {/* Design Activity */}
          {data.designActivity && (
            <div className="rounded-2xl border-2 border-purple-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:border-purple-800 dark:bg-slate-900/80">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-purple-500 text-white shadow-md">
                  <Palette className="size-6" />
                </div>
                <h2 className="font-bold text-2xl text-purple-900 dark:text-purple-100">
                  🎨 Design Activity
                </h2>
              </div>

              <h3 className="mb-4 font-bold text-xl">{data.designActivity.title}</h3>

              <div className="mb-6 flex flex-wrap gap-3">
                {data.designActivity.duration && (
                  <Badge variant="outline">⏱️ {data.designActivity.duration}</Badge>
                )}
                {data.designActivity.difficulty && (
                  <Badge
                    className={cn(
                      difficultyColors[data.designActivity.difficulty],
                      "border"
                    )}
                  >
                    {data.designActivity.difficulty.toUpperCase()}
                  </Badge>
                )}
              </div>

              {data.designActivity.objectives &&
                data.designActivity.objectives.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold">
                      <BookOpen className="size-5" />
                      Learning Objectives
                    </h4>
                    <ul className="space-y-2">
                      {data.designActivity.objectives.map((objective, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1">✨</span>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {data.designActivity.content &&
                data.designActivity.content.length > 0 && (
                  <div className="mb-6">
                    <RichText richText={data.designActivity.content} />
                  </div>
                )}

              {data.designActivity.designExamples &&
                data.designActivity.designExamples.length > 0 && (
                  <div className="mb-6 space-y-4">
                    {data.designActivity.designExamples.map((example) => (
                      <div key={example._key}>
                        {example.preview && (
                          <>
                            <SanityImage
                              className="rounded-lg"
                              height={400}
                              image={example}
                              width={800}
                            />
                            {example.caption && (
                              <p className="mt-2 text-center text-sm text-muted-foreground">
                                {example.caption}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              {data.designActivity.resources &&
                data.designActivity.resources.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold">
                      <LinkIcon className="size-5" />
                      Resources
                    </h4>
                    <ul className="space-y-2">
                      {data.designActivity.resources.map((resource) => (
                        <li key={resource._key}>
                          <a
                            className="flex items-center gap-2 text-blue-600 underline transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                            href={resource.url}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <LinkIcon className="size-4" />
                            <span>{resource.title || resource.url}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {data.designActivity.hint && (
                <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950/30">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="mt-1 size-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <h4 className="mb-1 font-semibold text-yellow-900 dark:text-yellow-100">
                        Hint
                      </h4>
                      <p className="text-yellow-800 dark:text-yellow-200">
                        {data.designActivity.hint}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Conclusion */}
        {data.conclusion && data.conclusion.length > 0 && (
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-green-100 to-blue-100 p-8 shadow-xl dark:from-green-950/30 dark:to-blue-950/30">
            <h2 className="mb-4 flex items-center gap-2 font-bold text-2xl">
              🎯 Conclusion
            </h2>
            <RichText richText={data.conclusion} />
          </div>
        )}
      </div>
    </div>
  );
}

// Snowflake animation component (reused from calendar)
function Snowflakes() {
  useEffect(() => {
    // Ensure animation is available
  }, []);

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

