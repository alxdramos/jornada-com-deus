"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { BookOpen, ChevronDown, Bookmark, ArrowLeft, Search, Heart, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const LIVROS_AT = [
  "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué", "Juízes", "Rute",
  "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras", "Neemias",
  "Ester", "Jó", "Salmos", "Provérbios", "Eclesiastes", "Cantares", "Isaías", "Jeremias",
  "Lamentações", "Ezequiel", "Daniel", "Oséias", "Joel", "Amós", "Obadias", "Jonas",
  "Miquéias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias"
];

const LIVROS_NT = [
  "Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos", "1 Coríntios", "2 Coríntios",
  "Gálatas", "Efésios", "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses",
  "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus", "Tiago", "1 Pedro", "2 Pedro",
  "1 João", "2 João", "3 João", "Judas", "Apocalipse"
];

// Dados de exemplo para demonstração
const EXEMPLO_CAPITULOS = {
  "Gênesis": 50,
  "Êxodo": 40,
  "Salmos": 150,
  "Provérbios": 31,
  "Mateus": 28,
  "Marcos": 16,
  "Lucas": 24,
  "João": 21,
  "Atos": 28,
  "Romanos": 16
};

const EXEMPLO_VERSICULOS = {
  "Gênesis 1": [
    "No princípio, criou Deus os céus e a terra.",
    "E a terra era sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava sobre a face das águas.",
    "E disse Deus: Haja luz; e houve luz.",
    "E viu Deus que a luz era boa; e fez separação entre a luz e as trevas."
  ],
  "Salmos 23": [
    "O Senhor é o meu pastor; nada me faltará.",
    "Ele me faz repousar em pastos verdejantes. Leva-me para junto das águas de descanso;",
    "Refrigera a minha alma. Guia-me pelas veredas da justiça, por amor do seu nome.",
    "Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam."
  ],
  "Mateus 5": [
    "Vendo ele as multidões, subiu ao monte; e, assentando-se, aproximaram-se os seus discípulos;",
    "E, abrindo a sua boca, os ensinava, dizendo:",
    "Bem-aventurados os pobres de espírito, porque deles é o reino dos céus;",
    "Bem-aventurados os que choram, porque serão consolados;",
    "Bem-aventurados os mansos, porque herdarão a terra;"
  ]
};

type ViewState = "books" | "chapters" | "verses";

