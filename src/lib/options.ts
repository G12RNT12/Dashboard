import type { ProductCategory } from '@/types';

const CATEGORIES: ProductCategory[] = [
  'Electrónica',
  'Moda',
  'Hogar',
  'Deportes',
  'Belleza',
  'Libros',
];

/** Opciones de filtro por categoría, compartidas por Ventas y Productos. */
export const CATEGORY_OPTIONS: Array<{ value: ProductCategory | 'all'; label: string }> = [
  { value: 'all', label: 'Todas las categorías' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];
