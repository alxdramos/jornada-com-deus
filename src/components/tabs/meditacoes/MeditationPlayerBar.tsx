import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeditationPlayerBarProps {
  playing: boolean;
  progress: number;
  currentTime: number;
  duration?: string;
  repeat: boolean;
  muted: boolean;
  audioLoading: boolean;
  audioError: boolean;
  onTogglePlay: () => void;
  onSkip: (direction: "forward" | "backward") => void;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onRepeatToggle: () => void;
  onMuteToggle: () => void;
  progressRef: React.RefObject<HTMLDivElement | null>;
}

export function MeditationPlayerBar({
  playing,
  progress,
  currentTime,
  duration = "--:--",
  repeat,
  muted,
  audioLoading,
  audioError,
  onTogglePlay,
  onSkip,
  onProgressClick,
  onRepeatToggle,
  onMuteToggle,
  progressRef,
}: MeditationPlayerBarProps) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div
          ref={progressRef}
          onClick={onProgressClick}
          className="h-1 bg-gray-200 rounded-full cursor-pointer hover:h-2 transition-all"
        >
          <div
            className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{duration}</span>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={onSkip.bind(null, "backward")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={onTogglePlay}
          disabled={audioLoading || audioError}
          className={cn(
            "p-4 rounded-full transition-colors",
            playing
              ? "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
              : "bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30"
          )}
        >
          {audioLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : playing ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <button
          onClick={onSkip.bind(null, "forward")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onRepeatToggle}
          className={cn(
            "p-2 rounded-lg transition-colors",
            repeat
              ? "bg-[#8B5CF6]/20 text-[#8B5CF6]"
              : "text-gray-400 hover:text-gray-700"
          )}
          title={repeat ? "Repetição ativada" : "Repetição desativada"}
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={onMuteToggle}
          className={cn(
            "p-2 rounded-lg transition-colors",
            muted
              ? "bg-red-500/20 text-red-500"
              : "text-gray-400 hover:text-gray-700"
          )}
        >
          {muted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Error Message */}
      {audioError && (
        <div className="text-center text-sm text-red-500">
          Erro ao carregar áudio. Tente novamente.
        </div>
      )}
    </div>
  );
}
