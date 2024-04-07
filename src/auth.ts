import NextAuth, { type NextAuthConfig, type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "./env";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
    accessToken: string;
    refreshToken: string;
  }
}

export const NextConfig = {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_SECRET,
      checks: ["none"],
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth?hd=company.com",
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/gmail.send",
        },
      },
    }),
  ],
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  ...NextConfig,
});
