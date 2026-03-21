'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserHeader } from '@/components/layout/UserHeader';
import { SearchBar } from '@/components/molecules/SearchBar';
import { useTabStore, TabId } from '@/stores/tabStore';
import { ReadingPlanModal } from '@/components/tabs/biblia/ReadingPlanModal';
import { useReadingPlanStore } from '@/stores/readingPlanStore';
import { usePersonalization } from '@/hooks/usePersonalization';

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
  const { hasInterests, sortedExploreCards, getTopTabIds } = usePersonalization();

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

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

  const topTabIds = hasInterests ? getTopTabIds(3) : [];
  const forYouCards = EXPLORE_CARDS.filter((c) => topTabIds.includes(c.id));
  const allCards = sortedExploreCards(EXPLORE_CARDS);

  return (
    <div className="min-h-screen bg-bg-primary p-6 pb-36">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserHeader title="Descobrir" />

        <SearchBar
          placeholder="Orações, Categorias, Bíblia e Mais"
          onSearch={handleSearch}
          fullWidth
        />

        {hasInterests && forYouCards.length > 0 && (
          <div>
            <h2 className="text-text-primary text-xl font-bold mb-4">Para Você</h2>
            <div className="grid grid-cols-2 gap-3">
              {forYouCards.map((card) => (
                <ExploreCardButton key={card.id} card={card} onPress={() => handleCardPress(card)} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-text-primary text-xl font-bold mb-4">
            {hasInterests ? 'Todas as Categorias' : 'Categorias'}
          </h2>
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
