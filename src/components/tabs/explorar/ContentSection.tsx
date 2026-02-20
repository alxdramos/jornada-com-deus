import { ReactNode } from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";

interface ContentSectionProps {
  title: string;
  onViewAll?: () => void;
  children: ReactNode;
  isLoading?: boolean;
  emptyState?: ReactNode;
}

export function ContentSection({
  title,
  onViewAll,
  children,
  isLoading = false,
  emptyState,
}: ContentSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#1F2937]">{title}</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-[#FB923C] font-medium hover:text-[#EA580C] transition-colors"
          >
            VER TUDO &gt;
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-60 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {children}
        </motion.div>
      )}

      {emptyState && !isLoading && (
        <div className="text-center py-8 text-[#6B7280]">
          {emptyState}
        </div>
      )}
    </section>
  );
}
