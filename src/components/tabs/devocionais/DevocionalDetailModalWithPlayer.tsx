import { Heart, ChevronDown, BookHeart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePrayerPlayer } from "@/hooks/usePrayerPlayer";
import { useReadingFontSize } from "@/hooks/useReadingFontSize";
import { stripAudioMarkers } from "@/lib/stripAudioMarkers";
import { DevocionalPlayerBar } from "./DevocionalPlayerBar";
import { Devocional } from "@/data/devocionais";
import Image from "next/image";

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
    audioUrl: devocional?.audioUrl,
    isOpen: !!devocional,
    title: devocional?.shortTitle,
  });

  const { fontSize, canIncrease, canDecrease, increase, decrease } = useReadingFontSize();

  if (!devocional) return null;

  const imageUrl = DEVOCIONAL_IMAGES[devocional.id];

  return (
    <AnimatePresence>
      {devocional && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
          transition={{ type: "spring", damping: 30, stiffness: 260 }}
          className="fixed inset-0 z-[10001] bg-black flex flex-col"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          {/* Imagem fullscreen */}
          <div className="absolute inset-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={devocional.shortTitle}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#F97316] to-[#92400E]">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <BookHeart className="w-64 h-64 text-white" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/55" />
          </div>

          {/* Top action bar */}
          <div className="relative z-10 flex items-center justify-between p-4">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={onClose}
              aria-label="Fechar"
              className="p-2.5 rounded-full bg-white/15 backdrop-blur-md"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => onToggleFavorite(devocional.id)}
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              className={cn(
                "p-2.5 rounded-full backdrop-blur-md transition-colors",
                isFavorite ? "bg-red-500/30" : "bg-white/15"
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorite ? "fill-red-400 text-red-400" : "text-white")} />
            </motion.button>
          </div>

          {/* Title */}
          <div className="relative z-10 px-6 pb-3">
            <h2
              className="text-2xl font-bold text-white leading-tight"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
            >
              {devocional.shortTitle}
            </h2>
            {devocional.reference && (
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                  {devocional.reference}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                  {devocional.category}
                </span>
              </div>
            )}
          </div>

          {/* Scrollable text */}
          <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-6">
            <div className="flex items-center justify-end mb-3">
              <div className="flex items-center gap-1.5" role="group" aria-label="Tamanho da fonte">
                <button
                  onClick={decrease}
                  disabled={!canDecrease}
                  aria-label="Diminuir tamanho da fonte"
                  className={cn(
                    "w-7 h-7 rounded-md text-xs font-bold transition-colors",
                    canDecrease ? "bg-white/20 text-white" : "bg-white/10 text-white/30 cursor-not-allowed"
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
                    canIncrease ? "bg-white/20 text-white" : "bg-white/10 text-white/30 cursor-not-allowed"
                  )}
                >
                  A+
                </button>
              </div>
            </div>
            <p
              className="text-white/95 whitespace-pre-wrap pb-4"
              style={{ fontSize: `${fontSize}px`, lineHeight: "1.85", textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}
            >
              {stripAudioMarkers(devocional.text)}
            </p>
          </div>

          {/* Player + close button */}
          <div
            className="relative z-10 px-5 pb-4"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}
          >
            <audio ref={audioRef} crossOrigin="anonymous" />
            {devocional.audioUrl ? (
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 mb-3">
                <DevocionalPlayerBar
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
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center mb-3">
                <p className="text-white/70 text-sm">Áudio não disponível para este devocional</p>
              </div>
            )}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              aria-label="Fechar devocional"
              className="w-full py-4 bg-[#F97316] text-white font-semibold rounded-2xl active:bg-[#EA580C] transition-colors"
            >
              Fechar
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
