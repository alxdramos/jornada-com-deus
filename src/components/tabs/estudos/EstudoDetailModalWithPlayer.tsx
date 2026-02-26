import { Heart, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePrayerPlayer } from "@/hooks/usePrayerPlayer";
import { useReadingFontSize } from "@/hooks/useReadingFontSize";
import { stripAudioMarkers } from "@/lib/stripAudioMarkers";
import { EstudoPlayerBar } from "./EstudoPlayerBar";
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
    audioUrl: estudo?.audioUrl,
    isOpen: !!estudo,
  });

  const { fontSize, canIncrease, canDecrease, increase, decrease } = useReadingFontSize();

  if (!estudo) return null;

  return (
    <AnimatePresence>
      {estudo && (
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
            aria-labelledby="estudo-modal-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-white rounded-t-3xl p-6 w-full max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-48 rounded-2xl mb-6 relative overflow-hidden flex items-end justify-between p-4 bg-gradient-to-br from-[#D97706] to-[#92400E]">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <BookOpen className="w-32 h-32 text-white" />
              </div>
              <div className="flex-1 relative z-10">
                <h2 id="estudo-modal-title" className="text-xl font-bold text-white drop-shadow-lg leading-tight">
                  {estudo.shortTitle}
                </h2>
                {estudo.reference && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium drop-shadow bg-black/20 text-white">
                      {estudo.reference}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium drop-shadow bg-black/20 text-white">
                      {estudo.category}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4 relative z-10">
                <button
                  onClick={() => onToggleFavorite(estudo.id)}
                  aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  className={cn(
                    "p-2 rounded-lg transition-colors backdrop-blur-sm",
                    isFavorite ? "text-red-400 bg-white/20" : "text-white hover:bg-white/20"
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

            {estudo.audioUrl ? (
              <>
                <EstudoPlayerBar
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
                <div className="h-px bg-gradient-to-r from-transparent via-[#D97706]/20 to-transparent my-6" />
              </>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center mb-6">
                <p className="text-gray-600 text-sm">Áudio não disponível para este estudo</p>
              </div>
            )}

            <audio ref={audioRef} crossOrigin="anonymous" />

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Estudo Bíblico</h3>
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
                  {stripAudioMarkers(estudo.text)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Fechar estudo bíblico"
              className="w-full py-4 bg-[#D97706] text-white font-semibold rounded-xl hover:bg-[#B45309] transition-colors"
            >
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
