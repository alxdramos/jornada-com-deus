"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ORACOES, Prayer } from "@/data/oracoes";
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
  // Todos as orações (sem filtro de categoria por enquanto)
  const filteredOracoes = ORACOES;

  // Pagina os resultados (20 por página)
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(0);
  const paginatedOracoes = filteredOracoes.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOracoes.length / itemsPerPage);

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
                Todas as Orações ({filteredOracoes.length})
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Grid de orações - 20 por página */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {paginatedOracoes.map((oracao) => (
                  <PrayerCard
                    key={oracao.id}
                    prayer={{
                      id: oracao.id,
                      title: oracao.titulo,
                      content: oracao.texto,
                      category: oracao.theme && oracao.theme !== "default" ? oracao.theme : "Geral",
                      isCustom: false,
                      createdAt: new Date(oracao.createdAt),
                      audioUrl: oracao.audioUrl,
                      duration: oracao.duration,
                      imagem: oracao.imagem,
                    }}
                    isFavorite={isFavorite(oracao.id)}
                    onToggleFavorite={onToggleFavorite}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pb-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 rounded-lg bg-gray-100 text-[#1F2937] disabled:opacity-50 hover:bg-gray-200"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm text-[#6B7280]">
                    Página {currentPage + 1} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-3 py-1 rounded-lg bg-gray-100 text-[#1F2937] disabled:opacity-50 hover:bg-gray-200"
                  >
                    Próxima →
                  </button>
                </div>
              )}

              {filteredOracoes.length === 0 && (
                <div className="text-center py-8 text-[#6B7280]">
                  Nenhuma oração encontrada
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
