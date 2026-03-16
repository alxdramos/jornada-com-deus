'use client';

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Heart, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNativeShare } from "@/hooks/useNativeShare";
import { useContentPlayer } from "@/hooks/useContentPlayer";
import { stripAudioMarkers } from "@/lib/stripAudioMarkers";
import { PlayerControls } from "./meditation/PlayerControls";
import { SecondaryControls } from "./meditation/SecondaryControls";
import { SpeedControls } from "./immersive/SpeedControls";

interface Badge {
  label: string;
  className?: string;
}

interface ImmersiveContentPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  texto: string;
  audioUrl?: string;
  imageUrl?: string;
  gradientFrom?: string;
  gradientTo?: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  badges?: Badge[];
  onDelete?: () => void;
}

export function ImmersiveContentPlayer({
  isOpen,
  onClose,
  titulo,
  texto,
  audioUrl,
  imageUrl,
  gradientFrom = "#6B21A8",
  gradientTo = "#1E1B4B",
  isFavorite,
  onToggleFavorite,
  badges,
  onDelete,
}: ImmersiveContentPlayerProps) {
  const { share } = useNativeShare();

  const {
    playing,
    progress,
    currentTime,
    duration,
    repeat,
    audioError,
    audioLoading,
    speed,
    muted,
    speeds,
    audioRef,
    progressRef,
    togglePlay,
    skip,
    handleProgressClick,
    setRepeat,
    setSpeed,
    setMuted,
    formatTime,
  } = useContentPlayer({ audioUrl, isOpen, title: titulo });

  if (!isOpen) return null;

  const paragraphs = stripAudioMarkers(texto)
    .split('\n')
    .filter(p => p.trim().length > 0);

  const handleDelete = () => {
    onDelete?.();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10001] bg-black"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={
            imageUrl
              ? { backgroundImage: `url(${imageUrl})` }
              : { background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }
          }
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Audio element */}
        <audio ref={audioRef} crossOrigin="anonymous" />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-2 pb-2">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onClose}
            aria-label="Fechar"
            className="p-2.5 rounded-full bg-white/15 backdrop-blur-md"
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </motion.button>

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={onToggleFavorite}
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              className={cn(
                "p-2.5 rounded-full backdrop-blur-md transition-colors",
                isFavorite ? "bg-red-500/30" : "bg-white/15"
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorite ? "fill-red-400 text-red-400" : "text-white")} />
            </motion.button>

            {onDelete && (
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={handleDelete}
                aria-label="Excluir"
                className="p-2.5 rounded-full bg-white/15 backdrop-blur-md"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col h-[calc(100%-60px)] px-6 pb-6">
          {/* Title + badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h1
              className="text-2xl font-bold text-white leading-tight mb-2"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
            >
              {titulo}
            </h1>
            {badges && badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {badges.map((b, i) => (
                  <span
                    key={i}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm",
                      b.className ?? "bg-white/20 text-white"
                    )}
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Scrollable text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 overflow-y-auto overscroll-contain mb-6"
          >
            <div className="max-w-2xl mx-auto space-y-4">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-base text-white/95 leading-relaxed text-center"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                >
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Progress bar */}
          {audioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div
                ref={progressRef}
                onClick={handleProgressClick}
                className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-2"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#FB923C] to-[#10B981] rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/70">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </motion.div>
          )}

          {/* Player controls */}
          {audioUrl ? (
            <>
              <PlayerControls
                playing={playing}
                audioLoading={audioLoading}
                audioError={audioError}
                onTogglePlay={togglePlay}
                onSkip={skip}
              />

              <SecondaryControls
                muted={muted}
                isFavorite={isFavorite}
                repeat={repeat}
                onToggleMute={() => setMuted(!muted)}
                onToggleFavorite={onToggleFavorite}
                onToggleRepeat={() => setRepeat(!repeat)}
                onShare={() =>
                  share({
                    title: titulo,
                    text: `🙏 Ouvi "${titulo}" na Jornada com Deus.\n\nVenha ouvir também!`,
                  })
                }
              />

              <div className="mt-4">
                <SpeedControls
                  speeds={speeds}
                  currentSpeed={speed}
                  onSpeedChange={setSpeed}
                />
              </div>
            </>
          ) : (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
              <p className="text-white/70 text-sm">Áudio não disponível</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