export function TabBiblia() {
  const user = useUserStore((s) => s.user);
  const [testamento, setTestamento] = useState<"AT" | "NT">("AT");
  const [viewState, setViewState] = useState<ViewState>("books");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showSearch, setShowSearch] = useState(false);

  const livros = testamento === "AT" ? LIVROS_AT : LIVROS_NT;
  const filteredLivros = livros.filter(livro =>
    livro.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Carregar favoritos do localStorage
    const saved = localStorage.getItem('bible-favorites');
    if (saved) {
      try {
        setFavorites(new Set(JSON.parse(saved)));
      } catch (error) {
        console.error('Erro ao carregar favoritos da Bíblia:', error);
      }
    }
  }, []);

  const toggleFavorite = (verseRef: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(verseRef)) {
        next.delete(verseRef);
      } else {
        next.add(verseRef);
      }
      localStorage.setItem('bible-favorites', JSON.stringify([...next]));
      return next;
    });
  };

  const selectBook = (book: string) => {
    setSelectedBook(book);
    setViewState("chapters");
  };

  const selectChapter = (chapter: number) => {
    setSelectedChapter(chapter);
    setViewState("verses");
  };

  const goBack = () => {
    if (viewState === "verses") {
      setViewState("chapters");
    } else if (viewState === "chapters") {
      setViewState("books");
      setSelectedBook("");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header: avatar + Bíblia NVI + ícone grupo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FB923C] flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1F2937]">Bíblia</h1>
              <button className="flex items-center gap-1 text-[#1F2937] text-sm">
                NVI <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FB923C]/20 flex items-center justify-center">
            <span className="text-lg">👥</span>
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
            <span>Bíblia NVI</span>
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

        {/* Busca + ações */}
        {viewState === "books" && (
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Pesquisar na Bíblia"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] placeholder:text-[#9CA3AF] text-sm pr-10"
              />
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Search className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
            <button className="p-3 rounded-xl bg-white border border-[#E5E7EB]">
              <Bookmark className="w-5 h-5 text-[#6B7280]" />
            </button>
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
              {filteredLivros.map((livro) => (
                <button
                  key={livro}
                  onClick={() => selectBook(livro)}
                  className="w-full bg-white rounded-2xl px-4 py-4 shadow-sm text-[#1F2937] font-medium text-left hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>{livro}</span>
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
                {Array.from({ length: EXEMPLO_CAPITULOS[selectedBook as keyof typeof EXEMPLO_CAPITULOS] || 10 }, (_, i) => i + 1).map((chapter) => (
                  <button
                    key={chapter}
                    onClick={() => selectChapter(chapter)}
                    className="aspect-square bg-white rounded-xl shadow-sm flex items-center justify-center text-[#1F2937] font-medium hover:bg-[#F9FAFB] transition-colors"
                  >
                    {chapter}
                  </button>
                ))}
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
                <h2 className="text-lg font-semibold text-[#1F2937]">
                  {selectedBook} {selectedChapter}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(`${selectedBook} ${selectedChapter}:1`)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      favorites.has(`${selectedBook} ${selectedChapter}:1`)
                        ? "bg-red-50 text-red-500"
                        : "bg-white text-[#6B7280] hover:text-red-500"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", favorites.has(`${selectedBook} ${selectedChapter}:1`) && "fill-current")} />
                  </button>
                  <button className="p-2 rounded-lg bg-white text-[#6B7280] hover:text-[#1F2937] transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                {(EXEMPLO_VERSICULOS[`${selectedBook} ${selectedChapter}` as keyof typeof EXEMPLO_VERSICULOS] || [
                  "Este capítulo contém a Palavra de Deus.",
                  "Leia com atenção e medite em cada versículo.",
                  "Deus fala conosco através da Sua Palavra.",
                  "Permita que o Espírito Santo ilumine seu entendimento."
                ]).map((versiculo, index) => (
                  <div key={index} className="flex gap-4 group">
                    <span className="text-[#FB923C] font-medium text-sm leading-6 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-[#1F2937] leading-relaxed flex-1">
                      {versiculo}
                    </p>
                    <button
                      onClick={() => toggleFavorite(`${selectedBook} ${selectedChapter}:${index + 1}`)}
                      className={cn(
                        "opacity-0 group-hover:opacity-100 p-1 rounded transition-all",
                        favorites.has(`${selectedBook} ${selectedChapter}:${index + 1}`)
                          ? "text-red-500"
                          : "text-[#6B7280] hover:text-red-500"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", favorites.has(`${selectedBook} ${selectedChapter}:${index + 1}`) && "fill-current")} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Navegação entre capítulos */}
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => selectChapter(Math.max(1, selectedChapter - 1))}
                  disabled={selectedChapter <= 1}
                  className="px-4 py-2 bg-white rounded-lg text-[#1F2937] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Capítulo anterior
                </button>
                <span className="text-[#6B7280] text-sm">
                  {selectedChapter} de {EXEMPLO_CAPITULOS[selectedBook as keyof typeof EXEMPLO_CAPITULOS] || 10}
                </span>
                <button
                  onClick={() => selectChapter(Math.min(EXEMPLO_CAPITULOS[selectedBook as keyof typeof EXEMPLO_CAPITULOS] || 10, selectedChapter + 1))}
                  disabled={selectedChapter >= (EXEMPLO_CAPITULOS[selectedBook as keyof typeof EXEMPLO_CAPITULOS] || 10)}
                  className="px-4 py-2 bg-white rounded-lg text-[#1F2937] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo capítulo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
