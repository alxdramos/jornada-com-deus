"use client";

import { useState } from "react";
import { ORACOES, Prayer } from "@/data/oracoes";
import { UserHeader } from "@/components/layout/UserHeader";
import { ContentSection } from "./explorar/ContentSection";
import { OracoesModal } from "./oracoes/OracoesModal";
import { PrayerDetailModalWithPlayer } from "./oracoes/PrayerDetailModalWithPlayer";
import { PrayerCard } from "./oracoes/PrayerCard";
import { Bird } from "lucide-react";

export function TabOracoes() {
  const [showAllModal, setShowAllModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Handlers
  const handleViewDetails = (prayer: Prayer) => {
    setSelectedPrayer(prayer);
    setShowDetailModal(true);
  };

  const toggleFavorite = (prayerId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(prayerId)) {
        next.delete(prayerId);
      } else {
        next.add(prayerId);
      }
      return next;
    });
  };

  const isFavorite = (id: string) => favorites.has(id);

  // Pega apenas os primeiros 4 itens para a lista inicial
  const inicialOracoes = ORACOES.slice(0, 4);

  return (
    <>
      <div className="min-h-screen bg-bg-primary p-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header padronizado */}
          <UserHeader
            title="Orações"
            rightElement={
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Bird className="w-5 h-5 text-green-500" />
              </div>
            }
          />

          {/* Seção de Orações */}
          <ContentSection
            title="Orações"
            onViewAll={() => setShowAllModal(true)}
          >
            {inicialOracoes.map((oracao) => (
              <PrayerCard
                key={oracao.id}
                prayer={{
                  id: oracao.id,
                  title: oracao.titulo,
                  content: oracao.texto,
                  category: "Geral",
                  isCustom: false,
                  createdAt: new Date(oracao.createdAt),
                  audioUrl: oracao.audioUrl,
                  duration: oracao.duration,
                  imagem: oracao.imagem,
                }}
                isFavorite={isFavorite(oracao.id)}
                onToggleFavorite={toggleFavorite}
                onViewDetails={handleViewDetails}
              />
            ))}
          </ContentSection>
        </div>
      </div>

      {/* Modal com todas as orações (20 por página) */}
      {showAllModal && (
        <OracoesModal
          isOpen={showAllModal}
          onClose={() => setShowAllModal(false)}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Modal de detalhe com player */}
      {showDetailModal && selectedPrayer && (
        <PrayerDetailModalWithPlayer
          prayer={selectedPrayer}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPrayer(null);
          }}
          isFavorite={isFavorite(selectedPrayer.id)}
          onToggleFavorite={toggleFavorite}
          onDeletePrayer={() => {
            setShowDetailModal(false);
            setSelectedPrayer(null);
          }}
        />
      )}
    </>
  );
}
