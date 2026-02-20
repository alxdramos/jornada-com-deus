/**
 * Configuração completa do Auth.js — roda apenas no Node.js Runtime.
 *
 * Estende authConfig (edge-compatible) adicionando o CredentialsProvider,
 * que depende de fs/path/bcryptjs e NÃO pode rodar no Edge Runtime.
 */

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { verifyCredentials } from "@/lib/credentials-db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    // Inclui o GoogleProvider que já está em authConfig
    ...authConfig.providers,

    // ── Login com E-mail + Senha (Node.js only — usa fs + bcryptjs) ──────────
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email", placeholder: "seu@email.com" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await verifyCredentials(
          credentials.email as string,
          credentials.password as string
        );

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar ?? null,
        };
      },
    }),
  ],
});
