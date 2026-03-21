/**
 * Planos de Leitura Bíblica
 * 3 planos: 21 dias (NT highlights), 30 dias (Sabedoria), 90 dias (NT completo)
 */

export interface ChapterReading {
  bookId: string;   // matches BibleBook.id (e.g., "joao")
  bookName: string; // nome em português
  chapter: number;
}

export interface PlanDay {
  day: number;
  title: string;
  readings: ChapterReading[];
  theme?: string;
}

export interface ReadingPlan {
  id: 'nt21' | 'sabedoria30' | 'nt90' | 'paz7' | 'fe10' | 'inicio15';
  title: string;
  subtitle: string;
  description: string;
  duration: number;
  xpPerChapter: number;
  color: string;       // tailwind gradient class
  accentColor: string; // hex
  icon: string;
  days: PlanDay[];
}

// ──────────────────────────────────────────────────────────────────────────────
// PLANO 1 — 21 dias "Conheça Jesus"
// João + Atos + Romanos + Gálatas + Filipenses
// ──────────────────────────────────────────────────────────────────────────────
const PLAN_21_DAYS: PlanDay[] = [
  { day: 1,  title: "A Palavra se fez carne",      theme: "Encarnação",       readings: [{ bookId: "joao", bookName: "João", chapter: 1 }, { bookId: "joao", bookName: "João", chapter: 2 }, { bookId: "joao", bookName: "João", chapter: 3 }] },
  { day: 2,  title: "Água viva",                    theme: "Revelação",        readings: [{ bookId: "joao", bookName: "João", chapter: 4 }, { bookId: "joao", bookName: "João", chapter: 5 }, { bookId: "joao", bookName: "João", chapter: 6 }] },
  { day: 3,  title: "A luz do mundo",               theme: "Identidade",       readings: [{ bookId: "joao", bookName: "João", chapter: 7 }, { bookId: "joao", bookName: "João", chapter: 8 }, { bookId: "joao", bookName: "João", chapter: 9 }] },
  { day: 4,  title: "O Bom Pastor",                 theme: "Cuidado",          readings: [{ bookId: "joao", bookName: "João", chapter: 10 }, { bookId: "joao", bookName: "João", chapter: 11 }, { bookId: "joao", bookName: "João", chapter: 12 }] },
  { day: 5,  title: "O mandamento do amor",         theme: "Amor",             readings: [{ bookId: "joao", bookName: "João", chapter: 13 }, { bookId: "joao", bookName: "João", chapter: 14 }, { bookId: "joao", bookName: "João", chapter: 15 }] },
  { day: 6,  title: "O Consolador vem",             theme: "Espírito Santo",   readings: [{ bookId: "joao", bookName: "João", chapter: 16 }, { bookId: "joao", bookName: "João", chapter: 17 }, { bookId: "joao", bookName: "João", chapter: 18 }] },
  { day: 7,  title: "Ressuscitou!",                 theme: "Ressurreição",     readings: [{ bookId: "joao", bookName: "João", chapter: 19 }, { bookId: "joao", bookName: "João", chapter: 20 }, { bookId: "joao", bookName: "João", chapter: 21 }] },
  { day: 8,  title: "O Espírito desce",             theme: "Pentecostes",      readings: [{ bookId: "atos", bookName: "Atos", chapter: 1 }, { bookId: "atos", bookName: "Atos", chapter: 2 }, { bookId: "atos", bookName: "Atos", chapter: 3 }] },
  { day: 9,  title: "A igreja cresce",              theme: "Comunidade",       readings: [{ bookId: "atos", bookName: "Atos", chapter: 4 }, { bookId: "atos", bookName: "Atos", chapter: 5 }, { bookId: "atos", bookName: "Atos", chapter: 6 }] },
  { day: 10, title: "Estêvão e a perseguição",      theme: "Martírio",         readings: [{ bookId: "atos", bookName: "Atos", chapter: 7 }, { bookId: "atos", bookName: "Atos", chapter: 8 }, { bookId: "atos", bookName: "Atos", chapter: 9 }] },
  { day: 11, title: "A missão se expande",          theme: "Missão",           readings: [{ bookId: "atos", bookName: "Atos", chapter: 10 }, { bookId: "atos", bookName: "Atos", chapter: 11 }, { bookId: "atos", bookName: "Atos", chapter: 12 }] },
  { day: 12, title: "Primeira viagem missionária",  theme: "Evangelismo",      readings: [{ bookId: "atos", bookName: "Atos", chapter: 13 }, { bookId: "atos", bookName: "Atos", chapter: 14 }, { bookId: "atos", bookName: "Atos", chapter: 15 }] },
  { day: 13, title: "Paulo e Silas na prisão",      theme: "Perseverança",     readings: [{ bookId: "atos", bookName: "Atos", chapter: 16 }, { bookId: "atos", bookName: "Atos", chapter: 17 }, { bookId: "atos", bookName: "Atos", chapter: 18 }] },
  { day: 14, title: "Éfeso e o último retorno",     theme: "Despedida",        readings: [{ bookId: "atos", bookName: "Atos", chapter: 19 }, { bookId: "atos", bookName: "Atos", chapter: 20 }, { bookId: "atos", bookName: "Atos", chapter: 21 }] },
  { day: 15, title: "A justiça de Deus",            theme: "Graça",            readings: [{ bookId: "romanos", bookName: "Romanos", chapter: 1 }, { bookId: "romanos", bookName: "Romanos", chapter: 2 }, { bookId: "romanos", bookName: "Romanos", chapter: 3 }] },
  { day: 16, title: "Justificados pela fé",         theme: "Fé",               readings: [{ bookId: "romanos", bookName: "Romanos", chapter: 4 }, { bookId: "romanos", bookName: "Romanos", chapter: 5 }, { bookId: "romanos", bookName: "Romanos", chapter: 6 }] },
  { day: 17, title: "Nenhuma condenação",           theme: "Libertação",       readings: [{ bookId: "romanos", bookName: "Romanos", chapter: 7 }, { bookId: "romanos", bookName: "Romanos", chapter: 8 }] },
  { day: 18, title: "Israel e as nações",           theme: "Propósito",        readings: [{ bookId: "romanos", bookName: "Romanos", chapter: 9 }, { bookId: "romanos", bookName: "Romanos", chapter: 10 }, { bookId: "romanos", bookName: "Romanos", chapter: 11 }] },
  { day: 19, title: "Liberdade em Cristo",          theme: "Liberdade",        readings: [{ bookId: "galatas", bookName: "Gálatas", chapter: 1 }, { bookId: "galatas", bookName: "Gálatas", chapter: 2 }, { bookId: "galatas", bookName: "Gálatas", chapter: 3 }] },
  { day: 20, title: "Fruto do Espírito",            theme: "Caráter",          readings: [{ bookId: "galatas", bookName: "Gálatas", chapter: 4 }, { bookId: "galatas", bookName: "Gálatas", chapter: 5 }, { bookId: "galatas", bookName: "Gálatas", chapter: 6 }] },
  { day: 21, title: "Alegria em qualquer situação", theme: "Contentamento",    readings: [{ bookId: "filipenses", bookName: "Filipenses", chapter: 1 }, { bookId: "filipenses", bookName: "Filipenses", chapter: 2 }, { bookId: "filipenses", bookName: "Filipenses", chapter: 3 }, { bookId: "filipenses", bookName: "Filipenses", chapter: 4 }] },
];

