'use client';

import { useState, useEffect } from 'react';
import { MEDITACOES, MeditationCard as MeditationCardType } from '@/data/meditacoes';
import { UserHeader } from '@/components/layout/UserHeader';
import { Chip } from '@/components/atoms/Chip';
import { ContentSection } from './explorar/ContentSection';
import { MeditationCard } from './explorar/MeditationCard';
import { MeditationDetailModalWithPlayer } from './meditacoes/MeditationDetailModalWithPlayer';
import { MeditacoesModal } from './meditacoes/MeditacoesModal';
import { PaywallModal } from '@/components/PaywallModal';
import { useSubscription } from '@/hooks/useSubscription';
import { useFavorites } from '@/hooks/useFavorites';
import { ImageCardSkeleton } from '@/components/ui/Skeleton';
import { Music } from 'lucide-react';
import { EmptyFilteredContent } from '@/components/EmptyStates';

export function TabMeditacoes() {
  const { isPlusUser: isPlus } = useSubscription();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [hydrated, setHydrated] = useState(false);

  const [showAllModal, setShowAllModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationCardType | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [chipAtivo, setChipAtivo] = useState("TUDO");

  const tagsUnicas = Array.from(new Set(MEDITACOES.flatMap(m => m.tags))).sort();
  const CHIPS = ["TUDO", ...tagsUnicas];

  const meditacoesFiltradas = MEDITACOES.filter(med => {
    return chipAtivo === "TUDO" || med.tags.includes(chipAtivo);
  });

  // Apenas os 4 primeiros na lista principal
  const iniciais = meditacoesFiltradas.slice(0, 4);

  useEffect(() => { setHydrated(true); }, []);

  const handleViewDetails = (meditation: MeditationCardType) => {
    if (meditation.plus && !isPlus) {
      setSelectedMeditation(meditation);
      setPaywallOpen(true);
    } else {
      setSelectedMeditation(meditation);
      setShowDetailModal(true);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-bg-primary p-6 pb-36">
        <div className="max-w-4xl mx-auto space-y-6">
          <UserHeader
            title="Meditações"
            rightElement={
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-purple-500" />
              </div>
            }
          />

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CHIPS.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                selected={chipAtivo === chip}
                onClick={() => setChipAtivo(chip)}
              />
            ))}
          </div>

          <ContentSection
            title="Meditações"
            onViewAll={() => setShowAllModal(true)}
          >
            {!hydrated
              ? [1, 2, 3, 4].map((i) => <ImageCardSkeleton key={i} />)
              : meditacoesFiltradas.length === 0 && chipAtivo !== "TUDO"
              ? <EmptyFilteredContent category={chipAtivo} />
              : iniciais.map((meditacao) => (
                  <MeditationCard
                    key={meditacao.id}
                    meditation={meditacao}
                    isPlus={isPlus}
                    isFavorite={isFavorite(meditacao.id)}
                    onPlay={handleViewDetails}
                    onFavorite={toggleFavorite}
                  />
                ))}
          </ContentSection>
        </div>
      </div>

      {/* Modal com todas as meditações */}
      {showAllModal && (
        <MeditacoesModal
          isOpen={showAllModal}
          onClose={() => setShowAllModal(false)}
          onViewDetails={handleViewDetails}
        />
      )}

      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onUpgrade={() => setPaywallOpen(false)}
        feature={selectedMeditation?.title}
      />

      {selectedMeditation && showDetailModal && (
        <MeditationDetailModalWithPlayer
          meditation={selectedMeditation}
          isFavorite={isFavorite(selectedMeditation.id)}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedMeditation(null);
          }}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </>
  );
}
