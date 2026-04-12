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
  dev_8:  "/images/devocionais/dev-8-humildade-grandeza.png",
  dev_9:  "/images/devocionais/dev-9-amor-incondicional.png",
  dev_10: "/images/devocionais/dev-10-esperanca-nao-decepciona.png",
  dev_11: "/images/devocionais/dev-11-identidade-em-cristo.png",
  dev_12: "/images/devocionais/dev-12-senhor-meu-pastor.png",
  dev_13: "/images/devocionais/dev-13-buscai-primeiro-reino.png",
  dev_14: "/images/devocionais/dev-14-guarda-teu-coracao.png",
  dev_15: "/images/devocionais/dev-15-paz-excede-entendimento.png",
  dev_16: "/images/devocionais/dev-16-deus-supre-necessidade.png",
  dev_17: "/images/devocionais/dev-17-firmeza-tentacao.png",
  dev_18: "/images/devocionais/dev-18-amor-palavra-deus.png",
  dev_19: "/images/devocionais/dev-19-misericordias-renovam.png",
  dev_20: "/images/devocionais/dev-20-aguas-vivas.png",
  dev_21: "/images/devocionais/dev-21-luz-no-mundo.png",
  dev_22: "/images/devocionais/dev-22-renovar-forcas-aguia.png",
  dev_23: "/images/devocionais/dev-23-colheita-fiel.png",
  dev_24: "/images/devocionais/dev-24-raizes-profundas-fe.png",
  dev_25: "/images/devocionais/dev-25-esperanca-brota.png",
  dev_26: "/images/devocionais/dev-26-caminho-nas-tribulacoes.png",
  dev_27: "/images/devocionais/dev-27-promessa-alianca.png",
  dev_28: "/images/devocionais/dev-28-adoracao-verdadeira.png",
  dev_29: "/images/devocionais/dev-29-dois-caminhos.png",
  dev_30: "/images/devocionais/dev-30-novo-dia-gracas.png",
  dev_31: "/images/devocionais/dev-31-batei-abrir-se-a.png",
  dev_32: "/images/devocionais/dev-32-quietude-alma.png",
  dev_33: "/images/devocionais/dev-33-grandeza-criacao.png",
  dev_34: "/images/devocionais/dev-34-semear-na-fe.png",
  dev_35: "/images/devocionais/dev-35-fidelidade-deus-amanhecer.png",
  dev_36: "/images/devocionais/dev-36-protecao-tempestade.png",
  dev_37: "/images/devocionais/dev-37-cume-com-deus.png",
  dev_38: "/images/devocionais/dev-38-confiar-no-tempo-deus.png",
  dev_39: "/images/devocionais/dev-39-gratidao-beleza-criacao.png",
  dev_40: "/images/devocionais/dev-40-farol-na-tempestade.png",
  dev_41: "/images/devocionais/dev-41-renovacao-inverno-primavera.png",
  dev_42: "/images/devocionais/dev-42-devocao-manha.png",
  dev_43: "/images/devocionais/dev-43-perseveranca-jornada.png",
  dev_44: "/images/devocionais/dev-44-abundancia-provisao.png",
  dev_45: "/images/devocionais/dev-45-presenca-divina-floresta.png",
  dev_46: "/images/devocionais/dev-46-amor-alianca-duravel.png",
  dev_47: "/images/devocionais/dev-47-rochedo-inabalavel.png",
  dev_48: "/images/devocionais/dev-48-proposito-inabalavel.png",
  dev_49: "/images/devocionais/dev-49-da-escuridao-a-luz.png",
  dev_50: "/images/devocionais/dev-50-virados-para-a-luz.png",
  dev_51: "/images/devocionais/dev-51-esplendor-divino.png",
  dev_52: "/images/devocionais/dev-52-refugio-inverno.png",
  dev_53: "/images/devocionais/dev-53-florescer-no-deserto.png",
  dev_54: "/images/devocionais/dev-54-gloria-nos-ceus.png",
  dev_55: "/images/devocionais/dev-55-beleza-presente.png",
  dev_56: "/images/devocionais/dev-56-fe-nas-pedras.png",
  dev_57: "/images/devocionais/dev-57-reflexo-do-ceu.png",
  dev_58: "/images/devocionais/dev-58-catedral-da-floresta.png",
  dev_59: "/images/devocionais/dev-59-jardim-da-oracao.png",
  dev_60: "/images/devocionais/dev-60-rochedo-dos-seculos.png",
  dev_61: "/images/devocionais/dev-61-paz-que-desce.png",
  dev_62: "/images/devocionais/dev-62-extravagancia-divina.png",
  dev_63: "/images/devocionais/dev-63-graca-no-inverno.png",
  dev_64: "/images/devocionais/dev-64-entre-o-ceu-e-a-terra.png",
  dev_65: "/images/devocionais/dev-65-porta-para-bencaos.png",
  dev_66: "/images/devocionais/dev-66-solidao-sagrada.png",
  dev_67: "/images/devocionais/dev-67-sombra-do-todo-poderoso.png",
  dev_68: "/images/devocionais/dev-68-fonte-da-vida.png",
  dev_69: "/images/devocionais/dev-69-primeiro-a-luz.png",
  dev_70: "/images/devocionais/dev-70-estrada-da-fe.png",
  dev_71: "/images/devocionais/dev-71-ponte-nas-transicoes.png",
  dev_72: "/images/devocionais/dev-72-campo-de-lavanda.png",
  dev_73: "/images/devocionais/dev-73-bencaos-que-transbordam.png",
  dev_74: "/images/devocionais/dev-74-transformacao-da-pedra.png",
  dev_75: "/images/devocionais/dev-75-cuidado-pelos-pequenos.png",
  dev_76: "/images/devocionais/dev-76-subida-fiel.png",
  dev_77: "/images/devocionais/dev-77-limiar-do-amanhecer.png",
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
