/**
 * Hooks de datos (React Query). Los componentes nunca llaman a los servicios
 * directamente: usan estos hooks, que añaden caché, reintentos y estados.
 * La clave de cada query incluye el rango, así cada rango se cachea por separado.
 */
import { useQuery } from '@tanstack/react-query';
import {
  getChannels,
  getKpis,
  getProducts,
  getRevenue,
  getSalesByCategory,
  getTransactions,
  getUsers,
} from '@/services';
import type { Range } from '@/types';
import { useFilters } from './useFilters';

export const queryKeys = {
  kpis: (range: Range) => ['kpis', range] as const,
  revenue: (range: Range) => ['revenue', range] as const,
  categories: (range: Range) => ['sales-by-category', range] as const,
  channels: (range: Range) => ['channels', range] as const,
  transactions: (range: Range) => ['transactions', range] as const,
  users: (range: Range) => ['users', range] as const,
  products: (range: Range) => ['products', range] as const,
};

export function useKpis() {
  const { range } = useFilters();
  return useQuery({ queryKey: queryKeys.kpis(range), queryFn: () => getKpis(range) });
}

export function useRevenue() {
  const { range } = useFilters();
  return useQuery({ queryKey: queryKeys.revenue(range), queryFn: () => getRevenue(range) });
}

export function useSalesByCategory() {
  const { range } = useFilters();
  return useQuery({
    queryKey: queryKeys.categories(range),
    queryFn: () => getSalesByCategory(range),
  });
}

export function useChannels() {
  const { range } = useFilters();
  return useQuery({ queryKey: queryKeys.channels(range), queryFn: () => getChannels(range) });
}

export function useTransactions() {
  const { range } = useFilters();
  return useQuery({
    queryKey: queryKeys.transactions(range),
    queryFn: () => getTransactions(range),
  });
}

export function useUsers() {
  const { range } = useFilters();
  return useQuery({ queryKey: queryKeys.users(range), queryFn: () => getUsers(range) });
}

export function useProducts() {
  const { range } = useFilters();
  return useQuery({ queryKey: queryKeys.products(range), queryFn: () => getProducts(range) });
}
