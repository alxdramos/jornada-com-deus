/**
 * Seed: Popular tabela bible_verses no Supabase com dados da NVI
 *
 * Fonte: github.com/thiagobodruk/bible (CC BY-NC)
 * Tradução: Nova Versão Internacional (NVI)
 *
 * Uso: node scripts/seed-bible-supabase.mjs
 *
 * Requisitos:
 *   - NEXT_PUBLIC_SUPABASE_URL no .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY no .env.local (chave de serviço)
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carregar variáveis de ambiente do .env.local
function loadEnv() {
  try {
    const envPath = join(__dirname, "../.env.local");
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const [key, ...valueParts] = line.split("=");
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    console.warn("Aviso: .env.local não encontrado. Use variáveis de ambiente do sistema.");
  }
}

loadEnv();

// Livros em ordem canônica (deve bater com ALL_BOOKS do biblia.ts)
const ALL_BOOKS = [
  // Antigo Testamento
  { id: "genesis", name: "Gênesis", testament: "AT" },
  { id: "exodo", name: "Êxodo", testament: "AT" },
  { id: "levitico", name: "Levítico", testament: "AT" },
  { id: "numeros", name: "Números", testament: "AT" },
  { id: "deuteronomio", name: "Deuteronômio", testament: "AT" },
  { id: "josue", name: "Josué", testament: "AT" },
  { id: "juizes", name: "Juízes", testament: "AT" },
  { id: "rute", name: "Rute", testament: "AT" },
  { id: "1samuel", name: "1 Samuel", testament: "AT" },
  { id: "2samuel", name: "2 Samuel", testament: "AT" },
  { id: "1reis", name: "1 Reis", testament: "AT" },
  { id: "2reis", name: "2 Reis", testament: "AT" },
  { id: "1cronicas", name: "1 Crônicas", testament: "AT" },
  { id: "2cronicas", name: "2 Crônicas", testament: "AT" },
  { id: "esdras", name: "Esdras", testament: "AT" },
  { id: "neemias", name: "Neemias", testament: "AT" },
  { id: "ester", name: "Ester", testament: "AT" },
  { id: "jo", name: "Jó", testament: "AT" },
  { id: "salmos", name: "Salmos", testament: "AT" },
  { id: "proverbios", name: "Provérbios", testament: "AT" },
  { id: "eclesiastes", name: "Eclesiastes", testament: "AT" },
  { id: "cantares", name: "Cantares", testament: "AT" },
  { id: "isaias", name: "Isaías", testament: "AT" },
  { id: "jeremias", name: "Jeremias", testament: "AT" },
  { id: "lamentacoes", name: "Lamentações", testament: "AT" },
  { id: "ezequiel", name: "Ezequiel", testament: "AT" },
  { id: "daniel", name: "Daniel", testament: "AT" },
  { id: "oseias", name: "Oséias", testament: "AT" },
  { id: "joel", name: "Joel", testament: "AT" },
  { id: "amos", name: "Amós", testament: "AT" },
  { id: "obadias", name: "Obadias", testament: "AT" },
  { id: "jonas", name: "Jonas", testament: "AT" },
  { id: "miqueias", name: "Miquéias", testament: "AT" },
  { id: "naum", name: "Naum", testament: "AT" },
  { id: "habacuque", name: "Habacuque", testament: "AT" },
  { id: "sofonias", name: "Sofonias", testament: "AT" },
  { id: "ageu", name: "Ageu", testament: "AT" },
  { id: "zacarias", name: "Zacarias", testament: "AT" },
  { id: "malaquias", name: "Malaquias", testament: "AT" },
  // Novo Testamento
  { id: "mateus", name: "Mateus", testament: "NT" },
  { id: "marcos", name: "Marcos", testament: "NT" },
  { id: "lucas", name: "Lucas", testament: "NT" },
  { id: "joao", name: "João", testament: "NT" },
  { id: "atos", name: "Atos", testament: "NT" },
  { id: "romanos", name: "Romanos", testament: "NT" },
  { id: "1corintios", name: "1 Coríntios", testament: "NT" },
  { id: "2corintios", name: "2 Coríntios", testament: "NT" },
  { id: "galatas", name: "Gálatas", testament: "NT" },
  { id: "efesios", name: "Efésios", testament: "NT" },
  { id: "filipenses", name: "Filipenses", testament: "NT" },
  { id: "colossenses", name: "Colossenses", testament: "NT" },
  { id: "1tessalonicenses", name: "1 Tessalonicenses", testament: "NT" },
  { id: "2tessalonicenses", name: "2 Tessalonicenses", testament: "NT" },
  { id: "1timoteo", name: "1 Timóteo", testament: "NT" },
  { id: "2timoteo", name: "2 Timóteo", testament: "NT" },
  { id: "tito", name: "Tito", testament: "NT" },
  { id: "filemom", name: "Filemom", testament: "NT" },
  { id: "hebreus", name: "Hebreus", testament: "NT" },
  { id: "tiago", name: "Tiago", testament: "NT" },
  { id: "1pedro", name: "1 Pedro", testament: "NT" },
  { id: "2pedro", name: "2 Pedro", testament: "NT" },
  { id: "1joao", name: "1 João", testament: "NT" },
  { id: "2joao", name: "2 João", testament: "NT" },
  { id: "3joao", name: "3 João", testament: "NT" },
  { id: "judas", name: "Judas", testament: "NT" },
  { id: "apocalipse", name: "Apocalipse", testament: "NT" },
];

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("ERRO: Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local");
    process.exit(1);
  }

  // Carregar dados da NVI
  const bibleJsonPath = join(__dirname, "../public/data/bible-nvi.json");
  const bibleData = JSON.parse(readFileSync(bibleJsonPath, "utf-8"));

  console.log(`Carregados ${bibleData.length} livros da NVI`);
  console.log("Iniciando seed no Supabase...\n");

  let totalVerses = 0;
  let errors = 0;

  for (let bookIdx = 0; bookIdx < bibleData.length; bookIdx++) {
    const bookInfo = ALL_BOOKS[bookIdx];
    const bookData = bibleData[bookIdx];
    const rows = [];

    for (let chIdx = 0; chIdx < bookData.chapters.length; chIdx++) {
      const chapter = bookData.chapters[chIdx];
      for (let vIdx = 0; vIdx < chapter.length; vIdx++) {
        const text = chapter[vIdx].replace(/^[""]|[""]$/g, "").trim();
        rows.push({
          translation: "nvi",
          book_index: bookIdx,
          book_id: bookInfo.id,
          book_name: bookInfo.name,
          testament: bookInfo.testament,
          chapter: chIdx + 1,
          verse: vIdx + 1,
          text,
        });
      }
    }

    // Inserir em batch de 500 registros
    for (let i = 0; i < rows.length; i += 500) {
      const batch = rows.slice(i, i + 500);
      const response = await fetch(`${supabaseUrl}/rest/v1/bible_verses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
          "Prefer": "resolution=merge-duplicates",
        },
        body: JSON.stringify(batch),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error(`Erro ao inserir ${bookInfo.name} batch ${i}: ${err}`);
        errors++;
      }
    }

    totalVerses += rows.length;
    process.stdout.write(`\r[${bookIdx + 1}/66] ${bookInfo.name.padEnd(25)} — ${totalVerses} versículos inseridos`);
  }

  console.log(`\n\nSeed concluído!`);
  console.log(`Total: ${totalVerses} versículos inseridos (${errors} erros)`);
}

main().catch(console.error);
