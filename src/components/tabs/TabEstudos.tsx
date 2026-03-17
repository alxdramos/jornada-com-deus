'use client';

import { useState, useEffect } from 'react';
import { ESTUDOS, EstudoBiblico, CATEGORIAS_ESTUDOS } from '@/data/estudos';
import { UserHeader } from '@/components/layout/UserHeader';
import { Chip } from '@/components/atoms/Chip';
import { ContentSection } from './explorar/ContentSection';
import { EstudoCard } from './estudos/EstudoCard';
import { EstudoDetailModalWithPlayer } from './estudos/EstudoDetailModalWithPlayer';
import { EstudosModal } from './estudos/EstudosModal';
import { PaywallModal } from '@/components/PaywallModal';
import { useSubscription } from '@/hooks/useSubscription';
import { useFavorites } from '@/hooks/useFavorites';
import { StudyCardSkeleton } from '@/components/ui/Skeleton';
import { BookOpen } from 'lucide-react';
import { EmptyFilteredContent } from '@/components/EmptyStates';

export function TabEstudos() {
  const { isPlusUser: isPlus } = useSubscription();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [hydrated, setHydrated] = useState(false);
  const [selectedEstudo, setSelectedEstudo] = useState<EstudoBiblico | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [chipAtivo, setChipAtivo] = useState("TUDO");
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState('');

  const categorias = Array.from(CATEGORIAS_ESTUDOS).filter(cat => {
    if (cat === "TUDO") return true;
    return ESTUDOS.some(e => e.category === cat);
  });

  const estudosFiltrados = ESTUDOS.filter(estudo => {
    return chipAtivo === "TUDO" || estudo.category === chipAtivo;
  });

  // Apenas os 4 primeiros na lista principal
  const iniciais = estudosFiltrados.slice(0, 4);

  useEffect(() => { setHydrated(true); }, []);

  const handleViewDetails = (estudo: EstudoBiblico) => {
    if (estudo.plus && !isPlus) {
      setPaywallFeature(estudo.title);
      setPaywallOpen(true);
    } else {
      setSelectedEstudo(estudo);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-bg-primary p-6 pb-36">
        <div className="max-w-4xl mx-auto space-y-6">
          <UserHeader
            title="Estudos Bíblicos"
            rightElement={
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-600" />
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
            title="Estudos Bíblicos"
            onViewAll={() => setShowAllModal(true)}
          >
            {!hydrated
              ? [1, 2, 3, 4].map((i) => <StudyCardSkeleton key={i} />)
              : estudosFiltrados.length === 0 && chipAtivo !== "TUDO"
              ? <EmptyFilteredContent category={chipAtivo} />
              : iniciais.map((estudo) => (
                  <EstudoCard
                    key={estudo.id}
                    estudo={estudo}
                    isFavorite={isFavorite(estudo.id)}
                    onPlay={handleViewDetails}
                    onFavorite={toggleFavorite}
                  />
                ))}
          </ContentSection>
        </div>
      </div>

      {/* Modal com todos os estudos */}
      {showAllModal && (
        <EstudosModal
          isOpen={showAllModal}
          onClose={() => setShowAllModal(false)}
          onViewDetails={handleViewDetails}
        />
      )}

      {selectedEstudo && (
        <EstudoDetailModalWithPlayer
          estudo={selectedEstudo}
          isFavorite={isFavorite(selectedEstudo.id)}
          onClose={() => setSelectedEstudo(null)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        feature={paywallFeature}
      />
    </>
  );
}
