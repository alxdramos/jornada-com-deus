/**
 * Configuração completa do Auth.js com Supabase Adapter
 *
 * Roda no Node.js Runtime apenas. Edge Runtime usa authConfig.ts.
 * - GoogleProvider: OAuth via Google
 * - Supabase Adapter: Persistência de sessão em banco de dados
 * - CredentialsProvider: DEPRECATED - remover após migração de usuários
 */

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { authConfig } from "@/auth.config";
import { verifyCredentials } from "@/lib/credentials-db";
import { supabaseAdmin } from "@/lib/supabase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  providers: [
    // Inclui o GoogleProvider que já está em authConfig
    ...authConfig.providers,

    // ── DEPRECATED: Login com E-mail + Senha (será removido) ──────────
    // Mantido por compatibilidade temporária com usuários locais.
    // Após migração, remover este provider completamente.
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email", placeholder: "seu@email.com" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await verifyCredentials(
            credentials.email as string,
            credentials.password as string
          );

          if (!user) return null;

          // Sync user to Supabase se não existir
          const { data: existingUser } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("email", user.email)
            .single();

          if (!existingUser) {
            await supabaseAdmin.from("users").insert({
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.avatar,
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatar ?? null,
          };
        } catch (error) {
          console.error("[Auth] CredentialsProvider error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser && account?.provider === "google") {
        console.log(`[Auth] New Google user signed up: ${user.email}`);
      }
    },
    async signOut() {
      console.log("[Auth] User signed out");
    },
  },
});
