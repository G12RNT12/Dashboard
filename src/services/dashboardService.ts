/**
 * Capa de datos del dashboard.
 *
 * Cada función imita un endpoint REST y devuelve una Promesa.
 * Para conectar una API real, sustituye el cuerpo de cada función por la línea
 * marcada con 🔌 (y borra la carpeta ./mock). Los componentes no cambian:
 * solo dependen de estas firmas y de los tipos de /src/types.
 */
import type {
  CategorySales,
  ChannelShare,
  Kpi,
  Product,
  Range,
  RevenuePoint,
  Transaction,
  UsersResponse,
} from '@/types';
import { simulateRequest } from './client';
import {
  buildChannels,
  buildKpis,
  buildProducts,
  buildRevenue,
  buildSalesByCategory,
  buildTransactions,
  buildUsers,
} from './mock/generator';

/** Totales del periodo y su variación frente al periodo anterior. */
export function getKpis(range: Range): Promise<Kpi[]> {
  // 🔌 API real: return apiGet<Kpi[]>('/kpis', { range });
  return simulateRequest(() => buildKpis(range));
}

/** Serie temporal de ingresos y pedidos (diaria en 7d/30d, mensual en 12m). */
export function getRevenue(range: Range): Promise<RevenuePoint[]> {
  // 🔌 API real: return apiGet<RevenuePoint[]>('/revenue', { range });
  return simulateRequest(() => buildRevenue(range));
}

/** Ingresos y pedidos por categoría de producto. */
export function getSalesByCategory(range: Range): Promise<CategorySales[]> {
  // 🔌 API real: return apiGet<CategorySales[]>('/sales/by-category', { range });
  return simulateRequest(() => buildSalesByCategory(range));
}

/** Reparto de ingresos por canal de adquisición. */
export function getChannels(range: Range): Promise<ChannelShare[]> {
  // 🔌 API real: return apiGet<ChannelShare[]>('/sales/by-channel', { range });
  return simulateRequest(() => buildChannels(range));
}

/** Transacciones más recientes del rango (ordenadas de nueva a antigua). */
export function getTransactions(range: Range): Promise<Transaction[]> {
  // 🔌 API real: return apiGet<Transaction[]>('/transactions', { range, limit: '400' });
  return simulateRequest(() => buildTransactions(range));
}

/** Crecimiento de clientes, reparto por país y listado de clientes. */
export function getUsers(range: Range): Promise<UsersResponse> {
  // 🔌 API real: return apiGet<UsersResponse>('/customers', { range });
  return simulateRequest(() => buildUsers(range));
}

/** Catálogo con unidades vendidas e ingresos del rango. */
export function getProducts(range: Range): Promise<Product[]> {
  // 🔌 API real: return apiGet<Product[]>('/products', { range });
  return simulateRequest(() => buildProducts(range));
}
