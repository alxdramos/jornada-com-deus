'use client';

import { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import './SearchBar.css';

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  fullWidth?: boolean;
}

export const SearchBar = ({
  placeholder = 'Buscar...',
  onSearch,
  onClear,
  fullWidth = false,
}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setQuery('');
    onClear?.();
  };

  const containerClass = fullWidth ? 'search-bar--full-width' : '';

  return (
    <div className={`search-bar ${containerClass}`}>
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        leftIcon="🔍"
        rightIcon={
          query && (
            <button
              onClick={handleClear}
              type="button"
              className="search-bar-clear"
              aria-label="Limpar busca"
            >
              ✕
            </button>
          )
        }
      />
    </div>
  );
};
