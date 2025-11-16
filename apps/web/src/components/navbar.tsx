import Link from "next/link";
import { CalendarLogo } from "../logos/CalendarLogo";

export function Navbar() {
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
        </div>
      </div>
    </header>
  );
}
