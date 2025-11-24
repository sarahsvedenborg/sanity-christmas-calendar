"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";

type NavbarMenuProps = {
  showRegistrationButton: boolean;
  registrationUrl?: string | null;
  hasSession: boolean;
  userEmail?: string | null;
  signOutAction: () => Promise<void>;
};

export function NavbarMenu({
  showRegistrationButton,
  registrationUrl,
  hasSession,
  userEmail,
  signOutAction,
}: NavbarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const MenuContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const linkClass = isMobile
      ? "text-base font-semibold text-white underline underline-offset-4 transition-colors hover:text-amber-200 py-2"
      : "flex items-center text-sm font-semibold text-white underline underline-offset-4 transition-colors hover:text-amber-200";

    if (showRegistrationButton && registrationUrl) {
      return (
        <>
          <a
            href={registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={
              isMobile
                ? "relative flex items-center justify-center rounded-md bg-[#B91C1C] border-2 border-amber-400 px-6 py-3 text-base font-bold text-white shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all hover:bg-[#991b1b]"
                : "relative flex items-center justify-center rounded-md bg-[#B91C1C] border-2 border-amber-400 px-6 py-3 text-base font-bold text-white shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all hover:bg-[#991b1b] hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:scale-105"
            }
            onClick={closeMenu}
          >
            Registrer deltakelse
          </a>
        </>
      );
    }

    return (
      <>
       <div className="flex flex-row gap-2 ml-8"> 
        {hasSession && <Link href="/demo" className={linkClass} onClick={closeMenu}>
          Demoløsning
        </Link>}
        <Link href="/definisjoner" className={linkClass} onClick={closeMenu}>
          Ordliste
        </Link>
       </div> 
<div className="flex flex-row gap-2">
       {hasSession && <Link href="/besvarelser" className={linkClass} onClick={closeMenu}>
          Delte besvarelser
        </Link> }
        {hasSession && <Link href="/scoreboard" className={linkClass} onClick={closeMenu}>
          Scoreboard
        </Link>}
        {hasSession ? (
          <>
            <Link href="/progresjon" className={linkClass} onClick={closeMenu}>
              Min progresjon
            </Link>
            <form
              action={async () => {
                await signOutAction();
              }}
            >
              <button
                type="submit"
                className={isMobile ? `${linkClass} w-full text-left` : linkClass}
                onClick={closeMenu}
              >
                Logg ut
              </button>
            </form>
          </>
        ) : (
          <Link href="/auth/signin" className={linkClass} onClick={closeMenu}>
            Logg inn
          </Link>
        )}
        </div>
      </>
    );
  };

  return (
    <>
      {/* Desktop Menu - Hidden on mobile */}
      <div className="hidden md:flex flex-1 flex-row justify-between gap-2">
{/*         <div className="flex items-center justify-space-between gap-4"> */}
          <MenuContent />
{/*         </div> */}
      {/*   {hasSession && userEmail && (
          <span className="text-xs text-white/70">
            Logget inn som: {userEmail}
          </span>
        )} */}
      </div>

      {/* Mobile Menu - Hamburger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="md:hidden flex items-center justify-center p-2 text-white hover:text-amber-200 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] bg-gradient-to-br from-green-950 to-green-900 border-amber-300/50 [&>button]:text-white [&>button]:hover:text-amber-200 [&>button]:border-white/20"
        >
          <div className="flex flex-col gap-6 mt-8 px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Meny</h2>
            </div>
            <nav className="flex flex-col gap-4 pl-4">
              <MenuContent isMobile />
              {hasSession && userEmail && (
                <span className="text-sm text-white/70 py-2 mt-2">
                  Logget inn som: {userEmail}
                </span>
              )}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

