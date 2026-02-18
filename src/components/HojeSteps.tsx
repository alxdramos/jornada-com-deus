"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Quote,
  BookOpen,
  MessageCircle,
  Bird,
  CheckCircle,
  Volume2,
  BookOpen as ReadIcon,
} from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";
import { useUserStore } from "@/stores/userStore";
import { toast } from "sonner";
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

export function HojeSteps() {
  const [completados, setCompletados] = useState<Set<string>>(new Set());
  const [playerAberto, setPlayerAberto] = useState(false);
  const { completeDay } = useProgressStore();
  const user = useUserStore((s) => s.user);
  const isPlus = user?.isPlus ?? false;

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
    toast.success("Dia concluído! Glória a Deus 🙌", {
      duration: 4000,
      style: {
        background: "#FAF9F6",
        border: "1px solid #E5E7EB",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      },
    });
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
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1F2937] text-white text-sm font-medium">
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
    </>
  );
}
