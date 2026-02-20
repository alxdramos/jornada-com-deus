import { BookOpen } from "lucide-react";
import { BibleBook } from "@/data/biblia";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface BibleBooksListProps {
  books: BibleBook[];
  onSelectBook: (book: string) => void;
}

export function BibleBooksList({ books, onSelectBook }: BibleBooksListProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      {books.map((book) => (
        <motion.button
          key={book.id}
          variants={staggerItem}
          onClick={() => onSelectBook(book.name)}
          className="p-4 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] hover:border-[#FB923C] transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#FB923C] group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-[#1F2937]">{book.name}</span>
            </div>
            <span className="text-xs font-medium text-[#9CA3AF] bg-[#F3F4F6] px-2 py-1 rounded">
              {book.abbrev}
            </span>
          </div>
          <p className="text-sm text-[#6B7280]">{book.chapters} capítulos</p>
        </motion.button>
      ))}
    </motion.div>
  );
}
