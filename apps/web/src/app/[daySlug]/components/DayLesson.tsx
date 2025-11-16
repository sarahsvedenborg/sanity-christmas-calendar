"use client";

import { RichText } from "@/components/elements/rich-text";
import { cn } from "@workspace/ui/lib/utils";
import { Code2, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { Lesson } from "./Lesson";

export const DayLesson = ({ data }: { data: any }) => {
     const hasTechActivity = Boolean(data.techActivity);
  const hasDesignActivity = Boolean(data.designActivity);

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


  const renderTechActivity = (lesson: any) => {
    if (!hasTechActivity) return null;
    return <Lesson data={lesson.techActivity} lessonType="tech" />
  }


    const renderDesignActivity = (lesson: any) => {
   if (!hasDesignActivity) return null;
    return <Lesson data={lesson.designActivity} lessonType="design" />
  }

  return (
  <>
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
        {/* _____ */}
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
              {(!hasDesignActivity || activeSection === "tech") && renderTechActivity( data)}
              {(!hasTechActivity || activeSection === "design") && renderDesignActivity( data)}
            </div> 

            <div
              className={cn(
                "hidden gap-8 md:grid",
                hasTechActivity && hasDesignActivity ? "md:grid-cols-2" : "md:grid-cols-1"
              )}
            >
               {renderTechActivity(data)}
              {renderDesignActivity( data)} 
            </div>
          </>
        {/* ________ */}
  </>
  );
};