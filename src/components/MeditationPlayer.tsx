"use client";

import { motion } from "framer-motion";
import { X, Heart } from "lucide-react";
import { useMeditationPlayer } from "@/hooks/useMeditationPlayer";
import { ProgressBar } from "./meditation/ProgressBar";
import { PlayerControls } from "./meditation/PlayerControls";
import { SecondaryControls } from "./meditation/SecondaryControls";
import { PlusOverlay } from "./meditation/PlusOverlay";
import { AudioErrorMessage } from "./meditation/AudioErrorMessage";

interface MeditationPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  descricao?: string;
  duracao: string;
  isPlus?: boolean;
  imagemFundo?: string;
  audioUrl?: string;
}

export function MeditationPlayer({
  isOpen,
  onClose,
  titulo,
  descricao,
  duracao,
  isPlus = false,
  imagemFundo = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop",
  audioUrl
}: MeditationPlayerProps) {
  const {
    playing,
    progress,
    currentTime,
    muted,
    isFavorite,
    repeat,
    audioError,
    audioLoading,
    audioRef,
    progressRef,
    togglePlay,
    handleProgressClick,
    skip,
    setMuted,
    setIsFavorite,
    setRepeat
  } = useMeditationPlayer({
    audioUrl,
    isPlus: isPlus ?? false,
    isOpen
  });

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-black"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imagemFundo})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white">
        {/* Título e descrição */}
        <div className="max-w-md space-y-4 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold leading-tight"
          >
            {titulo}
          </motion.h1>
          {descricao && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-sm leading-relaxed"
            >
              {descricao}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 text-sm text-white/70"
          >
            <span>{duracao}</span>
            {!isPlus && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  Plus
                </span>
              </>
            )}
          </motion.div>
        </div>

        <ProgressBar
          progress={progress}
          currentTime={currentTime}
          duracao={duracao}
          onProgressClick={handleProgressClick}
          progressRef={progressRef as React.RefObject<HTMLDivElement>}
        />

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
          onToggleFavorite={() => setIsFavorite(!isFavorite)}
          onToggleRepeat={() => setRepeat(!repeat)}
        />

        {!isPlus && <PlusOverlay />}

        <AudioErrorMessage show={audioError} />

        {audioUrl && (
          <audio
            ref={audioRef}
            preload="metadata"
            muted={muted}
            style={{ display: 'none' }}
          />
        )}
      </div>
    </motion.div>
  );
}