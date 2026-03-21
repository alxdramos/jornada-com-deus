'use client';

import { useUserStore } from '@/stores/userStore';

// Mapeia interest IDs para tab IDs e scores de relevância
const INTEREST_TAB_MAP: Record<string, { tabs: string[]; hint: string }> = {
  paz:       { tabs: ['meditacoes', 'oracoes'],           hint: 'Meditações de paz para você hoje 🕊️' },
  fe:        { tabs: ['oracoes', 'devocional'],            hint: 'Fortaleça sua fé com uma oração 🙏' },
  familia:   { tabs: ['oracoes', 'devocional'],            hint: 'Ore pela sua família hoje 👨‍👩‍👧' },
  biblia:    { tabs: ['biblia', 'estudos'],                hint: 'Mergulhe na Palavra de Deus 📖' },
  meditacao: { tabs: ['meditacoes'],                       hint: 'Uma meditação especial para você 🧘' },
  gratidao:  { tabs: ['oracoes', 'meditacoes'],            hint: 'Pratique a gratidão hoje ✨' },
  cura:      { tabs: ['meditacoes', 'oracoes'],            hint: 'Conteúdo de cura e saúde para você 💚' },
  proposito: { tabs: ['estudos', 'devocional'],            hint: 'Descubra seu propósito hoje 🌟' },
  louvor:    { tabs: ['devocional', 'meditacoes'],         hint: 'Celebre com louvor hoje 🎶' },
};

export function usePersonalization() {
  const interests = useUserStore((s) => s.user?.interests ?? []);

  const hasInterests = interests.length > 0;

  // Calcula score de cada tab baseado nos interesses do usuário
  function getTabScores(): Record<string, number> {
    const scores: Record<string, number> = {};
    interests.forEach((interest, idx) => {
      const mapping = INTEREST_TAB_MAP[interest];
      if (!mapping) return;
      mapping.tabs.forEach((tab, tabIdx) => {
        // Primeiro interesse tem peso maior; primeira tab tem peso maior
        const weight = (interests.length - idx) * (mapping.tabs.length - tabIdx);
        scores[tab] = (scores[tab] ?? 0) + weight;
      });
    });
    return scores;
  }

  // Ordena um array de cards de explorar por relevância de interesse
  function sortedExploreCards<T extends { id: string }>(cards: T[]): T[] {
    if (!hasInterests) return cards;
    const scores = getTabScores();
    return [...cards].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));
  }

  // Retorna IDs das tabs mais relevantes (top 3) para seção "Para Você"
  function getTopTabIds(limit = 3): string[] {
    const scores = getTabScores();
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id]) => id);
  }

  // Retorna hint de sugestão baseado no primeiro interesse
  function getInterestHint(): string | null {
    if (!hasInterests) return null;
    const primary = interests[0];
    return INTEREST_TAB_MAP[primary]?.hint ?? null;
  }

  return {
    interests,
    hasInterests,
    sortedExploreCards,
    getTopTabIds,
    getInterestHint,
  };
}
