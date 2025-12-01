'use client'

import { useEffect, useState } from "react";
import { RichText } from "./elements/rich-text";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";

export const Countdown = ({startDate, intro, isLoggedIn}: {startDate: number, intro: any, isLoggedIn?: boolean}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysUntilStart, setDaysUntilStart] = useState<number | null>(null);

    useEffect(() => {
        setCurrentDate(new Date());
        if (startDate) {
            const start = new Date(startDate);
            const diff = Math.ceil((start.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            setDaysUntilStart(diff);
        }
    }, [startDate]);


    if (daysUntilStart === null || daysUntilStart < 0) {
        return null;  
    }

    if(daysUntilStart === 0) {
      return (
        <>
           {!isLoggedIn && (
                  <a
                    href="/auth/signup"
                    className="relative mt-10 mb-10 mx-auto w-fit flex items-center justify-center rounded-md bg-[#B91C1C] border-2 border-amber-400 px-6 py-3 text-base font-bold text-white shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all hover:bg-[#991b1b] hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:scale-105"
                  >
                    Registrer deltakelse
                  </a>
                )}
        <Accordion type="single" collapsible className="w-full mx-auto max-w-md mt-10">
          <AccordionItem value="demo-studio" className="border-amber-300/50 dark:border-amber-700/50">
            <AccordionTrigger className="rounded-md bg-amber-400 px-4 py-3 text-left font-semibold text-lg text-green-950 hover:bg-amber-400/90 hover:no-underline dark:bg-amber-700/30 dark:text-white dark:hover:bg-amber-700/40">
              Mer informasjon om julekalenderen
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-base text-green-900 dark:text-white/70">
              <RichText
                className="mx-auto max-w-xl text-left"
                richText={intro}
                tone="light"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
                </>
      )
    }

    return (
                <section className="relative py-2 md:py-2">
<div className="container mx-auto px-4">
  <div className="mx-auto max-w-4xl text-center">
        <div className="mb-20 mt-20 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 text-white">
                      <div className="relative">
                            <div className="absolute inset-0 animate-ping rounded-full bg-yellow-800 opacity-20"></div> 
                  <div className="flex flex-col items-center">
                    <span className="text-7xl font-bold leading-none" style={{ color: '#D4AF37' }}>
                      {daysUntilStart}
                    </span>
                   
                    <span className="text-sm uppercase tracking-wider text-white/80">
                      {daysUntilStart === 1 ? 'dag igjen' : 'dager igjen'}
                    </span>
                     </div>
                  </div>
                </div>
              </div>
                {!isLoggedIn && (
                  <a
                    href="/auth/signup"
                    className="relative mt-[-45px] mb-10 mx-auto w-fit flex items-center justify-center rounded-md bg-[#B91C1C] border-2 border-amber-400 px-6 py-3 text-base font-bold text-white shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all hover:bg-[#991b1b] hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:scale-105"
                  >
                    Registrer deltakelse
                  </a>
                )}
               {intro && (<>
              <div className="mb-8">
                <RichText
                  className="mx-auto max-w-xl text-left"
                  richText={intro}
                  tone="light"
                />
              </div>
              </>
            )} 
            </div>
            </div>
            </section>
            
            )
  };

  