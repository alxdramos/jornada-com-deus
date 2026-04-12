import { Prayer } from "@/data/oracoes";
import { Heart, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

const CATEGORY_COLORS: Record<string, string> = {
  "Perdão":       "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  "Cura Divina":  "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Ansiedade":    "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Gratidão":     "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Fortalecimento": "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  "Intercessão":  "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Família":      "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Paz Interior": "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Proteção":     "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Esperança":    "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Paz":          "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Graças":       "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Força":        "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  "Fé":           "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Geral":        "bg-gray-100/80 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
};

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
  onViewDetails,
}: PrayerCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = prayer.imagem?.background ? `/images/${prayer.imagem.background}` : null;
  const categoryColor = CATEGORY_COLORS[prayer.category] ?? CATEGORY_COLORS["Geral"];

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
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onClick={() => onViewDetails(prayer)}
    >
      {/* Imagem compacta */}
      <div className="h-24 relative overflow-hidden bg-gray-200 dark:bg-gray-800">
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
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center" />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-200" />

        {/* Categoria sobreposta (equivalente ao versículo no devocional) */}
        {prayer.category && (
          <span className="absolute bottom-2 left-3 text-white/90 text-xs font-semibold bg-black/25 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {prayer.category}
          </span>
        )}

        {/* Favorito */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(prayer.id); }}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200",
            isFavorite
              ? "text-rose-400 bg-white/30 backdrop-blur-sm"
              : "text-white/70 hover:bg-white/20 backdrop-blur-sm"
          )}
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current text-rose-400")} />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm text-text-primary dark:text-[#F0EDE8] line-clamp-2 leading-snug">
          {prayer.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", categoryColor)}>
            {prayer.category}
          </span>
          <div className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
            <Headphones className="w-3.5 h-3.5" />
            <span className="text-xs text-text-secondary dark:text-[#8A8078]">Áudio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
