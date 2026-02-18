"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Repeat,
  Crown,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [repeat, setRepeat] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPlusOverlay, setShowPlusOverlay] = useState(!isPlus);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const speeds = [0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    if (!isOpen) {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [isOpen]);

  // Simular progresso quando "playing"
  useEffect(() => {
    if (!playing || !isPlus) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (repeat) {
            return 0; // Reinicia se repeat estiver ativado
          } else {
            setPlaying(false);
            return 100;
          }
        }
        return prev + 0.2;
      });
      setCurrentTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [playing, isPlus, repeat]);

  const togglePlay = () => {
    if (!isPlus) {
      setShowPlusOverlay(true);
      return;
    }
    setPlaying((p) => !p);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlus) return;
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = (clickX / rect.width) * 100;
      setProgress(newProgress);
      setCurrentTime((newProgress / 100) * 360); // Assumindo 6 minutos
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skip = (direction: 'forward' | 'backward') => {
    if (!isPlus) return;
    const skipAmount = 15; // 15 segundos
    const newTime = direction === 'forward'
      ? Math.min(currentTime + skipAmount, 360)
      : Math.max(currentTime - skipAmount, 0);
    setCurrentTime(newTime);
    setProgress((newTime / 360) * 100);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] bg-black"
      >
        {/* Background image com overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGEM_FUNDO})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-6 pb-8 pt-14">
          {/* Título e metadados */}
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

          {/* Texto rolável */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 overflow-y-auto mb-8"
          >
            <div className="max-w-2xl mx-auto">
              <div
                className="text-lg text-white/95 leading-relaxed whitespace-pre-wrap"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
              >
                {texto}
              </div>
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-2"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-[#FB923C] to-[#10B981] rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>{formatTime(currentTime)}</span>
              <span>6:00</span>
            </div>
          </motion.div>

          {/* Main controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 mb-8"
          >
            <button
              onClick={() => skip('backward')}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform shadow-lg"
            >
              {playing ? (
                <Pause className="w-7 h-7" />
              ) : (
                <Play className="w-7 h-7 ml-1" />
              )}
            </button>

            <button
              onClick={() => skip('forward')}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Secondary controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <button
              onClick={() => setMuted(!muted)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              {muted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={cn(
                "w-10 h-10 rounded-full backdrop-blur flex items-center justify-center transition-colors",
                isFavorite
                  ? "bg-red-500/20 text-red-400"
                  : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
            </button>

            <button
              onClick={() => setRepeat(!repeat)}
              className={cn(
                "w-10 h-10 rounded-full backdrop-blur flex items-center justify-center transition-colors",
                repeat
                  ? "bg-white/30 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              <Repeat className="w-5 h-5" />
            </button>

            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Speed controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-2"
          >
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  speed === s
                    ? "bg-gradient-to-r from-[#FB923C] to-[#10B981] text-white"
                    : "bg-white/20 text-white hover:bg-white/30"
                )}
              >
                {s}x
              </button>
            ))}
          </motion.div>
        </div>

        {/* Overlay Plus para conteúdo não premium */}
        <AnimatePresence>
          {showPlusOverlay && !isPlus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937] mb-2">
                  Conteúdo Plus
                </h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Esta oração está disponível apenas para membros Plus
                </p>
                <div className="space-y-3">
                  <button className="w-full py-3 px-4 bg-gradient-to-r from-[#FB923C] to-[#F97316] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity">
                    Atualizar para Plus
                  </button>
                  <button
                    onClick={() => setShowPlusOverlay(false)}
                    className="w-full py-2 px-4 text-[#6B7280] font-medium"
                  >
                    Ouvir depois
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
