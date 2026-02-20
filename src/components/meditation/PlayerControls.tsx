import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Loader2, AlertCircle } from "lucide-react";

interface PlayerControlsProps {
  playing: boolean;
  audioLoading: boolean;
  audioError: boolean;
  onTogglePlay: () => void;
  onSkip: (direction: 'forward' | 'backward') => void;
}

export function PlayerControls({
  playing,
  audioLoading,
  audioError,
  onTogglePlay,
  onSkip
}: PlayerControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex items-center gap-6 mb-8"
    >
      <button
        onClick={() => onSkip('backward')}
        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <SkipBack className="w-5 h-5" />
      </button>

      <button
        onClick={onTogglePlay}
        disabled={audioError || audioLoading}
        className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        title={audioError ? "Erro ao carregar áudio" : undefined}
      >
        {audioLoading ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : audioError ? (
          <AlertCircle className="w-7 h-7 text-red-500" />
        ) : playing ? (
          <Pause className="w-7 h-7" />
        ) : (
          <Play className="w-7 h-7 ml-1" />
        )}
      </button>

      <button
        onClick={() => onSkip('forward')}
        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <SkipForward className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
