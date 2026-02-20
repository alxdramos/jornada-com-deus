import { Prayer } from "@/data/oracoes";
import { Heart, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PrayerDetailModalProps {
  prayer: Prayer | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (prayerId: string) => void;
  onDeletePrayer: (prayerId: string) => void;
}

export function PrayerDetailModal({
  prayer,
  isFavorite,
  onClose,
  onToggleFavorite,
  onDeletePrayer
}: PrayerDetailModalProps) {
  if (!prayer) return null;

  const handleDelete = () => {
    onDeletePrayer(prayer.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {prayer && (
        <>
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
              className="bg-white rounded-t-3xl p-6 w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#1F2937]">{prayer.title}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      prayer.isCustom ? "bg-[#FB923C]/10 text-[#FB923C]" : "bg-[#10B981]/10 text-[#10B981]"
                    )}>
                      {prayer.category}
                    </span>
                    <span className="text-[#6B7280] text-sm">
                      {prayer.createdAt.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onToggleFavorite(prayer.id)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isFavorite
                        ? "text-red-500"
                        : "text-[#6B7280] hover:text-red-500"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                  </button>
                  {prayer.isCustom && (
                    <button
                      onClick={handleDelete}
                      className="p-2 rounded-lg text-[#6B7280] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                  >
                    <X className="w-5 h-5 text-[#6B7280]" />
                  </button>
                </div>
              </div>

              <div className="bg-[#F9FAFB] rounded-2xl p-6 mb-6">
                <p className="text-[#1F2937] leading-relaxed whitespace-pre-wrap">
                  {prayer.content}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-[#10B981] text-white font-semibold rounded-xl hover:bg-[#059669] transition-colors"
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
