'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BookMarked } from 'lucide-react';
import { UserHeader } from '@/components/layout/UserHeader';
import { SearchBar } from '@/components/molecules/SearchBar';
import { useTabStore, TabId } from '@/stores/tabStore';
import { ReadingPlanModal } from '@/components/tabs/biblia/ReadingPlanModal';
import { useReadingPlanStore } from '@/stores/readingPlanStore';

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
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const activePlan = useReadingPlanStore((s) => s.activePlan);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  function handleOpenChapterFromExplorer(bookId: string, bookName: string, chapter: number) {
    // Navega para a aba Bíblia; o estado do ReadingPlanStore já está marcado como lido
    setActiveTab('biblia');
    setPlanModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-bg-primary p-6 pb-36">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserHeader title="Descobrir" />

        <SearchBar
          placeholder="Orações, Categorias, Bíblia e Mais"
          onSearch={handleSearch}
          fullWidth
        />

        {/* Card de Planos de Leitura em destaque */}
        <div>
          <h2 className="text-text-primary text-xl font-bold mb-4">Em Destaque</h2>
          <button
            onClick={() => setPlanModalOpen(true)}
            className="w-full relative overflow-hidden rounded-2xl cursor-pointer active:scale-[0.97] transition-transform focus:outline-none"
            style={{ minHeight: 100 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500" />
            {/* padrão decorativo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full bg-white" />
            </div>
            <div className="relative flex items-center gap-4 p-5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <BookMarked className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-bold text-base">Planos de Leitura</p>
                <p className="text-white/80 text-xs mt-0.5">
                  {activePlan
                    ? "Continue seu plano de hoje →"
                    : "21, 30 ou 90 dias · +25 XP por capítulo"}
                </p>
              </div>
              {activePlan && (
                <div className="flex-shrink-0 bg-white/20 rounded-full px-3 py-1">
                  <span className="text-white text-xs font-semibold">Ativo</span>
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Grade de categorias */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-white font-semibold text-sm leading-tight drop-shadow-md text-left">
                  {card.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Planos de Leitura */}
      <ReadingPlanModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        onReadChapter={handleOpenChapterFromExplorer}
      />
    </div>
  );
}
