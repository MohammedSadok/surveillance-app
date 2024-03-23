import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import db from "./lib/db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async session({ token, session, user }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.isAdmin = token.isAdmin as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(parseInt(token.sub));
      if (!existingUser) return token;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.isAdmin = existingUser.isAdmin;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
