import { Heart, ChevronDown, BookOpen } from "lucide-react";
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
    title: estudo?.shortTitle,
  });

  const { fontSize, canIncrease, canDecrease, increase, decrease } = useReadingFontSize();

  if (!estudo) return null;

  return (
    <AnimatePresence>
      {estudo && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
          transition={{ type: "spring", damping: 30, stiffness: 260 }}
          className="fixed inset-0 z-[10001] bg-white flex flex-col"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          {/* Hero Image Area */}
          <div
            className="relative flex-shrink-0 overflow-hidden bg-gradient-to-br from-[#D97706] to-[#92400E]"
            style={{ height: "clamp(240px, 42vh, 340px)" }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <BookOpen className="w-48 h-48 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Top action bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={onClose}
                aria-label="Fechar"
                className="p-2.5 rounded-full bg-white/20 backdrop-blur-md"
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => onToggleFavorite(estudo.id)}
                aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                className={cn(
                  "p-2.5 rounded-full backdrop-blur-md transition-colors",
                  isFavorite ? "bg-red-500/30" : "bg-white/20"
                )}
              >
                <Heart className={cn("w-5 h-5", isFavorite ? "fill-red-400 text-red-400" : "text-white")} />
              </motion.button>
            </div>

            {/* Title at bottom of hero */}
            <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
              <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-lg">{estudo.shortTitle}</h2>
              {estudo.reference && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                    {estudo.reference}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                    {estudo.category}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 24px)" }}
          >
            <div className="p-5">
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
                  <div className="h-px bg-gradient-to-r from-transparent via-[#D97706]/20 to-transparent my-5" />
                </>
              ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center mb-5">
                  <p className="text-gray-500 text-sm">Áudio não disponível para este estudo</p>
                </div>
              )}

              <audio ref={audioRef} crossOrigin="anonymous" />

              {/* Study Text */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest">Estudo Bíblico</h3>
                  <div className="flex items-center gap-1.5" role="group" aria-label="Tamanho da fonte">
                    <button
                      onClick={decrease}
                      disabled={!canDecrease}
                      aria-label="Diminuir tamanho da fonte"
                      className={cn(
                        "w-7 h-7 rounded-md text-xs font-bold transition-colors",
                        canDecrease
                          ? "bg-gray-100 text-gray-700 active:bg-gray-300"
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
                          ? "bg-gray-100 text-gray-700 active:bg-gray-300"
                          : "bg-gray-50 text-gray-300 cursor-not-allowed"
                      )}
                    >
                      A+
                    </button>
                  </div>
                </div>
                <div className="bg-[#F9FAFB] rounded-2xl p-5">
                  <p
                    className="text-[#1F2937] whitespace-pre-wrap"
                    style={{ fontSize: `${fontSize}px`, lineHeight: "1.85" }}
                  >
                    {stripAudioMarkers(estudo.text)}
                  </p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                aria-label="Fechar estudo bíblico"
                className="w-full py-4 bg-[#D97706] text-white font-semibold rounded-2xl active:bg-[#B45309] transition-colors"
              >
                Fechar
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
