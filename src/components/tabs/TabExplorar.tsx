'use client';

import { UserHeader } from '@/components/layout/UserHeader';
import { SearchBar } from '@/components/molecules/SearchBar';
import { CategoryGrid } from './explorar/CategoryGrid';

export function TabExplorar() {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  return (
    <div className="min-h-screen bg-bg-primary p-6 pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <UserHeader title="Descobrir" />

        {/* Barra de busca */}
        <SearchBar
          placeholder="Orações, Categorias, Bíblia e Mais"
          onSearch={handleSearch}
          fullWidth
        />

        {/* Título da seção */}
        <h2 className="text-text-primary text-xl font-bold pt-4">Categorias Recomendadas</h2>

        {/* Grid de categorias */}
        <CategoryGrid onCategoryPress={(id) => console.log('Navigating to category:', id)} />
      </div>
    </div>
  );
}
