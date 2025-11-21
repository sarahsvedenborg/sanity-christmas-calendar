import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const tenantId = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID || "common";
const issuer = tenantId 
  ? `https://login.microsoftonline.com/${tenantId}/v2.0`
  : "https://login.microsoftonline.com/common/v2.0";



export const authConfig = NextAuth({
  trustHost: true,
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      issuer,
      authorization: { params: { scope: "openid profile email" } },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
      }
      if (session.user && token.name) {
        session.user.name = token.name as string;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile?.email) {
        token.email = profile.email;
      }
      if (profile?.name) {
        token.name = profile.name;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});


export const handlers = authConfig.handlers;
export const signIn = (...args: Parameters<typeof authConfig.signIn>) => authConfig.signIn(...args);
export const signOut = authConfig.signOut;
export const auth = authConfig.auth;


