'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { UserHeader } from '@/components/layout/UserHeader';
import { useTabStore, TabId } from '@/stores/tabStore';
import { ReadingPlanModal } from '@/components/tabs/biblia/ReadingPlanModal';
import { useReadingPlanStore } from '@/stores/readingPlanStore';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useSearchStore } from '@/hooks/useGlobalSearch';

interface ExploreCard {
  id: TabId | 'planos';
  label: string;
  image: string;
  action?: 'tab' | 'modal';
}

const EXPLORE_CARDS: ExploreCard[] = [
  {
    id: 'meditacoes',
    label: 'Meditações',
    image: '/images/explore-cards/explore-card-meditacoes.webp',
  },
  {
    id: 'oracoes',
    label: 'Orações',
    image: '/images/explore-cards/explore-card-oracoes.webp',
  },
  {
    id: 'estudos',
    label: 'Estudos Bíblicos',
    image: '/images/explore-cards/explore-card-estudos.webp',
  },
  {
    id: 'biblia',
    label: 'Bíblia',
    image: '/images/explore-cards/explore-card-biblia.webp',
  },
  {
    id: 'devocional',
    label: 'Devocional',
    image: '/images/explore-cards/explore-card-devocional.webp',
  },
  {
    id: 'planos',
    label: 'Planos de Leitura',
    image: '/images/explore-cards/explore-card-planos.png',
    action: 'modal',
  },
  {
    id: 'kids',
    label: 'Kids',
    image: '/images/explore-cards/explore-card-kids.webp',
  },
];

function ExploreCardButton({
  card,
  onPress,
}: {
  card: ExploreCard;
  onPress: () => void;
}) {
  return (
    <button
      onClick={onPress}
      className="relative overflow-hidden rounded-2xl aspect-[3/2] cursor-pointer active:scale-[0.97] transition-transform focus:outline-none"
    >
      <Image
        src={card.image}
        alt={card.label}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <span className="absolute bottom-3 left-3 right-3 text-white font-semibold text-sm leading-tight drop-shadow-md text-left">
        {card.label}
      </span>
    </button>
  );
}

export function TabExplorar() {
  const setActiveTab = useTabStore((s) => s.setActiveTab);
  const setPendingChapter = useReadingPlanStore((s) => s.setPendingChapter);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const { sortedExploreCards } = usePersonalization();
  const openSearch = useSearchStore((s) => s.open);

  function handleOpenChapterFromExplorer(bookId: string, bookName: string, chapter: number) {
    setPendingChapter({ bookId, bookName, chapter });
    setPlanModalOpen(false);
    setActiveTab('biblia');
  }

  function handleCardPress(card: ExploreCard) {
    if (card.action === 'modal') {
      setPlanModalOpen(true);
    } else {
      setActiveTab(card.id as TabId);
    }
  }

  const allCards = sortedExploreCards(EXPLORE_CARDS);

  return (
    <div className="min-h-screen bg-bg-primary p-6 pb-36">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserHeader title="Descobrir" />

        <button
          onClick={openSearch}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[#E5E7EB] shadow-sm text-left hover:border-[#FB923C] transition-colors group"
          aria-label="Abrir busca global"
        >
          <Search className="w-4 h-4 text-[#9CA3AF] shrink-0 group-hover:text-[#FB923C] transition-colors" />
          <span className="text-[#9CA3AF] text-sm flex-1">Devocionais, Orações, Meditações e Mais</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#9CA3AF] border border-[#E5E7EB] rounded">
            ⌘K
          </kbd>
        </button>

        <div>
          <h2 className="text-text-primary text-xl font-bold mb-4">Categorias</h2>
          <div className="grid grid-cols-2 gap-3">
            {allCards.map((card) => (
              <ExploreCardButton key={card.id} card={card} onPress={() => handleCardPress(card)} />
            ))}
          </div>
        </div>
      </div>

      <ReadingPlanModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        onReadChapter={handleOpenChapterFromExplorer}
      />
    </div>
  );
}
