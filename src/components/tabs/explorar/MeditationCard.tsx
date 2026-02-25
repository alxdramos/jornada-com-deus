import { MeditationCard as MeditationCardType } from "@/data/meditacoes";
import { Heart, Play, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Imagem única por meditação
const MEDITATION_IMAGES: Record<string, string> = {
  med_0:  "/images/meditacoes/med-0-rocha-descanso.png",
  med_1:  "/images/meditacoes/med-1-clareira-paz.png",
  med_2:  "/images/meditacoes/med-2-refugio-jardim.png",
  med_3:  "/images/meditacoes/med-3-getsemani.png",
  med_4:  "/images/meditacoes/med-4-confianca-oracao.png",
  med_5:  "/images/meditacoes/med-5-forca-fraqueza.png",
  med_6:  "/images/meditacoes/med-6-autoimagem.png",
  med_7:  "/images/meditacoes/med-7-madrugada-paz.png",
  med_8:  "/images/meditacoes/med-8-disciplina-manha.png",
  med_9:  "/images/meditacoes/med-9-paz-interior.png",
  med_10: "/images/meditacoes/med-10-cura-culpa.png",
  med_11: "/images/meditacoes/med-11-portas-deus.png",
  med_12: "/images/meditacoes/med-12-ansiedade-respiracao.png",
  med_13: "/images/meditacoes/med-13-lar-gentileza.png",
  med_14: "/images/meditacoes/med-14-cura-vergonha.png",
  med_15: "/images/meditacoes/med-15-guardando-coracao.png",
  med_16: "/images/meditacoes/med-16-autoimagem-curta.png",
};

const TAG_COLORS: Record<string, string> = {
  "Sono": "bg-blue-100 text-blue-700",
  "Paz": "bg-purple-100 text-purple-700",
  "Cura": "bg-red-100 text-red-700",
  "Força": "bg-yellow-100 text-yellow-700",
  "Conexão com Deus e Fé": "bg-red-100 text-red-700",
  "Dependência e Drogas": "bg-purple-100 text-purple-700",
  "Cura Interior e Emoções": "bg-blue-100 text-blue-700",
  "Insônia e Ansiedade Noturna": "bg-yellow-100 text-yellow-700",
  "Autocontrole e Hábitos": "bg-red-100 text-red-700",
  "Relacionamentos e Amor": "bg-purple-100 text-purple-700",
  "Propósito e Direção": "bg-blue-100 text-blue-700",
  "Família": "bg-yellow-100 text-yellow-700",
};

const FALLBACK_TAG_COLORS = [
  "bg-red-100 text-red-700",
  "bg-purple-100 text-purple-700",
  "bg-blue-100 text-blue-700",
  "bg-yellow-100 text-yellow-700",
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
    <div className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow group">
      {/* Imagem */}
      <div className="relative h-40 overflow-hidden bg-gray-200">
        {(meditation.image || MEDITATION_IMAGES[meditation.id]) ? (
          <Image
            fill
            src={meditation.image || MEDITATION_IMAGES[meditation.id]}
            alt={meditation.title}
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500" />
        )}

        {/* Overlay de botões */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2">
          <button
            onClick={() => onPlay(meditation)}
            className={cn(
              "p-3 rounded-full transition-all",
              canPlay
                ? "bg-white text-[#FB923C] hover:bg-[#FB923C] hover:text-white"
                : "bg-gray-500 text-white cursor-not-allowed"
            )}
            disabled={!canPlay}
          >
            <Play className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={() => onFavorite(meditation.id)}
            className={cn(
              "p-3 rounded-full transition-all",
              isFavorite ? "bg-[#FB923C] text-white" : "bg-white text-[#FB923C] hover:bg-[#FB923C] hover:text-white"
            )}
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          {meditation.plus && !isPlus && (
            <span className="bg-[#FB923C] text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <Crown className="w-3 h-3" /> PLUS
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm text-[#1F2937] line-clamp-2">
          {meditation.title}
        </h3>
        <p className="text-xs text-[#6B7280]">{meditation.duration}</p>
        {meditation.description && (
          <p className="text-xs text-[#6B7280] line-clamp-2 mt-2">
            {meditation.description}
          </p>
        )}
        {meditation.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {meditation.tags.slice(0, 2).map((tag, i) => (
              <span
                key={tag}
                className={cn("px-2 py-0.5 rounded text-xs font-medium", getTagColor(tag, i))}
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
