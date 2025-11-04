"use client";

import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { Code2, Palette, BookOpen, Link as LinkIcon, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { QueryCalendarDayDataResult } from "@/lib/sanity/sanity.types";

import { RichText } from "./elements/rich-text";
import { SanityImage } from "./elements/sanity-image";

type CalendarDayData = NonNullable<QueryCalendarDayDataResult>;

type CalendarDayProps = {
  data: CalendarDayData;
  calendarSlug: string;
};

export function CalendarDay({ data, calendarSlug }: CalendarDayProps) {
  const [showSolution, setShowSolution] = useState(false);

/*   const difficultyColors = {
    beginner: "bg-green-200/80 text-green-950 border-amber-300 dark:bg-green-900/50 dark:text-green-100 dark:border-amber-700",
    intermediate: "bg-amber-200/80 text-green-950 border-amber-300 dark:bg-amber-900/50 dark:text-amber-100 dark:border-amber-700",
    advanced: "bg-red-200/80 text-red-950 border-amber-300 dark:bg-red-900/50 dark:text-red-100 dark:border-amber-700",
  }; */

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-amber-300 bg-amber-200/20 px-6 py-2 shadow-lg backdrop-blur-sm" style={{ borderColor: '#D4AF37' }}>
            <span className="text-2xl">🎄</span>
            <span className="font-bold text-white">Day {data.dayNumber}</span>
          </div>

          <h1 className="mb-4 text-balance font-bold text-4xl tracking-tight drop-shadow-lg md:text-6xl" style={{ 
            color: '#B91C1C',
            textShadow: '2px 2px 0px rgba(212, 175, 55, 0.9), -2px -2px 0px rgba(212, 175, 55, 0.9), 2px -2px 0px rgba(212, 175, 55, 0.9), -2px 2px 0px rgba(212, 175, 55, 0.9)'
          }}>
            {data.title}
          </h1>

          {data.description && (
            <p className="mx-auto max-w-2xl text-lg text-white/90">
              {data.description}
            </p>
          )}

         {/*  {data.reward && (
            <div className="mt-6 inline-block rounded-full border-2 border-amber-300 bg-amber-200/90 px-6 py-3 shadow-lg" style={{ borderColor: '#D4AF37', backgroundColor: '#F5DEB3' }}>
              <p className="flex items-center gap-2 font-bold text-green-950">
                <span className="text-2xl">🎁</span>
                <span>Reward: {data.reward}</span>
              </p>
            </div>
          )} */}

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
       {/*   {data.intro && data.intro.length > 0 && (
          <div className="mb-16 rounded-2xl border-2 border-amber-200/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
           
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
                    <BookOpen className="size-5" />
                    Learning Objectives:   <span className="prose">{data.description}</span>
                  </h4>
          </div>
        )}  */}

          {data.intro && data.intro.length > 0 && (
          <div className="mb-16 rounded-2xl border-2 border-amber-200/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
           <h2 className="font-bold text-3xl text-green-950 dark:text-white">Felles intro</h2>
           <RichText className="text-left" richText={data.intro} />
          </div>
        )} 

        {/* Shared Notes */}
        {data.sharedNotes && data.sharedNotes.length > 0 && (
          <div className="mb-16 rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
            <h2 className="mb-4 flex items-center gap-2 font-bold text-2xl text-green-950 dark:text-white">
              📝 Shared Notes
            </h2>
            <RichText richText={data.sharedNotes} />
          </div>
        )}

        {/* Two Column Layout for Tech and Design */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Tech Activity */}
          {data.techActivity && (
            <div className="rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full text-white shadow-md" style={{ backgroundColor: '#B91C1C' }}>
                  <Code2 className="size-6" />
                </div>
                <h2 className="font-bold text-3xl text-green-950 dark:text-white">
                  Tech-oppgave <br/> {/* {data.techActivity.title} */}
                </h2>
              </div>

             {/*  <h3 className="mb-4 font-bold text-xl">{data.techActivity.title}</h3> */}

             {/*  <div className="mb-6 flex flex-wrap gap-3">
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
              </div> */}

              {data.techActivity.objectives && data.techActivity.objectives.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
                    <BookOpen className="size-5" />
                    Læringsmål
                  </h3>
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


                        {data.techActivity.handIn && data.techActivity.handIn?.length > 0 && (
          <div className="mb-16 rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
            <h3 className="mb-4 flex items-center gap-2 font-bold text-2xl text-green-950 dark:text-white">
              Innlevering
            </h3>
            <RichText richText={data.techActivity.handIn} />
          </div>
        )}

              {data.techActivity.content && data.techActivity.content.length > 0 && (
                <div className="mb-6">
                   <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
                      Oppgave
                    </h3>
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
                        {/*   {example.language && (
                            <Badge className="bg-slate-700 text-white" variant="outline">
                              {example.language}
                            </Badge>
                          )} */}
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
                    <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
                      <LinkIcon className="size-5" />
                      Ressurser
                    </h3>
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
{/* 
              {data.techActivity.hint && (
                <div className="mb-6 rounded-lg border-2 border-amber-300 bg-amber-200/80 p-4 dark:border-amber-700 dark:bg-amber-950/50" style={{ borderColor: '#D4AF37', backgroundColor: '#F5DEB3' }}>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="mt-1 size-5 text-green-950 dark:text-amber-200" />
                    <div>
                      <h4 className="mb-1 font-semibold text-green-950 dark:text-amber-100">
                        Hint
                      </h4>
                      <p className="text-green-900 dark:text-amber-200">
                        {data.techActivity.hint}
                      </p>
                    </div>
                  </div>
                </div>
              )} */}

            {/*   {data.techActivity.solution &&
                data.techActivity.solution.length > 0 && (
                  <div>
                    <button
                      className="mb-4 w-full rounded-lg border-2 border-amber-300 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg"
                      onClick={() => setShowSolution(!showSolution)}
                      style={{ backgroundColor: '#B91C1C', borderColor: '#D4AF37' }}
                      type="button"
                    >
                      {showSolution ? "🙈 Hide Solution" : "👁️ Show Solution"}
                    </button>
                    {showSolution && (
                      <div className="rounded-lg border-2 border-amber-300 bg-white/95 p-6 dark:border-amber-700 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
                        <h4 className="mb-3 font-semibold text-green-950 dark:text-white">
                          ✅ Solution
                        </h4>
                        <RichText richText={data.techActivity.solution} />
                      </div>
                    )}
                  </div>
                )} */}
            </div>
          )}

          {/* Design Activity */}
          {data.designActivity && (
            <div className="rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full text-white shadow-md" style={{ backgroundColor: '#B91C1C' }}>
                  <Palette className="size-6" />
                </div>
                <h2 className="font-bold text-3xl text-green-950 dark:text-white">
                  Designoppgave <br/> {/* {data.designActivity.title} */}
                </h2>
              </div>

{/*               <h3 className="mb-4 font-bold text-2xl">{data.designActivity.title}</h3> */}

            {/*   <div className="mb-6 flex flex-wrap gap-3">
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
              </div> */}

              {data.designActivity.objectives &&
                data.designActivity.objectives.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
                      <BookOpen className="size-5" />
                      Læringsmål
                    </h3>
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

                   {data.designActivity?.handIn && data.designActivity?.handIn?.length > 0 && (
          <div className="mb-16 rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
            <h3 className="mb-4 flex items-center gap-2 font-bold text-2xl text-green-950 dark:text-white">
              Innlevering
            </h3>
            <RichText richText={data.designActivity?.handIn} />
          </div>
        )}

              {data.designActivity.content &&
                data.designActivity.content.length > 0 && (
                  <div className="mb-6">
                     <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
                      Oppgave
                    </h3>
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
                    <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
                      <LinkIcon className="size-5" />
                      Ressurser
                    </h3>
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
                <div className="rounded-lg border-2 border-amber-300 bg-amber-200/80 p-4 dark:border-amber-700 dark:bg-amber-950/50" style={{ borderColor: '#D4AF37', backgroundColor: '#F5DEB3' }}>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="mt-1 size-5 text-green-950 dark:text-amber-200" />
                    <div>
                      <h4 className="mb-1 font-semibold text-green-950 dark:text-amber-100">
                        Hint
                      </h4>
                      <p className="text-green-900 dark:text-amber-200">
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
          <div className="mt-16 rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl dark:border-amber-700/50 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
            <h2 className="mb-4 flex items-center gap-2 font-bold text-2xl text-green-950 dark:text-white">
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

