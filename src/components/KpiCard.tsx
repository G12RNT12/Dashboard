import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';
import { AnimatedNumber } from './AnimatedNumber';
import { DeltaBadge } from './DeltaBadge';
import { Skeleton } from './Skeleton';
import { Sparkline } from './Sparkline';

interface KpiCardProps {
  label: string;
  value: number;
  changePct: number;
  format: (n: number) => string;
  sparkline: number[];
  icon: LucideIcon;
  /** Texto de comparación, p. ej. "vs. 30 días anteriores". */
  comparison: string;
  color?: string;
}

export function KpiCard({
  label,
  value,
  changePct,
  format,
  sparkline,
  icon: Icon,
  comparison,
  color,
}: KpiCardProps) {
  return (
    <Card hover="lift-scale" className="overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-muted">{label}</p>
        <span className="grid size-8 place-items-center rounded-lg bg-surface-2 text-ink-subtle">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <AnimatedNumber
        value={value}
        format={format}
        className="mt-3 block text-[28px] font-semibold leading-none tracking-tight text-ink"
      />
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="flex flex-wrap items-center gap-1.5 text-xs text-ink-subtle">
          <DeltaBadge value={changePct} />
          <span>{comparison}</span>
        </p>
        <div className="w-24 shrink-0">
          <Sparkline data={sparkline} color={color} height={40} />
        </div>
      </div>
    </Card>
  );
}

export function KpiCardSkeleton() {
  return (
    <Card hover={false} className="p-5" aria-hidden="true">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-8" />
      </div>
      <Skeleton className="mt-3 h-7 w-36" />
      <div className="mt-3 flex items-end justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </Card>
  );
}
