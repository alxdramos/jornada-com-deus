"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";
import { UserHeader } from "@/components/layout/UserHeader";
import { Info, BookOpen, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useBible } from "@/hooks/useBible";

// Sub-componentes
import { BibleTestamentToggle } from "./biblia/BibleTestamentToggle";
import { BibleSearchBar } from "./biblia/BibleSearchBar";
import { BibleBooksList } from "./biblia/BibleBooksList";
import { BibleChapterGrid } from "./biblia/BibleChapterGrid";
import { BibleChapterNavigation } from "./biblia/BibleChapterNavigation";

// Dados
import { Testamento, ViewState, LIVROS_AT, LIVROS_NT, ALL_BOOKS } from "@/data/biblia";

export function TabBiblia() {
  const user = useUserStore((s) => s.user);
  const {
    getBooksByTestament,
    BIBLE_BOOKS,
    fetchChapter,
    fetchByReference,
    loading,
    error,
    data,
    clearData,
  } = useBible();

  // Estados
  const [testamento, setTestamento] = useState<Testamento>("AT");
  const [viewState, setViewState] = useState<ViewState>("books");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [accessedChapters, setAccessedChapters] = useState<Set<string>>(new Set());

  // Livros por testamento
  const livros = getBooksByTestament(testamento);

  // Handlers
  const selectBook = (book: string) => {
    setSelectedBook(book);
    setViewState("chapters");
    clearData();
  };

  const selectChapter = async (chapter: number) => {
    if (loading) return;

    setSelectedChapter(chapter);
    setViewState("verses");

    const chapterKey = `${selectedBook}-${chapter}`;
    setAccessedChapters((prev) => new Set([...prev, chapterKey]));

    await new Promise((resolve) => setTimeout(resolve, 150));
    await fetchChapter(selectedBook, chapter);
  };

  const goBack = () => {
    if (viewState === "verses") {
      setViewState("chapters");
      clearData();
    } else if (viewState === "chapters") {
      setViewState("books");
      setSelectedBook("");
      clearData();
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    const result = await fetchByReference(query.trim());

    if (result?.verses && result.verses.length > 0) {
      const firstVerse = result.verses[0];
      const bookData = BIBLE_BOOKS.find(
        (book) =>
          book.name.toLowerCase().includes(firstVerse.book_name.toLowerCase()) ||
          firstVerse.book_name.toLowerCase().includes(book.name.toLowerCase())
      );

      if (bookData) {
        setSelectedBook(bookData.name);
        setSelectedChapter(firstVerse.chapter);
        setViewState("verses");
        setSearchQuery("");
      }
    } else {
      setViewState("books");
    }
  };

  // Reset ao mudar testamento
  useEffect(() => {
    setViewState("books");
    setSelectedBook("");
    setSelectedChapter(0);
    clearData();
  }, [testamento]);

  const bookData = BIBLE_BOOKS.find((book) => book.name === selectedBook);
  const totalChapters = bookData?.chapters || 0;

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <UserHeader
          title="Bíblia"
          rightElement={
            <>
              <Link
                href="/biblia/sobre"
                className="w-10 h-10 rounded-full bg-[#FB923C]/20 flex items-center justify-center hover:bg-[#FB923C]/30 transition-colors"
                title="Sobre a Bíblia"
              >
                <Info className="w-5 h-5 text-[#FB923C]" />
              </Link>
              <div className="w-10 h-10 rounded-full bg-[#FB923C]/20 flex items-center justify-center">
                <span className="text-lg">👥</span>
              </div>
            </>
          }
        />

        {/* Navigation */}
        <BibleChapterNavigation
          book={selectedBook}
          chapter={selectedChapter}
          viewState={viewState}
          onBack={goBack}
        />

        <AnimatePresence mode="wait">
          {/* Livros */}
          {viewState === "books" && (
            <motion.div
              key="books"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <BibleTestamentToggle
                value={testamento}
                onChange={setTestamento}
              />

              <BibleSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                loading={loading}
              />

              <BibleBooksList books={livros} onSelectBook={selectBook} />
            </motion.div>
          )}

          {/* Capítulos */}
          {viewState === "chapters" && (
            <motion.div
              key="chapters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-[#1F2937]">{selectedBook}</h2>
              <BibleChapterGrid
                chapters={totalChapters}
                loading={loading}
                onSelectChapter={selectChapter}
                accessedChapters={accessedChapters}
              />
            </motion.div>
          )}

          {/* Versículos */}
          {viewState === "verses" && (
            <motion.div
              key="verses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#FB923C] animate-spin" />
                </div>
              ) : data?.verses ? (
                <div className="space-y-4">
                  {data.verses.map((verse: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#FB923C] transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-semibold text-[#FB923C]">
                          {verse.verse}
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all hover:bg-gray-100">
                          <svg
                            className="w-4 h-4 text-[#6B7280]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-[#374151] leading-relaxed">{verse.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[#6B7280]">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-[#D1D5DB]" />
                  <p>Pronto para ler</p>
                </div>
              )}

              {/* Navegação de capítulos */}
              {data?.verses && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#FB923C] to-[#10B981] h-full transition-all duration-300"
                      style={{ width: `${(selectedChapter / totalChapters) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <button
                      onClick={() => selectChapter(Math.max(1, selectedChapter - 1))}
                      disabled={selectedChapter <= 1 || loading}
                      className="flex items-center gap-1 px-4 py-2 bg-white rounded-lg border disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" /> Anterior
                    </button>

                    <div className="text-center text-sm">
                      <p className="font-medium">{selectedChapter} de {totalChapters}</p>
                      <p className="text-xs text-[#6B7280]">{accessedChapters.size} acessados</p>
                    </div>

                    <button
                      onClick={() => selectChapter(Math.min(totalChapters, selectedChapter + 1))}
                      disabled={selectedChapter >= totalChapters || loading}
                      className="flex items-center gap-1 px-4 py-2 bg-white rounded-lg border disabled:opacity-50"
                    >
                      Próximo <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
