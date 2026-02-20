import { Prayer } from "@/data/oracoes";
import { Heart, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PrayerCardProps {
  prayer: Prayer;
  isFavorite: boolean;
  onToggleFavorite: (prayerId: string) => void;
  onViewDetails: (prayer: Prayer) => void;
}

export function PrayerCard({
  prayer,
  isFavorite,
  onToggleFavorite,
  onViewDetails
}: PrayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-[#1F2937] text-base mb-1">
            {prayer.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <span className={cn(
              "px-2 py-0.5 rounded-full",
              prayer.isCustom ? "bg-[#FB923C]/10 text-[#FB923C]" : "bg-[#10B981]/10 text-[#10B981]"
            )}>
              {prayer.category}
            </span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{prayer.createdAt.toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
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
      </div>

      <p className="text-[#6B7280] text-sm leading-relaxed mb-3 line-clamp-2">
        {prayer.content}
      </p>

      <button
        onClick={() => onViewDetails(prayer)}
        className="text-[#10B981] text-sm font-medium hover:text-[#059669] transition-colors"
      >
        Ver oração completa →
      </button>
    </motion.div>
  );
}
