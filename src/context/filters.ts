import { createContext } from 'react';
import type { Range } from '@/types';

export interface FiltersContextValue {
  /** Rango de fechas global (selector del header). */
  range: Range;
  setRange: (range: Range) => void;
  /** Texto del buscador global; filtra las tablas de la página actual. */
  search: string;
  setSearch: (value: string) => void;
}

export const FiltersContext = createContext<FiltersContextValue | null>(null);
