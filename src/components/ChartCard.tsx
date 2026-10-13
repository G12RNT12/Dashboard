import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Table2 } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Card } from './Card';
import { ChartSkeleton } from './Skeleton';
import { StateMessage } from './StateMessage';

export interface ChartDataTable {
  columns: string[];
  rows: Array<Array<string | number>>;
}

interface ChartCardProps {
  title: string;
  subtitle?: ReactNode;
  /** Contenido extra a la derecha del título (leyenda, filtros…). */
  actions?: ReactNode;
  /** Contenido destacado bajo el título (p. ej. el total del periodo). */
  summary?: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
  height?: number;
  /** Versión en tabla del gráfico (accesibilidad): se alterna con un botón. */
  dataTable?: ChartDataTable;
  className?: string;
  children: ReactNode;
}

/**
 * Contenedor estándar de gráficos. Centraliza los estados de carga (skeleton),
 * error (con reintento) y "sin datos", y ofrece una vista de tabla alternativa.
 */
export function ChartCard({
  title,
  subtitle,
  actions,
  summary,
  isLoading,
  isError,
  isEmpty,
  onRetry,
  emptyMessage = 'No hay datos para este rango de fechas.',
  height = 280,
  dataTable,
  className,
  children,
}: ChartCardProps) {
  const [showTable, setShowTable] = useState(false);
  const titleId = useId();
  const ready = !isLoading && !isError && !isEmpty;

  return (
    <Card className={cn('flex flex-col p-5 sm:p-6', className)}>
      <section aria-labelledby={titleId} className="flex flex-1 flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id={titleId} className="text-[15px] font-semibold text-ink">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-ink-subtle">{subtitle}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {actions}
            {dataTable && ready && (
              <button
                type="button"
                onClick={() => setShowTable((v) => !v)}
                aria-pressed={showTable}
                aria-label={showTable ? 'Ver como gráfico' : 'Ver como tabla'}
                title={showTable ? 'Ver como gráfico' : 'Ver como tabla'}
                className="grid size-8 place-items-center rounded-lg text-ink-subtle transition-colors hover:bg-surface-2 hover:text-ink"
              >
                {showTable ? (
                  <BarChart3 className="size-4" aria-hidden="true" />
                ) : (
                  <Table2 className="size-4" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>

        {summary && ready && <div className="mb-4">{summary}</div>}

        <div className="relative flex-1" style={{ minHeight: height }}>
          {isLoading ? (
            <ChartSkeleton height={height} />
          ) : isError ? (
            <StateMessage
              kind="error"
              title="No se pudieron cargar los datos"
              description="Comprueba la conexión y vuelve a intentarlo."
              onRetry={onRetry}
              height={height}
            />
          ) : isEmpty ? (
            <StateMessage
              kind="empty"
              title="Sin datos"
              description={emptyMessage}
              height={height}
            />
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              {showTable && dataTable ? (
                <motion.div
                  key="table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-auto rounded-xl border border-line"
                  style={{ maxHeight: height }}
                >
                  <table className="w-full text-sm">
                    <caption className="sr-only">{title}</caption>
                    <thead className="sticky top-0 bg-surface-2 text-left text-xs text-ink-muted">
                      <tr>
                        {dataTable.columns.map((c, i) => (
                          <th
                            key={c}
                            scope="col"
                            className={cn('px-3 py-2 font-medium', i > 0 && 'text-right')}
                          >
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {dataTable.rows.map((row, r) => (
                        <tr key={r}>
                          {row.map((cell, i) => (
                            <td
                              key={i}
                              className={cn('px-3 py-2 text-ink', i > 0 && 'tabular text-right')}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              ) : (
                <motion.div
                  key="chart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ height }}
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>
    </Card>
  );
}
