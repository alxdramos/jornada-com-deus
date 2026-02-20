/**
 * Configuração leve do Auth.js — compatível com Edge Runtime.
 *
 * Este arquivo NÃO pode importar módulos Node.js (fs, path, bcryptjs, etc.)
 * porque é usado pelo middleware, que roda no Edge Runtime.
 *
 * O CredentialsProvider (que precisa de fs/bcryptjs) fica apenas em auth.ts,
 * que roda exclusivamente no ambiente Node.js.
 */

import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
};
