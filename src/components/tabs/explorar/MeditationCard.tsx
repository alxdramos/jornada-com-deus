import { MeditationCard as MeditationCardType } from "@/data/meditacoes";
import { Heart, Play, Crown } from "lucide-react";
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
  "Sono": "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Paz": "bg-violet-100/80 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  "Cura": "bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "Força": "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Cura Interior e Emoções": "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Insônia e Ansiedade Noturna": "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Autocontrole e Hábitos": "bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "Relacionamentos e Amor": "bg-violet-100/80 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  "Propósito e Direção": "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Família": "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

const FALLBACK_TAG_COLORS = [
  "bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "bg-violet-100/80 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
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
      onClick={() => onPlay(meditation)}
    >
      {/* Imagem */}
      <div className="relative h-40 overflow-hidden bg-gray-200 dark:bg-gray-800">
        {(meditation.image || MEDITATION_IMAGES[meditation.id]) ? (
          <Image
            fill
            src={meditation.image || MEDITATION_IMAGES[meditation.id]}
            alt={meditation.title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-400 to-blue-500" />
        )}

        {/* Overlay de botões ao hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onPlay(meditation); }}
            className={cn(
              "p-3 rounded-full transition-all shadow-lg",
              canPlay
                ? "bg-white text-violet-600 hover:bg-violet-600 hover:text-white"
                : "bg-gray-500/80 text-white cursor-not-allowed"
            )}
            disabled={!canPlay}
            aria-label="Reproduzir meditação"
          >
            <Play className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onFavorite(meditation.id); }}
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

        {/* Badge PLUS */}
        {meditation.plus && !isPlus && (
          <div className="absolute top-2 right-2">
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
              <Crown className="w-3 h-3" /> PLUS
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-3 space-y-1.5">
        <h3 className="font-semibold text-sm text-text-primary dark:text-[#F0EDE8] line-clamp-2 leading-snug">
          {meditation.title}
        </h3>
        <p className="text-xs text-text-secondary dark:text-[#8A8078]">
          {meditation.duration}
        </p>
        {meditation.description && (
          <p className="text-xs text-text-secondary dark:text-[#8A8078] line-clamp-2">
            {meditation.description}
          </p>
        )}
        {meditation.tags.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {meditation.tags.slice(0, 2).map((tag, i) => (
              <span
                key={tag}
                className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getTagColor(tag, i))}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
