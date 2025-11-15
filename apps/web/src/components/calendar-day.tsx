"use client";

import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowLeft, ArrowRight, Code2, Palette, BookOpen, Link as LinkIcon, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { QueryCalendarDayDataResult } from "@/lib/sanity/sanity.types";

import { RichText } from "./elements/rich-text";
import { SanityImage } from "./elements/sanity-image";
import { BreakDayContent } from "./BreakDayContent";
import { CalendarLogoBronze } from "../logos/CalendarLogoBronze";
import { CalendarLogoSilver } from "../logos/CalendarLogoSilver";
import { CalendarLogoGold } from "../logos/CalendarLogoGold";
import { Snowflakes } from "./elements/snowflakes";
import { LogoBronzeMini } from "../logos/LogoBronzeMini";
import { LogoSilverMini } from "../logos/LogoSilverMini";
import { LogoGoldMini } from "../logos/LogoGoldMini";

type CalendarDayData = NonNullable<QueryCalendarDayDataResult>;

type CalendarDayProps = {
  data: CalendarDayData;
  calendarSlug: string;
};

export function CalendarDay({ data, calendarSlug }: CalendarDayProps) {
  const [showSolution, setShowSolution] = useState(false);



  const hasTechActivity = Boolean(data.techActivity);
  const hasDesignActivity = Boolean(data.designActivity);
  const previousDay = (data as any).previousDay as
    | { slug?: string; dayNumber?: number; title?: string }
    | null
    | undefined;
  const nextDay = (data as any).nextDay as
    | { slug?: string; dayNumber?: number; title?: string }
    | null
    | undefined;
  const [activeSection, setActiveSection] = useState<"tech" | "design">(() => {
    if (hasTechActivity) return "tech";
    if (hasDesignActivity) return "design";
    return "tech";
  });

  useEffect(() => {
    if (hasTechActivity && activeSection === "tech") return;
    if (hasDesignActivity && activeSection === "design") return;

    if (hasTechActivity) {
      setActiveSection("tech");
    } else if (hasDesignActivity) {
      setActiveSection("design");
    }
  }, [hasTechActivity, hasDesignActivity, activeSection]);

  const category = (data as any)?.category as
    | { identifier?: string | null }
    | null
    | undefined;

  const renderTechActivity = () => {
    if (!data.techActivity) return null;
    const tech = data.techActivity;

    return (
      <div
        className="rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90"
        style={{ borderColor: "#D4AF37" }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex size-12 items-center justify-center rounded-full text-white shadow-md"
            style={{ backgroundColor: "#B91C1C" }}
          >
            <Code2 className="size-6" />
          </div>
          <h2 className="font-bold text-3xl text-green-950 dark:text-white">
            Tech-oppgave <br />
          </h2>
        </div>

        {tech.objectives && tech.objectives.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
              <BookOpen className="size-5" />
              Læringsmål
            </h3>
            <ul className="space-y-2">
              {tech.objectives.map((objective, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1">✨</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tech.handIn && tech.handIn?.length > 0 && (
          <div
            className="mb-16 rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90"
            style={{ borderColor: "#D4AF37" }}
          >
            <h3 className="mb-4 flex items-center gap-2 font-bold text-2xl text-green-950 dark:text-white">
              Innlevering
            </h3>
            <RichText richText={tech.handIn} />
          </div>
        )}

        {tech.content && tech.content.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
              Oppgave
            </h3>
            <RichText richText={tech.content} />
          </div>
        )}

        {tech.codeExamples && tech.codeExamples.length > 0 && (
          <div className="mb-6 space-y-4">
            {tech.codeExamples.map((example, idx) => (
              <div key={example._key || idx}>
                <div className="mb-2 flex items-center justify-between rounded-t-lg bg-slate-800 px-4 py-2">
                  <div className="flex items-center gap-2 text-white">
                    <Code2 className="size-4" />
                    <span className="font-mono text-sm">
                      {example.filename ||
                        `${example.language || "code"}`}
                    </span>
                  </div>
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

        {tech.resources && tech.resources.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
              <LinkIcon className="size-5" />
              Ressurser
            </h3>
            <ul className="space-y-2">
              {tech.resources.map((resource) => (
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
      </div>
    );
  };

  const renderDesignActivity = () => {
    if (!data.designActivity) return null;
    const design = data.designActivity;

    return (
      <div
        className="rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90"
        style={{ borderColor: "#D4AF37" }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex size-12 items-center justify-center rounded-full text-white shadow-md"
            style={{ backgroundColor: "#B91C1C" }}
          >
            <Palette className="size-6" />
          </div>
          <h2 className="font-bold text-3xl text-green-950 dark:text-white">
            Designoppgave <br />
          </h2>
        </div>

        {design.objectives && design.objectives.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
              <BookOpen className="size-5" />
              Læringsmål
            </h3>
            <ul className="space-y-2">
              {design.objectives.map((objective, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1">✨</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {design.handIn && design.handIn?.length > 0 && (
          <div
            className="mb-16 rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90"
            style={{ borderColor: "#D4AF37" }}
          >
            <h3 className="mb-4 flex items-center gap-2 font-bold text-2xl text-green-950 dark:text-white">
              Innlevering
            </h3>
            <RichText richText={design.handIn} />
          </div>
        )}

        {design.content && design.content.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
              Oppgave
            </h3>
            <RichText richText={design.content} />
          </div>
        )}

        {design.designExamples && design.designExamples.length > 0 && (
          <div className="mb-6 space-y-4">
            {design.designExamples.map((example) => (
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

        {design.resources && design.resources.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
              <LinkIcon className="size-5" />
              Ressurser
            </h3>
            <ul className="space-y-2">
              {design.resources.map((resource) => (
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
      </div>
    );
  };

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
           {/* <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-amber-300 bg-amber-200/20 px-6 py-2 shadow-lg backdrop-blur-sm" style={{ borderColor: '#D4AF37' }}>
           <CalendarLogoBronze width={40} height={40} />
             <span className="font-bold text-white text-lg">Uke 1: </span>
              </div> */}
              
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-amber-300 bg-amber-200/20 px-6 py-2 shadow-lg backdrop-blur-sm" style={{ borderColor: '#D4AF37' }}>
          {(data as any)?.isBreak &&  <div className="pointer-events-none absolute -right-10 top-[-18px] rotate-6 rounded-sm bg-slate-200/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-800 shadow sm:-right-8 sm:top-[-22px]">
            Pausedag
          </div>}
            {/* <span className="text-2xl">🎁</span> */}
{category?.identifier === '1' && <CalendarLogoBronze width={30} height={30} />}
{category?.identifier ==='2' && <CalendarLogoSilver width={30} height={30} />}
{category?.identifier ==='3' && <CalendarLogoGold width={30} height={30} />}
            <span className="font-bold text-white text-lg">Dag {data.dayNumber}</span>
              </div>

          <h1 className="mb-4 text-balance font-bold text-4xl tracking-tight drop-shadow-lg md:text-6xl" style={{ 
            color: '#B91C1C',
            textShadow: '2px 2px 0px rgba(212, 175, 55, 0.9), -2px -2px 0px rgba(212, 175, 55, 0.9), 2px -2px 0px rgba(212, 175, 55, 0.9), -2px 2px 0px rgba(212, 175, 55, 0.9)'
          }}>
            {data.title}
          </h1>
{/* 
          {data.description && (
            <p className="mx-auto max-w-2xl text-lg text-white/90">
              {data.description}
            </p>
          )} */}

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

        {/* Break Day Content */}
        {(data as any).isBreak && (data as any).breakContent && (data as any).breakContent.length > 0 && (
          <BreakDayContent breakContent={(data as any).breakContent} />
         /*  <div className="mb-16 rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
            <RichText richText={(data as any).breakContent} />
          </div> */
        )}

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

        {/* Two Column Layout for Tech and Design - Only show if not a break day */}
        {!(data as any).isBreak && (
          <>
            {hasTechActivity && hasDesignActivity && (
              <div className="mb-8 md:hidden">
                <div
                  className="flex rounded-full border-2 border-amber-300 bg-white/10 p-1 shadow-lg backdrop-blur-sm"
                  style={{ borderColor: "#D4AF37" }}
                >
                  <button
                    aria-pressed={activeSection === "tech"}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                      activeSection === "tech"
                        ? "bg-red-700 text-white shadow-md focus-visible:ring-red-900"
                        : "text-white/80 hover:bg-white/10 focus-visible:ring-amber-200"
                    )}
                    onClick={() => setActiveSection("tech")}
                    type="button"
                  >
                    <Code2 className="size-5" />
                    <span>Tech-oppgave</span>
                  </button>
                  <button
                    aria-pressed={activeSection === "design"}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                      activeSection === "design"
                        ? "bg-red-700 text-white shadow-md focus-visible:ring-red-900"
                        : "text-white/80 hover:bg-white/10 focus-visible:ring-amber-200"
                    )}
                    onClick={() => setActiveSection("design")}
                    type="button"
                  >
                    <Palette className="size-5" />
                    <span>Designoppgave</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-8 md:hidden">
              {(!hasDesignActivity || activeSection === "tech") && renderTechActivity()}
              {(!hasTechActivity || activeSection === "design") && renderDesignActivity()}
            </div>

            <div
              className={cn(
                "hidden gap-8 md:grid",
                hasTechActivity && hasDesignActivity ? "md:grid-cols-2" : "md:grid-cols-1"
              )}
            >
              {renderTechActivity()}
              {renderDesignActivity()}
            </div>
          </>
        )}

        {/* Conclusion */}
        {data.conclusion && data.conclusion.length > 0 && (
          <div className="mt-16 rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl dark:border-amber-700/50 dark:bg-green-950/90" style={{ borderColor: '#D4AF37' }}>
            <h2 className="mb-4 flex items-center gap-2 font-bold text-2xl text-green-950 dark:text-white">
              🎯 Conclusion
            </h2>
            <RichText richText={data.conclusion} />
          </div>
        )}

        {/* Day Navigation */}
        <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {previousDay?.slug ? (
            <Link
              className="group flex w-full items-center justify-center gap-3 rounded-full border-2 border-amber-300 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-200 md:w-auto"
              href={`/${previousDay.slug}`}
            >
              <ArrowLeft className="size-5 transition group-hover:-translate-x-1" />
              <span className="text-center">
                Forrige dag{previousDay.dayNumber ? `: ${previousDay.dayNumber}` : ""}{" "}
                {previousDay.title ? `— ${previousDay.title}` : ""}
              </span>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}

          {nextDay?.slug ? (
            <Link
              className="group flex w-full items-center justify-center gap-3 rounded-full border-2 border-amber-300 bg-red-700/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-900 md:w-auto"
              href={`/${nextDay.slug}`}
            >
              <span className="text-center">
                Neste dag{nextDay.dayNumber ? `: ${nextDay.dayNumber}` : ""}{" "}
                {nextDay.title ? `— ${nextDay.title}` : ""}
              </span>
              <ArrowRight className="size-5 transition group-hover:translate-x-1" />
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>
      </div>
    </div>
  );
}
