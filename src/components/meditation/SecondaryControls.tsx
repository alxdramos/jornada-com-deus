import { motion } from "framer-motion";
import { Volume2, VolumeX, Heart, Repeat, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecondaryControlsProps {
  muted: boolean;
  isFavorite: boolean;
  repeat: boolean;
  onToggleMute: () => void;
  onToggleFavorite: () => void;
  onToggleRepeat: () => void;
  onShare?: () => void;
}

export function SecondaryControls({
  muted,
  isFavorite,
  repeat,
  onToggleMute,
  onToggleFavorite,
  onToggleRepeat,
  onShare,
}: SecondaryControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex items-center gap-4"
    >
      <button
        onClick={onToggleMute}
        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        {muted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      <button
        onClick={onToggleFavorite}
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
        onClick={onToggleRepeat}
        className={cn(
          "w-10 h-10 rounded-full backdrop-blur flex items-center justify-center transition-colors",
          repeat
            ? "bg-white/30 text-white"
            : "bg-white/20 text-white hover:bg-white/30"
        )}
      >
        <Repeat className="w-5 h-5" />
      </button>

      <button
        onClick={onShare}
        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Compartilhar"
      >
        <Share2 className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
