import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

/** Bloque de carga con efecto shimmer. */
export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        'relative overflow-hidden rounded-lg bg-surface-2',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer',
        'before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent',
        'dark:before:via-white/[0.06]',
        className,
      )}
    />
  );
}

const BAR_HEIGHTS = [45, 62, 38, 70, 55, 82, 64, 76, 50, 88, 68, 92];

/** Esqueleto con forma de gráfico (barras de altura variable). */
export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div
      role="status"
      aria-label="Cargando gráfico"
      className="flex flex-col gap-3"
      style={{ height }}
    >
      <div className="flex flex-1 items-end gap-2">
        {BAR_HEIGHTS.map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-md" style={{ height: `${h}%` }} />
        ))}
      </div>
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

/** Esqueleto de tabla: cabecera + filas. */
export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Cargando tabla" className="space-y-3">
      <Skeleton className="h-9 w-full" />
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-11 w-full" />
      ))}
    </div>
  );
}
