"use client";

import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MEDITACOES, CARDS_ESCRITURAS, CARDS_NOVO, MeditationCard as MeditationCardType } from "@/data/meditacoes";
import { MeditationCard } from "../explorar/MeditationCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useUserStore } from "@/stores/userStore";

const TODAS_MEDITACOES: MeditationCardType[] = [...MEDITACOES, ...CARDS_ESCRITURAS, ...CARDS_NOVO];

interface MeditacoesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (meditation: MeditationCardType) => void;
}

export function MeditacoesModal({ isOpen, onClose, onViewDetails }: MeditacoesModalProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isPlus = useUserStore((s) => s.user?.isPlus ?? false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
          transition={{ type: "spring", damping: 30, stiffness: 260 }}
          className="fixed inset-0 z-[10000] bg-white flex flex-col"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </motion.button>
            <h2 className="text-base font-semibold text-[#1F2937]">
              Todas as Meditações ({TODAS_MEDITACOES.length})
            </h2>
            <div className="w-9" />
          </div>

          {/* Scrollable List */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 24px)" }}
          >
            {TODAS_MEDITACOES.map((med) => (
              <MeditationCard
                key={med.id}
                meditation={med}
                isPlus={isPlus}
                isFavorite={isFavorite(med.id)}
                onPlay={onViewDetails}
                onFavorite={toggleFavorite}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
