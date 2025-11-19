import Link from "next/link";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-950 via-green-900 to-green-950">
      <div className="w-full max-w-md rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-green-950 dark:text-white">
            Innloggingsfeil
          </h1>
          <p className="text-green-900/70 dark:text-amber-200/70">
            Det oppstod en feil under innlogging. Vennligst prøv igjen.
            
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/auth/signin"
            className="block w-full rounded-md bg-[#0078d4] px-4 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-[#0064b4]"
          >
            Prøv igjen
          </Link>
        </div>
      </div>
    </div>
  );
}

