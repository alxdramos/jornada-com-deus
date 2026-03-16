import { useState, useRef, useEffect, useCallback } from "react";
import { useMediaSession } from "./useMediaSession";
import { resolveAudioUrl } from "@/lib/cdn";

interface UsePrayerPlayerProps {
  audioUrl?: string;
  isOpen: boolean;
  title?: string;
  artwork?: string;
}

export function usePrayerPlayer({
  audioUrl,
  isOpen,
  title,
  artwork,
}: UsePrayerPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Setup audio element when URL is provided
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      setAudioError(false);
      setAudioLoading(true);
      audioRef.current.src = resolveAudioUrl(audioUrl);
      audioRef.current.load();
    }
  }, [audioUrl]);

  // Handle audio events
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;
    const audio = audioRef.current;

    const handleCanPlay = () => {
      setAudioLoading(false);
      setDuration(audio.duration);
    };
    const handleWaiting = () => setAudioLoading(true);
    const handleError = () => {
      setAudioLoading(false);
      setAudioError(true);
      setPlaying(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  // Handle audio progress
  useEffect(() => {
    if (!playing) return;

    if (audioUrl && audioRef.current) {
      const audio = audioRef.current;
      const updateProgress = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
          setCurrentTime(audio.currentTime);
        }
      };

      const handleEnded = () => {
        if (repeat) {
          audio.currentTime = 0;
          audio.play();
        } else {
          setPlaying(false);
        }
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [playing, repeat, audioUrl]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isOpen]);

  const togglePlay = useCallback(async () => {
    if (audioUrl && audioRef.current) {
      try {
        if (playing) {
          audioRef.current.pause();
          setPlaying(false);
        } else {
          await audioRef.current.play();
          setPlaying(true);
        }
      } catch (error) {
        console.error('Erro ao controlar áudio:', error);
        setPlaying(false);
      }
    }
  }, [audioUrl, playing]);

  const skipCb = useCallback((direction: 'forward' | 'backward') => {
    const skipAmount = 15;
    if (audioRef.current) {
      const newTime = direction === 'forward'
        ? Math.min(currentTime + skipAmount, duration)
        : Math.max(currentTime - skipAmount, 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress((newTime / duration) * 100);
    }
  }, [currentTime, duration]);

  const handlePlay = useCallback(() => { void togglePlay(); }, [togglePlay]);
  const handlePause = useCallback(() => { void togglePlay(); }, [togglePlay]);
  const handleSeekBwd = useCallback(() => skipCb('backward'), [skipCb]);
  const handleSeekFwd = useCallback(() => skipCb('forward'), [skipCb]);

  useMediaSession({
    metadata: isOpen && title ? { title, album: 'Orações' } : null,
    playing,
    onPlay: handlePlay,
    onPause: handlePause,
    onSeekBackward: handleSeekBwd,
    onSeekForward: handleSeekFwd,
  });

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = (clickX / rect.width) * 100;
      const newTime = (newProgress / 100) * duration;

      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
      setCurrentTime(newTime);
    }
  };

  const skip = skipCb;

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    playing,
    progress,
    currentTime,
    duration,
    repeat,
    audioError,
    audioLoading,
    audioRef,
    progressRef,
    togglePlay,
    handleProgressClick,
    skip,
    setRepeat,
    formatTime,
  };
}
