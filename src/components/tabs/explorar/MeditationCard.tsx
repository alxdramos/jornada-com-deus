import { MeditationCard as MeditationCardType } from "@/data/meditacoes";
import { Heart, Headphones, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Imagem única por meditação
const MEDITATION_IMAGES: Record<string, string> = {
  med_0:  "/images/meditacoes/med-0-rocha-descanso.webp",
  med_1:  "/images/meditacoes/med-1-clareira-paz.webp",
  med_2:  "/images/meditacoes/med-2-refugio-jardim.webp",
  med_3:  "/images/meditacoes/med-3-getsemani.webp",
  med_4:  "/images/meditacoes/med-4-confianca-oracao.webp",
  med_5:  "/images/meditacoes/med-5-forca-fraqueza.webp",
  med_6:  "/images/meditacoes/med-6-autoimagem.webp",
  med_7:  "/images/meditacoes/med-7-madrugada-paz.webp",
  med_8:  "/images/meditacoes/med-8-disciplina-manha.webp",
  med_9:  "/images/meditacoes/med-9-paz-interior.webp",
  med_10: "/images/meditacoes/med-10-cura-culpa.webp",
  med_11: "/images/meditacoes/med-11-portas-deus.webp",
  med_12: "/images/meditacoes/med-12-ansiedade-respiracao.webp",
  med_13: "/images/meditacoes/med-13-lar-gentileza.webp",
  med_14: "/images/meditacoes/med-14-cura-vergonha.webp",
  med_15: "/images/meditacoes/med-15-guardando-coracao.webp",
  med_16: "/images/meditacoes/med-16-autoimagem-curta.webp",
};

const TAG_COLORS: Record<string, string> = {
  "Sono":                       "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Paz":                        "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Cura":                       "bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "Força":                      "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Cura Interior e Emoções":    "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Insônia e Ansiedade Noturna":"bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Autocontrole e Hábitos":     "bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "Relacionamentos e Amor":     "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Propósito e Direção":        "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Família":                    "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

const FALLBACK_TAG_COLORS = [
  "bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
];

function getTagColor(tag: string, index: number): string {
  return TAG_COLORS[tag] || FALLBACK_TAG_COLORS[index % 4];
}

interface MeditationCardProps {
  meditation: MeditationCardType;
  isPlus: boolean;
  isFavorite: boolean;
  onPlay: (meditation: MeditationCardType) => void;
  onFavorite: (id: string) => void;
}

export function MeditationCard({
  meditation,
  isPlus,
  isFavorite,
  onPlay,
  onFavorite,
}: MeditationCardProps) {
  const canPlay = !meditation.plus || isPlus;
  const imageUrl = meditation.image || MEDITATION_IMAGES[meditation.id];
  const firstTag = meditation.tags[0];
  const tagColor = getTagColor(firstTag, 0);

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
      onClick={() => onPlay(meditation)}
    >
      {/* Imagem compacta */}
      <div className="h-24 relative overflow-hidden bg-gray-200 dark:bg-gray-800">
        {imageUrl ? (
          <Image
            fill
            src={imageUrl}
            alt={meditation.title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500" />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-200" />

        {/* Tag sobreposta (equivalente ao versículo no devocional) */}
        {firstTag && (
          <span className="absolute bottom-2 left-3 text-white/90 text-xs font-semibold bg-black/25 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {firstTag}
          </span>
        )}

        {/* Favorito */}
        <button
          onClick={(e) => { e.stopPropagation(); onFavorite(meditation.id); }}
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

        {/* Badge PLUS */}
        {meditation.plus && !isPlus && (
          <div className="absolute top-2 left-2">
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
              <Crown className="w-3 h-3" /> PLUS
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-3 space-y-2">
        <h3 className={cn(
          "font-semibold text-sm text-text-primary dark:text-[#F0EDE8] line-clamp-2 leading-snug",
          !canPlay && "opacity-60"
        )}>
          {meditation.title}
        </h3>
        <div className="flex items-center justify-between">
          {firstTag ? (
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", tagColor)}>
              {firstTag}
            </span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100/80 text-gray-600">
              {meditation.category}
            </span>
          )}
          <div className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
            <Headphones className="w-3.5 h-3.5" />
            <span className="text-xs text-text-secondary dark:text-[#8A8078]">Áudio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
