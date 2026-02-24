import { EstudoBiblico } from "@/data/estudos";
import { Heart, BookOpen, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

interface EstudoCardProps {
  estudo: EstudoBiblico;
  isFavorite: boolean;
  onPlay: (estudo: EstudoBiblico) => void;
  onFavorite: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Salmos: "bg-blue-100 text-blue-700",
  Evangelhos: "bg-green-100 text-green-700",
  "Epístolas": "bg-purple-100 text-purple-700",
  Sabedoria: "bg-yellow-100 text-yellow-700",
  "Proféticos": "bg-red-100 text-red-700",
  "Antigo Testamento": "bg-orange-100 text-orange-700",
  Geral: "bg-gray-100 text-gray-700",
};

export function EstudoCard({ estudo, isFavorite, onPlay, onFavorite }: EstudoCardProps) {
  const categoryColor = CATEGORY_COLORS[estudo.category] || CATEGORY_COLORS.Geral;

  return (
    <div
      className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer"
      onClick={() => onPlay(estudo)}
    >
      <div className="h-24 bg-gradient-to-br from-[#D97706] to-[#92400E] flex items-center justify-center relative">
        <BookOpen className="w-10 h-10 text-white/80" />
        {estudo.reference && (
          <span className="absolute bottom-2 left-3 text-white/90 text-xs font-medium bg-black/20 px-2 py-0.5 rounded-full">
            {estudo.reference}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onFavorite(estudo.id); }}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-full transition-colors backdrop-blur-sm",
            isFavorite ? "text-red-400 bg-white/20" : "text-white/70 hover:bg-white/20"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </button>
      </div>
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm text-[#1F2937] line-clamp-2 leading-snug">
          {estudo.shortTitle}
        </h3>
        <div className="flex items-center justify-between">
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", categoryColor)}>
            {estudo.category}
          </span>
          <div className="flex items-center gap-1 text-[#D97706]">
            <Headphones className="w-3.5 h-3.5" />
            <span className="text-xs text-[#6B7280]">Áudio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
