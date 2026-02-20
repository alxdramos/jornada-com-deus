'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Heart, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Oracao } from '@/data/oracoes';
import useOracaoStore from '@/stores/oracaoStore';

interface OracaoCardProps {
  oracao: Oracao;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const OracaoCard: React.FC<OracaoCardProps> = ({
  oracao,
  onNext,
  onPrevious,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const { isFavorito, toggleFavorito } = useOracaoStore();
  const isFav = isFavorito(oracao.id);

  // Handle audio play/pause
  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Update current time
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Update duration
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Format time for display
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Reset when oracao changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [oracao.id]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={`/Imagens Paisagem/${oracao.imagem.background}`}
          alt={oracao.titulo}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            // Fallback to gradient if image fails
            const img = e.currentTarget;
            img.style.display = 'none';
          }}
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-auto pt-8">
          <button
            onClick={() => toggleFavorito(oracao.id)}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <Heart
              size={24}
              className={isFav ? 'fill-red-500 text-red-500' : 'text-white'}
            />
          </button>

          <div className="text-white text-center flex-1 px-4">
            <p className="text-sm text-white/60 mb-1">Oração do Dia</p>
            <h1 className="text-3xl font-bold leading-tight">{oracao.titulo}</h1>
          </div>

          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Main Content - Scrollable Text */}
        <div className="flex-1 overflow-y-auto my-8 max-h-96">
          <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
            {oracao.texto}
          </p>
        </div>

        {/* Audio Player */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-6">
          <audio
            ref={audioRef}
            src={oracao.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Play/Pause Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center justify-center transition-all transform hover:scale-105 shadow-lg"
            >
              {isPlaying ? (
                <Pause size={32} className="text-white" />
              ) : (
                <Play size={32} className="text-white ml-1" />
              )}
            </button>
          </div>

          {/* Time display */}
          <div className="flex justify-between text-white/60 text-sm mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Progress bar */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />

          {/* Audio metadata */}
          <p className="text-white/60 text-xs mt-3 text-center">
            Áudio via Cloudflare R2
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onPrevious}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>

          <div className="text-white/60 text-sm">
            {oracao.id}
          </div>

          <button
            onClick={onNext}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OracaoCard;
