import { Devocional } from "@/data/devocionais";
import { Heart, BookHeart, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface DevocionalCardProps {
  devocional: Devocional;
  isFavorite: boolean;
  onPlay: (devocional: Devocional) => void;
  onFavorite: (id: string) => void;
  large?: boolean;
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
  dev_8:  "/images/devocionais/dev-8-humildade-grandeza.webp",
  dev_9:  "/images/devocionais/dev-9-amor-incondicional.webp",
  dev_10: "/images/devocionais/dev-10-esperanca-nao-decepciona.webp",
  dev_11: "/images/devocionais/dev-11-identidade-em-cristo.webp",
  dev_12: "/images/devocionais/dev-12-senhor-meu-pastor.webp",
  dev_13: "/images/devocionais/dev-13-buscai-primeiro-reino.webp",
  dev_14: "/images/devocionais/dev-14-guarda-teu-coracao.webp",
  dev_15: "/images/devocionais/dev-15-paz-excede-entendimento.webp",
  dev_16: "/images/devocionais/dev-16-deus-supre-necessidade.webp",
  dev_17: "/images/devocionais/dev-17-firmeza-tentacao.webp",
  dev_18: "/images/devocionais/dev-18-amor-palavra-deus.webp",
  dev_19: "/images/devocionais/dev-19-misericordias-renovam.webp",
  dev_20: "/images/devocionais/dev-20-aguas-vivas.webp",
  dev_21: "/images/devocionais/dev-21-luz-no-mundo.webp",
  dev_22: "/images/devocionais/dev-22-renovar-forcas-aguia.webp",
  dev_23: "/images/devocionais/dev-23-colheita-fiel.webp",
  dev_24: "/images/devocionais/dev-24-raizes-profundas-fe.webp",
  dev_25: "/images/devocionais/dev-25-esperanca-brota.webp",
  dev_26: "/images/devocionais/dev-26-caminho-nas-tribulacoes.webp",
  dev_27: "/images/devocionais/dev-27-promessa-alianca.webp",
  dev_28: "/images/devocionais/dev-28-adoracao-verdadeira.webp",
  dev_29: "/images/devocionais/dev-29-dois-caminhos.webp",
  dev_30: "/images/devocionais/dev-30-novo-dia-gracas.webp",
  dev_31: "/images/devocionais/dev-31-batei-abrir-se-a.webp",
  dev_32: "/images/devocionais/dev-32-quietude-alma.webp",
  dev_33: "/images/devocionais/dev-33-grandeza-criacao.webp",
  dev_34: "/images/devocionais/dev-34-semear-na-fe.webp",
  dev_35: "/images/devocionais/dev-35-fidelidade-deus-amanhecer.webp",
  dev_36: "/images/devocionais/dev-36-protecao-tempestade.webp",
  dev_37: "/images/devocionais/dev-37-cume-com-deus.webp",
  dev_38: "/images/devocionais/dev-38-confiar-no-tempo-deus.webp",
  dev_39: "/images/devocionais/dev-39-gratidao-beleza-criacao.webp",
  dev_40: "/images/devocionais/dev-40-farol-na-tempestade.webp",
  dev_41: "/images/devocionais/dev-41-renovacao-inverno-primavera.webp",
  dev_42: "/images/devocionais/dev-42-devocao-manha.webp",
  dev_43: "/images/devocionais/dev-43-perseveranca-jornada.webp",
  dev_44: "/images/devocionais/dev-44-abundancia-provisao.webp",
  dev_45: "/images/devocionais/dev-45-presenca-divina-floresta.webp",
  dev_46: "/images/devocionais/dev-46-amor-alianca-duravel.webp",
  dev_47: "/images/devocionais/dev-47-rochedo-inabalavel.webp",
  dev_48: "/images/devocionais/dev-48-proposito-inabalavel.webp",
  dev_49: "/images/devocionais/dev-49-da-escuridao-a-luz.webp",
  dev_50: "/images/devocionais/dev-50-virados-para-a-luz.webp",
  dev_51: "/images/devocionais/dev-51-esplendor-divino.webp",
  dev_52: "/images/devocionais/dev-52-refugio-inverno.webp",
  dev_53: "/images/devocionais/dev-53-florescer-no-deserto.webp",
  dev_54: "/images/devocionais/dev-54-gloria-nos-ceus.webp",
  dev_55: "/images/devocionais/dev-55-beleza-presente.webp",
  dev_56: "/images/devocionais/dev-56-fe-nas-pedras.webp",
  dev_57: "/images/devocionais/dev-57-reflexo-do-ceu.webp",
  dev_58: "/images/devocionais/dev-58-catedral-da-floresta.webp",
  dev_59: "/images/devocionais/dev-59-jardim-da-oracao.webp",
  dev_60: "/images/devocionais/dev-60-rochedo-dos-seculos.webp",
  dev_61: "/images/devocionais/dev-61-paz-que-desce.webp",
  dev_62: "/images/devocionais/dev-62-extravagancia-divina.webp",
  dev_63: "/images/devocionais/dev-63-graca-no-inverno.webp",
  dev_64: "/images/devocionais/dev-64-entre-o-ceu-e-a-terra.webp",
  dev_65: "/images/devocionais/dev-65-porta-para-bencaos.webp",
  dev_66: "/images/devocionais/dev-66-solidao-sagrada.webp",
  dev_67: "/images/devocionais/dev-67-sombra-do-todo-poderoso.webp",
  dev_68: "/images/devocionais/dev-68-fonte-da-vida.webp",
  dev_69: "/images/devocionais/dev-69-primeiro-a-luz.webp",
  dev_70: "/images/devocionais/dev-70-estrada-da-fe.webp",
  dev_71: "/images/devocionais/dev-71-ponte-nas-transicoes.webp",
  dev_72: "/images/devocionais/dev-72-campo-de-lavanda.webp",
  dev_73: "/images/devocionais/dev-73-bencaos-que-transbordam.webp",
  dev_74: "/images/devocionais/dev-74-transformacao-da-pedra.webp",
  dev_75: "/images/devocionais/dev-75-cuidado-pelos-pequenos.webp",
  dev_76: "/images/devocionais/dev-76-subida-fiel.webp",
  dev_77: "/images/devocionais/dev-77-limiar-do-amanhecer.webp",
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

// LQIP generic blur placeholder (8x8 WebP)
const BLUR_PLACEHOLDER = "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAAAQAgCdASoIAAgABUB8JYgCdAD5j5e5m30AAPzqwT/UubZQLVj0ccL2OIiV6UgIjWm8ZRT3kAA=";

const CATEGORY_COLORS: Record<string, string> = {
  "Fé": "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Esperança": "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Paz": "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Oração": "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "Gratidão": "bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "Perdão": "bg-orange-100/80 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "Geral": "bg-gray-100/80 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
};

export function DevocionalCard({ devocional, isFavorite, onPlay, onFavorite, large }: DevocionalCardProps) {
  const categoryColor = CATEGORY_COLORS[devocional.category] || CATEGORY_COLORS.Geral;
  const imageUrl = DEVOCIONAL_IMAGES[devocional.id] || CATEGORY_FALLBACK_IMAGES[devocional.category];

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden cursor-pointer group",
        "border border-white/60 dark:border-white/[0.06]",
        "bg-white dark:bg-[#231F1B]",
        "shadow-sm hover:shadow-md",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5"
      )}
      onClick={() => onPlay(devocional)}
    >
      <div className={cn(
        "relative overflow-hidden bg-gray-200 dark:bg-gray-800",
        large ? "h-[180px]" : "h-24"
      )}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={devocional.shortTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center">
            <BookHeart className="w-10 h-10 text-white/80" />
          </div>
        )}
        <div className={cn(
          "absolute inset-0 transition-colors duration-200",
          large
            ? "bg-gradient-to-t from-black/55 via-black/15 to-transparent group-hover:from-black/65"
            : "bg-black/20 group-hover:bg-black/30"
        )} />

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
