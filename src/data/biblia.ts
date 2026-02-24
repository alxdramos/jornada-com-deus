/**
 * Dados da Bíblia para TabBiblia
 */

export type Testamento = "AT" | "NT";
export type ViewState = "books" | "chapters" | "verses";

export const TESTAMENTOS: { label: string; value: Testamento }[] = [
  { label: "ANTIGO TESTAMENTO", value: "AT" },
  { label: "NOVO TESTAMENTO", value: "NT" },
];

export const TESTAMENTO_LABELS: Record<Testamento, string> = {
  AT: "Antigo Testamento",
  NT: "Novo Testamento",
};

export interface BibleBook {
  id: string;
  name: string;
  abbrev: string;
  chapters: number;
  testamento: Testamento;
  apiName: string; // nome em inglês para a bible-api.com
}

// Lista de livros por testamento
export const LIVROS_AT: BibleBook[] = [
  { id: "genesis", name: "Gênesis", abbrev: "Gn", chapters: 50, testamento: "AT", apiName: "genesis" },
  { id: "exodo", name: "Êxodo", abbrev: "Ex", chapters: 40, testamento: "AT", apiName: "exodus" },
  { id: "levitico", name: "Levítico", abbrev: "Lv", chapters: 27, testamento: "AT", apiName: "leviticus" },
  { id: "numeros", name: "Números", abbrev: "Nm", chapters: 36, testamento: "AT", apiName: "numbers" },
  { id: "deuteronomio", name: "Deuteronômio", abbrev: "Dt", chapters: 34, testamento: "AT", apiName: "deuteronomy" },
  { id: "josue", name: "Josué", abbrev: "Js", chapters: 24, testamento: "AT", apiName: "joshua" },
  { id: "juizes", name: "Juízes", abbrev: "Jz", chapters: 21, testamento: "AT", apiName: "judges" },
  { id: "rute", name: "Rute", abbrev: "Rt", chapters: 4, testamento: "AT", apiName: "ruth" },
  { id: "1samuel", name: "1 Samuel", abbrev: "1Sm", chapters: 31, testamento: "AT", apiName: "1 samuel" },
  { id: "2samuel", name: "2 Samuel", abbrev: "2Sm", chapters: 24, testamento: "AT", apiName: "2 samuel" },
  { id: "1reis", name: "1 Reis", abbrev: "1Rs", chapters: 22, testamento: "AT", apiName: "1 kings" },
  { id: "2reis", name: "2 Reis", abbrev: "2Rs", chapters: 25, testamento: "AT", apiName: "2 kings" },
  { id: "1cronicas", name: "1 Crônicas", abbrev: "1Cr", chapters: 29, testamento: "AT", apiName: "1 chronicles" },
  { id: "2cronicas", name: "2 Crônicas", abbrev: "2Cr", chapters: 36, testamento: "AT", apiName: "2 chronicles" },
  { id: "esdras", name: "Esdras", abbrev: "Ed", chapters: 10, testamento: "AT", apiName: "ezra" },
  { id: "neemias", name: "Neemias", abbrev: "Ne", chapters: 13, testamento: "AT", apiName: "nehemiah" },
  { id: "ester", name: "Ester", abbrev: "Et", chapters: 10, testamento: "AT", apiName: "esther" },
  { id: "jo", name: "Jó", abbrev: "Jó", chapters: 42, testamento: "AT", apiName: "job" },
  { id: "salmos", name: "Salmos", abbrev: "Sl", chapters: 150, testamento: "AT", apiName: "psalms" },
  { id: "proverbios", name: "Provérbios", abbrev: "Pv", chapters: 31, testamento: "AT", apiName: "proverbs" },
  { id: "eclesiastes", name: "Eclesiastes", abbrev: "Ec", chapters: 12, testamento: "AT", apiName: "ecclesiastes" },
  { id: "cantares", name: "Cantares", abbrev: "Ct", chapters: 8, testamento: "AT", apiName: "song of solomon" },
  { id: "isaias", name: "Isaías", abbrev: "Is", chapters: 66, testamento: "AT", apiName: "isaiah" },
  { id: "jeremias", name: "Jeremias", abbrev: "Jr", chapters: 52, testamento: "AT", apiName: "jeremiah" },
  { id: "lamentacoes", name: "Lamentações", abbrev: "Lm", chapters: 5, testamento: "AT", apiName: "lamentations" },
  { id: "ezequiel", name: "Ezequiel", abbrev: "Ez", chapters: 48, testamento: "AT", apiName: "ezekiel" },
  { id: "daniel", name: "Daniel", abbrev: "Dn", chapters: 12, testamento: "AT", apiName: "daniel" },
  { id: "oseias", name: "Oséias", abbrev: "Os", chapters: 14, testamento: "AT", apiName: "hosea" },
  { id: "joel", name: "Joel", abbrev: "Jl", chapters: 3, testamento: "AT", apiName: "joel" },
  { id: "amos", name: "Amós", abbrev: "Am", chapters: 9, testamento: "AT", apiName: "amos" },
  { id: "obadias", name: "Obadias", abbrev: "Ob", chapters: 1, testamento: "AT", apiName: "obadiah" },
  { id: "jonas", name: "Jonas", abbrev: "Jn", chapters: 4, testamento: "AT", apiName: "jonah" },
  { id: "miqueias", name: "Miquéias", abbrev: "Mq", chapters: 7, testamento: "AT", apiName: "micah" },
  { id: "naum", name: "Naum", abbrev: "Na", chapters: 3, testamento: "AT", apiName: "nahum" },
  { id: "habacuque", name: "Habacuque", abbrev: "Hc", chapters: 3, testamento: "AT", apiName: "habakkuk" },
  { id: "sofonias", name: "Sofonias", abbrev: "Sf", chapters: 3, testamento: "AT", apiName: "zephaniah" },
  { id: "ageu", name: "Ageu", abbrev: "Ag", chapters: 2, testamento: "AT", apiName: "haggai" },
  { id: "zacarias", name: "Zacarias", abbrev: "Zc", chapters: 14, testamento: "AT", apiName: "zechariah" },
  { id: "malaquias", name: "Malaquias", abbrev: "Ml", chapters: 4, testamento: "AT", apiName: "malachi" },
];