// ──────────────────────────────────────────────────────────────────────────────
// PLANO 2 — 30 dias "Sabedoria Viva"
// Salmos selecionados + Provérbios + Eclesiastes + Tiago + 1 João
// ──────────────────────────────────────────────────────────────────────────────
const PLAN_30_DAYS: PlanDay[] = [
  { day: 1,  title: "Blessed is the man",           theme: "Fundamento",    readings: [{ bookId: "salmos", bookName: "Salmos", chapter: 1 }, { bookId: "salmos", bookName: "Salmos", chapter: 8 }, { bookId: "salmos", bookName: "Salmos", chapter: 19 }] },
  { day: 2,  title: "Meu pastor",                   theme: "Confiança",     readings: [{ bookId: "salmos", bookName: "Salmos", chapter: 22 }, { bookId: "salmos", bookName: "Salmos", chapter: 23 }, { bookId: "salmos", bookName: "Salmos", chapter: 27 }] },
  { day: 3,  title: "Cria em mim um coração puro",  theme: "Arrependimento",readings: [{ bookId: "salmos", bookName: "Salmos", chapter: 32 }, { bookId: "salmos", bookName: "Salmos", chapter: 34 }, { bookId: "salmos", bookName: "Salmos", chapter: 37 }] },
  { day: 4,  title: "Como o cervo anseia",          theme: "Sede de Deus",  readings: [{ bookId: "salmos", bookName: "Salmos", chapter: 42 }, { bookId: "salmos", bookName: "Salmos", chapter: 46 }, { bookId: "salmos", bookName: "Salmos", chapter: 51 }] },
  { day: 5,  title: "No deserto te busco",          theme: "Busca",         readings: [{ bookId: "salmos", bookName: "Salmos", chapter: 63 }, { bookId: "salmos", bookName: "Salmos", chapter: 73 }, { bookId: "salmos", bookName: "Salmos", chapter: 84 }] },
  { day: 6,  title: "Refúgio eterno",               theme: "Proteção",      readings: [{ bookId: "salmos", bookName: "Salmos", chapter: 90 }, { bookId: "salmos", bookName: "Salmos", chapter: 91 }, { bookId: "salmos", bookName: "Salmos", chapter: 95 }] },
  { day: 7,  title: "Benção da alma",               theme: "Gratidão",      readings: [{ bookId: "salmos", bookName: "Salmos", chapter: 100 }, { bookId: "salmos", bookName: "Salmos", chapter: 103 }, { bookId: "salmos", bookName: "Salmos", chapter: 107 }] },
  { day: 8,  title: "A Palavra nos guia",           theme: "Escrituras",    readings: [{ bookId: "salmos", bookName: "Salmos", chapter: 116 }, { bookId: "salmos", bookName: "Salmos", chapter: 119 }, { bookId: "salmos", bookName: "Salmos", chapter: 121 }] },
  { day: 9,  title: "Deus examina meu coração",     theme: "Intimidade",    readings: [{ bookId: "salmos", bookName: "Salmos", chapter: 127 }, { bookId: "salmos", bookName: "Salmos", chapter: 139 }, { bookId: "salmos", bookName: "Salmos", chapter: 150 }] },
  { day: 10, title: "Tema toda a terra",            theme: "Louvor",        readings: [{ bookId: "salmos", bookName: "Salmos", chapter: 143 }, { bookId: "salmos", bookName: "Salmos", chapter: 145 }, { bookId: "salmos", bookName: "Salmos", chapter: 130 }] },
  { day: 11, title: "O início da sabedoria",        theme: "Sabedoria",     readings: [{ bookId: "proverbios", bookName: "Provérbios", chapter: 1 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 2 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 3 }] },
  { day: 12, title: "Guarda teu coração",           theme: "Caráter",       readings: [{ bookId: "proverbios", bookName: "Provérbios", chapter: 4 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 5 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 6 }] },
  { day: 13, title: "Sabedoria clama nas ruas",     theme: "Discernimento", readings: [{ bookId: "proverbios", bookName: "Provérbios", chapter: 7 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 8 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 9 }] },
  { day: 14, title: "Palavras e ações",             theme: "Integridade",   readings: [{ bookId: "proverbios", bookName: "Provérbios", chapter: 10 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 11 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 12 }] },
  { day: 15, title: "O justo floresce",             theme: "Justiça",       readings: [{ bookId: "proverbios", bookName: "Provérbios", chapter: 13 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 14 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 15 }] },
  { day: 16, title: "Confia no Senhor",             theme: "Confiança",     readings: [{ bookId: "proverbios", bookName: "Provérbios", chapter: 16 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 17 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 18 }] },
  { day: 17, title: "O tolo e o sábio",             theme: "Escolhas",      readings: [{ bookId: "proverbios", bookName: "Provérbios", chapter: 19 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 20 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 21 }] },
  { day: 18, title: "Fama e riqueza passam",        theme: "Eternidade",    readings: [{ bookId: "proverbios", bookName: "Provérbios", chapter: 22 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 23 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 24 }] },
  { day: 19, title: "O rei justo",                  theme: "Liderança",     readings: [{ bookId: "proverbios", bookName: "Provérbios", chapter: 25 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 26 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 27 }] },
  { day: 20, title: "O homem íntegro",              theme: "Integridade",   readings: [{ bookId: "proverbios", bookName: "Provérbios", chapter: 28 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 29 }, { bookId: "proverbios", bookName: "Provérbios", chapter: 30 }] },
  { day: 21, title: "A mulher virtuosa",            theme: "Excelência",    readings: [{ bookId: "proverbios", bookName: "Provérbios", chapter: 31 }, { bookId: "eclesiastes", bookName: "Eclesiastes", chapter: 1 }, { bookId: "eclesiastes", bookName: "Eclesiastes", chapter: 2 }] },
  { day: 22, title: "Há tempo para tudo",           theme: "Tempo",         readings: [{ bookId: "eclesiastes", bookName: "Eclesiastes", chapter: 3 }, { bookId: "eclesiastes", bookName: "Eclesiastes", chapter: 4 }, { bookId: "eclesiastes", bookName: "Eclesiastes", chapter: 5 }] },
  { day: 23, title: "A vaidade das riquezas",       theme: "Valores",       readings: [{ bookId: "eclesiastes", bookName: "Eclesiastes", chapter: 6 }, { bookId: "eclesiastes", bookName: "Eclesiastes", chapter: 7 }, { bookId: "eclesiastes", bookName: "Eclesiastes", chapter: 8 }] },
  { day: 24, title: "Vive com alegria",             theme: "Alegria",       readings: [{ bookId: "eclesiastes", bookName: "Eclesiastes", chapter: 9 }, { bookId: "eclesiastes", bookName: "Eclesiastes", chapter: 10 }, { bookId: "eclesiastes", bookName: "Eclesiastes", chapter: 11 }] },
  { day: 25, title: "Tema a Deus, o fim de tudo",   theme: "Reverência",    readings: [{ bookId: "eclesiastes", bookName: "Eclesiastes", chapter: 12 }, { bookId: "tiago", bookName: "Tiago", chapter: 1 }, { bookId: "tiago", bookName: "Tiago", chapter: 2 }] },
  { day: 26, title: "Fé sem obras está morta",      theme: "Prática",       readings: [{ bookId: "tiago", bookName: "Tiago", chapter: 3 }, { bookId: "tiago", bookName: "Tiago", chapter: 4 }, { bookId: "tiago", bookName: "Tiago", chapter: 5 }] },
  { day: 27, title: "Pedra viva, povo eleito",      theme: "Identidade",    readings: [{ bookId: "1pedro", bookName: "1 Pedro", chapter: 1 }, { bookId: "1pedro", bookName: "1 Pedro", chapter: 2 }, { bookId: "1pedro", bookName: "1 Pedro", chapter: 3 }] },
  { day: 28, title: "Firme na fé",                  theme: "Perseverança",  readings: [{ bookId: "1pedro", bookName: "1 Pedro", chapter: 4 }, { bookId: "1pedro", bookName: "1 Pedro", chapter: 5 }, { bookId: "2pedro", bookName: "2 Pedro", chapter: 1 }] },
  { day: 29, title: "Guardem-se dos falsos mestres",theme: "Discernimento", readings: [{ bookId: "2pedro", bookName: "2 Pedro", chapter: 2 }, { bookId: "2pedro", bookName: "2 Pedro", chapter: 3 }, { bookId: "judas", bookName: "Judas", chapter: 1 }] },
  { day: 30, title: "Deus é amor",                  theme: "Amor perfeito", readings: [{ bookId: "1joao", bookName: "1 João", chapter: 1 }, { bookId: "1joao", bookName: "1 João", chapter: 2 }, { bookId: "1joao", bookName: "1 João", chapter: 3 }] },
];

