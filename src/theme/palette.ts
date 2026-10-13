/**
 * Paleta del dashboard: ÚNICA fuente de verdad de los colores.
 * Tailwind la importa (tailwind.config.ts) y los gráficos de Recharts también,
 * así que cambiar un color aquí lo cambia en toda la app.
 */

/** Colores de marca (botones, foco, acentos de navegación). */
export const brand = {
  violet: '#8B5CF6',
  violetDark: '#7C3AED',
  cyan: '#06B6D4',
  navy: '#0F172A',
} as const;

/**
 * Colores de series de los gráficos, en orden FIJO (no se reciclan).
 * Validados para daltonismo (ΔE adyacente ≥ 9 en deuteranopía) y con
 * contraste ≥ 3:1 tanto sobre fondo claro (#FFFFFF) como oscuro (#111827).
 */
export const chartSeries = ['#8B5CF6', '#0891B2', '#D97706', '#E11D48', '#3B82F6'] as const;

/** Colores de estado: solo para significado (bien/mal), siempre con icono o texto. */
export const status = {
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  neutral: '#64748B',
} as const;
