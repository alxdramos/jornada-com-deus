import { EstudoBiblico } from "@/data/estudos";
import { Heart, BookOpen, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface EstudoCardProps {
  estudo: EstudoBiblico;
  isFavorite: boolean;
  onPlay: (estudo: EstudoBiblico) => void;
  onFavorite: (id: string) => void;
}

const CATEGORY_IMAGES: Record<string, string> = {
  "Salmos": "/images/estudos/est-salmos.png",
  "Evangelhos": "/images/estudos/est-evangelhos.png",
  "Epístolas": "/images/estudos/est-epistolas.png",
  "Sabedoria": "/images/estudos/est-sabedoria.png",
  "Proféticos": "/images/estudos/est-profeticos.png",
};

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
      <div className="h-24 relative overflow-hidden">
        {CATEGORY_IMAGES[estudo.category] ? (
          <Image
            src={CATEGORY_IMAGES[estudo.category]}
            alt={estudo.category}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#D97706] to-[#92400E] flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white/80" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20" />
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
