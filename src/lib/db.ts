import Dexie, { Table } from 'dexie';

// Interfaces para as tabelas
export interface User {
  id?: number;
  name: string;
  email?: string;
  isPlus: boolean;
  avatar?: string;
  createdAt: Date;
}

export interface Progress {
  id?: number;
  streak: number;
  xp: number;
  level: number;
  treeLevel: number; // 0-10
  lastCompletedDate?: Date;
  userId: number;
}

export interface Devotional {
  id?: number;
  title: string;
  duration: number; // em minutos
  category: string;
  isPlus: boolean;
  audioUrl?: string;
  imageUrl?: string;
  description?: string;
  createdAt: Date;
}

export interface Prayer {
  id?: number;
  title: string;
  text: string;
  audioUrl?: string;
  isPersonal: boolean;
  answered: boolean;
  createdAt: Date;
  userId: number;
  syncStatus?: 'pending' | 'synced'; // offline-first sync flag
  localId?: string; // original string ID (e.g., 'custom-1234567890')
}

export interface JournalEntry {
  id?: number;
  type: 'anotacao' | 'destaque' | 'citacao' | 'reflexao';
  content: string;
  date: Date;
  favorite: boolean;
  userId: number;
  syncStatus?: 'pending' | 'synced'; // offline-first sync flag
  localId?: string; // original string ID from localStorage
}

export interface Favorite {
  id?: number;
  contentId: number;
  type: 'devotional' | 'prayer' | 'journal';
  userId: number;
  createdAt: Date;
}

export class JornadaComDeusDB extends Dexie {
  users!: Table<User>;
  progress!: Table<Progress>;
  devotionals!: Table<Devotional>;
  prayers!: Table<Prayer>;
  journalEntries!: Table<JournalEntry>;
  favorites!: Table<Favorite>;

  constructor() {
    super('JornadaComDeusDB');
    this.version(1).stores({
      users: '++id, name, email, isPlus, avatar, createdAt',
      progress: '++id, streak, xp, level, treeLevel, lastCompletedDate, userId',
      devotionals: '++id, title, duration, category, isPlus, audioUrl, imageUrl, description, createdAt',
      prayers: '++id, title, text, audioUrl, isPersonal, answered, createdAt, userId',
      journalEntries: '++id, type, content, date, favorite, userId',
      favorites: '++id, contentId, type, userId, createdAt',
    });
    // v2: adds syncStatus + localId indexes for offline-first sync
    this.version(2).stores({
      users: '++id, name, email, isPlus, avatar, createdAt',
      progress: '++id, streak, xp, level, treeLevel, lastCompletedDate, userId',
      devotionals: '++id, title, duration, category, isPlus, audioUrl, imageUrl, description, createdAt',
      prayers: '++id, title, text, audioUrl, isPersonal, answered, createdAt, userId, syncStatus, localId',
      journalEntries: '++id, type, content, date, favorite, userId, syncStatus, localId',
      favorites: '++id, contentId, type, userId, createdAt',
    });

    // Hook para seed automático na primeira criação
    // NOTA: Removido seed automático para evitar conflito com autenticação
    // O seed será feito apenas quando necessário via código específico
    this.on('ready', async () => {
      console.log('📱 Banco de dados IndexedDB pronto para Jornada com Deus');
    });
  }

}

// Instância singleton do banco
export const db = new JornadaComDeusDB();