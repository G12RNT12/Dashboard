import { useMemo } from 'react';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format';
import { useSettings } from './useSettings';

/** Formateadores ligados a la moneda elegida en Configuración. */
export function useFormat() {
  const { currency } = useSettings();
  return useMemo(
    () => ({
      currency,
      money: (usd: number, opts?: Parameters<typeof formatCurrency>[2]) =>
        formatCurrency(usd, currency, opts),
      compactMoney: (usd: number) => formatCurrency(usd, currency, { compact: true }),
      number: formatNumber,
      percent: formatPercent,
    }),
    [currency],
  );
}
