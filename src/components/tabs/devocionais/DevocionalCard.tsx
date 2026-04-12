import { Devocional } from "@/data/devocionais";
import { Heart, BookHeart, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface DevocionalCardProps {
  devocional: Devocional;
  isFavorite: boolean;
  onPlay: (devocional: Devocional) => void;
  onFavorite: (id: string) => void;
}

// Imagem única por devocional
const DEVOCIONAL_IMAGES: Record<string, string> = {
  dev_0: "/images/devocionais/dev-0-nao-temas.webp",
  dev_1: "/images/devocionais/dev-1-confianca-total.webp",
  dev_2: "/images/devocionais/dev-2-descanso-deus.webp",
  dev_3: "/images/devocionais/dev-3-alegria-tempestade.webp",
  dev_4: "/images/devocionais/dev-4-fe-montanhas.webp",
  dev_5: "/images/devocionais/dev-5-oracao-pai.webp",
  dev_6: "/images/devocionais/dev-6-gratidao-vida.webp",
  dev_7: "/images/devocionais/dev-7-perdao-liberta.webp",
};

// Fallback por categoria para devocionais sem imagem própria
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "Fé":        "/images/devocionais/dev-4-fe-montanhas.webp",
  "Esperança": "/images/devocionais/dev-3-alegria-tempestade.webp",
  "Paz":       "/images/devocionais/dev-2-descanso-deus.webp",
  "Oração":    "/images/devocionais/dev-5-oracao-pai.webp",
  "Gratidão":  "/images/devocionais/dev-6-gratidao-vida.webp",
  "Perdão":    "/images/devocionais/dev-7-perdao-liberta.webp",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Fé": "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Esperança": "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Paz": "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Oração": "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "Gratidão": "bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "Perdão": "bg-orange-100/80 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "Geral": "bg-gray-100/80 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
};

export function DevocionalCard({ devocional, isFavorite, onPlay, onFavorite }: DevocionalCardProps) {
  const categoryColor = CATEGORY_COLORS[devocional.category] || CATEGORY_COLORS.Geral;
  const imageUrl = DEVOCIONAL_IMAGES[devocional.id] || CATEGORY_FALLBACK_IMAGES[devocional.category];

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
      onClick={() => onPlay(devocional)}
    >
      <div className="h-24 relative overflow-hidden bg-gray-200 dark:bg-gray-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={devocional.shortTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center">
            <BookHeart className="w-10 h-10 text-white/80" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-200" />

        {/* Referência bíblica */}
        {devocional.reference && (
          <span className="absolute bottom-2 left-3 text-white/90 text-xs font-semibold bg-black/25 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {devocional.reference}
          </span>
        )}

        {/* Favorito */}
        <button
          onClick={(e) => { e.stopPropagation(); onFavorite(devocional.id); }}
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

      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm text-text-primary dark:text-[#F0EDE8] line-clamp-2 leading-snug">
          {devocional.shortTitle}
        </h3>
        <div className="flex items-center justify-between">
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", categoryColor)}>
            {devocional.category}
          </span>
          <div className="flex items-center gap-1 text-orange-500 dark:text-orange-400">
            <Headphones className="w-3.5 h-3.5" />
            <span className="text-xs text-text-secondary dark:text-[#8A8078]">Áudio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
