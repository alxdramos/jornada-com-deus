import { Heart, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePrayerPlayer } from "@/hooks/usePrayerPlayer";
import { useImageFallback } from "@/hooks/useImageFallback";
import { useReadingFontSize } from "@/hooks/useReadingFontSize";
import { stripAudioMarkers } from "@/lib/stripAudioMarkers";
import { PrayerPlayerBar } from "./PrayerPlayerBar";

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
  onDeletePrayer
}: PrayerDetailModalWithPlayerProps) {
  // Hooks must be called before early return
  const {
    playing,
    progress,
    currentTime,
    duration,
    repeat,
    audioLoading,
    audioError,
    audioRef,
    progressRef,
    togglePlay,
    handleProgressClick,
    skip,
    setRepeat,
    formatTime,
  } = usePrayerPlayer({
    audioUrl: prayer?.audioUrl,
    isOpen: !!prayer,
  });

  const { imageUrl } = useImageFallback({
    filename: prayer?.imagem?.background,
    category: prayer?.category,
  });

  const { fontSize, canIncrease, canDecrease, increase, decrease } = useReadingFontSize();

  if (!prayer) return null;

  const handleDelete = () => {
    onDeletePrayer(prayer.id);
    onClose();
  };

  // Generate inline style with intelligent fallback
  const headerStyle: React.CSSProperties = {
    backgroundImage: imageUrl
      ? `url('${imageUrl}')`
      : "linear-gradient(to bottom right, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.3))",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <AnimatePresence>
      {prayer && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[1000] flex items-end"
            onClick={onClose}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="prayer-modal-title"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white rounded-t-3xl p-6 w-full max-h-[95vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Image */}
              <div
                className="h-48 rounded-2xl mb-6 relative overflow-hidden flex items-end justify-between p-4"
                style={headerStyle}
              >
                <div className="flex-1">
                  <h2 id="prayer-modal-title" className="text-2xl font-bold text-white drop-shadow-lg">{prayer.title}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium drop-shadow",
                      prayer.isCustom ? "bg-[#FB923C]/20 text-[#FB923C]" : "bg-[#10B981]/20 text-white"
                    )}>
                      {prayer.category}
                    </span>
                  </div>
                </div>

                {/* Top Right Buttons */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onToggleFavorite(prayer.id)}
                    aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    className={cn(
                      "p-2 rounded-lg transition-colors backdrop-blur-sm",
                      isFavorite
                        ? "text-red-500 bg-white/20"
                        : "text-white hover:bg-white/20"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                  </button>
                  {prayer.isCustom && (
                    <button
                      onClick={handleDelete}
                      aria-label="Excluir oração"
                      className="p-2 rounded-lg hover:bg-red-500/20 text-white transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    aria-label="Fechar"
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Audio Player */}
              {prayer.audioUrl ? (
                <>
                  <PrayerPlayerBar
                    playing={playing}
                    progress={progress}
                    currentTime={currentTime}
                    duration={duration}
                    repeat={repeat}
                    audioLoading={audioLoading}
                    audioError={audioError}
                    onTogglePlay={togglePlay}
                    onSkip={skip}
                    onProgressClick={handleProgressClick}
                    onRepeatToggle={() => setRepeat(!repeat)}
                    progressRef={progressRef}
                    formatTime={formatTime}
                  />

                  <div className="h-px bg-gradient-to-r from-transparent via-[#10B981]/20 to-transparent my-6" />
                </>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center mb-6">
                  <p className="text-gray-600 text-sm">Áudio não disponível para esta oração</p>
                </div>
              )}

              {/* Hidden audio element */}
              <audio ref={audioRef} crossOrigin="anonymous" />

              {/* Prayer Text */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Oração</h3>
                  <div className="flex items-center gap-1.5" role="group" aria-label="Tamanho da fonte">
                    <button
                      onClick={decrease}
                      disabled={!canDecrease}
                      aria-label="Diminuir tamanho da fonte"
                      className={cn(
                        "w-7 h-7 rounded-md text-xs font-bold transition-colors",
                        canDecrease
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                          : "bg-gray-50 text-gray-300 cursor-not-allowed"
                      )}
                    >
                      A-
                    </button>
                    <button
                      onClick={increase}
                      disabled={!canIncrease}
                      aria-label="Aumentar tamanho da fonte"
                      className={cn(
                        "w-7 h-7 rounded-md text-xs font-bold transition-colors",
                        canIncrease
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                          : "bg-gray-50 text-gray-300 cursor-not-allowed"
                      )}
                    >
                      A+
                    </button>
                  </div>
                </div>
                <div className="bg-[#F9FAFB] rounded-2xl p-6">
                  <p
                    className="text-[#1F2937] whitespace-pre-wrap"
                    style={{ fontSize: `${fontSize}px`, lineHeight: '1.85' }}
                  >
                    {stripAudioMarkers(prayer.content)}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Fechar oração"
                className="w-full py-4 bg-[#10B981] text-white font-semibold rounded-xl hover:bg-[#059669] transition-colors"
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
