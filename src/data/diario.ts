/**
 * Dados de diário para TabDiario
 */

export type DiaryEntryType = 'note' | 'highlight' | 'verse' | 'quote';
export type DiaryTabType = 'Tudo' | 'Destaques' | 'Anotações' | 'Citações';

export interface DiaryEntry {
  id: string;
  type: DiaryEntryType;
  title: string;
  content: string;
  reference?: string;
  tags?: string[];
  createdAt: Date;
  isFavorite?: boolean;
}

export const ENTRIES_EXEMPLO: DiaryEntry[] = [
  {
    id: "highlight-1",
    type: "highlight",
    title: "Momento de reflexão - João 3:16",
    content: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    reference: "João 3:16",
    tags: ["amor", "salvação", "fé"],
    createdAt: new Date(Date.now() - 86400000),
    isFavorite: true
  },
  {
    id: "note-1",
    type: "note",
    title: "Reflexão sobre a gratidão",
    content: "Hoje me dei conta de como é importante agradecer pelas pequenas coisas da vida. Cada dia é uma oportunidade de crescimento espiritual.",
    tags: ["gratidão", "reflexão", "crescimento"],
    createdAt: new Date(Date.now() - 172800000),
    isFavorite: false
  },
  {
    id: "verse-1",
    type: "verse",
    title: "Versículo do dia",
    content: "Tudo posso naquele que me fortalece.",
    reference: "Filipenses 4:13",
    tags: ["força", "fé", "poder"],
    createdAt: new Date(Date.now() - 259200000),
    isFavorite: true
  },
  {
    id: "quote-1",
    type: "quote",
    title: "Citação inspiradora",
    content: "A fé é dar o primeiro passo, mesmo que você não veja toda a escada.",
    reference: "Martin Luther King Jr.",
    tags: ["fé", "inspiração", "coragem"],
    createdAt: new Date(Date.now() - 345600000),
    isFavorite: false
  }
];

export const DIARY_TABS: DiaryTabType[] = ['Tudo', 'Destaques', 'Anotações', 'Citações'];

export const ENTRY_TYPE_LABELS: Record<DiaryEntryType, string> = {
  note: "Anotação",
  highlight: "Destaque",
  verse: "Versículo",
  quote: "Citação"
};

export const ENTRY_TYPE_ICONS: Record<DiaryEntryType, string> = {
  note: "📝",
  highlight: "✨",
  verse: "📖",
  quote: "💬"
};
