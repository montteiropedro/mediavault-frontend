import { createContext } from 'react';

type SearchContextValue = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export const SearchContext = createContext<SearchContextValue | null>(null);
