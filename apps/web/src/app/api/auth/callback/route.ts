import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createUserInSanity, checkUserExists } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session?.user?.email || !session?.user?.name) {
    redirect("/auth/signin?error=missing_info");
  }

  // Check if user exists in Sanity
  const userExists = await checkUserExists(session.user.email);

  if (!userExists) {
    // Check for consent cookies from signup page
    const cookieStore = await cookies();
    const acceptTracking = cookieStore.get("signup_acceptTracking")?.value === "true";
    const acceptScoreboard = cookieStore.get("signup_acceptScoreboard")?.value === "true";
    const acceptDisplayWork = cookieStore.get("signup_acceptDisplayWork")?.value === "true";

    // If no consent cookies, redirect to signup
    if (!acceptTracking) {
      // Clear any partial cookies
      cookieStore.delete("signup_acceptTracking");
      cookieStore.delete("signup_acceptScoreboard");
      cookieStore.delete("signup_acceptDisplayWork");
      redirect("/auth/signup?error=consent_required");
    }

    // Create user with consent values
    try {
      await createUserInSanity(
        session.user.email,
        session.user.name,
        acceptScoreboard,
        acceptDisplayWork
      );

      // Clear consent cookies
      cookieStore.delete("signup_acceptTracking");
      cookieStore.delete("signup_acceptScoreboard");
      cookieStore.delete("signup_acceptDisplayWork");
    } catch (error) {
      console.error("Error creating user:", error);
      redirect("/auth/signup?error=creation_failed");
    }
  }

  // Redirect to the original destination or default
  const searchParams = new URL(request.url).searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/progresjon";
  redirect(callbackUrl);
}

