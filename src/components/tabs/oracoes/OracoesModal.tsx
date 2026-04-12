"use client";

import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prayer, PRAYERS_PREDEFINIDAS } from "@/data/oracoes";
import { PrayerCard } from "./PrayerCard";

interface OracoesModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (prayer: Prayer) => void;
}

export function OracoesModal({
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
}: OracoesModalProps) {
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
              Todas as Orações ({PRAYERS_PREDEFINIDAS.length})
            </h2>
            <div className="w-9" />
          </div>

          {/* Scrollable List */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain p-3 grid grid-cols-2 gap-3 content-start"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 24px)" }}
          >
            {PRAYERS_PREDEFINIDAS.map((prayer) => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                isFavorite={isFavorite(prayer.id)}
                onToggleFavorite={onToggleFavorite}
                onViewDetails={onViewDetails}
                large
              />
            ))}

            {PRAYERS_PREDEFINIDAS.length === 0 && (
              <div className="col-span-2 text-center py-12 text-[#9CA3AF]">
                Nenhuma oração encontrada
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
