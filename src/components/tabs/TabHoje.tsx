"use client";

import { GamificationCard } from "@/components/GamificationCard";
import { HojeSteps } from "@/components/HojeSteps";
import { CalendarioFavoritosModal } from "@/components/CalendarioFavoritosModal";
import { UserHeader } from "@/components/layout/UserHeader";
import { useUserStore } from "@/stores/userStore";
import { useProgressStore } from "@/stores/progressStore";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Flame } from "lucide-react";

export function TabHoje() {
  const [calendarioOpen, setCalendarioOpen] = useState(false);
  const { data: session } = useSession();
  const user = useUserStore((s) => s.user);
  const { progress } = useProgressStore();

  const displayName = user?.name || session?.user?.name || "Visitante";

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header reutilizável com avatar Google + ProfileModal */}
        <UserHeader
          title="Cresça com Deus"
          subtitleElement={
            <button
              onClick={() => setCalendarioOpen(true)}
              className="text-sm text-[#FB923C] font-medium hover:text-[#EA580C] transition-colors"
            >
              VER CALENDÁRIO &amp; FAVORITOS
            </button>
          }
          rightElement={
            <>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white shadow-sm">
                <Flame className="w-4 h-4 text-[#FB923C]" />
                <span className="text-sm font-semibold text-[#1F2937]">{progress.currentStreak}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#6B7280]">
                <span className="text-lg">👥</span>
              </div>
            </>
          }
        />

        {/* Saudação personalizada */}
        <div className="space-y-2">
          <h2 className="text-xl text-[#6B7280]">
            Bom dia, <span className="font-semibold text-[#1F2937]">{displayName.split(' ')[0]}</span>!
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-[#1F2937] leading-tight">
            Vamos cultivar sua Árvore da Vida hoje?
          </h3>
        </div>

        {/* Data e tema do dia (opcional) */}
        <p className="text-sm text-[#6B7280]">
          {new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}{" "}
          · Mansidão e Majestade
        </p>

        {/* 4 etapas em cards + botão Concluir */}
        <HojeSteps />

        {/* Bloco Essenciais da Fé (como na referência) */}
        <div className="flex items-center justify-between pt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6B7280]">
            Essenciais da Fé
          </h3>
          <button className="text-sm font-medium text-[#FB923C]">VER TUDO &gt;</button>
        </div>

        {/* Card resumo da jornada (streak, XP, árvore) */}
        <GamificationCard />
      </div>

      <CalendarioFavoritosModal isOpen={calendarioOpen} onClose={() => setCalendarioOpen(false)} />
    </div>
  );
}
