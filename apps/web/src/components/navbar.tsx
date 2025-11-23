import Link from "next/link";
import { CalendarLogo } from "../logos/CalendarLogo";
import { LogoGreenNew } from "../logos/LogoGreenNew";
import { auth, signOut } from "@/auth";
import { sanityFetch } from "@/lib/sanity/live";
import { querySettingsData } from "@/lib/sanity/query";
import { NavbarMenu } from "./navbar-menu";

export async function Navbar() {
  const session = await auth();
  const { data: settings } = await sanityFetch({
    query: querySettingsData,
  });

  const showRegistrationButton = settings?.showRegistrationButton ?? false;
  const registrationUrl = settings?.registrationUrl;
  const hasSession = Boolean(session);
  const userEmail = session?.user?.email;

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <header 
      className="sticky top-0 z-40 w-full border-b border-amber-300/50 backdrop-blur-sm bg-gradient-to-r from-green-950  to-green-950" 
    >
      <div className="container mx-auto px-4 ">
        <div className="flex h-16 items-center justify-between gap-4">   
          <div className="flex flex-1 items-center justify-center md:justify-start">
            <Link className="flex items-center" href="/">
              <div className="mb-[-60px] scale-75 sm:scale-100">
               {/*  <CalendarLogo width={100} height={100}/> */}
                <LogoGreenNew width={100} height={100}/>
              </div>
            </Link>
          </div>
          {showRegistrationButton && registrationUrl && (
            <div className="hidden md:block relative">
              {/* Subtle pulsing glow effect */}
              <div className="absolute inset-0 rounded-md bg-amber-400 opacity-30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
              <div className="absolute inset-0 rounded-md bg-amber-300 opacity-20 animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center rounded-md bg-[#B91C1C] border-2 border-amber-400 px-6 py-3 text-base font-bold text-white shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all hover:bg-[#991b1b] hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:scale-105"
              >
                Registrer deltakelse
              </a>
            </div>
          )}
          <NavbarMenu
            showRegistrationButton={showRegistrationButton}
            registrationUrl={registrationUrl}
            hasSession={hasSession}
            userEmail={userEmail}
            signOutAction={handleSignOut}
          />
        </div>
      </div>
    </header>
  );
}
