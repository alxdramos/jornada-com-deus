import { useState, useRef, useEffect } from "react";

interface UseImmersiveAudioPlayerProps {
  isPlus: boolean;
  isOpen: boolean;
}

export function useImmersiveAudioPlayer({
  isPlus,
  isOpen
}: UseImmersiveAudioPlayerProps) {
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

  useEffect(() => {
    if (!playing || !isPlus) return;
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
      setCurrentTime((newProgress / 100) * 360);
    }
  };

  const skip = (direction: 'forward' | 'backward') => {
    if (!isPlus) return;
    const skipAmount = 15;
    const newTime = direction === 'forward'
      ? Math.min(currentTime + skipAmount, 360)
      : Math.max(currentTime - skipAmount, 0);
    setCurrentTime(newTime);
    setProgress((newTime / 360) * 100);
  };

  return {
    playing,
    progress,
    currentTime,
    volume,
    muted,
    speed,
    repeat,
    isFavorite,
    showPlusOverlay,
    speeds,
    audioRef,
    progressRef,
    togglePlay,
    handleProgressClick,
    skip,
    setMuted,
    setIsFavorite,
    setRepeat,
    setShowPlusOverlay,
    setSpeed,
  };
}
