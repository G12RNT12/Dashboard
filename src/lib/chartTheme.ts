/**
 * Estilos compartidos de Recharts. Los colores de ejes y rejilla leen variables CSS,
 * así que cambian solos con el tema claro/oscuro.
 */
import { chartSeries } from '@/theme/palette';

export const SERIES = chartSeries;

export const axisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fill: 'rgb(var(--ink-subtle))', fontSize: 12 },
  tickMargin: 8,
} as const;

export const gridProps = {
  stroke: 'rgb(var(--grid))',
  strokeDasharray: '3 4',
  vertical: false,
} as const;

export const cursorLine = {
  stroke: 'rgb(var(--ink-subtle))',
  strokeWidth: 1,
  strokeDasharray: '4 4',
};
export const cursorBand = { fill: 'rgb(var(--ink-subtle) / 0.08)' };

/** Margen estándar: deja hueco a las etiquetas del eje Y sin desperdiciar ancho. */
export const chartMargin = { top: 8, right: 8, bottom: 0, left: 0 };

/** Convierte el id de useId (":r1:") en uno válido para url(#id) en SVG. */
export const svgId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, '');
