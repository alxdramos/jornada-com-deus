import { ImmersiveContentPlayer } from "@/components/ImmersiveContentPlayer";
import { MeditationCard as MeditationCardType } from "@/data/meditacoes";

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
      imageUrl={meditation.image}
      gradientFrom="#8B5CF6"
      gradientTo="#4C1D95"
      isFavorite={isFavorite}
      onToggleFavorite={() => onToggleFavorite(meditation.id)}
      badges={badges}
    />
  );
}
