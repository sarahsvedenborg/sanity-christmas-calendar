import Link from "next/link";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage({
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
           Registrering
          </h1>
          <p className="text-green-900/70 dark:text-amber-200/70">
            Registrer deg med Sopra Steria SSO for å se progresjonen din
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("microsoft-entra-id", { redirectTo: callbackUrl });
          }}
        >

              <div className="space-y-4 rounded-lg  bg-amber-50/50 p-4 dark:border-amber-700/30 dark:bg-amber-900/20">
                <legend className="text-sm font-medium text-green-950 dark:text-white">*Påkrevd</legend>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptTracking"
                    name="acceptTracking"
                 /*    checked={formData.acceptTracking}
                    onChange={handleChange} */
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-2 border-amber-600 text-amber-600 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:border-amber-400 dark:bg-green-950/50"
                  />
                  <label
                    htmlFor="acceptTracking"
                    className="cursor-pointer text-base font-medium text-green-950 dark:text-white"
                  >
                    Jeg aksepterer at mitt navn og epost lagres til julekalenderen er avsluttet for at fremgangen kan trackes.
                  </label>
                </div>
                <legend className="text-sm font-medium text-green-950 dark:text-white">Valgfritt</legend>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptScoreboard"
                    name="acceptScoreboard"
                 /*    checked={formData.acceptScoreboard}
                    onChange={handleChange} */
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-2 border-amber-600 text-amber-600 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:border-amber-400 dark:bg-green-950/50"
                  />
                  <label
                    htmlFor="acceptScoreboard"
                    className="cursor-pointer text-base font-medium text-green-950 dark:text-white"
                  >
                 Jeg aksepterer at min score vises i scoreboard.
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptDisplayWork"
                    name="acceptDisplayWork"
                 /*    checked={formData.acceptDisplayWork}
                    onChange={handleChange} */
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-2 border-amber-600 text-amber-600 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:border-amber-400 dark:bg-green-950/50"
                  />
                  <label
                    htmlFor="acceptDisplayWork"
                    className="cursor-pointer text-base font-medium text-green-950 dark:text-white"
                  >
                   Jeg aksepterer at arbeidet mitt vises i en felles liste med slik at jeg kan bli kjent med andre kollegaer.
                  </label>
                </div>
              </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#0078d4] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#0064b4]"
          >
            Logg inn med Microsoft
          </button>
        </form>
      </div>
      
      <div className="mt-6 text-center">
        <Link
          href="/auth/signin"
          className="text-lg text-white/90 underline transition-colors hover:text-white"
        >
          Allerede bruker? Logg inn her
        </Link>
      </div>
    </div>
  );
}

