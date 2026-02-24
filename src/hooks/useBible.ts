import { useState, useEffect } from 'react';
import { BibleBook, LIVROS_AT, LIVROS_NT, ALL_BOOKS } from '@/data/biblia';

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

interface BibleApiResponse {
  reference: string;
  verses: Array<{
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

const BIBLE_API_BASE = 'https://bible-api.com';

// Re-export books for backward compatibility
export const BIBLE_BOOKS = ALL_BOOKS;

// Converte nome/id de livro em português para o nome aceito pela API (inglês)
function resolveApiName(bookNameOrId: string): string {
  const normalized = bookNameOrId.trim().toLowerCase();
  // Buscar por nome exato, abreviação ou id
  const found = ALL_BOOKS.find(
    (b) =>
      b.name.toLowerCase() === normalized ||
      b.id === normalized ||
      b.abbrev.toLowerCase() === normalized ||
      b.apiName === normalized
  );
  if (found) return found.apiName;
  // Busca parcial por nome (ex: "jo" pode ser "João" ou "Jó")
  const partial = ALL_BOOKS.find(
    (b) =>
      b.name.toLowerCase().startsWith(normalized) ||
      b.id.startsWith(normalized)
  );
  return partial?.apiName ?? bookNameOrId;
}

// Constrói o segmento de livro para a URL, substituindo espaços por +
function buildBookSegment(apiName: string): string {
  return apiName.replace(/ /g, '+');
}

export function useBible() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [cache, setCache] = useState<Map<string, BibleApiResponse>>(new Map());

  // Cache simples em sessionStorage
  useEffect(() => {
    const savedCache = sessionStorage.getItem('bible-cache');
    if (savedCache) {
      try {
        const parsed = JSON.parse(savedCache);
        setCache(new Map(Object.entries(parsed)));
      } catch (error) {
        console.warn('Erro ao carregar cache da Bíblia:', error);
      }
    }
  }, []);

  // Salvar cache no sessionStorage
  const saveCache = (newCache: Map<string, BibleApiResponse>) => {
    try {
      const cacheObject = Object.fromEntries(newCache);
      sessionStorage.setItem('bible-cache', JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Erro ao salvar cache da Bíblia:', error);
    }
  };

  // Função auxiliar para fazer requests à API com cache
  const fetchFromAPI = async (endpoint: string, useCache = true) => {
    // Verificar cache primeiro
    if (useCache && cache.has(endpoint)) {
      const cachedData = cache.get(endpoint)!;
      setData(cachedData);
      return cachedData;
    }

    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`${BIBLE_API_BASE}${endpoint}?translation=acf`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Referência não encontrada. Verifique se está correta.');
        } else if (response.status >= 500) {
          throw new Error('Servidor temporariamente indisponível. Tente novamente em alguns minutos.');
        } else {
          throw new Error(`Erro na API (${response.status}). Tente novamente.`);
        }
      }

      const data: BibleApiResponse = await response.json();

      // Verificar se os dados são válidos
      if (!data.verses || data.verses.length === 0) {
        throw new Error('Texto não encontrado para esta referência.');
      }

      setData(data);

      // Salvar no cache
      if (useCache) {
        const newCache = new Map(cache);
        newCache.set(endpoint, data);
        // Limitar cache a 20 entradas para não crescer demais
        if (newCache.size > 20) {
          const firstKey = newCache.keys().next().value;
          if (firstKey) {
            newCache.delete(firstKey);
          }
        }
        setCache(newCache);
        saveCache(newCache);
      }

      return data;
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Tempo limite esgotado. Verifique sua conexão e tente novamente.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Erro desconhecido ao carregar dados.');
      }
      console.error('Erro na API da Bíblia:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Buscar um capítulo completo (ex: "João 3")
  // book pode ser nome em português, id ou apiName em inglês
  const fetchChapter = async (book: string, chapter: number) => {
    const apiName = resolveApiName(book);
    const endpoint = `/${buildBookSegment(apiName)}+${chapter}`;
    return await fetchFromAPI(endpoint);
  };

  // Buscar um versículo específico (ex: "João 3:16")
  const fetchVerse = async (book: string, chapter: number, verse: number) => {
    const apiName = resolveApiName(book);
    const endpoint = `/${buildBookSegment(apiName)}+${chapter}:${verse}`;
    return await fetchFromAPI(endpoint);
  };

  // Buscar múltiplos versículos (ex: "João 3:14-16")
  const fetchVerses = async (book: string, chapter: number, startVerse: number, endVerse?: number) => {
    const apiName = resolveApiName(book);
    const verseRange = endVerse ? `${startVerse}-${endVerse}` : startVerse.toString();
    const endpoint = `/${buildBookSegment(apiName)}+${chapter}:${verseRange}`;
    return await fetchFromAPI(endpoint);
  };

  // Buscar por referência completa (ex: "João 3:16" ou "João 3")
  // Suporta: "João 3", "João 3:16", "João 3:14-16", "1 Coríntios 13:4"
  const fetchByReference = async (reference: string) => {
    try {
      const ref = reference.trim();

      // Separar o nome do livro do restante (capítulo:versículo)
      // Padrão: "Nome Livro 3:16" ou "1 Nome 3:16"
      const match = ref.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);

      if (match) {
        const bookRaw = match[1].trim();
        const chapter = parseInt(match[2]);
        const startVerse = match[3] ? parseInt(match[3]) : undefined;
        const endVerse = match[4] ? parseInt(match[4]) : undefined;

        if (startVerse !== undefined && endVerse !== undefined) {
          return await fetchVerses(bookRaw, chapter, startVerse, endVerse);
        } else if (startVerse !== undefined) {
          return await fetchVerse(bookRaw, chapter, startVerse);
        } else {
          return await fetchChapter(bookRaw, chapter);
        }
      }

      // Fallback: tentar como referência direta
      const endpoint = `/${ref.replace(/ /g, '+')}`;
      return await fetchFromAPI(endpoint);

    } catch (err) {
      setError('Referência inválida. Use formato: "Livro Capítulo:Versículo" (ex: "João 3:16")');
      return null;
    }
  };

  // Buscar por termo/palavra (mais complexo, pode retornar múltiplos resultados)
  const searchByTerm = async (term: string) => {
    try {
      // Como a API bible-api.com não tem busca por termo diretamente,
      // vamos tentar uma abordagem alternativa ou informar que não é suportado
      setError('Busca por palavra/frase não suportada pela API atual. Use referências específicas como "João 3:16".');
      return null;
    } catch (err) {
      setError('Erro na busca por termo.');
      return null;
    }
  };

  // Buscar livros por testamento
  const getBooksByTestament = (testament: 'AT' | 'NT'): BibleBook[] => {
    return BIBLE_BOOKS.filter(book => book.testamento === testament);
  };

  // Limpar dados
  const clearData = () => {
    setData(null);
    setError(null);
  };

  return {
    // Estados
    loading,
    error,
    data,

    // Funções de busca
    fetchChapter,
    fetchVerse,
    fetchVerses,
    fetchByReference,
    searchByTerm,

    // Utilitários
    getBooksByTestament,
    clearData,

    // Constantes
    BIBLE_BOOKS
  };
}