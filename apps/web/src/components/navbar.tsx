import Link from "next/link";
import { CalendarLogo } from "../logos/CalendarLogo";
import { sanityFetch } from "@/lib/sanity/live";
import { querySettingsData } from "@/lib/sanity/query";

export async function Navbar() {
  const { data: settings } = await sanityFetch({
    query: querySettingsData,
  });

  // const showRegistrationButton = settings?.showRegistrationButton ?? false;
  const showRegistrationButton = true;
  // const registrationUrl = settings?.registrationUrl;
  const registrationUrl = 'https://vg.no';

  return (
    <header 
      className="sticky top-0 z-40 w-full border-b border-amber-300/50 backdrop-blur-sm bg-gradient-to-r from-green-950  to-green-950" 
    >
      <div className="container mx-auto px-4 ">
        <div className="flex h-16 items-center justify-between sm:justify-between gap-4">   
          <div className="flex flex-1 items-center justify-center md:justify-start">
            <Link className="flex items-center" href="/">
              <div className="mb-[-60px] scale-75 sm:scale-100">
                <CalendarLogo width={100} height={100}/>
              </div>
            </Link>
          </div>
          {showRegistrationButton && registrationUrl ? (
            <div className="relative">
              {/* Subtle pulsing glow effect */}
              <div className="absolute inset-0 rounded-md bg-amber-400 opacity-30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
              <div className="absolute inset-0 rounded-md bg-amber-300 opacity-20 animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center rounded-md bg-[#B91C1C] border-2 border-amber-400 px-6 py-3 text-base font-bold text-white shadow-[0_0_25px_rgba(251,191,36,0.7),0_0_50px_rgba(251,191,36,0.4)] transition-all hover:bg-[#991b1b] hover:shadow-[0_0_35px_rgba(251,191,36,0.9),0_0_70px_rgba(251,191,36,0.6)] hover:scale-105"
              >
                Registrer deltakelse
              </a>
              {/* Tagline dropping down */}
            {/*   <div 
                className="absolute left-1/2 top-full mt-2 -translate-x-1/2 -skew-x-12"
                style={{
                  animation: 'dropDown 0.6s ease-out forwards',
                }}
              >
                <span className="inline-block rounded-md bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  få premier
                </span>
              </div> */}
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes dropDown {
                  0% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-10px) skewX(-12deg);
                  }
                  100% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0) skewX(-12deg);
                  }
                }
              `}} />
            </div>
          ) : (
            <>
              <Link
                href="/besvarelser"
                className="flex items-center text-sm font-semibold text-white underline underline-offset-4 transition-colors hover:text-amber-200"
              >
                Se besvarelser
              </Link>
              <Link
                href="/progresjon"
                className="flex items-center text-sm font-semibold text-white underline underline-offset-4 transition-colors hover:text-amber-200"
              >
                Progresjon
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
