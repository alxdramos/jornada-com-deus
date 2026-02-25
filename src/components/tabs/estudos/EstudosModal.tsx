"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ESTUDOS, EstudoBiblico } from "@/data/estudos";
import { EstudoCard } from "./EstudoCard";
import { useFavorites } from "@/hooks/useFavorites";

interface EstudosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (estudo: EstudoBiblico) => void;
}

export function EstudosModal({ isOpen, onClose, onViewDetails }: EstudosModalProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 20;
  const paginated = ESTUDOS.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(ESTUDOS.length / itemsPerPage);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-white w-full max-h-[90vh] rounded-t-xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1F2937]">
                Todos os Estudos ({ESTUDOS.length})
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {paginated.map((estudo) => (
                  <EstudoCard
                    key={estudo.id}
                    estudo={estudo}
                    isFavorite={isFavorite(estudo.id)}
                    onPlay={onViewDetails}
                    onFavorite={toggleFavorite}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pb-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 rounded-lg bg-gray-100 text-[#1F2937] disabled:opacity-50 hover:bg-gray-200"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm text-[#6B7280]">
                    Página {currentPage + 1} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-3 py-1 rounded-lg bg-gray-100 text-[#1F2937] disabled:opacity-50 hover:bg-gray-200"
                  >
                    Próxima →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
