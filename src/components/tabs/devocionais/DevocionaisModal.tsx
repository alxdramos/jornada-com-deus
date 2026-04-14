"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DEVOCIONAIS, CATEGORIAS_DEVOCIONAIS, Devocional } from "@/data/devocionais";
import { DevocionalCard } from "./DevocionalCard";
import { useFavorites } from "@/hooks/useFavorites";

interface DevocionaisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (devocional: Devocional) => void;
  isPlus?: boolean;
}

export function DevocionaisModal({ isOpen, onClose, onViewDetails, isPlus = false }: DevocionaisModalProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("TUDO");

  const devocionaisFiltrados = useMemo(() => {
    return DEVOCIONAIS.filter((dev) => {
      const matchCat = selectedCategory === "TUDO" || dev.category === selectedCategory;
      const matchSearch =
        !search.trim() ||
        dev.shortTitle.toLowerCase().includes(search.toLowerCase()) ||
        (dev.reference && dev.reference.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

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
          <div className="flex-shrink-0 border-b border-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </motion.button>

              <div className="text-center">
                <h2 className="text-base font-semibold text-[#1F2937]">Todos os Devocionais</h2>
                <p className="text-xs text-gray-400">{devocionaisFiltrados.length} devocionais</p>
              </div>

              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => { setShowSearch((v) => !v); if (showSearch) setSearch(""); }}
                className={`p-2 rounded-full transition-colors ${showSearch ? "bg-orange-50 text-orange-600" : "hover:bg-gray-100 text-gray-500"}`}
              >
                {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </motion.button>
            </div>

            {/* Search bar */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden px-4 pb-3"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      autoFocus
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar devocional ou versículo..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400/40"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Category filter chips */}
            <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
              {CATEGORIAS_DEVOCIONAIS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Grid */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 24px)" }}
          >
            {devocionaisFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Search className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">Nenhum devocional encontrado</p>
                <p className="text-xs mt-1 opacity-70">Tente outra busca ou categoria</p>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {devocionaisFiltrados.map((devocional) => (
                  <DevocionalCard
                    key={devocional.id}
                    devocional={devocional}
                    isFavorite={isFavorite(devocional.id)}
                    isPlus={isPlus}
                    onPlay={onViewDetails}
                    onFavorite={toggleFavorite}
                    large
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
