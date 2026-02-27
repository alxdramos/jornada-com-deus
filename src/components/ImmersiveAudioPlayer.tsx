"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, SkipBack, SkipForward, Crown } from "lucide-react";
import { useNativeShare } from "@/hooks/useNativeShare";
import { useImmersiveAudioPlayer } from "@/hooks/useImmersiveAudioPlayer";
import { formatTime } from "@/lib/time";
import { TextSection } from "./immersive/TextSection";
import { ImmersiveProgressBar } from "./immersive/ImmersiveProgressBar";
import { PlayerControls } from "./meditation/PlayerControls";
import { SecondaryControls } from "./meditation/SecondaryControls";
import { SpeedControls } from "./immersive/SpeedControls";
import { ImmersivePlusOverlay } from "./immersive/ImmersivePlusOverlay";

const IMAGEM_FUNDO =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=1600&fit=crop";

interface ImmersiveAudioPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  texto: string;
  isPlus: boolean;
}

export function ImmersiveAudioPlayer({
  isOpen,
  onClose,
  titulo,
  texto,
  isPlus,
}: ImmersiveAudioPlayerProps) {
  const { share: shareAudio } = useNativeShare();

  const {
    playing,
    progress,
    currentTime,
    muted,
    speed,
    repeat,
    isFavorite,
    showPlusOverlay,
    speeds,
    progressRef,
    togglePlay,
    handleProgressClick,
    skip,
    setMuted,
    setIsFavorite,
    setRepeat,
    setShowPlusOverlay,
    setSpeed,
  } = useImmersiveAudioPlayer({
    isPlus,
    isOpen
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] bg-black"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGEM_FUNDO})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 flex flex-col h-full px-6 pb-8 pt-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
              {titulo}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-white/70">
              <span>{formatTime(currentTime)}</span>
              <span>•</span>
              <span>Oração Guiada</span>
              {!isPlus && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Crown className="w-4 h-4 text-[#FB923C]" />
                    <span className="text-[#FB923C] font-medium">Plus</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          <TextSection texto={texto} />

          <ImmersiveProgressBar
            progress={progress}
            currentTime={currentTime}
            onProgressClick={handleProgressClick}
            progressRef={progressRef as React.RefObject<HTMLDivElement>}
          />

          <PlayerControls
            playing={playing}
            audioLoading={false}
            audioError={false}
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
            onShare={() =>
              shareAudio({
                title: titulo,
                text: `🙏 Ouvi "${titulo}" na Jornada com Deus.\n\nVenha ouvir também!`,
              })
            }
          />

          <SpeedControls
            speeds={speeds}
            currentSpeed={speed}
            onSpeedChange={setSpeed}
          />
        </div>

        <ImmersivePlusOverlay
          show={showPlusOverlay && !isPlus}
          onClose={() => setShowPlusOverlay(false)}
        />
      </motion.div>
    </AnimatePresence>
  );
}
