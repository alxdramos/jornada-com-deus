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

// Imagem única por estudo (sem repetição)
const STUDY_IMAGES: Record<string, string> = {
  est_0:  "/images/estudos/est-0-paz-caos.webp",
  est_1:  "/images/estudos/est-1-coragem-recomecar.webp",
  est_2:  "/images/estudos/est-2-forca-fraqueza.webp",
  est_3:  "/images/estudos/est-3-foco-sem-distracoes.webp",
  est_4:  "/images/estudos/est-4-identidade-secreto.webp",
  est_5:  "/images/estudos/est-5-comparacao-contentamento.webp",
  est_6:  "/images/estudos/est-6-palavras-constroem.webp",
  est_7:  "/images/estudos/est-7-trabalho-proposito.webp",
  est_8:  "/images/estudos/est-8-perdao-liberta.webp",
  est_9:  "/images/estudos/est-9-descanso-ritmo.webp",
  est_10: "/images/estudos/est-10-santidade-cotidiano.webp",
  est_11: "/images/estudos/est-11-vencendo-culpa.webp",
  est_12: "/images/estudos/est-12-disciplina-espiritual.webp",
  est_13: "/images/estudos/est-13-medo-futuro.webp",
  est_14: "/images/estudos/est-14-autocontrole-impulsos.webp",
  est_15: "/images/estudos/est-15-equilibrio-trabalho.webp",
  est_16: "/images/estudos/est-16-amor-pratico.webp",
  est_17: "/images/estudos/est-17-processos-maturidade.webp",
  est_18: "/images/estudos/est-18-coracao-quebrantado.webp",
  est_19: "/images/estudos/est-19-financas-sabedoria.webp",
  est_20: "/images/estudos/est-20-decisoes-guiadas.webp",
};

const CATEGORY_COLORS: Record<string, string> = {
  Salmos: "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Evangelhos: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "Epístolas": "bg-violet-100/80 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  Sabedoria: "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Proféticos": "bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "Antigo Testamento": "bg-orange-100/80 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Geral: "bg-gray-100/80 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
};

export function EstudoCard({ estudo, isFavorite, onPlay, onFavorite }: EstudoCardProps) {
  const categoryColor = CATEGORY_COLORS[estudo.category] || CATEGORY_COLORS.Geral;

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
      onClick={() => onPlay(estudo)}
    >
      <div className="h-24 relative overflow-hidden bg-gray-200 dark:bg-gray-800">
        {STUDY_IMAGES[estudo.id] ? (
          <Image
            src={STUDY_IMAGES[estudo.id]}
            alt={estudo.shortTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white/80" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-200" />

        {/* Referência bíblica */}
        {estudo.reference && (
          <span className="absolute bottom-2 left-3 text-white/90 text-xs font-semibold bg-black/25 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {estudo.reference}
          </span>
        )}

        {/* Favorito */}
        <button
          onClick={(e) => { e.stopPropagation(); onFavorite(estudo.id); }}
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
          {estudo.shortTitle}
        </h3>
        <div className="flex items-center justify-between">
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", categoryColor)}>
            {estudo.category}
          </span>
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <Headphones className="w-3.5 h-3.5" />
            <span className="text-xs text-text-secondary dark:text-[#8A8078]">Áudio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
