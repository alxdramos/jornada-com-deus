import { Play, Pause, SkipBack, SkipForward, Repeat2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EstudoPlayerBarProps {
  playing: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  repeat: boolean;
  audioLoading: boolean;
  audioError: boolean;
  onTogglePlay: () => void;
  onSkip: (direction: 'forward' | 'backward') => void;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onRepeatToggle: () => void;
  progressRef: React.RefObject<HTMLDivElement | null>;
  formatTime: (seconds: number) => string;
}

export function EstudoPlayerBar({
  playing,
  progress,
  currentTime,
  duration,
  repeat,
  audioLoading,
  audioError,
  onTogglePlay,
  onSkip,
  onProgressClick,
  onRepeatToggle,
  progressRef,
  formatTime,
}: EstudoPlayerBarProps) {
  if (audioError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-600 text-sm">Erro ao carregar áudio</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#D97706]/10 to-[#B45309]/10 rounded-2xl p-6 space-y-4 border border-[#D97706]/20">
      <div
        ref={progressRef}
        onClick={onProgressClick}
        className="h-2 bg-[#D97706]/20 rounded-full cursor-pointer group relative hover:h-3 transition-all"
      >
        <div
          className="h-full bg-gradient-to-r from-[#D97706] to-[#B45309] rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
      <div className="flex justify-between text-xs text-[#6B7280]">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onSkip('backward')}
          className="p-2 rounded-lg hover:bg-white/50 text-[#D97706] transition-colors"
          aria-label="Voltar 15 segundos"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={onTogglePlay}
          disabled={audioLoading}
          className={cn(
            "p-3 rounded-full transition-all flex items-center justify-center",
            audioLoading
              ? "bg-[#D97706]/20 text-[#D97706]"
              : "bg-[#D97706] text-white hover:bg-[#B45309]"
          )}
          aria-label={playing ? "Pausar" : "Reproduzir"}
        >
          {audioLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : playing ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current" />
          )}
        </button>
        <button
          onClick={() => onSkip('forward')}
          className="p-2 rounded-lg hover:bg-white/50 text-[#D97706] transition-colors"
          aria-label="Avançar 15 segundos"
        >
          <SkipForward className="w-5 h-5" />
        </button>
        <button
          onClick={onRepeatToggle}
          className={cn(
            "p-2 rounded-lg transition-colors",
            repeat
              ? "bg-[#D97706]/20 text-[#D97706]"
              : "hover:bg-white/50 text-[#6B7280]"
          )}
          aria-label="Repetir"
        >
          <Repeat2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