// ──────────────────────────────────────────────────────────────────────────────
// PLANO 3 — 90 dias "Novo Testamento Completo"
// 260 capítulos do NT lidos em 90 dias (~3 por dia)
// ──────────────────────────────────────────────────────────────────────────────
function generateNT90Days(): PlanDay[] {
  const NT_SEQUENCE: { bookId: string; bookName: string; chapters: number }[] = [
    { bookId: "mateus",            bookName: "Mateus",            chapters: 28 },
    { bookId: "marcos",            bookName: "Marcos",            chapters: 16 },
    { bookId: "lucas",             bookName: "Lucas",             chapters: 24 },
    { bookId: "joao",              bookName: "João",              chapters: 21 },
    { bookId: "atos",              bookName: "Atos",              chapters: 28 },
    { bookId: "romanos",           bookName: "Romanos",           chapters: 16 },
    { bookId: "1corintios",        bookName: "1 Coríntios",       chapters: 16 },
    { bookId: "2corintios",        bookName: "2 Coríntios",       chapters: 13 },
    { bookId: "galatas",           bookName: "Gálatas",           chapters: 6  },
    { bookId: "efesios",           bookName: "Efésios",           chapters: 6  },
    { bookId: "filipenses",        bookName: "Filipenses",        chapters: 4  },
    { bookId: "colossenses",       bookName: "Colossenses",       chapters: 4  },
    { bookId: "1tessalonicenses",  bookName: "1 Tessalonicenses", chapters: 5  },
    { bookId: "2tessalonicenses",  bookName: "2 Tessalonicenses", chapters: 3  },
    { bookId: "1timoteo",          bookName: "1 Timóteo",         chapters: 6  },
    { bookId: "2timoteo",          bookName: "2 Timóteo",         chapters: 4  },
    { bookId: "tito",              bookName: "Tito",              chapters: 3  },
    { bookId: "filemom",           bookName: "Filemom",           chapters: 1  },
    { bookId: "hebreus",           bookName: "Hebreus",           chapters: 13 },
    { bookId: "tiago",             bookName: "Tiago",             chapters: 5  },
    { bookId: "1pedro",            bookName: "1 Pedro",           chapters: 5  },
    { bookId: "2pedro",            bookName: "2 Pedro",           chapters: 3  },
    { bookId: "1joao",             bookName: "1 João",            chapters: 5  },
    { bookId: "2joao",             bookName: "2 João",            chapters: 1  },
    { bookId: "3joao",             bookName: "3 João",            chapters: 1  },
    { bookId: "judas",             bookName: "Judas",             chapters: 1  },
    { bookId: "apocalipse",        bookName: "Apocalipse",        chapters: 22 },
  ];

  // Flatten all chapters in order
  const allChapters: ChapterReading[] = [];
  for (const book of NT_SEQUENCE) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      allChapters.push({ bookId: book.bookId, bookName: book.bookName, chapter: ch });
    }
  }

  // Distribute into 90 days (3 per day mostly, some days get 2)
  const days: PlanDay[] = [];
  let chapterIdx = 0;
  for (let day = 1; day <= 90; day++) {
    const remaining = allChapters.length - chapterIdx;
    const daysLeft = 90 - day + 1;
    const perDay = Math.ceil(remaining / daysLeft);
    const dayChapters = allChapters.slice(chapterIdx, chapterIdx + perDay);
    chapterIdx += perDay;

    const firstBook = dayChapters[0]?.bookName ?? "";
    const lastBook = dayChapters[dayChapters.length - 1]?.bookName ?? "";
    const title = firstBook === lastBook
      ? `${firstBook} ${dayChapters.map(c => c.chapter).join(", ")}`
      : `${firstBook} → ${lastBook}`;

    days.push({ day, title, readings: dayChapters });
  }

  return days;
}

