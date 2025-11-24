import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./config";

const tenantId = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID || "common";
const issuer = tenantId 
  ? `https://login.microsoftonline.com/${tenantId}/v2.0`
  : "https://login.microsoftonline.com/common/v2.0";

// Create a write client for creating users
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
});

// Create a read client for checking if user exists
const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

export async function createUserInSanity(
  email: string,
  name: string,
  acceptScoreboard: boolean = false,
  acceptSharingWorkPublicly: boolean = false
) {
  try {
    // Check if user already exists
    const existingUser = await readClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      return existingUser;
    }

    // Get all calendar days to create initial task completion status
    const calendarDays = await readClient.fetch<{ _id: string }[]>(
      `*[_type == "calendarDay"] | order(dayNumber asc){ _id }`
    );

    // Create task completion status array
    const taskCompletionStatus = calendarDays.map((day) => ({
      _type: "taskStatus",
      _key: day._id,
      calendarDay: {
        _type: "reference",
        _ref: day._id,
      },
      completed: false,
    }));

    // Create new user with consent values
    const newUser = await writeClient.create({
      _type: "user",
      name,
      email,
      acceptScoreboard,
      acceptSharingWorkPublicly,
      taskCompletionStatus,
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user in Sanity:", error);
    throw error;
  }
}

export async function checkUserExists(email: string) {
  try {
    const user = await readClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );
    return !!user;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return false;
  }
}

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
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false; // Require email
      }

      // Check if user exists in Sanity
      const userExists = await checkUserExists(user.email);

      if (!userExists) {
        // User doesn't exist - check if they have consent cookies (from signup page)
        // We'll handle user creation in a separate route after authentication completes
        // For now, allow signin to proceed
        return true;
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
      }
      if (session.user && token.name) {
        session.user.name = token.name as string;
      }
      return session;
    },
    async jwt({ token, account, profile, user }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile?.email) {
        token.email = profile.email;
      }
      if (profile?.name) {
        token.name = profile.name;
      }
      // Also check user object for email/name
      if (user?.email) {
        token.email = user.email;
      }
      if (user?.name) {
        token.name = user.name;
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


