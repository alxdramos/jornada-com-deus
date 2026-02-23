/**
 * Script para migrar usuários locais (credentials-users.json) para Supabase
 *
 * IMPORTANTE: Execute APÓS Supabase estar configurado e schema criado
 *
 * Uso:
 * npx tsx scripts/migrate-users-to-supabase.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

// Validar variáveis de ambiente
const requiredEnvVars = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Criar client Supabase com service role (permissões administrativas)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Interface de usuário local
interface LocalUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  avatar?: string;
}

async function migrateUsersToSupabase() {
  try {
    // Ler arquivo de usuários locais
    const credentialsPath = path.join(
      process.cwd(),
      "data/credentials-users.json"
    );

    if (!fs.existsSync(credentialsPath)) {
      console.log(
        "⚠️  No local users file found at data/credentials-users.json"
      );
      console.log("Nada a migrar.");
      return;
    }

    const localUsers: LocalUser[] = JSON.parse(
      fs.readFileSync(credentialsPath, "utf-8")
    );

    if (!Array.isArray(localUsers) || localUsers.length === 0) {
      console.log("No users to migrate");
      return;
    }

    console.log(`📋 Encontrados ${localUsers.length} usuários locais`);
    console.log("---");

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of localUsers) {
      try {
        // Verificar se usuário já existe
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (existingUser) {
          console.log(`⏭️  ${user.email} - já existe em Supabase`);
          skipped++;
          continue;
        }

        // Criar usuário no Supabase
        const { data, error } = await supabase.from("users").insert({
          id: user.id || crypto.randomUUID(),
          email: user.email,
          name: user.name,
          image: user.avatar || null,
        });

        if (error) {
          throw error;
        }

        console.log(`✅ ${user.email} - migrado com sucesso`);
        migrated++;
      } catch (error) {
        console.error(`❌ ${user.email} - erro na migração:`, error);
        errors++;
      }
    }

    // Resumo
    console.log("---");
    console.log(`\n📊 Resultado da Migração:`);
    console.log(`  ✅ Migrados: ${migrated}`);
    console.log(`  ⏭️  Pulados (já existem): ${skipped}`);
    console.log(`  ❌ Erros: ${errors}`);
    console.log(`  📈 Total: ${migrated + skipped + errors}/${localUsers.length}`);

    if (errors > 0) {
      console.log("\n⚠️  Alguns usuários não foram migrados. Verifique os erros acima.");
      process.exit(1);
    }

    console.log(
      "\n✨ Migração concluída! Usuários agora estão em Supabase.\n"
    );

    // Próximos passos
    console.log("📝 Próximos passos:");
    console.log(
      "  1. Verificar usuários em Supabase Dashboard → SQL Editor:"
    );
    console.log("     SELECT * FROM public.users;");
    console.log("  2. Testar login em http://localhost:3000");
    console.log("  3. CredentialsProvider pode ser removido (está DEPRECATED)");
    console.log("");
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

// Executar migração
migrateUsersToSupabase().catch(console.error);
