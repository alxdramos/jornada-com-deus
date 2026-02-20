import { useState, useEffect } from 'react';

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

export interface BibleBook {
  name: string;
  testament: 'AT' | 'NT';
  chapters: number;
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

// Lista completa de livros da Bíblia (AT + NT)
export const BIBLE_BOOKS: BibleBook[] = [
  // Antigo Testamento
  { name: "Gênesis", testament: "AT", chapters: 50 },
  { name: "Êxodo", testament: "AT", chapters: 40 },
  { name: "Levítico", testament: "AT", chapters: 27 },
  { name: "Números", testament: "AT", chapters: 36 },
  { name: "Deuteronômio", testament: "AT", chapters: 34 },
  { name: "Josué", testament: "AT", chapters: 24 },
  { name: "Juízes", testament: "AT", chapters: 21 },
  { name: "Rute", testament: "AT", chapters: 4 },
  { name: "1 Samuel", testament: "AT", chapters: 31 },
  { name: "2 Samuel", testament: "AT", chapters: 24 },
  { name: "1 Reis", testament: "AT", chapters: 22 },
  { name: "2 Reis", testament: "AT", chapters: 25 },
  { name: "1 Crônicas", testament: "AT", chapters: 29 },
  { name: "2 Crônicas", testament: "AT", chapters: 36 },
  { name: "Esdras", testament: "AT", chapters: 10 },
  { name: "Neemias", testament: "AT", chapters: 13 },
  { name: "Ester", testament: "AT", chapters: 10 },
  { name: "Jó", testament: "AT", chapters: 42 },
  { name: "Salmos", testament: "AT", chapters: 150 },
  { name: "Provérbios", testament: "AT", chapters: 31 },
  { name: "Eclesiastes", testament: "AT", chapters: 12 },
  { name: "Cantares", testament: "AT", chapters: 8 },
  { name: "Isaías", testament: "AT", chapters: 66 },
  { name: "Jeremias", testament: "AT", chapters: 52 },
  { name: "Lamentações", testament: "AT", chapters: 5 },
  { name: "Ezequiel", testament: "AT", chapters: 48 },
  { name: "Daniel", testament: "AT", chapters: 12 },
  { name: "Oséias", testament: "AT", chapters: 14 },
  { name: "Joel", testament: "AT", chapters: 3 },
  { name: "Amós", testament: "AT", chapters: 9 },
  { name: "Obadias", testament: "AT", chapters: 1 },
  { name: "Jonas", testament: "AT", chapters: 4 },
  { name: "Miquéias", testament: "AT", chapters: 7 },
  { name: "Naum", testament: "AT", chapters: 3 },
  { name: "Habacuque", testament: "AT", chapters: 3 },
  { name: "Sofonias", testament: "AT", chapters: 3 },
  { name: "Ageu", testament: "AT", chapters: 2 },
  { name: "Zacarias", testament: "AT", chapters: 14 },
  { name: "Malaquias", testament: "AT", chapters: 4 },

  // Novo Testamento
  { name: "Mateus", testament: "NT", chapters: 28 },
  { name: "Marcos", testament: "NT", chapters: 16 },
  { name: "Lucas", testament: "NT", chapters: 24 },
  { name: "João", testament: "NT", chapters: 21 },
  { name: "Atos", testament: "NT", chapters: 28 },
  { name: "Romanos", testament: "NT", chapters: 16 },
  { name: "1 Coríntios", testament: "NT", chapters: 16 },
  { name: "2 Coríntios", testament: "NT", chapters: 13 },
  { name: "Gálatas", testament: "NT", chapters: 6 },
  { name: "Efésios", testament: "NT", chapters: 6 },
  { name: "Filipenses", testament: "NT", chapters: 4 },
  { name: "Colossenses", testament: "NT", chapters: 4 },
  { name: "1 Tessalonicenses", testament: "NT", chapters: 5 },
  { name: "2 Tessalonicenses", testament: "NT", chapters: 3 },
  { name: "1 Timóteo", testament: "NT", chapters: 6 },
  { name: "2 Timóteo", testament: "NT", chapters: 4 },
  { name: "Tito", testament: "NT", chapters: 3 },
  { name: "Filemom", testament: "NT", chapters: 1 },
  { name: "Hebreus", testament: "NT", chapters: 13 },
  { name: "Tiago", testament: "NT", chapters: 5 },
  { name: "1 Pedro", testament: "NT", chapters: 5 },
  { name: "2 Pedro", testament: "NT", chapters: 3 },
  { name: "1 João", testament: "NT", chapters: 5 },
  { name: "2 João", testament: "NT", chapters: 1 },
  { name: "3 João", testament: "NT", chapters: 1 },
  { name: "Judas", testament: "NT", chapters: 1 },
  { name: "Apocalipse", testament: "NT", chapters: 22 }
];

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
  const fetchChapter = async (book: string, chapter: number) => {
    const endpoint = `/${book}+${chapter}`;
    return await fetchFromAPI(endpoint);
  };

  // Buscar um versículo específico (ex: "João 3:16")
  const fetchVerse = async (book: string, chapter: number, verse: number) => {
    const endpoint = `/${book}+${chapter}:${verse}`;
    return await fetchFromAPI(endpoint);
  };

  // Buscar múltiplos versículos (ex: "João 3:14-16")
  const fetchVerses = async (book: string, chapter: number, startVerse: number, endVerse?: number) => {
    const verseRange = endVerse ? `${startVerse}-${endVerse}` : startVerse.toString();
    const endpoint = `/${book}+${chapter}:${verseRange}`;
    return await fetchFromAPI(endpoint);
  };

  // Buscar por referência completa (ex: "João 3:16" ou "João 3")
  const fetchByReference = async (reference: string) => {
    try {
      // Tentar parse da referência (João 3:16 ou João 3)
      const parts = reference.trim().split(/[ :\-]+/);

      if (parts.length >= 2) {
        const book = parts[0];
        const chapter = parseInt(parts[1]);

        if (parts.length === 3) {
          // João 3:16
          const verse = parseInt(parts[2]);
          return await fetchVerse(book, chapter, verse);
        } else if (parts.length === 2) {
          // João 3
          return await fetchChapter(book, chapter);
        } else if (parts.length === 4 && parts[2] === '-') {
          // João 3:14-16
          const startVerse = parseInt(parts[1]);
          const endVerse = parseInt(parts[3]);
          return await fetchVerses(book, chapter, startVerse, endVerse);
        }
      }

      // Se não conseguir parsear, tentar como referência direta
      const endpoint = `/${reference}`;
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
  const getBooksByTestament = (testament: 'AT' | 'NT') => {
    return BIBLE_BOOKS.filter(book => book.testament === testament);
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