export const LIVROS_NT: BibleBook[] = [
  { id: "mateus", name: "Mateus", abbrev: "Mt", chapters: 28, testamento: "NT", apiName: "matthew" },
  { id: "marcos", name: "Marcos", abbrev: "Mc", chapters: 16, testamento: "NT", apiName: "mark" },
  { id: "lucas", name: "Lucas", abbrev: "Lc", chapters: 24, testamento: "NT", apiName: "luke" },
  { id: "joao", name: "João", abbrev: "Jo", chapters: 21, testamento: "NT", apiName: "john" },
  { id: "atos", name: "Atos", abbrev: "At", chapters: 28, testamento: "NT", apiName: "acts" },
  { id: "romanos", name: "Romanos", abbrev: "Rm", chapters: 16, testamento: "NT", apiName: "romans" },
  { id: "1corintios", name: "1 Coríntios", abbrev: "1Co", chapters: 16, testamento: "NT", apiName: "1 corinthians" },
  { id: "2corintios", name: "2 Coríntios", abbrev: "2Co", chapters: 13, testamento: "NT", apiName: "2 corinthians" },
  { id: "galatas", name: "Gálatas", abbrev: "Gl", chapters: 6, testamento: "NT", apiName: "galatians" },
  { id: "efesios", name: "Efésios", abbrev: "Ef", chapters: 6, testamento: "NT", apiName: "ephesians" },
  { id: "filipenses", name: "Filipenses", abbrev: "Fp", chapters: 4, testamento: "NT", apiName: "philippians" },
  { id: "colossenses", name: "Colossenses", abbrev: "Cl", chapters: 4, testamento: "NT", apiName: "colossians" },
  { id: "1tessalonicenses", name: "1 Tessalonicenses", abbrev: "1Ts", chapters: 5, testamento: "NT", apiName: "1 thessalonians" },
  { id: "2tessalonicenses", name: "2 Tessalonicenses", abbrev: "2Ts", chapters: 3, testamento: "NT", apiName: "2 thessalonians" },
  { id: "1timoteo", name: "1 Timóteo", abbrev: "1Tm", chapters: 6, testamento: "NT", apiName: "1 timothy" },
  { id: "2timoteo", name: "2 Timóteo", abbrev: "2Tm", chapters: 4, testamento: "NT", apiName: "2 timothy" },
  { id: "tito", name: "Tito", abbrev: "Tt", chapters: 3, testamento: "NT", apiName: "titus" },
  { id: "filemom", name: "Filemom", abbrev: "Fm", chapters: 1, testamento: "NT", apiName: "philemon" },
  { id: "hebreus", name: "Hebreus", abbrev: "Hb", chapters: 13, testamento: "NT", apiName: "hebrews" },
  { id: "tiago", name: "Tiago", abbrev: "Tg", chapters: 5, testamento: "NT", apiName: "james" },
  { id: "1pedro", name: "1 Pedro", abbrev: "1Pe", chapters: 5, testamento: "NT", apiName: "1 peter" },
  { id: "2pedro", name: "2 Pedro", abbrev: "2Pe", chapters: 3, testamento: "NT", apiName: "2 peter" },
  { id: "1joao", name: "1 João", abbrev: "1Jo", chapters: 5, testamento: "NT", apiName: "1 john" },
  { id: "2joao", name: "2 João", abbrev: "2Jo", chapters: 1, testamento: "NT", apiName: "2 john" },
  { id: "3joao", name: "3 João", abbrev: "3Jo", chapters: 1, testamento: "NT", apiName: "3 john" },
  { id: "judas", name: "Judas", abbrev: "Jd", chapters: 1, testamento: "NT", apiName: "jude" },
  { id: "apocalipse", name: "Apocalipse", abbrev: "Ap", chapters: 22, testamento: "NT", apiName: "revelation" },
];

export const ALL_BOOKS = [...LIVROS_AT, ...LIVROS_NT];
