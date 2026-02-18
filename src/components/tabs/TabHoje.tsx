"use client";

import { GamificationCard } from "@/components/GamificationCard";
import { HojeSteps } from "@/components/HojeSteps";
import { ProfileModal } from "@/components/ProfileModal";
import { useUserStore } from "@/stores/userStore";
import { useProgressStore } from "@/stores/progressStore";
import { useState } from "react";
import { Flame } from "lucide-react";

export function TabHoje() {
  const [profileOpen, setProfileOpen] = useState(false);
  const user = useUserStore((s) => s.user);
  const { progress } = useProgressStore();

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header: avatar + Cresça com Deus + streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setProfileOpen(true)}
              className="w-12 h-12 rounded-full bg-[#FB923C] flex items-center justify-center text-white font-bold text-lg shrink-0"
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#1F2937]">Cresça com Deus</h1>
              <button className="text-sm text-[#FB923C] font-medium">
                VER CALENDÁRIO & FAVORITOS
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white shadow-sm">
              <Flame className="w-4 h-4 text-[#FB923C]" />
              <span className="text-sm font-semibold text-[#1F2937]">{progress.currentStreak}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#6B7280]">
              <span className="text-lg">👥</span>
            </div>
          </div>
        </div>

        {/* Título grande */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] leading-tight">
          Seu momento com Deus hoje
        </h2>

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

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
