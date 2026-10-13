import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { formatDelta } from '@/lib/format';
import { cn } from '@/lib/cn';

/** Variación vs. periodo anterior: flecha + signo + color (nunca solo color). */
export function DeltaBadge({ value, className }: { value: number; className?: string }) {
  const flat = Math.abs(value) < 0.05;
  const up = value > 0;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        'tabular inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold',
        flat && 'bg-surface-2 text-ink-muted',
        !flat && up && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        !flat && !up && 'bg-red-500/10 text-red-700 dark:text-red-400',
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      <span className="sr-only">{flat ? 'Sin cambios' : up ? 'Sube' : 'Baja'}</span>
      {formatDelta(value)}
    </span>
  );
}
