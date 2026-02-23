"use client";

import { GamificationCard } from "@/components/GamificationCard";
import { HojeSteps } from "@/components/HojeSteps";
import { CalendarioFavoritosModal } from "@/components/CalendarioFavoritosModal";
import { JourneyDetailsModal } from "@/components/JourneyDetailsModal";
import { UserHeader } from "@/components/layout/UserHeader";
import { useUserStore } from "@/stores/userStore";
import { useProgressStore } from "@/stores/progressStore";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Flame } from "lucide-react";

export function TabHoje() {
  const [calendarioOpen, setCalendarioOpen] = useState(false);
  const [journeyModalOpen, setJourneyModalOpen] = useState(false);
  const { user: authUser } = useAuth();
  const user = useUserStore((s) => s.user);
  const { progress } = useProgressStore();

  const displayName = user?.name || authUser?.user_metadata?.full_name || "Visitante";

  return (
    <div className="min-h-screen bg-bg-primary p-6 pb-28">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header reutilizável com avatar Google + ProfileModal */}
        <UserHeader
          title="Cresça com Deus"
          subtitleElement={
            <button
              onClick={() => setCalendarioOpen(true)}
              className="text-sm text-orange-500 font-medium hover:text-orange-600 transition-colors"
            >
              VER CALENDÁRIO &amp; FAVORITOS
            </button>
          }
          rightElement={
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-bg-secondary shadow-sm border border-border-subtle">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-text-primary">{progress.currentStreak}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-bg-secondary shadow-sm border border-border-subtle flex items-center justify-center text-text-secondary">
                <span className="text-lg">👥</span>
              </div>
            </>
          }
        />

        {/* Saudação personalizada */}
        <div className="space-y-2">
          <h2 className="text-lg text-text-secondary">
            Bom dia, <span className="font-semibold text-text-primary">{displayName.split(' ')[0]}</span>!
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight">
            Vamos cultivar sua Árvore da Vida hoje?
          </h3>
        </div>

        {/* Data e tema do dia (opcional) */}
        <p className="text-sm text-text-secondary">
          {new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}{' '}
          · Mansidão e Majestade
        </p>

        {/* 4 etapas em cards + botão Concluir */}
        <HojeSteps />

        {/* Bloco Essenciais da Fé (como na referência) */}
        <div className="flex items-center justify-between pt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Essenciais da Fé
          </h3>
          <button
            onClick={() => setJourneyModalOpen(true)}
            className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
          >
            VER TUDO &gt;
          </button>
        </div>

        {/* Card resumo da jornada (streak, XP, árvore) */}
        <GamificationCard />
      </div>

      <CalendarioFavoritosModal isOpen={calendarioOpen} onClose={() => setCalendarioOpen(false)} />
      <JourneyDetailsModal isOpen={journeyModalOpen} onClose={() => setJourneyModalOpen(false)} />
    </div>
  );
}
