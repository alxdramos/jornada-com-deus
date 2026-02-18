"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  BookOpen,
  MessageCircle,
  Bird,
  CheckCircle,
  Volume2,
  BookOpen as ReadIcon,
  X,
} from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";
import { useUserStore } from "@/stores/userStore";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { ImmersiveAudioPlayer } from "./ImmersiveAudioPlayer";

const ETAPAS = [
  {
    id: "versiculo",
    titulo: "Versículo do Dia",
    duracao: "1 min",
    icone: Quote,
    refBiblica: null,
    temAudio: false,
    temOracao: false,
  },
  {
    id: "passagem",
    titulo: "Passagem Bíblica",
    duracao: "1 min",
    icone: BookOpen,
    refBiblica: null,
    temAudio: false,
    temOracao: false,
  },
  {
    id: "devocional",
    titulo: "Devocional",
    duracao: "4 min",
    icone: MessageCircle,
    refBiblica: "Efésios 3:14-16",
    temAudio: true,
    temOracao: false,
  },
  {
    id: "oracao",
    titulo: "Oração",
    duracao: "1 min",
    icone: Bird,
    refBiblica: null,
    temAudio: false,
    temOracao: true,
  },
] as const;

const ORACAO_EXEMPLO = {
  titulo: "Oração da Paz",
  texto: "Senhor, dá-me a paz que excede todo entendimento. Guarda meu coração e minha mente em Cristo Jesus. Que eu descanse em Ti hoje e confie nos Teus caminhos. Amém.",
};

const DEVOCIONAL_EXEMPLO = {
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

export function HojeSteps() {
  const [completados, setCompletados] = useState<Set<string>>(new Set());
  const [playerAberto, setPlayerAberto] = useState(false);
  const [lerAberto, setLerAberto] = useState(false);
  const { completeDay } = useProgressStore();
  const user = useUserStore((s) => s.user);
  const isPlus = user?.isPlus ?? false;
  const { dayCompleted } = useToast();

  const toggleEtapa = (id: string) => {
    setCompletados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConcluirDia = () => {
    completeDay();
    dayCompleted();
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6B7280]">
          Devocional diário
        </h2>

        {ETAPAS.map((etapa) => {
          const Icon = etapa.icone;
          const concluido = completados.has(etapa.id);

          return (
            <motion.div
              key={etapa.id}
              layout
              className={cn(
                "bg-white rounded-2xl shadow-sm border border-[#E5E7EB]/80 p-4",
                "flex items-center gap-4"
              )}
            >
              <button
                onClick={() => toggleEtapa(etapa.id)}
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#E5E7EB] hover:border-[#10B981] transition-colors"
              >
                {concluido ? (
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-[#9CA3AF]" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      "w-5 h-5 shrink-0",
                      etapa.id === "devocional" ? "text-[#FB923C]" : "text-[#1F2937]"
                    )}
                  />
                  <span className="font-medium text-[#1F2937]">{etapa.titulo}</span>
                </div>
                {etapa.refBiblica && (
                  <p className="text-sm font-semibold text-[#1F2937] mt-0.5">
                    {etapa.refBiblica}
                  </p>
                )}
                {etapa.temAudio && (
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
                      <ReadIcon className="w-4 h-4" />
                      LER
                    </button>
                  </div>
                )}
                {etapa.temOracao && (
                  <button
                    onClick={() => setPlayerAberto(true)}
                    className="mt-2 text-sm text-[#FB923C] font-medium"
                  >
                    Abrir oração →
                  </button>
                )}
              </div>

              <span className="text-sm text-[#6B7280] shrink-0">{etapa.duracao}</span>
            </motion.div>
          );
        })}
      </div>

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

      <ImmersiveAudioPlayer
        isOpen={playerAberto}
        onClose={() => setPlayerAberto(false)}
        titulo={ORACAO_EXEMPLO.titulo}
        texto={ORACAO_EXEMPLO.texto}
        isPlus={isPlus}
      />

      {/* Modal de Leitura do Devocional */}
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
              {/* Header fixo */}
              <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-[#F3F4F6]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#FB923C]">
                      Devocional
                    </span>
                    <h2 className="text-xl font-bold text-[#1F2937] mt-0.5">
                      {DEVOCIONAL_EXEMPLO.titulo}
                    </h2>
                    <p className="text-sm text-[#6B7280] mt-0.5">
                      {DEVOCIONAL_EXEMPLO.refBiblica}
                    </p>
                  </div>
                  <button
                    onClick={() => setLerAberto(false)}
                    className="p-2 rounded-xl hover:bg-[#F9FAFB] transition-colors"
                  >
                    <X className="w-5 h-5 text-[#6B7280]" />
                  </button>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="px-6 py-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-[#1F2937] leading-relaxed whitespace-pre-wrap text-base">
                    {DEVOCIONAL_EXEMPLO.texto}
                  </p>
                </div>
              </div>

              {/* Botão fechar */}
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
