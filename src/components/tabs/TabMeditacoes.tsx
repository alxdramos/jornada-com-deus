'use client';

import { useState } from 'react';
import { MEDITACOES, MeditationCard as MeditationCardType } from '@/data/meditacoes';
import { UserHeader } from '@/components/layout/UserHeader';
import { Chip } from '@/components/atoms/Chip';
import { ContentSection } from './explorar/ContentSection';
import { MeditationCard } from './explorar/MeditationCard';
import { MeditationDetailModalWithPlayer } from './meditacoes/MeditationDetailModalWithPlayer';
import { PaywallModal } from '@/components/PaywallModal';
import { useUserStore } from '@/stores/userStore';
import { useFavorites } from '@/hooks/useFavorites';
import { Music } from 'lucide-react';

export function TabMeditacoes() {
  const user = useUserStore((s) => s.user);
  const isPlus = user?.isPlus ?? false;
  const { toggleFavorite, isFavorite } = useFavorites();

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationCardType | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [catAtiva, setCatAtiva] = useState("TUDO");
  const [chipAtivo, setChipAtivo] = useState("TUDO");

  // Gerar chips dinamicamente a partir das tags das meditações
  const CATEGORIAS = ["TUDO", "MENTE", "CORPO", "ESPÍRITO", "MÚSICA", "ESTUDOS"];
  const tagsUnicas = Array.from(new Set(MEDITACOES.flatMap(m => m.tags))).sort();
  const CHIPS = ["TUDO", ...tagsUnicas];

  // Filtrar meditações
  const meditacoesFiltradas = MEDITACOES.filter(med => {
    const categoriaMatch = catAtiva === "TUDO" || med.category === catAtiva;
    const chipMatch = chipAtivo === "TUDO" || med.tags.includes(chipAtivo);
    return categoriaMatch && chipMatch;
  });

  // Handlers
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
      <div className="min-h-screen bg-bg-primary p-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header padronizado */}
          <UserHeader
            title="Meditações"
            rightElement={
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-purple-500" />
              </div>
            }
          />

          {/* Filtros - Categorias */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIAS.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                selected={catAtiva === cat}
                onClick={() => setCatAtiva(cat)}
                variant="filled"
              />
            ))}
          </div>

          {/* Filtros - Tags/Chips */}
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

          {/* Seção de Meditações */}
          <ContentSection
            title="Meditações"
            onViewAll={() => {}}
            emptyState="Nenhuma meditação encontrada com esses filtros"
          >
            {meditacoesFiltradas.map((meditacao) => (
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

      {/* Modais */}
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onUpgrade={() => console.log("Upgrade realizado!")}
        feature={selectedMeditation?.title}
      />

      {selectedMeditation && (
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
