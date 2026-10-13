import { AlertTriangle, Inbox, RotateCw } from 'lucide-react';
import type { ReactNode } from 'react';

interface StateMessageProps {
  kind: 'error' | 'empty';
  title: string;
  description?: ReactNode;
  onRetry?: () => void;
  height?: number;
}

/** Mensaje centrado para los estados de error y "sin datos". */
export function StateMessage({ kind, title, description, onRetry, height }: StateMessageProps) {
  const Icon = kind === 'error' ? AlertTriangle : Inbox;
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      className="flex flex-col items-center justify-center gap-2 px-6 py-8 text-center"
      style={height ? { minHeight: height } : undefined}
    >
      <span
        className={
          kind === 'error'
            ? 'rounded-full bg-status-danger/10 p-2.5 text-status-danger'
            : 'rounded-full bg-surface-2 p-2.5 text-ink-subtle'
        }
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="text-sm font-medium text-ink">{title}</p>
      {description && <p className="max-w-xs text-sm text-ink-muted">{description}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-2"
        >
          <RotateCw className="size-3.5" aria-hidden="true" />
          Reintentar
        </button>
      )}
    </div>
  );
}
