/**
 * build_bible_pt_almeida1911.ts
 *
 * Converte o texto do Project Gutenberg (pg62383.txt) – Bíblia Almeida 1911 –
 * para arquivos JSON usados pelo app Next.js.
 *
 * Saída:
 *   public/bible/index.json             — metadados dos livros
 *   public/bible/{slug}.json            — versículos por capítulo
 *
 * Uso:
 *   npx tsx scripts/build_bible_pt_almeida1911.ts
 */

import * as fs from "fs";
import * as path from "path";

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────

interface BookMeta {
  slug: string;
  name: string;
  abbrev: string;
  testament: "AT" | "NT";
  chapters: number;        // total detectado
  totalVerses: number;
}

// Cada livro no JSON de saída:
// chapters: string[][] → chapters[i] = versículos do capítulo (i+1), índice 0 = versículo 1
interface BookOutput {
  slug: string;
  name: string;
  abbrev: string;
  testament: "AT" | "NT";
  chapters: string[][];
}

// ─────────────────────────────────────────────────────────────────────────────
// Mapeamento: cabeçalho exato do Gutenberg → info do livro
// ─────────────────────────────────────────────────────────────────────────────

interface BookDef {
  header: string;   // texto exato (uppercase) como aparece no .txt
  slug: string;
  name: string;
  abbrev: string;
  testament: "AT" | "NT";
}

