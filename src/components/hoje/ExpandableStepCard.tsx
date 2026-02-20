import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ExpandableStepCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  isCompleted: boolean;
  isExpanded: boolean;
  onToggleComplete: () => void;
  onToggleExpand: () => void;
  children?: ReactNode;
}

export function ExpandableStepCard({
  icon: Icon,
  title,
  subtitle,
  isCompleted,
  isExpanded,
  onToggleComplete,
  onToggleExpand,
  children
}: ExpandableStepCardProps) {
  return (
    <motion.div
      layout
      className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB]/80 overflow-hidden"
    >
      <div className="flex items-center gap-4 p-4">
        <button
          onClick={onToggleComplete}
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#E5E7EB] hover:border-[#10B981] transition-colors"
        >
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-[#10B981]" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-[#9CA3AF]" />
          )}
        </button>

        <button
          onClick={onToggleExpand}
          className="flex-1 min-w-0 text-left"
        >
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 shrink-0 text-[#1F2937]" />
            <span className="font-medium text-[#1F2937]">{title}</span>
          </div>
          <p className="text-xs text-[#6B7280] mt-0.5 truncate">
            {subtitle}
          </p>
        </button>

        <button
          onClick={onToggleExpand}
          className="shrink-0 p-1"
        >
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
            <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && children && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-1 border-t border-[#F3F4F6]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
