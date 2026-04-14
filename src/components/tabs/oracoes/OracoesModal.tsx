"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prayer, Oracao, ORACOES } from "@/data/oracoes";
import { PrayerCard } from "./PrayerCard";

interface OracoesModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (prayer: Prayer) => void;
  isPlus?: boolean;
}

export function OracoesModal({
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  isPlus = false,
}: OracoesModalProps) {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("TUDO");

  const temas = useMemo(() => {
    const unicos = Array.from(new Set(ORACOES.map((o) => o.theme).filter((t) => t && t !== "default"))).sort();
    return ["TUDO", ...unicos];
  }, []);

  const oracoesFiltradas = useMemo(() => {
    return ORACOES.filter((oracao) => {
      const matchTheme = selectedTheme === "TUDO" || oracao.theme === selectedTheme;
      const matchSearch = !search.trim() || oracao.titulo.toLowerCase().includes(search.toLowerCase());
      return matchTheme && matchSearch;
    });
  }, [search, selectedTheme]);

  const toPrayer = (oracao: Oracao): Prayer => ({
    id: oracao.id,
    title: oracao.titulo,
    content: oracao.texto,
    category: oracao.theme && oracao.theme !== "default" ? oracao.theme : "Geral",
    isCustom: false,
    createdAt: new Date(oracao.createdAt),
    audioUrl: oracao.audioUrl,
    duration: oracao.duration,
    imagem: oracao.imagem,
  });

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
                <h2 className="text-base font-semibold text-[#1F2937]">Todas as Orações</h2>
                <p className="text-xs text-gray-400">{oracoesFiltradas.length} orações</p>
              </div>

              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => { setShowSearch((v) => !v); if (showSearch) setSearch(""); }}
                className={`p-2 rounded-full transition-colors ${showSearch ? "bg-emerald-50 text-emerald-600" : "hover:bg-gray-100 text-gray-500"}`}
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
                      placeholder="Buscar oração..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-400/40"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Theme filter chips */}
            <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
              {temas.map((tema) => (
                <button
                  key={tema}
                  onClick={() => setSelectedTheme(tema)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                    selectedTheme === tema
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tema}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Grid */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 24px)" }}
          >
            {oracoesFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Search className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">Nenhuma oração encontrada</p>
                <p className="text-xs mt-1 opacity-70">Tente outra busca ou categoria</p>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {oracoesFiltradas.map((oracao) => (
                  <PrayerCard
                    key={oracao.id}
                    prayer={toPrayer(oracao)}
                    isFavorite={isFavorite(oracao.id)}
                    isPlus={isPlus}
                    onToggleFavorite={onToggleFavorite}
                    onViewDetails={onViewDetails}
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