// ──────────────────────────────────────────────────────────────────────────────
// PLANO 4 — 7 dias "Salmos & Paz Interior"
// Versículos de conforto, fé e tranquilidade
// ──────────────────────────────────────────────────────────────────────────────
const PLAN_PAZ_7_DAYS: PlanDay[] = [
  { day: 1,  title: "O Senhor é meu pastor",                theme: "Confiança",         readings: [{ bookId: "salmos",     bookName: "Salmos",     chapter: 23 }] },
  { day: 2,  title: "A paz que excede o entendimento",       theme: "Paz",               readings: [{ bookId: "filipenses", bookName: "Filipenses", chapter: 4  }] },
  { day: 3,  title: "Deus é nosso refúgio",                  theme: "Proteção",          readings: [{ bookId: "salmos",     bookName: "Salmos",     chapter: 46 }] },
  { day: 4,  title: "Não se turbe o vosso coração",          theme: "Serenidade",        readings: [{ bookId: "joao",       bookName: "João",       chapter: 14 }] },
  { day: 5,  title: "Renovar as forças como águias",         theme: "Renovação",         readings: [{ bookId: "isaias",     bookName: "Isaías",     chapter: 40 }] },
  { day: 6,  title: "Debaixo da sombra do Altíssimo",        theme: "Refúgio",           readings: [{ bookId: "salmos",     bookName: "Salmos",     chapter: 91 }] },
  { day: 7,  title: "Nada nos separará do amor de Deus",     theme: "Amor de Deus",      readings: [{ bookId: "romanos",    bookName: "Romanos",    chapter: 8  }] },
];

