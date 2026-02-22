import { useState, useRef, useEffect } from "react";

interface UseMeditationPlayerProps {
  audioUrl?: string;
  isPlus: boolean;
  isOpen: boolean;
}

export function useMeditationPlayer({
  audioUrl,
  isPlus,
  isOpen
}: UseMeditationPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showPlusOverlay, setShowPlusOverlay] = useState(!isPlus);
  const [audioError, setAudioError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Setup audio element when URL is provided
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      setAudioError(false);
      setAudioLoading(true);
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      console.log('Audio loaded:', audioUrl);
    }
  }, [audioUrl]);

  // Fallback: Ensure audio is loaded even if ref wasn't ready on first effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (audioUrl && audioRef.current && !audioRef.current.src) {
        console.log('Fallback: Loading audio URL', audioUrl);
        audioRef.current.src = audioUrl;
        audioRef.current.load();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [audioUrl]);

  // Lidar com eventos do audio element
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;
    const audio = audioRef.current;

    const handleCanPlay = () => setAudioLoading(false);
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

  // Lidar com progresso do audio
  useEffect(() => {
    if (!playing || !isPlus) return;

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
    } else {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (repeat) {
              return 0;
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
    }
  }, [playing, isPlus, repeat, audioUrl]);

  useEffect(() => {
    if (!isOpen) {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [isOpen]);

  const togglePlay = async () => {
    if (!isPlus) {
      setShowPlusOverlay(true);
      return;
    }

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
        console.error('Erro ao controlar audio:', error);
        setPlaying(false);
      }
    } else {
      setPlaying(!playing);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = (clickX / rect.width) * 100;
      setProgress(newProgress);
      setCurrentTime((newProgress / 100) * 300);
    }
  };

  const skip = (direction: 'forward' | 'backward') => {
    const skipAmount = 15;
    const newTime = direction === 'forward'
      ? Math.min(currentTime + skipAmount, 300)
      : Math.max(currentTime - skipAmount, 0);
    setCurrentTime(newTime);
    setProgress((newTime / 300) * 100);
  };

  return {
    playing,
    progress,
    volume,
    muted,
    currentTime,
    isFavorite,
    repeat,
    showPlusOverlay,
    audioError,
    audioLoading,
    audioRef,
    progressRef,
    togglePlay,
    handleProgressClick,
    skip,
    setMuted,
    setIsFavorite,
    setRepeat,
    setShowPlusOverlay,
    setVolume,
  };
}
