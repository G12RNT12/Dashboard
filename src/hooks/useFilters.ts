import { useContext } from 'react';
import { FiltersContext } from '@/context/filters';

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters debe usarse dentro de <FiltersProvider>');
  return ctx;
}
