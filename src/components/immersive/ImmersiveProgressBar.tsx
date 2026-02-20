import { motion } from "framer-motion";
import { formatTime } from "@/lib/time";

interface ImmersiveProgressBarProps {
  progress: number;
  currentTime: number;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  progressRef: React.RefObject<HTMLDivElement>;
}

export function ImmersiveProgressBar({
  progress,
  currentTime,
  onProgressClick,
  progressRef
}: ImmersiveProgressBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div
        ref={progressRef}
        onClick={onProgressClick}
        className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-2"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-[#FB923C] to-[#10B981] rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
      <div className="flex justify-between text-xs text-white/70">
        <span>{formatTime(currentTime)}</span>
        <span>6:00</span>
      </div>
    </motion.div>
  );
}