// ──────────────────────────────────────────────────────────────────────────────
// PLANO 5 — 10 dias "Fé que Move Montanhas"
// Versículos sobre fé, oração e confiança em Deus
// ──────────────────────────────────────────────────────────────────────────────
const PLAN_FE_10_DAYS: PlanDay[] = [
  { day: 1,  title: "A definição da fé",                    theme: "Fé",                readings: [{ bookId: "hebreus",    bookName: "Hebreus",    chapter: 11 }] },
  { day: 2,  title: "Pedi e recebereis",                    theme: "Oração",            readings: [{ bookId: "marcos",     bookName: "Marcos",     chapter: 11 }] },
  { day: 3,  title: "A fé que persevera",                   theme: "Perseverança",      readings: [{ bookId: "tiago",      bookName: "Tiago",      chapter: 1  }] },
  { day: 4,  title: "O Pai Nosso — como orar",              theme: "Oração",            readings: [{ bookId: "mateus",     bookName: "Mateus",     chapter: 6  }] },
  { day: 5,  title: "A fé vem pelo ouvir",                  theme: "Palavra",           readings: [{ bookId: "romanos",    bookName: "Romanos",    chapter: 10 }, { bookId: "josue", bookName: "Josué", chapter: 1 }] },
  { day: 6,  title: "Fé diante do fogo",                    theme: "Coragem",           readings: [{ bookId: "daniel",     bookName: "Daniel",     chapter: 3  }] },
  { day: 7,  title: "O amor como fundamento da fé",         theme: "Amor",              readings: [{ bookId: "1corintios", bookName: "1 Coríntios", chapter: 13 }] },
  { day: 8,  title: "Confiar e descansar em Deus",          theme: "Descanso",          readings: [{ bookId: "salmos",     bookName: "Salmos",     chapter: 37 }] },
  { day: 9,  title: "Pedro anda sobre as águas",            theme: "Fé em ação",        readings: [{ bookId: "mateus",     bookName: "Mateus",     chapter: 14 }] },
  { day: 10, title: "A armadura de Deus",                   theme: "Batalha espiritual",readings: [{ bookId: "efesios",    bookName: "Efésios",    chapter: 6  }] },
];

