import { useEffect } from "react";
import { ImmersiveContentPlayer } from "@/components/ImmersiveContentPlayer";
import { MeditationCard as MeditationCardType } from "@/data/meditacoes";
import { useAnalytics } from "@/hooks/useAnalytics";

const MEDITATION_IMAGES: Record<string, string> = {
  med_0: "/images/meditacoes/med-0-rocha-descanso.webp",
  med_1: "/images/meditacoes/med-1-clareira-paz.webp",
  med_2: "/images/meditacoes/med-2-refugio-jardim.webp",
  med_3: "/images/meditacoes/med-3-getsemani.webp",
  med_4: "/images/meditacoes/med-4-confianca-oracao.webp",
  med_5: "/images/meditacoes/med-5-forca-fraqueza.webp",
  med_6: "/images/meditacoes/med-6-autoimagem.webp",
  med_7: "/images/meditacoes/med-7-madrugada-paz.webp",
  med_8: "/images/meditacoes/med-8-disciplina-manha.webp",
  med_9: "/images/meditacoes/med-9-paz-interior.webp",
  med_10: "/images/meditacoes/med-10-cura-culpa.webp",
  med_11: "/images/meditacoes/med-11-portas-deus.webp",
  med_12: "/images/meditacoes/med-12-ansiedade-respiracao.webp",
  med_13: "/images/meditacoes/med-13-lar-gentileza.webp",
  med_14: "/images/meditacoes/med-14-cura-vergonha.webp",
  med_15: "/images/meditacoes/med-15-guardando-coracao.webp",
  med_16: "/images/meditacoes/med-16-autoimagem-curta.webp",
  med_17: "/images/meditacoes/med-17-processando-luto-esperanca.webp",
  med_18: "/images/meditacoes/med-18-deitar-paz-sem-ansiedade.webp",
  med_19: "/images/meditacoes/med-19-presenca-deus-agora.webp",
  med_20: "/images/meditacoes/med-20-paz-nao-depende-noticias.webp",
  med_21: "/images/meditacoes/med-21-deus-abre-fecha-portas.webp",
  med_22: "/images/meditacoes/med-22-esperanca-recaida-levantar.webp",
  med_23: "/images/meditacoes/med-23-entrega-total-deus-conduz.webp",
  med_24: "/images/meditacoes/med-24-descanso-alma-dia-pesado.webp",
  med_25: "/images/meditacoes/med-25-reduzindo-estresse-corpo.webp",
  med_26: "/images/meditacoes/med-26-disciplina-sem-dureza.webp",
  med_27: "/images/meditacoes/med-27-paz-dias-cobranca.webp",
};

interface MeditationDetailModalWithPlayerProps {
  meditation: MeditationCardType | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (meditationId: string) => void;
}

export function MeditationDetailModalWithPlayer({
  meditation,
  isFavorite,
  onClose,
  onToggleFavorite,
}: MeditationDetailModalWithPlayerProps) {
  const { trackMeditationStarted } = useAnalytics();

  useEffect(() => {
    if (meditation) trackMeditationStarted(meditation.id, meditation.title);
  }, [meditation?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!meditation) return null;

  const badges = [
    { label: meditation.category },
    ...(meditation.plus ? [{ label: "Plus", className: "bg-[#FB923C]/40 text-white" }] : []),
  ];

  return (
    <ImmersiveContentPlayer
      isOpen={!!meditation}
      onClose={onClose}
      titulo={meditation.title}
      texto={meditation.description ?? ''}
      audioUrl={meditation.audioUrl}
      imageUrl={MEDITATION_IMAGES[meditation.id] ?? meditation.image}
      gradientFrom="#6C4D8F"
      gradientTo="#4C2E6D"
      isFavorite={isFavorite}
      onToggleFavorite={() => onToggleFavorite(meditation.id)}
      badges={badges}
    />
  );
}
