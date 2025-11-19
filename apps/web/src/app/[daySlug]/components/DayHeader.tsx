import { SanityImage } from "@/components/elements/sanity-image";
import { CalendarLogoBronze } from "@/logos/CalendarLogoBronze";
import { CalendarLogoGold } from "@/logos/CalendarLogoGold";
import { CalendarLogoSilver } from "@/logos/CalendarLogoSilver";

export const stegaClean = (value: any) => {
  return value.normalize('NFKC') // Normalize Unicode
  .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
  .trim(); // Remove leading/traili

}

export const DayHeader = ({ dayData }: { dayData: any }) => {

  const getLogo = (identifier: string) => {
    const cleanIdentifier = stegaClean(identifier);
    if (cleanIdentifier === '1') return <CalendarLogoBronze width={30} height={30} />;
    if (cleanIdentifier === '2') return <CalendarLogoSilver width={30} height={30} />;
    if (cleanIdentifier === '3') return <CalendarLogoGold width={30} height={30} />;
    return null;
  }
  
  
    return (
     <div className="mb-12 text-center">
           {/* <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-amber-300 bg-amber-200/20 px-6 py-2 shadow-lg backdrop-blur-sm" style={{ borderColor: '#D4AF37' }}>
           <CalendarLogoBronze width={40} height={40} />
             <span className="font-bold text-white text-lg">Uke 1: </span>
              </div> */}
              
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-amber-300 bg-amber-200/20 px-6 py-2 shadow-lg backdrop-blur-sm" style={{ borderColor: '#D4AF37' }}>
          {(dayData as any)?.isBreak &&  <div className="pointer-events-none absolute -right-10 top-[-18px] rotate-6 rounded-sm bg-slate-200/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-800 shadow sm:-right-8 sm:top-[-22px]">
            Pausedag
          </div>}
            {/* <span className="text-2xl">🎁</span> */}
            {getLogo(dayData.category.identifier)}         
            <span className="font-bold text-white text-lg">Dag {dayData.dayNumber}</span>
              </div>

          <h1 className="mb-4 text-balance font-bold text-4xl tracking-tight drop-shadow-lg md:text-6xl" style={{ 
            color: '#B91C1C',
            textShadow: '2px 2px 0px rgba(212, 175, 55, 0.9), -2px -2px 0px rgba(212, 175, 55, 0.9), 2px -2px 0px rgba(212, 175, 55, 0.9), -2px 2px 0px rgba(212, 175, 55, 0.9)'
          }}>
            {dayData.title}
          </h1>


           {dayData.reward && (
            <div className="mt-6 inline-block rounded-full border-2 border-amber-300 bg-amber-200/90 px-6 py-3 shadow-lg" style={{ borderColor: '#D4AF37', backgroundColor: '#F5DEB3' }}>
              <p className="flex items-center gap-2 font-bold text-green-950">
                <span className="text-2xl">🎁</span>
                <span>Premie: {dayData.reward}</span>
              </p>
            </div>
          )} 

          {dayData.icon && (
            <div className="mt-8 flex justify-center">
              <SanityImage
                className="size-32 rounded-full shadow-2xl"
                height={128}
                image={dayData.icon}
                width={128}
              />
            </div>
          )}
        </div>
  );
};