import { cn } from '@/lib/cn';

export interface LegendItem {
  label: string;
  color: string;
  dashed?: boolean;
}

/** Leyenda compacta: muestra de línea (continua o discontinua) + nombre. */
export function ChartLegend({ items, className }: { items: LegendItem[]; className?: string }) {
  return (
    <ul
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted',
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <svg width="18" height="8" aria-hidden="true">
            <line
              x1="1"
              y1="4"
              x2="17"
              y2="4"
              stroke={item.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={item.dashed ? '3 4' : undefined}
            />
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  );
}
