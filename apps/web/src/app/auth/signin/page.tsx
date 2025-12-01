import Link from "next/link";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { AuthButton } from "@/components/auth-button";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/progresjon";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-950 via-green-900 to-green-950">
      <div className="w-full max-w-md rounded-2xl border-2 border-amber-300/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-amber-700/50 dark:bg-green-950/90">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-green-950 dark:text-white">
            Logg inn
          </h1>
          <p className="text-green-900/70 dark:text-amber-200/70">
            Logg inn med din Sopra Steria-konto for å se progresjonen din, scoreboard og vinnere.
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("microsoft-entra-id", { redirectTo: callbackUrl });
          }}
        >
          <AuthButton className="w-full rounded-md bg-[#0078d4] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#0064b4]">
            Logg inn med Microsoft
          </AuthButton>
        </form>
      </div>
      
      <div className="mt-6 text-center">
        <Link
          href="/auth/signup"
          className="text-lg text-white/90 underline transition-colors hover:text-white"
        >
          Ikke medlem? Registrer deg her
        </Link>
      </div>
    </div>
  );
}

