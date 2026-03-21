"use client";

import { motion } from "framer-motion";
import { SearchX, Filter, BookOpen } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface EmptySearchResultsProps {
  query: string;
}

export function EmptySearchResults({ query }: EmptySearchResultsProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
        <SearchX className="w-8 h-8" style={{ color: "#006947" }} />
      </div>
      <h3 className="font-semibold text-[#1F2937] mb-1">
        Nenhum resultado para &ldquo;{query}&rdquo;
      </h3>
      <p className="text-sm text-[#6B7280] max-w-xs">
        Tente buscar com outras palavras ou remova os filtros.
      </p>
    </motion.div>
  );
}

interface EmptyFilteredContentProps {
  category: string;
}

export function EmptyFilteredContent({ category }: EmptyFilteredContentProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
        <Filter className="w-8 h-8 text-[#D97706]" />
      </div>
      <h3 className="font-semibold text-[#1F2937] mb-1">
        Nada em &ldquo;{category}&rdquo;
      </h3>
      <p className="text-sm text-[#6B7280] max-w-xs">
        Não há conteúdo nesta categoria ainda. Experimente outro filtro.
      </p>
    </motion.div>
  );
}

interface EmptyLibraryStateProps {
  message?: string;
}

export function EmptyLibraryState({ message }: EmptyLibraryStateProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8" style={{ color: "#006947" }} />
      </div>
      <h3 className="font-semibold text-[#1F2937] mb-1">Ainda vazio por aqui</h3>
      <p className="text-sm text-[#6B7280] max-w-xs">
        {message ?? "O conteúdo está sendo preparado. Volte em breve!"}
      </p>
    </motion.div>
  );
}
