import { X, Heart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DiaryEntry, ENTRY_TYPE_ICONS } from "@/data/diario";
import { cn } from "@/lib/utils";

interface DiaryDetailModalProps {
  entry: DiaryEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DiaryDetailModal({
  entry,
  isOpen,
  onClose,
  onToggleFavorite,
  onDelete,
}: DiaryDetailModalProps) {
  if (!entry) return null;

  const getTypeColor = () => {
    switch (entry.type) {
      case "note": return "from-blue-500 to-blue-600";
      case "highlight": return "from-yellow-500 to-yellow-600";
      case "verse": return "from-purple-500 to-purple-600";
      case "quote": return "from-green-500 to-green-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

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
            className="bg-white w-full max-h-[90vh] rounded-t-2xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header com gradiente */}
            <div
              className={cn(
                "bg-gradient-to-r p-6 text-white",
                getTypeColor()
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-4xl">{ENTRY_TYPE_ICONS[entry.type]}</span>
                  <div>
                    <h1 className="text-2xl font-bold">{entry.title}</h1>
                    <p className="text-white/80 text-sm mt-1">
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {/* Referência */}
              {entry.reference && (
                <div className="pb-4 border-b">
                  <p className="text-sm text-[#6B7280] mb-1">Referência</p>
                  <p className="font-semibold text-[#1F2937]">
                    {entry.reference}
                  </p>
                </div>
              )}

              {/* Conteúdo principal */}
              <div>
                <p className="text-lg text-[#374151] leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-[#6B7280] mb-2">Tags</p>
                  <div className="flex gap-2 flex-wrap">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#F3F4F6] text-[#6B7280] px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => onToggleFavorite(entry.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-1",
                    entry.isFavorite
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <Heart
                    className={cn(
                      "w-5 h-5",
                      entry.isFavorite && "fill-current"
                    )}
                  />
                  {entry.isFavorite ? "Favorito" : "Adicionar aos favoritos"}
                </button>
                <button
                  onClick={() => {
                    onDelete(entry.id);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Deletar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
