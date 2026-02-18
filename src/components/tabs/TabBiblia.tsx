"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";
import { BookOpen, ArrowLeft, Loader2, Share2, Search, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useBible } from "@/hooks/useBible";
import { BibleApiError } from "@/components/OfflineIndicator";

type ViewState = "books" | "chapters" | "verses";

export function TabBiblia() {
  const user = useUserStore((s) => s.user);
  const { getBooksByTestament, BIBLE_BOOKS, fetchChapter, fetchByReference, loading, error, data, clearData } = useBible();

  const [testamento, setTestamento] = useState<"AT" | "NT">("AT");
  const [viewState, setViewState] = useState<ViewState>("books");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [accessedChapters, setAccessedChapters] = useState<Set<string>>(new Set());

  const livros = getBooksByTestament(testamento);

  const selectBook = (book: string) => {
    setSelectedBook(book);
    setViewState("chapters");
    clearData(); // Limpar dados anteriores
  };

  const selectChapter = async (chapter: number) => {
    // Prevenir múltiplas requisições simultâneas
    if (loading) return;

    setSelectedChapter(chapter);
    setViewState("verses");

    // Rastrear capítulo acessado
    const chapterKey = `${selectedBook}-${chapter}`;
    setAccessedChapters(prev => new Set([...prev, chapterKey]));

    // Pequeno delay para melhorar UX (feedback visual)
    await new Promise(resolve => setTimeout(resolve, 150));

    // Buscar dados do capítulo via API
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

  // Quando mudar de testamento, voltar para lista de livros
  useEffect(() => {
    setViewState("books");
    setSelectedBook("");
    setSelectedChapter(0);
    clearData();
  }, [testamento]);

  // Função de busca por referência
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setShowSearch(false); // Esconder exemplos durante busca

    const result = await fetchByReference(query.trim());

    if (result?.verses && result.verses.length > 0) {
      // Se encontrou versículos, navegar para o capítulo
      const firstVerse = result.verses[0];
      const bookData = BIBLE_BOOKS.find(book =>
        book.name.toLowerCase().includes(firstVerse.book_name.toLowerCase()) ||
        firstVerse.book_name.toLowerCase().includes(book.name.toLowerCase())
      );

      if (bookData) {
        setSelectedBook(bookData.name);
        setSelectedChapter(firstVerse.chapter);
        setViewState("verses");
        setSearchQuery(""); // Limpar busca após sucesso
      }
    } else {
      // Se não encontrou, manter na tela de livros com erro
      setViewState("books");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header: avatar + Bíblia + ícone grupo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FB923C] flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <h1 className="text-xl font-bold text-[#1F2937]">Bíblia</h1>
          </div>
          <div className="flex items-center gap-2">
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
          </div>
        </div>

        {/* Navigation Breadcrumb */}
        {viewState !== "books" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-[#6B7280]"
          >
            <button onClick={goBack} className="flex items-center gap-1 hover:text-[#1F2937]">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <span>•</span>
            <span>Bíblia ACF</span>
            {selectedBook && (
              <>
                <span>•</span>
                <span>{selectedBook}</span>
              </>
            )}
            {viewState === "verses" && (
              <>
                <span>•</span>
                <span>Capítulo {selectedChapter}</span>
              </>
            )}
          </motion.div>
        )}

        {/* Segmented: ANTIGO / NOVO TESTAMENTO */}
        {viewState === "books" && (
          <div className="flex rounded-xl overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => setTestamento("AT")}
              className={cn(
                "flex-1 py-3 text-sm font-medium",
                testamento === "AT" ? "bg-[#1F2937] text-white" : "bg-white text-[#1F2937]"
              )}
            >
              ANTIGO TESTAMENTO
            </button>
            <button
              onClick={() => setTestamento("NT")}
              className={cn(
                "flex-1 py-3 text-sm font-medium",
                testamento === "NT" ? "bg-[#1F2937] text-white" : "bg-white text-[#1F2937]"
              )}
            >
              NOVO TESTAMENTO
            </button>
          </div>
        )}

        {/* Campo de busca por referência */}
        {viewState === "books" && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder='Buscar referência (ex: "João 3:16")'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleSearch(searchQuery);
                    }
                  }}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937] placeholder:text-[#9CA3AF] text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-[#FB923C]/20 focus:border-[#FB923C] disabled:opacity-50"
                />
                {searchQuery && !loading && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#E5E7EB] rounded"
                  >
                    <X className="w-4 h-4 text-[#6B7280]" />
                  </button>
                )}
                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#FB923C]" />
                  </div>
                )}
              </div>
              <button
                onClick={() => handleSearch(searchQuery)}
                disabled={!searchQuery.trim() || loading}
                className="px-6 py-3 bg-[#FB923C] text-white rounded-xl hover:bg-[#EA580C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </div>

            {/* Exemplos de busca */}
            {!loading && (
              <div className="mt-3 flex gap-2 flex-wrap">
                <span className="text-xs text-[#6B7280]">Exemplos:</span>
                {["João 3:16", "Gn 1:1", "Sl 23", "Mt 5:1-12"].map((example) => (
                  <button
                    key={example}
                    onClick={() => {
                      setSearchQuery(example);
                      handleSearch(example);
                    }}
                    disabled={loading}
                    className="text-xs px-2 py-1 bg-[#F1F5F9] text-[#64748B] rounded hover:bg-[#E2E8F0] transition-colors disabled:opacity-50"
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}

            {/* Status da busca */}
            {error && viewState === "books" && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Conteúdo baseado no estado */}
        <AnimatePresence mode="wait">
          {viewState === "books" && (
            <motion.div
              key="books"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2"
            >
              {livros.map((livro) => (
                <button
                  key={livro.name}
                  onClick={() => selectBook(livro.name)}
                  className="w-full bg-white rounded-2xl px-4 py-4 shadow-sm text-[#1F2937] font-medium text-left hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>{livro.name}</span>
                    <BookOpen className="w-5 h-5 text-[#6B7280]" />
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {viewState === "chapters" && selectedBook && (
            <motion.div
              key="chapters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-lg font-semibold text-[#1F2937] mb-4">
                Capítulos de {selectedBook}
              </h2>
              <div className="grid grid-cols-5 gap-3">
                {(() => {
                  const bookData = BIBLE_BOOKS.find(book => book.name === selectedBook);
                  const totalChapters = bookData?.chapters || 0;

                  return Array.from({ length: totalChapters }, (_, i) => i + 1).map((chapter) => (
                    <motion.button
                      key={chapter}
                      onClick={() => selectChapter(chapter)}
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.05 } : {}}
                      whileTap={!loading ? { scale: 0.95 } : {}}
                      className={cn(
                        "aspect-square bg-white rounded-xl shadow-sm flex items-center justify-center text-[#1F2937] font-medium transition-all hover:shadow-md relative",
                        chapter === selectedChapter
                          ? "bg-[#FB923C] text-white shadow-md ring-2 ring-[#FB923C]/30"
                          : "hover:bg-[#F9FAFB]",
                        loading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {chapter}
                      {loading && chapter === selectedChapter && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 flex items-center justify-center bg-[#FB923C]/80 rounded-xl"
                        >
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ));
                })()}
              </div>
            </motion.div>
          )}

          {viewState === "verses" && selectedBook && (
            <motion.div
              key="verses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#1F2937]">
                    {selectedBook} {selectedChapter}
                  </h2>
                  {data?.verses && (
                    <p className="text-xs text-[#6B7280] mt-1">
                      {data.verses.length} versículos • Almeida Corrigida Fiel
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {loading && (
                    <div className="flex items-center gap-2 text-[#6B7280]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Carregando...</span>
                    </div>
                  )}
                  {data?.verses && !loading && (
                    <button
                      onClick={() => {
                        const text = `${selectedBook} ${selectedChapter}\n\n${data.verses.map((v: any) => `${v.verse}. ${v.text}`).join('\n\n')}\n\n— Almeida Corrigida Fiel`;
                        navigator.share?.({
                          title: `${selectedBook} ${selectedChapter}`,
                          text: text,
                        }).catch(() => {
                          navigator.clipboard.writeText(text);
                          // TODO: Add toast notification
                        });
                      }}
                      className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                      title="Compartilhar capítulo"
                    >
                      <Share2 className="w-5 h-5 text-[#6B7280]" />
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <BibleApiError
                  error={error}
                  onRetry={() => fetchChapter(selectedBook, selectedChapter)}
                />
              )}

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-6 space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
                          <span className="text-xs text-gray-400">{i + 1}</span>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : data?.verses ? (
                  <div className="p-6 space-y-6">
                    {data.verses.map((verse: any, index: number) => (
                      <div
                        key={verse.verse}
                        className="flex gap-4 group hover:bg-[#F9FAFB] -mx-2 px-2 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-7 h-7 bg-[#FB923C] rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm">
                            {verse.verse}
                          </div>
                        </div>
                        <div className="flex-1 leading-relaxed text-[#1F2937]">
                          <p className="text-base">
                            {verse.text}
                          </p>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all hover:bg-white">
                          <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : !error ? (
                  <div className="p-6 text-center text-[#6B7280] py-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-[#D1D5DB]" />
                    <p className="text-base mb-2">Pronto para ler</p>
                    <p className="text-sm">Selecione um capítulo para ver os versículos</p>
                  </div>
                ) : null}
              </div>

              {/* Navegação entre capítulos */}
              {(() => {
                const bookData = BIBLE_BOOKS.find(book => book.name === selectedBook);
                const totalChapters = bookData?.chapters || 0;
                const progressPercent = (selectedChapter / totalChapters) * 100;

                return (
                  <div className="space-y-4">
                    {/* Barra de progresso visual */}
                    <div className="bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#FB923C] to-[#10B981] h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Controles de navegação */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => selectChapter(Math.max(1, selectedChapter - 1))}
                        disabled={selectedChapter <= 1 || loading}
                        className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm text-[#1F2937] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F9FAFB] transition-all hover:shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Anterior</span>
                      </button>

                      <div className="text-center">
                        <p className="text-sm font-medium text-[#1F2937]">
                          {selectedChapter} de {totalChapters}
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          {selectedBook}
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-1">
                          {accessedChapters.size} capítulos acessados
                        </p>
                      </div>

                      <button
                        onClick={() => selectChapter(Math.min(totalChapters, selectedChapter + 1))}
                        disabled={selectedChapter >= totalChapters || loading}
                        className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm text-[#1F2937] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F9FAFB] transition-all hover:shadow-md"
                      >
                        <span className="text-sm font-medium">Próximo</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Jump to chapter */}
                    <div className="bg-[#F9FAFB] rounded-xl p-4">
                      <p className="text-sm font-medium text-[#1F2937] mb-2">Ir para capítulo</p>
                      <div className="flex gap-2 flex-wrap">
                        {Array.from({ length: Math.min(totalChapters, 10) }, (_, i) => i + 1).map((chapter) => (
                          <button
                            key={chapter}
                            onClick={() => selectChapter(chapter)}
                            disabled={loading}
                            className={cn(
                              "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                              chapter === selectedChapter
                                ? "bg-[#FB923C] text-white shadow-sm"
                                : "bg-white text-[#1F2937] hover:bg-[#F1F5F9]"
                            )}
                          >
                            {chapter}
                          </button>
                        ))}
                        {totalChapters > 10 && (
                          <button className="px-3 py-1 bg-white rounded-lg text-sm text-[#6B7280] hover:bg-[#F1F5F9]">
                            +{totalChapters - 10} mais
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
