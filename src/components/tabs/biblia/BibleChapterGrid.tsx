import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface BibleChapterGridProps {
  chapters: number;
  loading: boolean;
  onSelectChapter: (chapter: number) => void;
  accessedChapters?: Set<string>;
}

export function BibleChapterGrid({
  chapters,
  loading,
  onSelectChapter,
  accessedChapters = new Set(),
}: BibleChapterGridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
    >
      {Array.from({ length: chapters }, (_, i) => i + 1).map((chapter) => (
        <motion.button
          key={chapter}
          variants={staggerItem}
          onClick={() => onSelectChapter(chapter)}
          disabled={loading}
          className="p-3 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#FB923C]/10 hover:border-[#FB923C] transition-all text-sm font-medium text-[#1F2937] disabled:opacity-50"
        >
          {chapter}
        </motion.button>
      ))}
    </motion.div>
  );
}
