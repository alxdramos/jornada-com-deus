import { ImmersiveContentPlayer } from "@/components/ImmersiveContentPlayer";
import { EstudoBiblico } from "@/data/estudos";

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

  const imageUrl = (estudo as { image?: string }).image;

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
