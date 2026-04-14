import { ImmersiveContentPlayer } from "@/components/ImmersiveContentPlayer";
import { EstudoBiblico } from "@/data/estudos";

const ESTUDO_IMAGES: Record<string, string> = {
  est_0: "/images/estudos/est-0-paz-caos.webp",
  est_1: "/images/estudos/est-1-coragem-recomecar.webp",
  est_2: "/images/estudos/est-2-forca-fraqueza.webp",
  est_3: "/images/estudos/est-3-foco-sem-distracoes.webp",
  est_4: "/images/estudos/est-4-identidade-secreto.webp",
  est_5: "/images/estudos/est-5-comparacao-contentamento.webp",
  est_6: "/images/estudos/est-6-palavras-constroem.webp",
  est_7: "/images/estudos/est-7-trabalho-proposito.webp",
  est_8: "/images/estudos/est-8-perdao-liberta.webp",
  est_9: "/images/estudos/est-9-descanso-ritmo.webp",
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

interface EstudoDetailModalWithPlayerProps {
  estudo: EstudoBiblico | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export function EstudoDetailModalWithPlayer({
  estudo,
  isFavorite,
  onClose,
  onToggleFavorite,
}: EstudoDetailModalWithPlayerProps) {
  if (!estudo) return null;

  const imageUrl = ESTUDO_IMAGES[estudo.id];

  const badges = [
    { label: estudo.reference ?? '' },
    { label: estudo.category },
  ].filter(b => b.label);

  return (
    <ImmersiveContentPlayer
      isOpen={!!estudo}
      onClose={onClose}
      titulo={estudo.shortTitle}
      texto={estudo.text}
      audioUrl={estudo.audioUrl}
      imageUrl={imageUrl}
      gradientFrom="#D97706"
      gradientTo="#92400E"
      isFavorite={isFavorite}
      onToggleFavorite={() => onToggleFavorite(estudo.id)}
      badges={badges}
    />
  );
}