const BOOK_DEFS: BookDef[] = [
  { header: "O PRIMEIRO LIVRO DE MOYSÉS CHAMADO GENESIS.",        slug: "genesis",           name: "Gênesis",               abbrev: "gn",   testament: "AT" },
  { header: "O SEGUNDO LIVRO DE MOYSÉS CHAMADO EXODO.",           slug: "exodo",             name: "Êxodo",                 abbrev: "ex",   testament: "AT" },
  { header: "O TERCEIRO LIVRO DE MOYSÉS CHAMADO LEVITICO.",       slug: "levitico",          name: "Levítico",              abbrev: "lv",   testament: "AT" },
  { header: "O QUARTO LIVRO DE MOYSÉS CHAMADO NUMEROS.",          slug: "numeros",           name: "Números",               abbrev: "nm",   testament: "AT" },
  { header: "O QUINTO LIVRO DE MOYSÉS CHAMADO DEUTERONOMIO.",     slug: "deuteronomio",      name: "Deuteronômio",          abbrev: "dt",   testament: "AT" },
  { header: "O LIVRO DE JOSUÉ.",                                   slug: "josue",             name: "Josué",                 abbrev: "js",   testament: "AT" },
  { header: "O LIVRO DOS JUIZES.",                                 slug: "juizes",            name: "Juízes",                abbrev: "jz",   testament: "AT" },
  { header: "O LIVRO DE RUTH.",                                    slug: "rute",              name: "Rute",                  abbrev: "rt",   testament: "AT" },
  { header: "O PRIMEIRO LIVRO DE SAMUEL.",                        slug: "1samuel",           name: "1 Samuel",              abbrev: "1sm",  testament: "AT" },
  { header: "O SEGUNDO LIVRO DE SAMUEL.",                         slug: "2samuel",           name: "2 Samuel",              abbrev: "2sm",  testament: "AT" },
  { header: "O PRIMEIRO LIVRO DOS REIS.",                         slug: "1reis",             name: "1 Reis",                abbrev: "1rs",  testament: "AT" },
  { header: "O SEGUNDO LIVRO DOS REIS.",                          slug: "2reis",             name: "2 Reis",                abbrev: "2rs",  testament: "AT" },
  { header: "O PRIMEIRO LIVRO DAS CHRONICAS.",                    slug: "1cronicas",         name: "1 Crônicas",            abbrev: "1cr",  testament: "AT" },
  { header: "O SEGUNDO LIVRO DAS CHRONICAS.",                     slug: "2cronicas",         name: "2 Crônicas",            abbrev: "2cr",  testament: "AT" },
  { header: "O LIVRO DE ESDRAS.",                                  slug: "esdras",            name: "Esdras",                abbrev: "ed",   testament: "AT" },
  { header: "O LIVRO DE NEHEMIAS.",                               slug: "neemias",           name: "Neemias",               abbrev: "ne",   testament: "AT" },
  { header: "O LIVRO DE ESTHER.",                                  slug: "ester",             name: "Ester",                 abbrev: "et",   testament: "AT" },
  { header: "[MT] O LIVRO DE JOB.",                               slug: "jo",                name: "Jó",                    abbrev: "jó",   testament: "AT" },
  { header: "O LIVRO DOS PSALMOS.",                               slug: "salmos",            name: "Salmos",                abbrev: "sl",   testament: "AT" },
  { header: "O LIVRO DOS PROVERBIOS.",                            slug: "proverbios",        name: "Provérbios",            abbrev: "pv",   testament: "AT" },
  { header: "O PREGADOR.",                                         slug: "eclesiastes",       name: "Eclesiastes",           abbrev: "ec",   testament: "AT" },
  { header: "O CANTICO DOS CANTICOS.",                            slug: "cantares",          name: "Cantares",              abbrev: "ct",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA ISAIAS.",                        slug: "isaias",            name: "Isaías",                abbrev: "is",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA JEREMIAS.",                      slug: "jeremias",          name: "Jeremias",              abbrev: "jr",   testament: "AT" },
  { header: "AS LAMENTAÇÕES DE JEREMIAS.",                        slug: "lamentacoes",       name: "Lamentações",           abbrev: "lm",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA EZEQUIEL.",                      slug: "ezequiel",          name: "Ezequiel",              abbrev: "ez",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA DANIEL.",                        slug: "daniel",            name: "Daniel",                abbrev: "dn",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA OSEIAS.",                        slug: "oseias",            name: "Oséias",                abbrev: "os",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA JOEL.",                          slug: "joel",              name: "Joel",                  abbrev: "jl",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA AMOS.",                          slug: "amos",              name: "Amós",                  abbrev: "am",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA ABDIAS.",                        slug: "obadias",           name: "Obadias",               abbrev: "ob",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA JONAS.",                         slug: "jonas",             name: "Jonas",                 abbrev: "jn",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA MIQUEIAS.",                      slug: "miqueias",          name: "Miquéias",              abbrev: "mq",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA NAUM.",                          slug: "naum",              name: "Naum",                  abbrev: "na",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA HABACUQUE.",                     slug: "habacuque",         name: "Habacuque",             abbrev: "hc",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA SOFONIAS.",                      slug: "sofonias",          name: "Sofonias",              abbrev: "sf",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA AGGEU.",                         slug: "ageu",              name: "Ageu",                  abbrev: "ag",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA ZACHARIAS.",                     slug: "zacarias",          name: "Zacarias",              abbrev: "zc",   testament: "AT" },
  { header: "O LIVRO DO PROPHETA MALAQUIAS.",                     slug: "malaquias",         name: "Malaquias",             abbrev: "ml",   testament: "AT" },
  // NT
  { header: "O SANCTO EVANGELHO SEGUNDO S. MATTHEUS.",            slug: "mateus",            name: "Mateus",                abbrev: "mt",   testament: "NT" },
  { header: "O SANCTO EVANGELHO SEGUNDO S. MARCOS.",              slug: "marcos",            name: "Marcos",                abbrev: "mc",   testament: "NT" },
  { header: "O SANCTO EVANGELHO SEGUNDO S. LUCAS.",               slug: "lucas",             name: "Lucas",                 abbrev: "lc",   testament: "NT" },
  { header: "O SANCTO EVANGELHO SEGUNDO S. JOÃO.",                slug: "joao",              name: "João",                  abbrev: "jo",   testament: "NT" },
  { header: "O LIVRO DOS ACTOS DOS APOSTOLOS.",                   slug: "atos",              name: "Atos",                  abbrev: "at",   testament: "NT" },
  { header: "EPISTOLA DO APOSTOLO S. PAULO AOS ROMANOS.",         slug: "romanos",           name: "Romanos",               abbrev: "rm",   testament: "NT" },
  { header: "PRIMEIRA EPISTOLA DO APOSTOLO S. PAULO AOS CORINTHIOS.", slug: "1corintios",   name: "1 Coríntios",           abbrev: "1co",  testament: "NT" },
  { header: "SEGUNDA EPISTOLA DO APOSTOLO S. PAULO AOS CORINTHIOS.", slug: "2corintios",    name: "2 Coríntios",           abbrev: "2co",  testament: "NT" },
  { header: "EPISTOLA DO APOSTOLO S. PAULO AOS GALATAS.",         slug: "galatas",           name: "Gálatas",               abbrev: "gl",   testament: "NT" },
  { header: "EPISTOLA DO APOSTOLO S. PAULO AOS EPHESIOS.",        slug: "efesios",           name: "Efésios",               abbrev: "ef",   testament: "NT" },
  { header: "EPISTOLA DO APOSTOLO S. PAULO AOS PHILIPPENSES.",    slug: "filipenses",        name: "Filipenses",            abbrev: "fp",   testament: "NT" },
  { header: "EPISTOLA DO APOSTOLO S. PAULO AOS COLOSSENSES.",     slug: "colossenses",       name: "Colossenses",           abbrev: "cl",   testament: "NT" },
  { header: "PRIMEIRA EPISTOLA DO APOSTOLO S. PAULO AOS THESSALONICENSES.", slug: "1tessalonicenses", name: "1 Tessalonicenses", abbrev: "1ts", testament: "NT" },
  { header: "SEGUNDA EPISTOLA DO APOSTOLO S. PAULO AOS THESSALONICENSES.", slug: "2tessalonicenses", name: "2 Tessalonicenses", abbrev: "2ts", testament: "NT" },
  { header: "PRIMEIRA EPISTOLA DO APOSTOLO S. PAULO A TIMOTHEO.", slug: "1timoteo",          name: "1 Timóteo",             abbrev: "1tm",  testament: "NT" },
  { header: "SEGUNDA EPISTOLA DO APOSTOLO S. PAULO A TIMOTHEO.",  slug: "2timoteo",          name: "2 Timóteo",             abbrev: "2tm",  testament: "NT" },
  { header: "EPISTOLA DO APOSTOLO S. PAULO A TITO.",              slug: "tito",              name: "Tito",                  abbrev: "tt",   testament: "NT" },
  { header: "EPISTOLA DO APOSTOLO S. PAULO A PHILEMON.",          slug: "filemom",           name: "Filemom",               abbrev: "fm",   testament: "NT" },
  { header: "EPISTOLA DO APOSTOLO S. PAULO AOS HEBREOS.",         slug: "hebreus",           name: "Hebreus",               abbrev: "hb",   testament: "NT" },
  { header: "EPISTOLA CATHOLICA DO APOSTOLO S. THIAGO.",          slug: "tiago",             name: "Tiago",                 abbrev: "tg",   testament: "NT" },
  { header: "PRIMEIRA EPISTOLA CATHOLICA DO APOSTOLO S. PEDRO.",  slug: "1pedro",            name: "1 Pedro",               abbrev: "1pe",  testament: "NT" },
  { header: "SEGUNDA EPISTOLA CATHOLICA DO APOSTOLO S. PEDRO.",   slug: "2pedro",            name: "2 Pedro",               abbrev: "2pe",  testament: "NT" },
  { header: "PRIMEIRA EPISTOLA CATHOLICA DO APOSTOLO S. JOÃO.",   slug: "1joao",             name: "1 João",                abbrev: "1jo",  testament: "NT" },
  { header: "SEGUNDA EPISTOLA CATHOLICA DO APOSTOLO S. JOÃO.",    slug: "2joao",             name: "2 João",                abbrev: "2jo",  testament: "NT" },
  { header: "TERCEIRA EPISTOLA CATHOLICA DO APOSTOLO S. JOÃO.",   slug: "3joao",             name: "3 João",                abbrev: "3jo",  testament: "NT" },
  { header: "EPISTOLA CATHOLICA DO APOSTOLO S. JUDAS.",           slug: "judas",             name: "Judas",                 abbrev: "jd",   testament: "NT" },
  { header: "O APOCALYPSE DO APOSTOLO S. JOÃO.",                  slug: "apocalipse",        name: "Apocalipse",            abbrev: "ap",   testament: "NT" },
];

const HEADER_TO_BOOK = new Map<string, BookDef>();
for (const b of BOOK_DEFS) {
  HEADER_TO_BOOK.set(b.header.trim().toUpperCase(), b);
}

// ─────────────────────────────────────────────────────────────────────────────
// Limpeza do texto do versículo
// ─────────────────────────────────────────────────────────────────────────────

function cleanVerse(text: string): string {
  return text
    .replace(/\[[\dA-Z]+\]/g, "")   // remove marcadores de notas [1] [A] [BC]
    .replace(/_([^_]+)_/g, "$1")    // remove itálico _palavra_
    .replace(/\s+/g, " ")
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Parser principal
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formato Gutenberg Almeida 1911:
 *
 * - Cabeçalho do livro: linha UPPERCASE isolada (ex: "O LIVRO DE JOSUÉ.")
 * - Capítulo: após seção de notas de rodapé + linha(s) em branco (+ opcionais _italic_ e [data]),
 *   a primeira linha numerada "N texto..." é o capítulo N, versículo 1.
 * - Versículo: linha iniciando com "N " onde N é número do versículo.
 * - Nota de rodapé (fim de capítulo): linha que começa com "[N]" onde N = dígito ou letra.
 * - Continuação de versículo: linha sem número no início, parte do versículo anterior.
 */
function parseBooks(lines: string[]): Map<string, BookOutput> {
  const books = new Map<string, BookOutput>();

  let currentBook: BookDef | null = null;
  let currentBookLines: string[] = [];

  // Divide o arquivo em seções por livro
  for (const line of lines) {
    const trimmed = line.trim();
    const upper = trimmed.toUpperCase();

    // Detecta cabeçalho de livro
    const bookDef = HEADER_TO_BOOK.get(upper);
    if (bookDef) {
      if (currentBook && currentBookLines.length > 0) {
        const parsed = parseBook(currentBook, currentBookLines);
        books.set(currentBook.slug, parsed);
      }
      currentBook = bookDef;
      currentBookLines = [];
      continue;
    }

    if (currentBook) {
      currentBookLines.push(line);
    }
  }

  // Último livro
  if (currentBook && currentBookLines.length > 0) {
    const parsed = parseBook(currentBook, currentBookLines);
    books.set(currentBook.slug, parsed);
  }

  return books;
}

const RE_VERSE_START = /^(\d+)\s+(.+)/;
const RE_FOOTNOTE_DEF = /^\[[\dA-Za-z]+\]\s+\S/; // "[1] Pro. 8.23..." – notas de rodapé
const RE_SKIP_LINE = /^_.*_$|^\[Antes de Christo\|^\[Anno\|^Nota|^PROJECT GUTENBERG|^CAPITULO/i;
const RE_ALL_UPPER = /^[A-ZÁÉÍÓÚÃÕÂÊÔÀÇÜÑ\s\.\,\:\;\!\?\(\)'"\/\-\[\]]+$/;

function parseBook(def: BookDef, lines: string[]): BookOutput {
  const chapters: string[][] = [];
  let currentChapterVerses: string[] = [];
  let currentChapter = 0;
  let lastVerseNum = 0;
  let pendingVerse = "";

  // Estado: detectar fim de capítulo via notas de rodapé
  let inFootnotes = false;
  let afterBreak = true; // inicia aguardando primeiro capítulo

  const flushVerse = () => {
    if (pendingVerse !== "") {
      currentChapterVerses.push(cleanVerse(pendingVerse));
      pendingVerse = "";
    }
  };

  const startChapter = (n: number, firstVerseText: string) => {
    flushVerse();
    if (currentChapter > 0) {
      chapters.push([...currentChapterVerses]);
    }
    currentChapterVerses = [];
    currentChapter = n;
    lastVerseNum = 1;
    pendingVerse = firstVerseText;
    inFootnotes = false;
    afterBreak = false;
  };

  for (const rawLine of lines) {
    const line = rawLine
      .replace(/\uFEFF/g, "")
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trimEnd();

    const trimmed = line.trim();

    // Linha em branco
    if (trimmed === "") {
      if (inFootnotes) {
        inFootnotes = false;
        afterBreak = true;
      }
      continue;
    }

    // Linha de nota de rodapé (definição, não inline)
    if (RE_FOOTNOTE_DEF.test(trimmed)) {
      flushVerse();
      inFootnotes = true;
      continue;
    }

    // Linhas a ignorar: _descritivo_, [Antes de Christo ...], cabeçalhos genéricos
    if (
      /^_.*_\s*$/.test(trimmed) ||
      /^\[Antes de Christo/.test(trimmed) ||
      /^\[Anno/.test(trimmed) ||
      /^\[A.C\./.test(trimmed) ||
      /^\[D.C\./.test(trimmed) ||
      /^Nota do transcritor/.test(trimmed) ||
      /^VELHO TESTAMENTO/.test(trimmed) ||
      /^NOVO TESTAMENTO/.test(trimmed) ||
      /^Abreviaturas/.test(trimmed) ||
      /^Evangelho de/.test(trimmed) ||
      // Linha toda em caps que não é versículo (subcabeçalhos internos)
      (RE_ALL_UPPER.test(trimmed) && trimmed.length > 4 && !/^\d/.test(trimmed))
    ) {
      continue;
    }

    // Linha numerada: potencial início de capítulo ou versículo
    const vm = RE_VERSE_START.exec(trimmed);
    if (vm) {
      const n = parseInt(vm[1], 10);
      const text = vm[2];

      if (afterBreak) {
        // Primeira linha numerada após quebra de capítulo → novo capítulo N, versículo 1
        startChapter(n, text);
        continue;
      }

      // Tentamos identificar: versículo N da sequência normal?
      if (n === lastVerseNum + 1) {
        // Próximo versículo esperado
        flushVerse();
        pendingVerse = text;
        lastVerseNum = n;
        continue;
      }

      // Mesmo número = pode ser capítulo seguinte (ex: cap.2 vers.1 seguido de cap.2 vers.2)
      // Heurística: se n == currentChapter + 1 e n < lastVerseNum, é novo capítulo
      if (n === currentChapter + 1 && n < lastVerseNum) {
        startChapter(n, text);
        continue;
      }

      // n == 1: reset de versículo → novo capítulo não marcado por notas
      if (n === 1 && lastVerseNum > 1) {
        flushVerse();
        chapters.push([...currentChapterVerses]);
        currentChapterVerses = [];
        currentChapter++;
        lastVerseNum = 1;
        pendingVerse = text;
        continue;
      }

      // Versículo fora de sequência mas ainda razoável (pular alguns versículos)
      if (n > lastVerseNum && n <= lastVerseNum + 5) {
        flushVerse();
        pendingVerse = text;
        lastVerseNum = n;
        continue;
      }

      // Número alto que parece início de capítulo após lacuna (ex: Salmos tem muitos)
      if (n > lastVerseNum + 5 || (afterBreak && n > 1)) {
        startChapter(n, text);
        continue;
      }

      // Fallback: trata como continuação do versículo atual
      if (pendingVerse !== "") {
        pendingVerse += " " + trimmed;
      }
      continue;
    }

    // Linha sem número: continuação de versículo anterior
    if (!afterBreak && !inFootnotes && pendingVerse !== "") {
      pendingVerse += " " + trimmed;
    }
  }

  // Finaliza último versículo e capítulo
  flushVerse();
  if (currentChapterVerses.length > 0) {
    chapters.push([...currentChapterVerses]);
  }

  return {
    slug: def.slug,
    name: def.name,
    abbrev: def.abbrev,
    testament: def.testament,
    chapters,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const root = path.resolve(__dirname, "..");
  const srcFile = path.join(root, "scripts", "source", "almeida1911.txt");
  const outDir = path.join(root, "public", "bible");

  if (!fs.existsSync(srcFile)) {
    console.error(`\n❌ Arquivo fonte não encontrado: ${srcFile}`);
    console.error("   Baixe o arquivo de: https://www.gutenberg.org/cache/epub/62383/pg62383.txt");
    console.error("   e salve em scripts/source/almeida1911.txt\n");
    process.exit(1);
  }

  console.log(`📖 Lendo: ${srcFile}`);
  const raw = fs.readFileSync(srcFile, "utf-8");
  const lines = raw.split(/\r?\n/);
  console.log(`   ${raw.length.toLocaleString()} chars | ${lines.length.toLocaleString()} linhas`);

  console.log("\n🔍 Parsing...");
  const books = parseBooks(lines);

  fs.mkdirSync(outDir, { recursive: true });

  const index: BookMeta[] = [];
  let totalV = 0;
  let warnings = 0;

  // Escreve cada livro
  for (const def of BOOK_DEFS) {
    const book = books.get(def.slug);
    if (!book) {
      console.warn(`  ⚠️  Livro não encontrado: ${def.name} (${def.slug})`);
      warnings++;
      continue;
    }

    // Valida
    if (book.chapters.length === 0) {
      console.warn(`  ⚠️  ${def.name}: 0 capítulos extraídos`);
      warnings++;
    }

    const totalVerses = book.chapters.reduce((s, ch) => s + ch.length, 0);

    // Salva JSON compacto (sem espaços) para minimizar tamanho
    const outFile = path.join(outDir, `${def.slug}.json`);
    fs.writeFileSync(outFile, JSON.stringify(book), "utf-8");

    index.push({
      slug: def.slug,
      name: def.name,
      abbrev: def.abbrev,
      testament: def.testament,
      chapters: book.chapters.length,
      totalVerses,
    });

    totalV += totalVerses;
    const chOk = book.chapters.length > 0 ? "✓" : "⚠";
    console.log(`  ${chOk} ${def.name.padEnd(24)} ${String(book.chapters.length).padStart(3)} caps | ${String(totalVerses).padStart(5)} vers`);
  }

  // index.json
  const indexFile = path.join(outDir, "index.json");
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2), "utf-8");

  console.log(`\n✅ ${index.length} livros | ${index.reduce((s, b) => s + b.chapters, 0)} capítulos | ${totalV.toLocaleString()} versículos`);
  console.log(`📁 Saída: ${outDir}`);

  if (totalV < 25000) {
    console.warn(`\n⚠️  Total de versículos baixo (${totalV}). Esperado ~31.102.`);
    console.warn("   Verifique os cabeçalhos dos livros no arquivo fonte.");
  }

  if (warnings > 0) {
    console.warn(`\n⚠️  ${warnings} aviso(s) — verifique os livros marcados acima.`);
  }
}

main();
