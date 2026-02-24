import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BibleChapterNavigationProps {
  book: string;
  chapter: number;
  viewState: "books" | "chapters" | "verses";
  onBack: () => void;
}

export function BibleChapterNavigation({
  book,
  chapter,
  viewState,
  onBack,
}: BibleChapterNavigationProps) {
  if (viewState === "books") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 text-sm text-[#6B7280]"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1 hover:text-[#1F2937] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>
      <span>•</span>
      <span className="font-medium">Bíblia NVI</span>
      {book && (
        <>
          <span>•</span>
          <span className="font-medium">{book}</span>
        </>
      )}
      {viewState === "verses" && (
        <>
          <span>•</span>
          <span className="font-medium">Capítulo {chapter}</span>
        </>
      )}
    </motion.div>
  );
}
