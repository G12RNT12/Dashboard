/**
 * Contratos de datos del dashboard.
 * Cuando exista un backend, sus respuestas deben cumplir estos tipos
 * (o adaptarse a ellos en la capa de servicios).
 */

/** Rangos de fechas que acepta cada endpoint. */
export type Range = '7d' | '30d' | '12m';

export type KpiId = 'revenue' | 'orders' | 'newCustomers' | 'conversion';
export type KpiFormat = 'currency' | 'number' | 'percent';

export interface Kpi {
  id: KpiId;
  label: string;
  /** Valor del periodo actual. Moneda siempre en USD (la conversión se hace al mostrar). */
  value: number;
  /** Valor del periodo anterior de igual duración. */
  previousValue: number;
  /** Variación relativa en %, p. ej. 12.4 = +12,4 %. */
  changePct: number;
  format: KpiFormat;
  /** Serie para el mini gráfico de tendencia (un punto por bucket del rango). */
  sparkline: number[];
}

/** Un punto de la serie temporal de ingresos (un día o un mes según el rango). */
export interface RevenuePoint {
  /** Fecha ISO del inicio del bucket. */
  date: string;
  /** Etiqueta corta para el eje X. */
  label: string;
  revenue: number;
  orders: number;
  /** Ingresos del bucket equivalente del periodo anterior (para comparar). */
  previousRevenue: number;
  /** Ticket medio = revenue / orders. */
  avgOrderValue: number;
}

export interface CategorySales {
  category: ProductCategory;
  revenue: number;
  orders: number;
  /** Porcentaje del total de ingresos del periodo. */
  share: number;
}

export type Channel = 'Búsqueda orgánica' | 'Anuncios' | 'Redes sociales' | 'Email' | 'Referidos';

export interface ChannelShare {
  channel: Channel;
  revenue: number;
  share: number;
}

export type ProductCategory = 'Electrónica' | 'Hogar' | 'Moda' | 'Deportes' | 'Belleza' | 'Libros';

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';

export interface Transaction {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: number;
  status: TransactionStatus;
  category: ProductCategory;
  channel: Channel;
  product: string;
}

export type CustomerStatus = 'active' | 'new' | 'inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  country: string;
  signupDate: string;
  orders: number;
  totalSpent: number;
  status: CustomerStatus;
}

export interface UserGrowthPoint {
  date: string;
  label: string;
  newCustomers: number;
  activeCustomers: number;
}

export interface CountryCount {
  country: string;
  customers: number;
}

export interface UsersResponse {
  growth: UserGrowthPoint[];
  byCountry: CountryCount[];
  customers: Customer[];
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  stockStatus: StockStatus;
  unitsSold: number;
  revenue: number;
  rating: number;
}

export interface ProductsResponse {
  products: Product[];
}

/** Punto del widget en tiempo real. */
export interface LivePoint {
  time: number;
  label: string;
  visitors: number;
  ordersPerMinute: number;
}
