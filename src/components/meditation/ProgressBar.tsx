import { motion } from "framer-motion";
import { formatTime } from "@/lib/time";

interface ProgressBarProps {
  progress: number;
  currentTime: number;
  duracao: string;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  progressRef: React.RefObject<HTMLDivElement>;
}

export function ProgressBar({
  progress,
  currentTime,
  duracao,
  onProgressClick,
  progressRef
}: ProgressBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-md mb-8"
    >
      <div
        ref={progressRef}
        onClick={onProgressClick}
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
  );
}
