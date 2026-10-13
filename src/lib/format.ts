import type { Range } from '@/types';

export type Currency = 'USD' | 'EUR' | 'MXN' | 'COP';

/**
 * Los servicios devuelven importes en USD. Para la demo se convierte con tasas fijas;
 * con una API real lo normal es pedir los importes ya en la moneda elegida.
 */
export const currencyOptions: Record<Currency, { label: string; rate: number }> = {
  USD: { label: 'Dólar estadounidense (USD)', rate: 1 },
  EUR: { label: 'Euro (EUR)', rate: 0.92 },
  MXN: { label: 'Peso mexicano (MXN)', rate: 18.4 },
  COP: { label: 'Peso colombiano (COP)', rate: 4100 },
};

/** Un único formato numérico en toda la app: 1.234.567,89 */
const LOCALE = 'es-ES';

const cache = new Map<string, Intl.NumberFormat>();
function nf(options: Intl.NumberFormatOptions) {
  const key = JSON.stringify(options);
  let f = cache.get(key);
  if (!f) {
    // useGrouping 'always': es-ES por defecto no separa los números de 4 cifras (1234).
    f = new Intl.NumberFormat(LOCALE, {
      ...options,
      useGrouping: 'always' as unknown as boolean,
    });
    cache.set(key, f);
  }
  return f;
}

export function formatCurrency(
  usd: number,
  currency: Currency = 'USD',
  opts: { compact?: boolean; decimals?: boolean } = {},
) {
  const { rate } = currencyOptions[currency];
  return nf({
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    notation: opts.compact ? 'compact' : 'standard',
    maximumFractionDigits: opts.compact ? 1 : opts.decimals ? 2 : 0,
    minimumFractionDigits: opts.decimals && !opts.compact ? 2 : 0,
  }).format(usd * rate);
}

export function formatNumber(value: number, opts: { compact?: boolean; decimals?: number } = {}) {
  return nf({
    notation: opts.compact ? 'compact' : 'standard',
    maximumFractionDigits: opts.decimals ?? (opts.compact ? 1 : 0),
    minimumFractionDigits: opts.decimals ?? 0,
  }).format(value);
}

/** `value` ya viene en puntos porcentuales (3.2 → "3,2 %"). */
export function formatPercent(value: number, decimals = 1) {
  return `${formatNumber(value, { decimals })} %`;
}

/** Variación con signo: +12,4 % / −3,1 % */
export function formatDelta(value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${formatNumber(Math.abs(value), { decimals: 1 })} %`;
}

const dateFormats = {
  weekday: new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric' }),
  day: new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }),
  month: new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit' }),
  long: new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
  dateTime: new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }),
  time: new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
};

const clean = (s: string) => s.replace(/\./g, '');

/** Etiqueta corta del eje X según la granularidad del rango. */
export function formatBucketLabel(date: Date, range: Range) {
  if (range === '7d') return clean(dateFormats.weekday.format(date));
  if (range === '30d') return clean(dateFormats.day.format(date));
  return clean(dateFormats.month.format(date));
}

export const formatDateLong = (iso: string) => dateFormats.long.format(new Date(iso));
export const formatDateTime = (iso: string) => clean(dateFormats.dateTime.format(new Date(iso)));
export const formatTime = (ms: number) => dateFormats.time.format(new Date(ms));

export const rangeLabels: Record<Range, { short: string; long: string; previous: string }> = {
  '7d': { short: '7 días', long: 'Últimos 7 días', previous: 'vs. 7 días anteriores' },
  '30d': { short: '30 días', long: 'Últimos 30 días', previous: 'vs. 30 días anteriores' },
  '12m': { short: '12 meses', long: 'Últimos 12 meses', previous: 'vs. 12 meses anteriores' },
};
