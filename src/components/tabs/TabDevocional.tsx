'use client';

import { useState, useEffect } from 'react';
import { DEVOCIONAIS, Devocional, CATEGORIAS_DEVOCIONAIS } from '@/data/devocionais';
import { UserHeader } from '@/components/layout/UserHeader';
import { Chip } from '@/components/atoms/Chip';
import { ContentSection } from './explorar/ContentSection';
import { DevocionalCard } from './devocionais/DevocionalCard';
import { DevocionalDetailModalWithPlayer } from './devocionais/DevocionalDetailModalWithPlayer';
import { DevocionaisModal } from './devocionais/DevocionaisModal';
import { useFavorites } from '@/hooks/useFavorites';
import { StudyCardSkeleton } from '@/components/ui/Skeleton';
import { BookHeart } from 'lucide-react';

export function TabDevocional() {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [hydrated, setHydrated] = useState(false);
  const [selectedDevocional, setSelectedDevocional] = useState<Devocional | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [chipAtivo, setChipAtivo] = useState("TUDO");

  const categorias = Array.from(CATEGORIAS_DEVOCIONAIS).filter((cat) => {
    if (cat === "TUDO") return true;
    return DEVOCIONAIS.some((d) => d.category === cat);
  });

  const devocionaisFiltrados = DEVOCIONAIS.filter((d) => {
    return chipAtivo === "TUDO" || d.category === chipAtivo;
  });

  const iniciais = devocionaisFiltrados.slice(0, 4);

  useEffect(() => { setHydrated(true); }, []);

  const handleViewDetails = (devocional: Devocional) => {
    setSelectedDevocional(devocional);
  };

  return (
    <>
      <div className="min-h-screen bg-bg-primary p-6 pb-36">
        <div className="max-w-4xl mx-auto space-y-6">
          <UserHeader
            title="Devocional"
            rightElement={
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <BookHeart className="w-5 h-5 text-orange-600" />
              </div>
            }
          />

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categorias.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                selected={chipAtivo === cat}
                onClick={() => setChipAtivo(cat)}
              />
            ))}
          </div>

          <ContentSection
            title="Devocionais"
            onViewAll={() => setShowAllModal(true)}
            emptyState="Nenhum devocional encontrado com esses filtros"
          >
            {!hydrated
              ? [1, 2, 3, 4].map((i) => <StudyCardSkeleton key={i} />)
              : iniciais.map((devocional) => (
                  <DevocionalCard
                    key={devocional.id}
                    devocional={devocional}
                    isFavorite={isFavorite(devocional.id)}
                    onPlay={handleViewDetails}
                    onFavorite={toggleFavorite}
                  />
                ))}
          </ContentSection>
        </div>
      </div>

      {/* Modal com todos os devocionais */}
      {showAllModal && (
        <DevocionaisModal
          isOpen={showAllModal}
          onClose={() => setShowAllModal(false)}
          onViewDetails={handleViewDetails}
        />
      )}

      {selectedDevocional && (
        <DevocionalDetailModalWithPlayer
          devocional={selectedDevocional}
          isFavorite={isFavorite(selectedDevocional.id)}
          onClose={() => setSelectedDevocional(null)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </>
  );
}
