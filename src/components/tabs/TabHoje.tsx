"use client";

import { GamificationCard } from "@/components/GamificationCard";
import { HojeSteps } from "@/components/HojeSteps";
import { CalendarioFavoritosModal } from "@/components/CalendarioFavoritosModal";
import { JourneyDetailsModal } from "@/components/JourneyDetailsModal";
import { UserHeader } from "@/components/layout/UserHeader";
import { getGreeting } from "@/components/VerseOfDayCard";
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
  const firstName = displayName.split(" ")[0];
  const greeting = getGreeting();

  return (
    <div className="relative min-h-screen bg-bg-primary p-6 pb-36">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header reutilizável com avatar Google + ProfileModal */}
        <UserHeader
          title="Minha Jornada Diária"
          subtitleElement={
            <button
              onClick={() => setCalendarioOpen(true)}
              className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-700 dark:hover:text-violet-300 transition-colors uppercase tracking-wide"
            >
              Ver Calendário &amp; Favoritos
            </button>
          }
          rightElement={
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-200/60 dark:border-orange-700/30 shadow-sm">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                {progress.currentStreak}
              </span>
            </div>
          }
        />

        {/* Saudação personalizada por horário */}
        <div className="space-y-1 pt-1">
          <p className="text-sm text-text-secondary font-medium">
            {greeting},{" "}
            <span className="text-text-primary font-semibold">{firstName}</span>!
          </p>
          <h2
            className="text-2xl font-bold text-text-primary leading-snug"
            style={{ fontFamily: "var(--font-lora), Lora, Georgia, serif" }}
          >
            Vamos cultivar sua Árvore da Vida hoje?
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* 4 etapas do dia + botão Concluir */}
        <HojeSteps />

        {/* Cabeçalho da seção de jornada */}
        <div className="flex items-center justify-between pt-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Sua Jornada
          </h3>
          <button
            onClick={() => setJourneyModalOpen(true)}
            className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors uppercase tracking-wide"
          >
            Ver Detalhes &rsaquo;
          </button>
        </div>

        {/* Card de gamificação (streak, XP, árvore) */}
        <GamificationCard />
      </div>

      <CalendarioFavoritosModal isOpen={calendarioOpen} onClose={() => setCalendarioOpen(false)} />
      <JourneyDetailsModal isOpen={journeyModalOpen} onClose={() => setJourneyModalOpen(false)} />
    </div>
  );
}
