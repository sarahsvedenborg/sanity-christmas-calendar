"use client";

import Link from "next/link";
import { RichText } from "@/components/elements/rich-text";
import { BookOpen, Code2, LinkIcon, Palette } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";

export const Lesson = ({ data: lesson, lessonType }: { data: any, lessonType: 'tech' | 'design' }) => {
    const title = lessonType === 'tech' ? 'Tech-oppgave' : 'Designoppgave'

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
            {lessonType === 'tech' ? <Code2 className="size-6" /> : <Palette className="size-6" />}
          </div>
          <h2 className="font-bold text-3xl text-green-950 dark:text-white">
            {title}<br />
          </h2>
        </div>

        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
              <BookOpen className="size-5" />
              Læringsmål
            </h3>
            <ul className="space-y-2">
              {lesson.objectives.map((objective: any, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1">✨</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {lessonType === 'design' && (
          <div className="mb-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="demo-studio" className="border-amber-300/50 dark:border-amber-700/50">
                <AccordionTrigger className="rounded-md bg-amber-500/90 px-4 py-3 text-left font-semibold text-lg text-green-950 hover:bg-amber-400/90 hover:no-underline dark:bg-amber-700/30 dark:text-white dark:hover:bg-amber-700/40">
                  Trenger du tilgang til et demo studio?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-base text-green-900 dark:text-white/70">
                  <p className="mb-4">
                    Hvis du trenger/ønsker tilgang til et demo studio, kan du finne <Link href="/demo-docs" className="inline-flex items-center gap-2 font-semibold text-green-900 underline transition-colors hover:text-green-700 dark:text-blue-400 dark:hover:text-blue-200">informasjon om dette i demo-dokumentasjon.</Link>
                  </p>
                {/*   <Link
                    href="/demo-docs"
                    className="inline-flex items-center gap-2 font-semibold text-blue-600 underline transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    <LinkIcon className="size-4" />
                    Les mer i demo dokumentasjonen
                  </Link> */}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {lesson.handIn && lesson.handIn?.length > 0 && (
          <div
            className="mb-16 rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90"
            style={{ borderColor: "#D4AF37" }}
          >
            <h3 className="mb-4 flex items-center gap-2 font-bold text-2xl text-green-950 dark:text-white">
              Innlevering
            </h3>
           <p className="mb-4 text-green-950 text-lg"> Kommenter på {' '}
            {lesson.handInUrl ? <a target="_blank" rel="noopener noreferrer" href={lesson.handInUrl} className="text-blue-600 underline transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">dagens Viva Engage post</a> : <span className="text-gray-500">dagens Viva Engage post</span>} (åpner senest kl 10.00) med: </p>
            <RichText richText={lesson.handIn} />
          </div>
        )}

        {lesson.content && lesson.content.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
              Oppgave
            </h3>
            <RichText richText={lesson.content} />
          </div>
        )}

        {lesson.codeExamples && lesson.codeExamples.length > 0 && (
          <div className="mb-6 space-y-4">
            {lesson.codeExamples.map((example: any, idx: number) => (
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

        {lesson.resources && lesson.resources.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-2xl">
              <LinkIcon className="size-5" />
              Ressurser
            </h3>
            <ul className="space-y-2">
              {lesson.resources.map((resource: any) => (
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