import { MeditationCard as MeditationCardType } from "@/data/meditacoes";
import { Heart, Play, Lock, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

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
        {meditation.image ? (
          <img
            src={meditation.image}
            alt={meditation.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
            {meditation.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded text-xs"
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
