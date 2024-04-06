import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import { db } from "@/server/db";
import { createTable } from "@/server/db/schema";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
    accessToken: string;
    refreshToken: string;
  }

  interface User {
    id: string;
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }
}

export const authOptions: NextAuthOptions = {
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
  adapter: DrizzleAdapter(db, createTable) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_SECRET,
      checks: "none",
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth?hd=company.com",
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/gmail.send",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: env.NEXTAUTH_SECRET,
};

export const getServerAuthSession = () => getServerSession(authOptions);
