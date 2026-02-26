"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Quote, BookOpen, MessageCircle, Bird, Volume2 } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { cn } from "@/lib/utils";
import { useHojeSteps } from "@/hooks/useHojeSteps";
import { DEVOCIONAL_FIXO } from "@/data/hojeSteps";
import { ImmersiveAudioPlayer } from "./ImmersiveAudioPlayer";
import { ExpandableStepCard } from "./hoje/ExpandableStepCard";
import { DevocionalReadModal } from "./hoje/DevocionalReadModal";
import { getVersiculoDoDia } from "@/data/versiculos";
import { getPassagemDoDia } from "@/data/passagens-diarias";
import { getOracaoDoDia } from "@/data/oracoes-diarias";

export function HojeSteps() {
  const {
    completados,
    expandido,
    playerAberto,
    lerAberto,
    todayDone,
    toggleEtapa,
    toggleExpandido,
    setPlayerAberto,
    setLerAberto,
    handleConcluirDia
  } = useHojeSteps();

  const user = useUserStore((s) => s.user);
  const isPlus = user?.isPlus ?? false;

  const versiculoDoDia = useMemo(() => getVersiculoDoDia(), []);
  const passagemDoDia = useMemo(() => getPassagemDoDia(), []);
  const oracaoDoDia = useMemo(() => getOracaoDoDia(), []);

  return (
    <>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6B7280]">
          Devocional diário
        </h2>

        {/* Versículo do Dia */}
        <ExpandableStepCard
          icon={Quote}
          title="Versículo do Dia"
          subtitle={`${versiculoDoDia.referencia} — toque para ler`}
          isCompleted={completados.has("versiculo")}
          isExpanded={expandido === "versiculo"}
          onToggleComplete={() => toggleEtapa("versiculo")}
          onToggleExpand={() => toggleExpandido("versiculo")}
        >
          <div className="bg-gradient-to-br from-[#F8F4FF] to-[#EEF2FF] rounded-xl p-4">
            <p className="text-[#1F2937] text-base leading-relaxed italic font-medium">
              "{versiculoDoDia.texto}"
            </p>
            <p className="text-[#6B4CE6] text-sm font-semibold mt-3">
              — {versiculoDoDia.referencia}
            </p>
          </div>
        </ExpandableStepCard>

        {/* Passagem Bíblica */}
        <ExpandableStepCard
          icon={BookOpen}
          title="Passagem Bíblica"
          subtitle={passagemDoDia.titulo}
          isCompleted={completados.has("passagem")}
          isExpanded={expandido === "passagem"}
          onToggleComplete={() => toggleEtapa("passagem")}
          onToggleExpand={() => toggleExpandido("passagem")}
        >
          <div className="space-y-4">
            <div className="bg-[#FFFBEB] rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F59E0B] mb-2">
                {passagemDoDia.referencia}
              </p>
              <p className="text-[#1F2937] text-sm leading-relaxed italic">
                "{passagemDoDia.texto}"
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-2">
                Reflexão
              </p>
              <p className="text-[#374151] text-sm leading-relaxed">
                {passagemDoDia.reflexao}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-2">
                Para pensar hoje
              </p>
              <div className="space-y-2">
                {passagemDoDia.perguntas.map((pergunta, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#FB923C] font-bold text-sm shrink-0 mt-0.5">
                      {i + 1}.
                    </span>
                    <p className="text-[#374151] text-sm leading-relaxed">{pergunta}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ExpandableStepCard>

        {/* Devocional */}
        <motion.div
          layout
          className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB]/80 p-4"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleEtapa("devocional")}
              aria-label={completados.has("devocional") ? 'Desmarcar "Devocional" como concluído' : 'Marcar "Devocional" como concluído'}
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#E5E7EB] hover:border-[#10B981] transition-colors"
            >
              {completados.has("devocional") ? (
                <div className="w-5 h-5 text-[#10B981]" aria-hidden="true">✓</div>
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-[#9CA3AF]" aria-hidden="true" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 shrink-0 text-[#FB923C]" />
                <span className="font-medium text-[#1F2937]">Devocional</span>
              </div>
              <p className="text-sm font-semibold text-[#1F2937] mt-0.5">
                {DEVOCIONAL_FIXO.refBiblica}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setPlayerAberto(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1F2937] text-white text-sm font-medium"
                >
                  <Volume2 className="w-4 h-4" />
                  OUVIR
                </button>
                <button
                  onClick={() => setLerAberto(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1F2937] text-white text-sm font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  LER
                </button>
              </div>
            </div>

            <span className="text-sm text-[#6B7280] shrink-0">4 min</span>
          </div>
        </motion.div>

        {/* Oração do Dia */}
        <ExpandableStepCard
          icon={Bird}
          title="Oração do Dia"
          subtitle={`${oracaoDoDia.titulo} · ${oracaoDoDia.tema}`}
          isCompleted={completados.has("oracao")}
          isExpanded={expandido === "oracao"}
          onToggleComplete={() => toggleEtapa("oracao")}
          onToggleExpand={() => toggleExpandido("oracao")}
        >
          <div className="bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#10B981] mb-3">
              {oracaoDoDia.titulo}
            </p>
            <p className="text-[#1F2937] text-sm leading-relaxed">
              {oracaoDoDia.texto}
            </p>
          </div>
        </ExpandableStepCard>
      </div>

      {todayDone ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "w-full py-4 px-6 rounded-2xl font-semibold text-lg text-center",
            "bg-gradient-to-r from-[#10B981]/20 to-[#059669]/20",
            "border-2 border-[#10B981] text-[#059669]",
            "mt-8"
          )}
        >
          ✅ Dia concluído! Volte amanhã.
        </motion.div>
      ) : (
        <motion.button
          onClick={handleConcluirDia}
          className={cn(
            "w-full py-4 px-6 rounded-2xl font-semibold text-lg text-white",
            "bg-gradient-to-r from-[#FB923C] to-[#10B981]",
            "hover:opacity-95 active:scale-[0.98] transition-all",
            "shadow-lg mt-8"
          )}
        >
          Concluir meu dia hoje
        </motion.button>
      )}

      <ImmersiveAudioPlayer
        isOpen={playerAberto}
        onClose={() => setPlayerAberto(false)}
        titulo={DEVOCIONAL_FIXO.titulo}
        texto={DEVOCIONAL_FIXO.texto}
        isPlus={isPlus}
      />

      <DevocionalReadModal
        isOpen={lerAberto}
        onClose={() => setLerAberto(false)}
      />
    </>
  );
}
