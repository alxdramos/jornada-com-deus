import { Prayer } from "@/data/oracoes";
import { Heart, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PrayerCardProps {
  prayer: Prayer;
  isFavorite: boolean;
  onToggleFavorite: (prayerId: string) => void;
  onViewDetails: (prayer: Prayer) => void;
}

// Helper para formatar duração (segundos para MM:SS)
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
  onViewDetails
}: PrayerCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = prayer.imagem?.background ? `/images/${prayer.imagem.background}` : null;

  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => onViewDetails(prayer)}>
      {/* Imagem */}
      <div className="relative h-40 overflow-hidden bg-gray-200">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={prayer.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500" />
        )}

        {/* Overlay de botões */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(prayer);
            }}
            className="p-3 rounded-full transition-all bg-white text-[#FB923C] hover:bg-[#FB923C] hover:text-white"
          >
            <Play className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(prayer.id);
            }}
            className={cn(
              "p-3 rounded-full transition-all",
              isFavorite ? "bg-[#FB923C] text-white" : "bg-white text-[#FB923C] hover:bg-[#FB923C] hover:text-white"
            )}
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm text-[#1F2937] line-clamp-2">
          {prayer.title}
        </h3>
        <p className="text-xs text-[#6B7280]">{formatDuration(prayer.duration)}</p>
        {prayer.content && (
          <p className="text-xs text-[#6B7280] line-clamp-2 mt-2">
            {prayer.content}
          </p>
        )}
        {prayer.category && (
          <div className="flex gap-1 mt-2 flex-wrap">
            <span
              className={cn(
                "px-2 py-0.5 rounded text-xs",
                prayer.isCustom
                  ? "bg-[#FB923C]/10 text-[#FB923C]"
                  : "bg-[#10B981]/10 text-[#10B981]"
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
