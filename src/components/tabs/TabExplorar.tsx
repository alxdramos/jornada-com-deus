"use client";

import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useTabStore } from "@/stores/tabStore";
import { UserHeader } from "@/components/layout/UserHeader";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

// Sub-componentes
import { ExploreFilters } from "./explorar/ExploreFilters";
import { MeditationCard } from "./explorar/MeditationCard";
import { ContentSection } from "./explorar/ContentSection";

// Dados
import { MEDITACOES, CARDS_ESCRITURAS, CARDS_NOVO, MeditationCard as MeditationCardType } from "@/data/meditacoes";

export function TabExplorar() {
  const user = useUserStore((s) => s.user);
  const isPlus = user?.isPlus ?? false;
  const { toggleFavorite, isFavorite } = useFavorites();
  const { setActiveTab } = useTabStore();

  // Estados
  const [catAtiva, setCatAtiva] = useState("TUDO");
  const [chipAtivo, setChipAtivo] = useState("TUDO");

  // Gerar chips dinamicamente das tags reais
  const tagsUnicas = Array.from(new Set(MEDITACOES.flatMap(m => m.tags))).sort();
  const CHIPS = ["TUDO", ...tagsUnicas];

  // Filtrar meditações
  const meditatacoesFiltradas = MEDITACOES.filter(med => {
    const categoriaMatch = catAtiva === "TUDO" || med.category === catAtiva;
    const chipMatch = chipAtivo === "TUDO" || med.tags.includes(chipAtivo);
    return categoriaMatch && chipMatch;
  });

  // Handlers
  const handleViewAllMeditacoes = () => {
    setActiveTab('meditacoes');
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
            chips={CHIPS}
            onCategoryChange={setCatAtiva}
            onChipChange={setChipAtivo}
          />

          {/* Seção Meditações - Preview com 4 cards */}
          <ContentSection
            title="Meditações"
            onViewAll={handleViewAllMeditacoes}
          >
            {meditatacoesFiltradas.slice(0, 4).map((med) => (
              <MeditationCard
                key={med.id}
                meditation={med}
                isPlus={isPlus}
                isFavorite={isFavorite(med.id)}
                onPlay={() => handleViewAllMeditacoes()}
                onFavorite={toggleFavorite}
              />
            ))}
          </ContentSection>

          {/* Seção Escrituras */}
          <ContentSection
            title="Escrituras"
            onViewAll={() => {}}
          >
            {CARDS_ESCRITURAS.map((card) => (
              <MeditationCard
                key={card.id}
                meditation={card}
                isPlus={isPlus}
                isFavorite={isFavorite(card.id)}
                onPlay={() => {}}
                onFavorite={toggleFavorite}
              />
            ))}
          </ContentSection>

          {/* Seção Novo */}
          <ContentSection
            title="Tudo novo, de novo"
            onViewAll={() => {}}
          >
            {CARDS_NOVO.map((card) => (
              <MeditationCard
                key={card.id}
                meditation={card}
                isPlus={isPlus}
                isFavorite={isFavorite(card.id)}
                onPlay={() => {}}
                onFavorite={toggleFavorite}
              />
            ))}
          </ContentSection>
        </div>
      </div>
    </>
  );
}
