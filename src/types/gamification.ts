// Gamification System Types
export type ActivityType = 'oracao' | 'meditacao' | 'biblia' | 'diario';
export type PlayerStage = 'Semente' | 'Broto' | 'Árvore Jovem' | 'Madura' | 'Frutífera';

export interface GamificationState {
  userId: string;
  level: number;
  totalXP: number;
  stage: PlayerStage;
  streakDays: number;
  lastActivityDate: Date;
  branches: {
    oracao: number;
    meditacao: number;
    biblia: number;
    diario: number;
    comunidade: number;
  };
  badges: Badge[];
  unlockDateAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface BranchData {
  activitiesCompleted: number;
  currentLevel: number;
  xpInBranch: number;
}

export const GAMIFICATION_CONFIG = {
  XP_MULTIPLIERS: {
    oracao: 10,
    meditacao: 15,
    biblia: 5,
    diario: 20,
    streak_7: 100,
    streak_30: 300,
    streak_100: 1000,
  },

  LEVEL_STAGES: [
    { level: 1, stage: 'Semente' as PlayerStage, minXP: 0, maxXP: 500 },
    { level: 11, stage: 'Broto' as PlayerStage, minXP: 500, maxXP: 1500 },
    { level: 21, stage: 'Árvore Jovem' as PlayerStage, minXP: 1500, maxXP: 3500 },
    { level: 31, stage: 'Árvore Madura' as PlayerStage, minXP: 3500, maxXP: 7000 },
    { level: 41, stage: 'Árvore Frutífera' as PlayerStage, minXP: 7000, maxXP: Infinity },
  ],

  BADGES: [
    { id: 'first_prayer', name: '🙏 Primeiro Passo', description: 'Complete 1 oração' },
    { id: 'meditation_master', name: '🧘 Mestre Meditador', description: 'Complete 30 meditações' },
    { id: 'bible_scholar', name: '📚 Erudito Bíblico', description: 'Leia 100 versículos' },
    { id: 'journal_keeper', name: '📔 Guardião do Diário', description: 'Escreva 20 reflexões' },
    { id: 'week_streak', name: '🔥 Semana Sagrada', description: '7 dias de atividade' },
    { id: 'month_streak', name: '🌟 Mês Abençoado', description: '30 dias de atividade' },
    { id: 'century_strike', name: '💯 Século de Fé', description: '100 dias de atividade' },
    { id: 'prayer_warrior', name: '⚔️ Guerreiro de Oração', description: 'Complete 50 orações' },
  ],
};
