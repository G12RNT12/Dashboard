import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

const toneClass: Record<Tone, string> = {
  success: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400',
  danger: 'bg-red-500/10 text-red-700 ring-red-500/20 dark:text-red-400',
  neutral: 'bg-slate-500/10 text-slate-600 ring-slate-500/20 dark:text-slate-300',
  info: 'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-300',
};

export interface BadgeProps {
  tone: Tone;
  icon: LucideIcon;
  label: string;
}

/** Badge de estado: icono + texto + color (el color nunca va solo). */
export function Badge({ tone, icon: Icon, label }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        toneClass[tone],
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
