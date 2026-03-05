'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserHeader } from '@/components/layout/UserHeader';
import { SearchBar } from '@/components/molecules/SearchBar';
import { useTabStore, TabId } from '@/stores/tabStore';
import { ReadingPlanModal } from '@/components/tabs/biblia/ReadingPlanModal';

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

export function TabExplorar() {
  const setActiveTab = useTabStore((s) => s.setActiveTab);
  const [planModalOpen, setPlanModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  return (
    <div className="min-h-screen bg-bg-primary p-6 pb-36">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserHeader title="Descobrir" />

        <SearchBar
          placeholder="Orações, Categorias, Bíblia e Mais"
          onSearch={handleSearch}
          fullWidth
        />

        <div>
          <h2 className="text-text-primary text-xl font-bold mb-4">Categorias</h2>
          <div className="grid grid-cols-2 gap-3">
            {EXPLORE_CARDS.map((card) => (
              <button
                key={card.id}
                onClick={() =>
                  card.action === 'modal'
                    ? setPlanModalOpen(true)
                    : setActiveTab(card.id as TabId)
                }
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
            ))}
          </div>
        </div>
      </div>

      <ReadingPlanModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
      />
    </div>
  );
}
