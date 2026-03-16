import { ImmersiveContentPlayer } from "@/components/ImmersiveContentPlayer";
import { Devocional } from "@/data/devocionais";

const DEVOCIONAL_IMAGES: Record<string, string> = {
  dev_0: "/images/devocionais/dev-0-nao-temas.webp",
  dev_1: "/images/devocionais/dev-1-confianca-total.webp",
  dev_2: "/images/devocionais/dev-2-descanso-deus.webp",
  dev_3: "/images/devocionais/dev-3-alegria-tempestade.webp",
  dev_4: "/images/devocionais/dev-4-fe-montanhas.webp",
  dev_5: "/images/devocionais/dev-5-oracao-pai.webp",
  dev_6: "/images/devocionais/dev-6-gratidao-vida.webp",
  dev_7: "/images/devocionais/dev-7-perdao-liberta.webp",
};

interface DevocionalDetailModalWithPlayerProps {
  devocional: Devocional | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export function DevocionalDetailModalWithPlayer({
  devocional,
  isFavorite,
  onClose,
  onToggleFavorite,
}: DevocionalDetailModalWithPlayerProps) {
  if (!devocional) return null;

  const imageUrl = DEVOCIONAL_IMAGES[devocional.id];

  const badges = [
    { label: devocional.reference },
    { label: devocional.category },
  ].filter(b => b.label);

  return (
    <ImmersiveContentPlayer
      isOpen={!!devocional}
      onClose={onClose}
      titulo={devocional.shortTitle}
      texto={devocional.text}
      audioUrl={devocional.audioUrl}
      imageUrl={imageUrl}
      gradientFrom="#F97316"
      gradientTo="#92400E"
      isFavorite={isFavorite}
      onToggleFavorite={() => onToggleFavorite(devocional.id)}
      badges={badges}
    />
  );
}
