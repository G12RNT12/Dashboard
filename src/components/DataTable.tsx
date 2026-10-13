import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { formatNumber } from '@/lib/format';
import { StateMessage } from './StateMessage';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Si se define, la columna se puede ordenar por este valor. */
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'right';
  /** Oculta la columna en pantallas pequeñas. */
  hideBelow?: 'sm' | 'md' | 'lg';
}

type SortState = { key: string; dir: 'asc' | 'desc' } | null;

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  caption: string;
  initialSort?: SortState;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: ReactNode;
}

const hideClass = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
};

/** Tabla genérica con ordenación por columnas y paginación (accesible con teclado). */
export function DataTable<T>({
  rows,
  columns,
  getRowId,
  caption,
  initialSort = null,
  pageSize = 8,
  emptyTitle = 'Sin resultados',
  emptyDescription = 'Prueba con otra búsqueda o cambia los filtros.',
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(initialSort);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const get = col.sortValue;
    const factor = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = get(a);
      const vb = get(b);
      return (
        (typeof va === 'number' && typeof vb === 'number'
          ? va - vb
          : String(va).localeCompare(String(vb), 'es')) * factor
      );
    });
  }, [rows, columns, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages - 1); // si un filtro reduce las filas
  const start = safePage * pageSize;
  const visible = sorted.slice(start, start + pageSize);

  const toggleSort = (key: string) => {
    setPage(0);
    setSort((prev) =>
      prev?.key !== key ? { key, dir: 'desc' } : prev.dir === 'desc' ? { key, dir: 'asc' } : null,
    );
  };

  if (rows.length === 0) {
    return (
      <StateMessage kind="empty" title={emptyTitle} description={emptyDescription} height={240} />
    );
  }

  return (
    <div>
      <div className="-mx-5 overflow-x-auto sm:-mx-6">
        <table className="w-full text-sm sm:min-w-[560px]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-y border-line bg-surface-2/60 text-left text-xs text-ink-muted">
              {columns.map((col) => {
                const active = sort?.key === col.key;
                const ariaSort = active
                  ? sort.dir === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={cn(
                      'px-3 py-2.5 font-medium first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6',
                      col.align === 'right' && 'text-right',
                      col.hideBelow && hideClass[col.hideBelow],
                    )}
                  >
                    {col.sortValue ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded transition-colors hover:text-ink',
                          active && 'text-ink',
                          col.align === 'right' && 'flex-row-reverse',
                        )}
                      >
                        {col.header}
                        {active ? (
                          sort.dir === 'asc' ? (
                            <ArrowUp className="size-3.5" aria-hidden="true" />
                          ) : (
                            <ArrowDown className="size-3.5" aria-hidden="true" />
                          )
                        ) : (
                          <ChevronsUpDown className="size-3.5 opacity-50" aria-hidden="true" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <AnimatePresence mode="wait" initial={false}>
            <motion.tbody
              key={`${safePage}-${sort?.key}-${sort?.dir}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="divide-y divide-line/70"
            >
              {visible.map((row) => (
                <tr key={getRowId(row)} className="transition-colors hover:bg-surface-2/50">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-3 py-3 text-ink first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6',
                        col.align === 'right' && 'tabular text-right',
                        col.hideBelow && hideClass[col.hideBelow],
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>

      <nav
        aria-label="Paginación"
        className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted"
      >
        <p className="tabular" aria-live="polite">
          {formatNumber(start + 1)}–{formatNumber(Math.min(start + pageSize, sorted.length))} de{' '}
          {formatNumber(sorted.length)}
        </p>
        <div className="flex items-center gap-1">
          <PageButton
            label="Página anterior"
            disabled={safePage === 0}
            onClick={() => setPage(safePage - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </PageButton>
          <span className="tabular px-2">
            Página {safePage + 1} de {totalPages}
          </span>
          <PageButton
            label="Página siguiente"
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage(safePage + 1)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </PageButton>
        </div>
      </nav>
    </div>
  );
}

function PageButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-lg border border-line text-ink transition-colors hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}
