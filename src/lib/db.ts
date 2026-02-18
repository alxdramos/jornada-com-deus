import Dexie, { Table } from 'dexie';

// Interfaces para as tabelas
export interface User {
  id?: number;
  name: string;
  email?: string;
  isPlus: boolean;
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
}

export interface JournalEntry {
  id?: number;
  type: 'anotacao' | 'destaque' | 'citacao' | 'reflexao';
  content: string;
  date: Date;
  favorite: boolean;
  userId: number;
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
      users: '++id, name, email, isPlus, createdAt',
      progress: '++id, streak, xp, level, treeLevel, lastCompletedDate, userId',
      devotionals: '++id, title, duration, category, isPlus, audioUrl, imageUrl, description, createdAt',
      prayers: '++id, title, text, audioUrl, isPersonal, answered, createdAt, userId',
      journalEntries: '++id, type, content, date, favorite, userId',
      favorites: '++id, contentId, type, userId, createdAt',
    });

    // Hook para seed automático na primeira criação
    this.on('ready', async () => {
      const userCount = await this.users.count();
      if (userCount === 0) {
        console.log('🌱 Fazendo seed inicial do banco de dados...');
        await this.seedInitialData();
      }
    });
  }

  private async seedInitialData() {
    try {
      // Criar usuário padrão
      const userId = await this.users.add({
        name: 'Usuário',
        isPlus: false,
        createdAt: new Date(),
      });

      // Criar progresso inicial
      await this.progress.add({
        streak: 0,
        xp: 0,
        level: 1,
        treeLevel: 0,
        userId: userId,
      });

      // Seed será feito pelo arquivo seed.ts separado
      console.log('✅ Seed inicial concluído!');
    } catch (error) {
      console.error('❌ Erro no seed inicial:', error);
    }
  }
}

// Instância singleton do banco
export const db = new JornadaComDeusDB();