// ──────────────────────────────────────────────────────────────────────────────
// PLANO 6 — 15 dias "Começando com Deus"
// Panorama essencial da Bíblia para novos crentes ou quem quer recomeçar
// ──────────────────────────────────────────────────────────────────────────────
const PLAN_INICIO_15_DAYS: PlanDay[] = [
  { day: 1,  title: "No princípio — a criação",              theme: "Criação",           readings: [{ bookId: "genesis",    bookName: "Gênesis",    chapter: 1  }, { bookId: "genesis",    bookName: "Gênesis",    chapter: 2  }] },
  { day: 2,  title: "A queda",                               theme: "Salvação",          readings: [{ bookId: "genesis",    bookName: "Gênesis",    chapter: 3  }] },
  { day: 3,  title: "A grandeza de Deus revelada",           theme: "Louvor",            readings: [{ bookId: "salmos",     bookName: "Salmos",     chapter: 8  }, { bookId: "salmos",     bookName: "Salmos",     chapter: 19 }] },
  { day: 4,  title: "O começo da sabedoria",                 theme: "Sabedoria",         readings: [{ bookId: "proverbios", bookName: "Provérbios", chapter: 1  }, { bookId: "proverbios", bookName: "Provérbios", chapter: 3  }] },
  { day: 5,  title: "O Servo Sofredor — profecia de Jesus",  theme: "Profecia",          readings: [{ bookId: "isaias",     bookName: "Isaías",     chapter: 53 }] },
  { day: 6,  title: "O nascimento de Jesus",                 theme: "Encarnação",        readings: [{ bookId: "lucas",      bookName: "Lucas",      chapter: 1  }, { bookId: "lucas",      bookName: "Lucas",      chapter: 2  }] },
  { day: 7,  title: "Nascer de novo — João 3:16",            theme: "Salvação",          readings: [{ bookId: "joao",       bookName: "João",       chapter: 3  }] },
  { day: 8,  title: "As Bem-aventuranças",                   theme: "Reino de Deus",     readings: [{ bookId: "mateus",     bookName: "Mateus",     chapter: 5  }] },
  { day: 9,  title: "Sal, luz e o bom samaritano",           theme: "Amor ao próximo",   readings: [{ bookId: "lucas",      bookName: "Lucas",      chapter: 10 }] },
  { day: 10, title: "A ressurreição de Lázaro",              theme: "Vida eterna",       readings: [{ bookId: "joao",       bookName: "João",       chapter: 11 }] },
  { day: 11, title: "A paixão de Cristo",                    theme: "Cruz",              readings: [{ bookId: "lucas",      bookName: "Lucas",      chapter: 22 }, { bookId: "lucas",      bookName: "Lucas",      chapter: 23 }] },
  { day: 12, title: "A ressurreição",                        theme: "Ressurreição",      readings: [{ bookId: "lucas",      bookName: "Lucas",      chapter: 24 }, { bookId: "joao",       bookName: "João",       chapter: 20 }] },
  { day: 13, title: "O nascimento da Igreja",                theme: "Igreja",            readings: [{ bookId: "atos",       bookName: "Atos",       chapter: 2  }] },
  { day: 14, title: "A justificação pela fé",                theme: "Graça",             readings: [{ bookId: "romanos",    bookName: "Romanos",    chapter: 3  }, { bookId: "romanos",    bookName: "Romanos",    chapter: 5  }] },
  { day: 15, title: "A promessa do novo céu e nova terra",   theme: "Esperança",         readings: [{ bookId: "apocalipse", bookName: "Apocalipse", chapter: 21 }, { bookId: "apocalipse", bookName: "Apocalipse", chapter: 22 }] },
];

