import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Range } from '@/types';
import { FiltersContext } from './filters';

const RANGE_KEY = 'dashboard:range';
const isRange = (v: unknown): v is Range => v === '7d' || v === '30d' || v === '12m';

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<Range>(() => {
    try {
      const stored = localStorage.getItem(RANGE_KEY);
      return isRange(stored) ? stored : '30d';
    } catch {
      return '30d';
    }
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(RANGE_KEY, range);
    } catch {
      // Sin almacenamiento disponible: el rango vive solo en memoria.
    }
  }, [range]);

  const value = useMemo(() => ({ range, setRange, search, setSearch }), [range, search]);
  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}
