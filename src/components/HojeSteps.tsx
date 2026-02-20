"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  BookOpen,
  MessageCircle,
  Bird,
  CheckCircle,
  Volume2,
  ChevronDown,
  X,
} from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";
import { useUserStore } from "@/stores/userStore";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { ImmersiveAudioPlayer } from "./ImmersiveAudioPlayer";
import { getVersiculoDoDia } from "@/data/versiculos";
import { getPassagemDoDia } from "@/data/passagens-diarias";
import { getOracaoDoDia } from "@/data/oracoes-diarias";

const DEVOCIONAL_FIXO = {
  refBiblica: "Efésios 3:14-16",
  titulo: "Mansidão e Majestade",
  texto: `"Por esta razão, me ponho de joelhos diante do Pai, de quem recebe o nome toda família no céu e na terra. Peço que, segundo a riqueza da sua glória, ele os fortaleça com poder por meio do seu Espírito no homem interior."
— Efésios 3:14-16 (NVI)

Reflexão do dia:

Paulo escreve esta oração do cárcere, não de um trono. E, mesmo assim, ele se ajoelha diante do Pai com ousadia e confiança. Isso nos ensina algo profundo: a mansidão não é fraqueza — é força direcionada.

Quando entendemos a majestade do Pai, a resposta natural é a reverência. Não o medo paralisante, mas o assombro que nos faz querer ficar mais perto d'Ele.

Hoje, permita que esta passagem te lembre que você tem acesso direto ao Criador de todas as coisas. Ele quer te fortalecer no homem interior — aquela parte de você que ninguém vê, mas que governa tudo o que você é.

Perguntas para reflexão:
• Onde você está buscando força hoje?
• Você tem se ajoelhado diante de Deus com confiança, sabendo quem Ele é?
• Como a mansidão pode ser uma forma de força em suas relações hoje?`,
};

type EtapaId = "versiculo" | "passagem" | "devocional" | "oracao";

