import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { checkUserExists } from "@/auth";

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  
  // Protect the progress page - require authentication
  if (pathname.startsWith("/progresjon") || pathname.startsWith("/scoreboard")) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // If authenticated but user doesn't exist in Sanity, redirect to signup
    if (isAuthenticated && req.auth?.user?.email) {
      const userExists = await checkUserExists(req.auth.user.email);
      if (!userExists) {
        const signupUrl = new URL("/auth/signup", req.url);
        signupUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signupUrl);
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

