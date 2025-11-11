import Link from "next/link";

export function SimpleFooter() {
  return (
    <footer className="border-t border-amber-300/30 bg-gradient-to-br from-green-950 via-green-900 to-green-950 py-8 text-center">
      <div className="flex flex-col-reverse items-center gap-4 px-4 text-sm text-white/80 sm:flex-row sm:justify-between sm:text-base">
        <p>
          Laget av:{" "}
         {/*  <span className="font-semibold text-white"> */}XXX{/* </span> */} {/* 🎄 🤶 */} 🌟
        </p>
        <p>
         2025
        </p>
        <p>
          <Link
                       className="flex items-center text-sm font-semibold text-white underline underline-offset-4 transition-colors hover:text-amber-200"
            href="/definisjoner"
          >
            Sanity begreper/ord/utrykk
          </Link>
        </p>
      </div>
    </footer>
  );
}
