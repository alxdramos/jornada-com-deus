import { Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useMeditationPlayer } from "@/hooks/useMeditationPlayer";
import { useImageFallback } from "@/hooks/useImageFallback";
import { useReadingFontSize } from "@/hooks/useReadingFontSize";
import { stripAudioMarkers } from "@/lib/stripAudioMarkers";
import { MeditationPlayerBar } from "./MeditationPlayerBar";
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
  onToggleFavorite
}: MeditationDetailModalWithPlayerProps) {
  // Hooks must be called before early return
  const {
    playing,
    progress,
    currentTime,
    muted,
    repeat,
    audioLoading,
    audioError,
    audioRef,
    progressRef,
    togglePlay,
    handleProgressClick,
    skip,
    setMuted,
    setRepeat,
  } = useMeditationPlayer({
    audioUrl: meditation?.audioUrl,
    isPlus: true,
    isOpen: !!meditation,
    title: meditation?.title,
  });

  const { fontSize, canIncrease, canDecrease, increase, decrease } = useReadingFontSize();

  const { imageUrl } = useImageFallback({
    filename: meditation?.image?.split('/').pop()?.split('.')[0],
    category: meditation?.category,
  });

  if (!meditation) return null;

  // Generate inline style with intelligent fallback
  const headerStyle: React.CSSProperties = {
    backgroundImage: meditation?.image
      ? `url('${meditation.image}')`
      : imageUrl
      ? `url('${imageUrl}')`
      : "linear-gradient(to bottom right, rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.3))",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <AnimatePresence>
      {meditation && (
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
              aria-labelledby="meditation-modal-title"
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
                  <h2 id="meditation-modal-title" className="text-2xl font-bold text-white drop-shadow-lg">{meditation.title}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium drop-shadow bg-[#8B5CF6]/20 text-white">
                      {meditation.category}
                    </span>
                    {meditation.plus && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium drop-shadow bg-[#FB923C]/20 text-[#FB923C]">
                        Plus
                      </span>
                    )}
                  </div>
                </div>

                {/* Top Right Buttons */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onToggleFavorite(meditation.id)}
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
              {meditation.audioUrl ? (
                <>
                  <MeditationPlayerBar
                    playing={playing}
                    progress={progress}
                    currentTime={currentTime}
                    duration={meditation.duration}
                    repeat={repeat}
                    muted={muted}
                    audioLoading={audioLoading}
                    audioError={audioError}
                    onTogglePlay={togglePlay}
                    onSkip={skip}
                    onProgressClick={handleProgressClick}
                    onRepeatToggle={() => setRepeat(!repeat)}
                    onMuteToggle={() => setMuted(!muted)}
                    progressRef={progressRef}
                  />

                  <div className="h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/20 to-transparent my-6" />
                </>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center mb-6">
                  <p className="text-gray-600 text-sm">Áudio não disponível para esta meditação</p>
                </div>
              )}

              {/* Hidden audio element */}
              <audio ref={audioRef} crossOrigin="anonymous" />

              {/* Meditation Text */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Meditação</h3>
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
                    {stripAudioMarkers(meditation.description ?? '')}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Fechar meditação"
                className="w-full py-4 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors"
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
