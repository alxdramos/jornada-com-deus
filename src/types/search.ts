export type SearchResultType = 'oracao' | 'meditacao' | 'estudo' | 'devocional';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}
