"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  Heart,
  Share2,
  Repeat
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MeditationPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  descricao?: string;
  duracao: string;
  isPlus?: boolean;
  imagemFundo?: string;
}

export function MeditationPlayer({
  isOpen,
  onClose,
  titulo,
  descricao,
  duracao,
  isPlus = false,
  imagemFundo = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop"
}: MeditationPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Simular progresso para demonstração
  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
        setCurrentTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [playing]);

  useEffect(() => {
    if (!isOpen) {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [isOpen]);

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = (clickX / rect.width) * 100;
      setProgress(newProgress);
      setCurrentTime((newProgress / 100) * 300); // Assumindo 5 minutos
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skip = (direction: 'forward' | 'backward') => {
    const skipAmount = 15; // 15 segundos
    const newTime = direction === 'forward'
      ? Math.min(currentTime + skipAmount, 300)
      : Math.max(currentTime - skipAmount, 0);
    setCurrentTime(newTime);
    setProgress((newTime / 300) * 100);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-black"
    >
      {/* Background image com overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imagemFundo})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Content */}
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

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md mb-8"
        >
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="h-1 bg-white/30 rounded-full cursor-pointer mb-2"
          >
            <motion.div
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/70">
            <span>{formatTime(currentTime)}</span>
            <span>{duracao}</span>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-6 mb-8"
        >
          <button
            onClick={() => skip('backward')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
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
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Secondary controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-4"
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

        {/* Overlay Plus para conteúdo não premium */}
        {!isPlus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] mb-2">
                Conteúdo Plus
              </h3>
              <p className="text-sm text-[#6B7280] mb-4">
                Esta meditação está disponível apenas para membros Plus
              </p>
              <button className="w-full py-3 px-4 bg-gradient-to-r from-[#FB923C] to-[#F97316] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity">
                Atualizar para Plus
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}