export function HojeSteps() {
  const [completados, setCompletados] = useState<Set<EtapaId>>(new Set());
  const [expandido, setExpandido] = useState<EtapaId | null>(null);
  const [playerAberto, setPlayerAberto] = useState(false);
  const [lerAberto, setLerAberto] = useState(false);

  const { completeDay } = useProgressStore();
  const user = useUserStore((s) => s.user);
  const isPlus = user?.isPlus ?? false;
  const { dayCompleted } = useToast();

  // Conteúdo do dia calculado uma única vez por render
  const versiculoDoDia = useMemo(() => getVersiculoDoDia(), []);
  const passagemDoDia = useMemo(() => getPassagemDoDia(), []);
  const oracaoDoDia = useMemo(() => getOracaoDoDia(), []);

  const toggleEtapa = (id: EtapaId) => {
    setCompletados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpandido = (id: EtapaId) => {
    setExpandido((prev) => (prev === id ? null : id));
    // Marcar como lido automaticamente ao expandir
    if (!completados.has(id)) {
      toggleEtapa(id);
    }
  };

  const handleConcluirDia = () => {
    completeDay();
    dayCompleted();
  };

  return (
    <>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6B7280]">
          Devocional diário
        </h2>

        {/* ─── Card: Versículo do Dia ─── */}
        <motion.div
          layout
          className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB]/80 overflow-hidden"
        >
          <div className="flex items-center gap-4 p-4">
            {/* Checkbox */}
            <button
              onClick={() => toggleEtapa("versiculo")}
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#E5E7EB] hover:border-[#10B981] transition-colors"
            >
              {completados.has("versiculo") ? (
                <CheckCircle className="w-5 h-5 text-[#10B981]" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-[#9CA3AF]" />
              )}
            </button>

            {/* Conteúdo clicável para expandir */}
            <button
              onClick={() => toggleExpandido("versiculo")}
              className="flex-1 min-w-0 text-left"
            >
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 shrink-0 text-[#1F2937]" />
                <span className="font-medium text-[#1F2937]">Versículo do Dia</span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5 truncate">
                {versiculoDoDia.referencia} — toque para ler
              </p>
            </button>

            <button
              onClick={() => toggleExpandido("versiculo")}
              className="shrink-0 p-1"
            >
              <motion.div animate={{ rotate: expandido === "versiculo" ? 180 : 0 }}>
                <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
              </motion.div>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {expandido === "versiculo" && (
              <motion.div
                key="versiculo-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-5 pt-1 border-t border-[#F3F4F6]">
                  <div className="bg-gradient-to-br from-[#F8F4FF] to-[#EEF2FF] rounded-xl p-4">
                    <p className="text-[#1F2937] text-base leading-relaxed italic font-medium">
                      "{versiculoDoDia.texto}"
                    </p>
                    <p className="text-[#6B4CE6] text-sm font-semibold mt-3">
                      — {versiculoDoDia.referencia}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── Card: Passagem Bíblica ─── */}
        <motion.div
          layout
          className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB]/80 overflow-hidden"
        >
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => toggleEtapa("passagem")}
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#E5E7EB] hover:border-[#10B981] transition-colors"
            >
              {completados.has("passagem") ? (
                <CheckCircle className="w-5 h-5 text-[#10B981]" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-[#9CA3AF]" />
              )}
            </button>

            <button
              onClick={() => toggleExpandido("passagem")}
              className="flex-1 min-w-0 text-left"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 shrink-0 text-[#1F2937]" />
                <span className="font-medium text-[#1F2937]">Passagem Bíblica</span>
              </div>
              <p className="text-xs text-[#FB923C] font-medium mt-0.5 truncate">
                {passagemDoDia.titulo}
              </p>
            </button>

            <button
              onClick={() => toggleExpandido("passagem")}
              className="shrink-0 p-1"
            >
              <motion.div animate={{ rotate: expandido === "passagem" ? 180 : 0 }}>
                <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
              </motion.div>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {expandido === "passagem" && (
              <motion.div
                key="passagem-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-5 pt-1 border-t border-[#F3F4F6] space-y-4">
                  {/* Passagem bíblica */}
                  <div className="bg-[#FFFBEB] rounded-xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#F59E0B] mb-2">
                      {passagemDoDia.referencia}
                    </p>
                    <p className="text-[#1F2937] text-sm leading-relaxed italic">
                      "{passagemDoDia.texto}"
                    </p>
                  </div>

                  {/* Reflexão */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-2">
                      Reflexão
                    </p>
                    <p className="text-[#374151] text-sm leading-relaxed">
                      {passagemDoDia.reflexao}
                    </p>
                  </div>

                  {/* Perguntas */}
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── Card: Devocional ─── */}
        <motion.div
          layout
          className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB]/80 p-4"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleEtapa("devocional")}
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#E5E7EB] hover:border-[#10B981] transition-colors"
            >
              {completados.has("devocional") ? (
                <CheckCircle className="w-5 h-5 text-[#10B981]" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-[#9CA3AF]" />
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

        {/* ─── Card: Oração do Dia ─── */}
        <motion.div
          layout
          className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB]/80 overflow-hidden"
        >
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => toggleEtapa("oracao")}
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#E5E7EB] hover:border-[#10B981] transition-colors"
            >
              {completados.has("oracao") ? (
                <CheckCircle className="w-5 h-5 text-[#10B981]" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-[#9CA3AF]" />
              )}
            </button>

            <button
              onClick={() => toggleExpandido("oracao")}
              className="flex-1 min-w-0 text-left"
            >
              <div className="flex items-center gap-2">
                <Bird className="w-5 h-5 shrink-0 text-[#1F2937]" />
                <span className="font-medium text-[#1F2937]">Oração do Dia</span>
              </div>
              <p className="text-xs text-[#10B981] font-medium mt-0.5 truncate">
                {oracaoDoDia.titulo} · {oracaoDoDia.tema}
              </p>
            </button>

            <button
              onClick={() => toggleExpandido("oracao")}
              className="shrink-0 p-1"
            >
              <motion.div animate={{ rotate: expandido === "oracao" ? 180 : 0 }}>
                <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
              </motion.div>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {expandido === "oracao" && (
              <motion.div
                key="oracao-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-5 pt-1 border-t border-[#F3F4F6]">
                  <div className="bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] rounded-xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#10B981] mb-3">
                      {oracaoDoDia.titulo}
                    </p>
                    <p className="text-[#1F2937] text-sm leading-relaxed">
                      {oracaoDoDia.texto}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Botão Concluir */}
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

      {/* Player de áudio do devocional */}
      <ImmersiveAudioPlayer
        isOpen={playerAberto}
        onClose={() => setPlayerAberto(false)}
        titulo={DEVOCIONAL_FIXO.titulo}
        texto={DEVOCIONAL_FIXO.texto}
        isPlus={isPlus}
      />

      {/* Modal de leitura do devocional */}
      <AnimatePresence>
        {lerAberto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[1000] flex items-end"
            onClick={() => setLerAberto(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white rounded-t-3xl w-full max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-[#F3F4F6]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#FB923C]">
                      Devocional
                    </span>
                    <h2 className="text-xl font-bold text-[#1F2937] mt-0.5">
                      {DEVOCIONAL_FIXO.titulo}
                    </h2>
                    <p className="text-sm text-[#6B7280] mt-0.5">{DEVOCIONAL_FIXO.refBiblica}</p>
                  </div>
                  <button
                    onClick={() => setLerAberto(false)}
                    className="p-2 rounded-xl hover:bg-[#F9FAFB] transition-colors"
                  >
                    <X className="w-5 h-5 text-[#6B7280]" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                <p className="text-[#1F2937] leading-relaxed whitespace-pre-wrap text-base">
                  {DEVOCIONAL_FIXO.texto}
                </p>
              </div>

              <div className="px-6 pb-8">
                <button
                  onClick={() => setLerAberto(false)}
                  className="w-full py-4 bg-[#1F2937] text-white font-semibold rounded-2xl hover:bg-[#374151] transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
