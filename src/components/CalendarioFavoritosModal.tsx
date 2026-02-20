"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Calendar } from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";
import { cn } from "@/lib/utils";
import { useCalendarioFavoritosModal } from "@/hooks/useCalendarioFavoritosModal";
import { CalendarStats } from "./calendario/CalendarStats";
import { MonthNavigation } from "./calendario/MonthNavigation";
import { CalendarGrid } from "./calendario/CalendarGrid";
import { FavoritosList } from "./calendario/FavoritosList";
import { EmptyFavorites } from "./calendario/EmptyFavorites";

interface CalendarioFavoritosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalendarioFavoritosModal({ isOpen, onClose }: CalendarioFavoritosModalProps) {
  const { progress } = useProgressStore();
  const {
    aba,
    setAba,
    mesSelecionado,
    favoritos,
    mudarMes,
    tipoCor,
    tipoLabel,
  } = useCalendarioFavoritosModal({ isOpen });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[1000] flex items-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="bg-white rounded-t-3xl w-full max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-[#F3F4F6]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1F2937]">Minha Jornada</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[#F9FAFB] transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            {/* Abas */}
            <div className="flex gap-2">
              <button
                onClick={() => setAba("calendario")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  aba === "calendario"
                    ? "bg-[#FB923C] text-white"
                    : "bg-[#F3F4F6] text-[#6B7280]"
                )}
              >
                <Calendar className="w-4 h-4" />
                Calendário
              </button>
              <button
                onClick={() => setAba("favoritos")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  aba === "favoritos"
                    ? "bg-[#FB923C] text-white"
                    : "bg-[#F3F4F6] text-[#6B7280]"
                )}
              >
                <Heart className="w-4 h-4" />
                Favoritos
              </button>
            </div>
          </div>

          <div className="px-6 py-6">
            {aba === "calendario" && (
              <div>
                <CalendarStats
                  currentStreak={progress.currentStreak}
                  completedDays={progress.completedDays}
                  maxStreak={progress.maxStreak}
                />

                <MonthNavigation
                  mesSelecionado={mesSelecionado}
                  onMesChange={mudarMes}
                />

                <CalendarGrid mesSelecionado={mesSelecionado} />
              </div>
            )}

            {aba === "favoritos" && (
              <div>
                {favoritos.length === 0 ? (
                  <EmptyFavorites />
                ) : (
                  <FavoritosList
                    favoritos={favoritos}
                    tipoCor={tipoCor}
                    tipoLabel={tipoLabel}
                  />
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
