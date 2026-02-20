import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpeedControlsProps {
  speeds: number[];
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export function SpeedControls({
  speeds,
  currentSpeed,
  onSpeedChange
}: SpeedControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex justify-center gap-2"
    >
      {speeds.map((s) => (
        <button
          key={s}
          onClick={() => onSpeedChange(s)}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
            currentSpeed === s
              ? "bg-gradient-to-r from-[#FB923C] to-[#10B981] text-white"
              : "bg-white/20 text-white hover:bg-white/30"
          )}
        >
          {s}x
        </button>
      ))}
    </motion.div>
  );
}
