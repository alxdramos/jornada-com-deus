'use client';

import Image from 'next/image';
import { UserHeader } from '@/components/layout/UserHeader';
import { SearchBar } from '@/components/molecules/SearchBar';
import { useTabStore, TabId } from '@/stores/tabStore';

interface ExploreCard {
  id: TabId;
  label: string;
  image: string;
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
    id: 'kids',
    label: 'Kids',
    image: '/images/explore-cards/explore-card-kids.webp',
  },
];

export function TabExplorar() {
  const setActiveTab = useTabStore((s) => s.setActiveTab);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  return (
    <div className="min-h-screen bg-bg-primary p-6 pb-28">
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
                onClick={() => setActiveTab(card.id)}
                className="relative overflow-hidden rounded-2xl aspect-[3/2] cursor-pointer active:scale-[0.97] transition-transform focus:outline-none"
              >
                <Image
                  src={card.image}
                  alt={card.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {/* dark gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-white font-semibold text-sm leading-tight drop-shadow-md text-left">
                  {card.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
