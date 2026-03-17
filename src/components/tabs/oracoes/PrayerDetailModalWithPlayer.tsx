import { useEffect } from "react";
import { useImageFallback } from "@/hooks/useImageFallback";
import { ImmersiveContentPlayer } from "@/components/ImmersiveContentPlayer";
import { useAnalytics } from "@/hooks/useAnalytics";

interface Prayer {
  id: string;
  title: string;
  content: string;
  category: string;
  isCustom: boolean;
  createdAt: Date;
}

interface PrayerWithAudio extends Prayer {
  audioUrl?: string;
  imagem?: {
    background: string;
    icon: string;
  };
}

interface PrayerDetailModalWithPlayerProps {
  prayer: PrayerWithAudio | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (prayerId: string) => void;
  onDeletePrayer: (prayerId: string) => void;
}

export function PrayerDetailModalWithPlayer({
  prayer,
  isFavorite,
  onClose,
  onToggleFavorite,
  onDeletePrayer,
}: PrayerDetailModalWithPlayerProps) {
  const { imageUrl } = useImageFallback({
    filename: prayer?.imagem?.background,
    category: prayer?.category,
  });
  const { trackPrayerStarted } = useAnalytics();

  useEffect(() => {
    if (prayer) trackPrayerStarted(prayer.id, prayer.title);
  }, [prayer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!prayer) return null;

  return (
    <ImmersiveContentPlayer
      isOpen={!!prayer}
      onClose={onClose}
      titulo={prayer.title}
      texto={prayer.content}
      audioUrl={prayer.audioUrl}
      imageUrl={imageUrl ?? undefined}
      gradientFrom="#10B981"
      gradientTo="#065F46"
      isFavorite={isFavorite}
      onToggleFavorite={() => onToggleFavorite(prayer.id)}
      badges={[{ label: prayer.category, className: prayer.isCustom ? "bg-[#FB923C]/40 text-white" : "bg-white/20 text-white" }]}
      onDelete={prayer.isCustom ? () => onDeletePrayer(prayer.id) : undefined}
    />
  );
}
