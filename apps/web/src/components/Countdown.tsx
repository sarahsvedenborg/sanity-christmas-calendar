'use client'

import { useEffect, useState } from "react";
import { RichText } from "./elements/rich-text";

export const Countdown = ({startDate, intro}: {startDate: number, intro: any}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysUntilStart, setDaysUntilStart] = useState<number | null>(null);

    useEffect(() => {
        setCurrentDate(new Date());
        if (startDate) {
            const start = new Date(startDate);
            const diff = Math.ceil((start.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            setDaysUntilStart(diff);
        }
    }, [startDate, currentDate]);

    if (daysUntilStart === null || daysUntilStart < 0) {
        return null;  
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

  