// ──────────────────────────────────────────────────────────────────────────────
// Catálogo de Planos
// ──────────────────────────────────────────────────────────────────────────────
export const READING_PLANS: ReadingPlan[] = [
  {
    id: 'nt21',
    title: 'Conheça Jesus',
    subtitle: '21 dias',
    description: 'Uma jornada pelo Evangelho de João, Atos dos Apóstolos e as epístolas de Paulo. Ideal para quem quer começar.',
    duration: 21,
    xpPerChapter: 25,
    color: 'from-amber-500 to-orange-600',
    accentColor: '#F97316',
    icon: '✨',
    days: PLAN_21_DAYS,
  },
  {
    id: 'sabedoria30',
    title: 'Sabedoria Viva',
    subtitle: '30 dias',
    description: 'Salmos, Provérbios, Eclesiastes e as cartas gerais. Uma imersão na sabedoria bíblica para o dia a dia.',
    duration: 30,
    xpPerChapter: 25,
    color: 'from-emerald-600 to-teal-700',
    accentColor: '#006947',
    icon: '📖',
    days: PLAN_30_DAYS,
  },
  {
    id: 'nt90',
    title: 'NT Completo',
    subtitle: '90 dias',
    description: 'Leia todo o Novo Testamento em 90 dias, do Evangelho de Mateus até o Apocalipse.',
    duration: 90,
    xpPerChapter: 25,
    color: 'from-emerald-500 to-teal-700',
    accentColor: '#10B981',
    icon: '🌿',
    days: generateNT90Days(),
  },
  {
    id: 'paz7',
    title: 'Salmos & Paz Interior',
    subtitle: '7 dias',
    description: 'Versículos de conforto, fé e tranquilidade para momentos de ansiedade. Uma semana de paz com Deus.',
    duration: 7,
    xpPerChapter: 25,
    color: 'from-sky-400 to-blue-600',
    accentColor: '#0EA5E9',
    icon: '🕊️',
    days: PLAN_PAZ_7_DAYS,
  },
  {
    id: 'fe10',
    title: 'Fé que Move Montanhas',
    subtitle: '10 dias',
    description: 'Versículos sobre fé, oração e confiança em Deus. Para quem quer fortalecer a vida de oração.',
    duration: 10,
    xpPerChapter: 25,
    color: 'from-rose-500 to-red-700',
    accentColor: '#F43F5E',
    icon: '⛰️',
    days: PLAN_FE_10_DAYS,
  },
  {
    id: 'inicio15',
    title: 'Começando com Deus',
    subtitle: '15 dias',
    description: 'Um panorama essencial da Bíblia para novos crentes ou quem quer recomeçar. Da criação à promessa eterna.',
    duration: 15,
    xpPerChapter: 25,
    color: 'from-amber-400 to-yellow-600',
    accentColor: '#F59E0B',
    icon: '🌱',
    days: PLAN_INICIO_15_DAYS,
  },
];

export function getPlanById(id: string): ReadingPlan | undefined {
  return READING_PLANS.find(p => p.id === id);
}
