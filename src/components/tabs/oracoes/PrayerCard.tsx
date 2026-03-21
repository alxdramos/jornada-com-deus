import { Prayer } from "@/data/oracoes";
import { Heart, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

const THEME_COLORS: Record<string, string> = {
  "Perdão": "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  "Cura Divina": "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Ansiedade": "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Gratidão": "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Fortalecimento": "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  "Intercessão": "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Família": "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Paz Interior": "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Proteção": "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Esperança": "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Paz": "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Graças": "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Força": "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  "Fé": "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

interface PrayerCardProps {
  prayer: Prayer;
  isFavorite: boolean;
  onToggleFavorite: (prayerId: string) => void;
  onViewDetails: (prayer: Prayer) => void;
}

function formatDuration(seconds?: number): string {
  if (!seconds || seconds === 0) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function PrayerCard({
  prayer,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
}: PrayerCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = prayer.imagem?.background ? `/images/${prayer.imagem.background}` : null;

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden cursor-pointer group",
        "border border-white/60 dark:border-white/[0.06]",
        "bg-white/80 dark:bg-[#231F1B]/80",
        "shadow-sm hover:shadow-md",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5"
      )}
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={() => onViewDetails(prayer)}
    >
      {/* Imagem */}
      <div className="relative h-40 overflow-hidden bg-gray-200 dark:bg-gray-800">
        {imageUrl && !imgError ? (
          <Image
            fill
            src={imageUrl}
            alt={prayer.title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500" />
        )}

        {/* Overlay de botões ao hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetails(prayer); }}
            className="p-3 rounded-full transition-all bg-white text-emerald-700 hover:bg-emerald-700 hover:text-white shadow-lg"
            aria-label="Reproduzir oração"
          >
            <Play className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(prayer.id); }}
            className={cn(
              "p-3 rounded-full transition-all shadow-lg",
              isFavorite
                ? "bg-rose-500 text-white"
                : "bg-white text-rose-500 hover:bg-rose-500 hover:text-white"
            )}
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-3 space-y-1.5">
        <h3 className="font-semibold text-sm text-text-primary dark:text-[#F0EDE8] line-clamp-2 leading-snug">
          {prayer.title}
        </h3>
        <p className="text-xs text-text-secondary dark:text-[#8A8078]">
          {formatDuration(prayer.duration)}
        </p>
        {prayer.content && (
          <p className="text-xs text-text-secondary dark:text-[#8A8078] line-clamp-2">
            {prayer.content}
          </p>
        )}
        {prayer.category && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                prayer.isCustom
                  ? "bg-orange-100/80 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                  : THEME_COLORS[prayer.category] || "bg-gray-100/80 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400"
              )}
            >
              {prayer.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
