"use client";

import { useState, useEffect } from "react";
import { ORACOES, Prayer } from "@/data/oracoes";
import { UserHeader } from "@/components/layout/UserHeader";
import { Chip } from "@/components/atoms/Chip";
import { ContentSection } from "./explorar/ContentSection";
import { OracoesModal } from "./oracoes/OracoesModal";
import { PrayerDetailModalWithPlayer } from "./oracoes/PrayerDetailModalWithPlayer";
import { PrayerCard } from "./oracoes/PrayerCard";
import { PaywallModal } from "@/components/PaywallModal";
import { useSubscription } from "@/hooks/useSubscription";
import { ImageCardSkeleton } from "@/components/ui/Skeleton";
import { Bird } from "lucide-react";
import { EmptyFilteredContent } from "@/components/EmptyStates";

export function TabOracoes() {
  const { isPlusUser: isPlus } = useSubscription();
  const [hydrated, setHydrated] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [chipAtivo, setChipAtivo] = useState("TUDO");
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState('');

  // Gerar chips dinamicamente a partir dos themes das orações
  const temasUnicos = Array.from(new Set(ORACOES.map(o => o.theme))).filter(t => t && t !== "default").sort();
  const CHIPS = ["TUDO", ...temasUnicos];

  // Filtrar orações apenas por chips
  const oracoesFiltradas = ORACOES.filter(oracao => {
    const chipMatch = chipAtivo === "TUDO" || oracao.theme === chipAtivo;
    return chipMatch;
  });

  // Pega apenas os primeiros 4 itens para a lista inicial
  const inicialOracoes = oracoesFiltradas.slice(0, 4);

  // Handlers
  const handleViewDetails = (prayer: Prayer) => {
    if (prayer.plus && !isPlus) {
      setPaywallFeature(prayer.title);
      setPaywallOpen(true);
    } else {
      setSelectedPrayer(prayer);
      setShowDetailModal(true);
    }
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

  useEffect(() => { setHydrated(true); }, []);

  return (
    <>
      <div className="min-h-screen bg-bg-primary p-6 pb-36">
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

          {/* Seção de Orações */}
          <ContentSection
            title="Orações"
            onViewAll={() => setShowAllModal(true)}
          >
            {!hydrated
              ? [1, 2, 3, 4].map((i) => <ImageCardSkeleton key={i} />)
              : oracoesFiltradas.length === 0 && chipAtivo !== "TUDO"
              ? <EmptyFilteredContent category={chipAtivo} />
              : inicialOracoes.map((oracao) => (
                  <PrayerCard
                    key={oracao.id}
                    prayer={{
                      id: oracao.id,
                      title: oracao.titulo,
                      content: oracao.texto,
                      category: oracao.theme && oracao.theme !== "default" ? oracao.theme : "Geral",
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

      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        feature={paywallFeature}
      />
    </>
  );
}
