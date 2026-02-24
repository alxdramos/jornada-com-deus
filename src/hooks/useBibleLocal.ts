"use client";

/**
 * useBibleLocal — Bíblia offline usando dados locais (NVI)
 *
 * Fonte dos dados: https://github.com/thiagobodruk/bible
 * Licença: Creative Commons BY-NC
 * Tradução: Nova Versão Internacional (NVI)
 */

import { useState, useCallback } from "react";
import { BibleBook, ALL_BOOKS } from "@/data/biblia";

// Formato interno do JSON thiagobodruk
interface NviBook {
  abbrev: string;
  chapters: string[][];
}

// Formato retornado ao componente (compatível com useBible.ts)
export interface BibleVerse {
  book_id: string;
  book_name: string; // apiName (inglês) para compatibilidade com TabBiblia
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleApiResponse {
  reference: string;
  verses: BibleVerse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

// Cache em módulo (persiste durante a sessão)
let _bibleData: NviBook[] | null = null;
let _loadPromise: Promise<NviBook[]> | null = null;

async function loadBibleData(): Promise<NviBook[]> {
  if (_bibleData) return _bibleData;
  if (_loadPromise) return _loadPromise;

  _loadPromise = fetch("/data/bible-nvi.json")
    .then((res) => {
      if (!res.ok) throw new Error(`Erro ao carregar dados: ${res.status}`);
      return res.json();
    })
    .then((data: NviBook[]) => {
      _bibleData = data;
      _loadPromise = null;
      return data;
    });

  return _loadPromise;
}

// Mapear nome/id do livro para índice em ALL_BOOKS (e consequentemente no JSON)
function findBookIndex(nameOrId: string): number {
  const n = nameOrId.trim().toLowerCase();
  const idx = ALL_BOOKS.findIndex(
    (b) =>
      b.name.toLowerCase() === n ||
      b.id === n ||
      b.abbrev.toLowerCase() === n ||
      b.apiName === n
  );
  return idx;
}

// Construir o objeto BibleApiResponse a partir dos dados locais
function buildResponse(
  book: BibleBook,
  chapterNum: number,
  versesText: string[],
  startVerse = 1
): BibleApiResponse {
  const verses: BibleVerse[] = versesText.map((text, i) => ({
    book_id: book.id,
    book_name: book.apiName,
    chapter: chapterNum,
    verse: startVerse + i,
    text: text.replace(/^[""]|[""]$/g, "").trim(), // remove aspas externas se houver
  }));

  return {
    reference: `${book.name} ${chapterNum}`,
    verses,
    text: versesText.join(" "),
    translation_id: "nvi",
    translation_name: "Nova Versão Internacional",
    translation_note: "Fonte: github.com/thiagobodruk/bible (CC BY-NC)",
  };
}

export function useBibleLocal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BibleApiResponse | null>(null);

  // Buscar capítulo completo
  const fetchChapter = useCallback(
    async (bookNameOrId: string, chapter: number) => {
      setLoading(true);
      setError(null);

      try {
        const bibleData = await loadBibleData();
        const idx = findBookIndex(bookNameOrId);

        if (idx === -1) {
          throw new Error(`Livro não encontrado: "${bookNameOrId}"`);
        }

        const book = ALL_BOOKS[idx];
        const bookData = bibleData[idx];
        const chapterArr = bookData.chapters[chapter - 1];

        if (!chapterArr) {
          throw new Error(
            `Capítulo ${chapter} não encontrado em ${book.name}.`
          );
        }

        const response = buildResponse(book, chapter, chapterArr);
        setData(response);
        return response;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Erro ao carregar capítulo.";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Buscar versículo único
  const fetchVerse = useCallback(
    async (bookNameOrId: string, chapter: number, verse: number) => {
      setLoading(true);
      setError(null);

      try {
        const bibleData = await loadBibleData();
        const idx = findBookIndex(bookNameOrId);

        if (idx === -1) throw new Error(`Livro não encontrado: "${bookNameOrId}"`);

        const book = ALL_BOOKS[idx];
        const chapterArr = bibleData[idx].chapters[chapter - 1];

        if (!chapterArr) throw new Error(`Capítulo ${chapter} não encontrado.`);

        const verseText = chapterArr[verse - 1];
        if (!verseText) throw new Error(`Versículo ${verse} não encontrado.`);

        const response = buildResponse(book, chapter, [verseText], verse);
        setData(response);
        return response;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Erro ao carregar versículo.";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Buscar intervalo de versículos
  const fetchVerses = useCallback(
    async (
      bookNameOrId: string,
      chapter: number,
      startVerse: number,
      endVerse?: number
    ) => {
      setLoading(true);
      setError(null);

      try {
        const bibleData = await loadBibleData();
        const idx = findBookIndex(bookNameOrId);

        if (idx === -1) throw new Error(`Livro não encontrado: "${bookNameOrId}"`);

        const book = ALL_BOOKS[idx];
        const chapterArr = bibleData[idx].chapters[chapter - 1];

        if (!chapterArr) throw new Error(`Capítulo ${chapter} não encontrado.`);

        const end = endVerse ?? startVerse;
        const versesText = chapterArr.slice(startVerse - 1, end);
        const response = buildResponse(book, chapter, versesText, startVerse);
        setData(response);
        return response;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Erro ao carregar versículos.";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Buscar por referência: "João 3:16", "João 3", "João 3:14-16"
  const fetchByReference = useCallback(
    async (reference: string) => {
      const ref = reference.trim();
      const match = ref.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);

      if (!match) {
        setError(
          'Referência inválida. Use formato: "Livro Capítulo:Versículo" (ex: "João 3:16")'
        );
        return null;
      }

      const bookRaw = match[1].trim();
      const chapter = parseInt(match[2]);
      const startVerse = match[3] ? parseInt(match[3]) : undefined;
      const endVerse = match[4] ? parseInt(match[4]) : undefined;

      if (startVerse !== undefined && endVerse !== undefined) {
        return fetchVerses(bookRaw, chapter, startVerse, endVerse);
      } else if (startVerse !== undefined) {
        return fetchVerse(bookRaw, chapter, startVerse);
      } else {
        return fetchChapter(bookRaw, chapter);
      }
    },
    [fetchChapter, fetchVerse, fetchVerses]
  );

  // Busca por palavra/frase — funciona offline!
  const searchByTerm = useCallback(async (term: string) => {
    if (!term.trim()) {
      setError("Digite um termo para buscar.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const bibleData = await loadBibleData();
      const termLower = term.toLowerCase().trim();
      const results: BibleVerse[] = [];

      for (let bookIdx = 0; bookIdx < bibleData.length; bookIdx++) {
        const book = ALL_BOOKS[bookIdx];
        const bookData = bibleData[bookIdx];

        for (let chIdx = 0; chIdx < bookData.chapters.length; chIdx++) {
          const chapter = bookData.chapters[chIdx];
          for (let vIdx = 0; vIdx < chapter.length; vIdx++) {
            if (chapter[vIdx].toLowerCase().includes(termLower)) {
              results.push({
                book_id: book.id,
                book_name: book.apiName,
                chapter: chIdx + 1,
                verse: vIdx + 1,
                text: chapter[vIdx].replace(/^[""]|[""]$/g, "").trim(),
              });
              if (results.length >= 50) break; // Limitar a 50 resultados
            }
          }
          if (results.length >= 50) break;
        }
        if (results.length >= 50) break;
      }

      if (results.length === 0) {
        setError(`Nenhum versículo encontrado com "${term}".`);
        return null;
      }

      const response: BibleApiResponse = {
        reference: `Busca: "${term}"`,
        verses: results,
        text: "",
        translation_id: "nvi",
        translation_name: "Nova Versão Internacional",
        translation_note: `${results.length} resultado(s) encontrado(s)${results.length >= 50 ? " (primeiros 50)" : ""}`,
      };

      setData(response);
      return response;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro na busca.";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBooksByTestament = useCallback(
    (testament: "AT" | "NT"): BibleBook[] => {
      return ALL_BOOKS.filter((book) => book.testamento === testament);
    },
    []
  );

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    data,
    fetchChapter,
    fetchVerse,
    fetchVerses,
    fetchByReference,
    searchByTerm,
    getBooksByTestament,
    clearData,
    BIBLE_BOOKS: ALL_BOOKS,
  };
}
