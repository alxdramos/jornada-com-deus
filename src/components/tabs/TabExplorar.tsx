"use client";

import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { UserHeader } from "@/components/layout/UserHeader";
import { Heart } from "lucide-react";
import { PaywallModal } from "@/components/PaywallModal";
import { MeditationPlayer } from "@/components/MeditationPlayer";
import { useFavorites } from "@/hooks/useFavorites";

// Sub-componentes
import { ExploreFilters } from "./explorar/ExploreFilters";
import { MeditationCard } from "./explorar/MeditationCard";
import { ContentSection } from "./explorar/ContentSection";
import { AllContentModal } from "./explorar/AllContentModal";

// Dados
import { MEDITACOES, CARDS_ESCRITURAS, CARDS_NOVO, MeditationCard as MeditationCardType } from "@/data/meditacoes";

export function TabExplorar() {
  const user = useUserStore((s) => s.user);
  const isPlus = user?.isPlus ?? false;
  const { toggleFavorite, isFavorite } = useFavorites();

  // Estados
  const [catAtiva, setCatAtiva] = useState("TUDO");
  const [chipAtivo, setChipAtivo] = useState("TUDO");
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationCardType | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'meditacoes' | 'escrituras' | 'novo'>('meditacoes');

  // Filtrar meditações
  const meditatacoesFiltradas = MEDITACOES.filter(med => {
    const categoriaMatch = catAtiva === "TUDO" || med.category === catAtiva;
    const chipMatch = chipAtivo === "TUDO" || med.tags.includes(chipAtivo);
    return categoriaMatch && chipMatch;
  });

  // Handlers
  const handlePlayMeditation = (meditation: MeditationCardType) => {
    if (meditation.plus && !isPlus) {
      setSelectedMeditation(meditation);
      setPaywallOpen(true);
    } else {
      setSelectedMeditation(meditation);
      setPlayerOpen(true);
    }
  };

  const togglePlusForTesting = () => {
    const { togglePlus } = useUserStore.getState();
    togglePlus();
    window.location.reload();
  };

  return (
    <>
      <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <UserHeader
            title="Explorar"
            rightElement={
              <>
                <button
                  onClick={togglePlusForTesting}
                  className="px-2 py-1 bg-[#10B981] text-white text-xs rounded hover:bg-[#059669] transition-colors"
                  title={isPlus ? "Desativar Plus (debug)" : "Ativar Plus (debug)"}
                >
                  {isPlus ? "PLUS" : "FREE"}
                </button>
                <button className="flex items-center gap-1 text-[#FB923C]">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">Favoritos</span>
                </button>
              </>
            }
          />

          {/* Filtros */}
          <ExploreFilters
            categoryActive={catAtiva}
            chipActive={chipAtivo}
            onCategoryChange={setCatAtiva}
            onChipChange={setChipAtivo}
          />

          {/* Seção Meditações */}
          <ContentSection
            title="Meditações"
            onViewAll={() => {
              setSelectedSection('meditacoes');
              setShowAllModal(true);
            }}
          >
            {meditatacoesFiltradas.map((med) => (
              <MeditationCard
                key={med.id}
                meditation={med}
                isPlus={isPlus}
                isFavorite={isFavorite(med.id)}
                onPlay={handlePlayMeditation}
                onFavorite={toggleFavorite}
              />
            ))}
          </ContentSection>

          {/* Seção Escrituras */}
          <ContentSection
            title="Escrituras"
            onViewAll={() => {
              setSelectedSection('escrituras');
              setShowAllModal(true);
            }}
          >
            {CARDS_ESCRITURAS.map((card) => (
              <MeditationCard
                key={card.id}
                meditation={card}
                isPlus={isPlus}
                isFavorite={isFavorite(card.id)}
                onPlay={handlePlayMeditation}
                onFavorite={toggleFavorite}
              />
            ))}
          </ContentSection>

          {/* Seção Novo */}
          <ContentSection
            title="Tudo novo, de novo"
            onViewAll={() => {
              setSelectedSection('novo');
              setShowAllModal(true);
            }}
          >
            {CARDS_NOVO.map((card) => (
              <MeditationCard
                key={card.id}
                meditation={card}
                isPlus={isPlus}
                isFavorite={isFavorite(card.id)}
                onPlay={handlePlayMeditation}
                onFavorite={toggleFavorite}
              />
            ))}
          </ContentSection>
        </div>

        {/* Modais */}
        <PaywallModal
          isOpen={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          onUpgrade={() => console.log("Upgrade realizado!")}
          feature={selectedMeditation?.title}
        />

        {selectedMeditation && (
          <MeditationPlayer
            isOpen={playerOpen}
            onClose={() => setPlayerOpen(false)}
            titulo={selectedMeditation.title}
            descricao={selectedMeditation.description}
            duracao={selectedMeditation.duration}
            isPlus={isPlus || !selectedMeditation.plus}
            audioUrl={selectedMeditation.audioUrl}
          />
        )}

        <AllContentModal
          isOpen={showAllModal}
          onClose={() => setShowAllModal(false)}
          section={selectedSection}
          isPlus={isPlus}
          onPlayMeditation={handlePlayMeditation}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </>
  );
}
