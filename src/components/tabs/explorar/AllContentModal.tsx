import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MEDITACOES, CARDS_ESCRITURAS, CARDS_NOVO, MeditationCard as MeditationCardType } from "@/data/meditacoes";
import { MeditationCard } from "./MeditationCard";
import { cn } from "@/lib/utils";

interface AllContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: 'meditacoes' | 'escrituras' | 'novo';
  isPlus: boolean;
  onPlayMeditation: (meditation: MeditationCardType) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export function AllContentModal({
  isOpen,
  onClose,
  section,
  isPlus,
  onPlayMeditation,
  isFavorite,
  onToggleFavorite,
}: AllContentModalProps) {
  const [catAtiva, setCatAtiva] = useState("TUDO");

  const getContent = () => {
    switch (section) {
      case 'meditacoes':
        return {
          title: 'Todas as Meditações',
          items: MEDITACOES,
          categories: ["TUDO", "MENTE", "CORPO", "ESPÍRITO", "MÚSICA", "ESTUDOS"],
        };
      case 'escrituras':
        return {
          title: 'Todas as Escrituras',
          items: CARDS_ESCRITURAS,
          categories: ["TUDO"],
        };
      case 'novo':
        return {
          title: 'Novo Conteúdo',
          items: CARDS_NOVO,
          categories: ["TUDO"],
        };
    }
  };

  const content = getContent();
  const filteredItems = content.items.filter(
    (item: any) => catAtiva === "TUDO" || item.category === catAtiva
  );

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
                {content.title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Categorias */}
              {content.categories.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {content.categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCatAtiva(cat)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                        catAtiva === cat
                          ? "bg-[#1F2937] text-white"
                          : "bg-gray-100 text-[#1F2937] hover:bg-gray-200"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Grid de itens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {filteredItems.map((item: any) => (
                  <MeditationCard
                    key={item.id}
                    meditation={item}
                    isPlus={isPlus}
                    isFavorite={isFavorite(item.id)}
                    onPlay={onPlayMeditation}
                    onFavorite={onToggleFavorite}
                  />
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-8 text-[#6B7280]">
                  Nenhum item encontrado
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
