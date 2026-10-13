import { motion } from 'framer-motion';
import { useRef, type KeyboardEvent } from 'react';
import { useFilters } from '@/hooks/useFilters';
import { cn } from '@/lib/cn';
import { spring } from '@/lib/motion';
import type { Range } from '@/types';

const OPTIONS: Array<{ value: Range; label: string; full: string }> = [
  { value: '7d', label: '7 d', full: 'Últimos 7 días' },
  { value: '30d', label: '30 d', full: 'Últimos 30 días' },
  { value: '12m', label: '12 m', full: 'Últimos 12 meses' },
];

/** Control segmentado del rango global. Navegable con flechas (patrón radiogroup). */
export function RangeSelector() {
  const { range, setRange } = useFilters();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const dir =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? -1
          : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (index + dir + OPTIONS.length) % OPTIONS.length;
    setRange(OPTIONS[next]!.value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Rango de fechas"
      className="relative flex rounded-xl border border-line bg-surface-2/70 p-1"
    >
      {OPTIONS.map((opt, i) => {
        const active = opt.value === range;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.full}
            title={opt.full}
            tabIndex={active ? 0 : -1}
            onClick={() => setRange(opt.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              'tabular relative z-10 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              active ? 'text-ink' : 'text-ink-muted hover:text-ink',
            )}
          >
            {active && (
              <motion.span
                layoutId="range-pill"
                transition={spring}
                className="absolute inset-0 -z-10 rounded-lg bg-surface shadow-card ring-1 ring-line"
              />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
