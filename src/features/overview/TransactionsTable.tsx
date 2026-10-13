import { useMemo, type ReactNode } from 'react';
import { Card } from '@/components/Card';
import { DataTable, type Column } from '@/components/DataTable';
import { TableSkeleton } from '@/components/Skeleton';
import { StateMessage } from '@/components/StateMessage';
import { Badge } from '@/components/StatusBadge';
import { transactionStatusMeta } from '@/lib/statusMeta';
import { useTransactions } from '@/hooks/useDashboardData';
import { useFilters } from '@/hooks/useFilters';
import { useFormat } from '@/hooks/useFormat';
import { formatDateTime } from '@/lib/format';
import { matchesSearch } from '@/lib/search';
import type { Transaction } from '@/types';

interface TransactionsTableProps {
  title?: string;
  description?: string;
  pageSize?: number;
  /** Filtro adicional aplicado por la página (estado, categoría…). */
  filter?: (t: Transaction) => boolean;
  /** Controles de filtro que se muestran junto al título. */
  toolbar?: ReactNode;
}

/** Tabla de transacciones: busca con el buscador global, ordena y pagina. */
export function TransactionsTable({
  title = 'Últimas transacciones',
  description,
  pageSize = 8,
  filter,
  toolbar,
}: TransactionsTableProps) {
  const { data = [], isLoading, isError, refetch } = useTransactions();
  const { search } = useFilters();
  const { money } = useFormat();

  const rows = useMemo(
    () =>
      data.filter(
        (t) =>
          (!filter || filter(t)) &&
          matchesSearch(search, t.id, t.customer, t.email, t.product, t.category),
      ),
    [data, search, filter],
  );

  const columns = useMemo<Column<Transaction>[]>(
    () => [
      {
        key: 'id',
        header: 'Pedido',
        render: (t) => <span className="font-medium text-ink">{t.id}</span>,
        sortValue: (t) => t.id,
        hideBelow: 'md',
      },
      {
        key: 'customer',
        header: 'Cliente',
        sortValue: (t) => t.customer,
        render: (t) => (
          <div className="min-w-0 max-w-[150px] sm:max-w-none">
            <p className="truncate font-medium text-ink">{t.customer}</p>
            <p className="truncate text-xs text-ink-subtle">{t.product}</p>
          </div>
        ),
      },
      {
        key: 'category',
        header: 'Categoría',
        sortValue: (t) => t.category,
        render: (t) => <span className="text-ink-muted">{t.category}</span>,
        hideBelow: 'lg',
      },
      {
        key: 'date',
        header: 'Fecha',
        sortValue: (t) => t.date,
        render: (t) => (
          <span className="whitespace-nowrap text-ink-muted">{formatDateTime(t.date)}</span>
        ),
        hideBelow: 'sm',
      },
      {
        key: 'status',
        header: 'Estado',
        sortValue: (t) => t.status,
        render: (t) => <Badge {...transactionStatusMeta[t.status]} />,
      },
      {
        key: 'amount',
        header: 'Importe',
        align: 'right',
        sortValue: (t) => t.amount,
        render: (t) => <span className="font-medium">{money(t.amount, { decimals: true })}</span>,
      },
    ],
    [money],
  );

  return (
    <Card hover={false} className="p-5 sm:p-6">
      <section aria-labelledby="tx-title">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="tx-title" className="text-[15px] font-semibold text-ink">
              {title}
            </h2>
            <p className="mt-0.5 text-sm text-ink-subtle">
              {description ??
                (search ? `Resultados para "${search}"` : 'Pedidos más recientes del periodo')}
            </p>
          </div>
          {toolbar}
        </div>

        {isLoading ? (
          <TableSkeleton rows={pageSize} />
        ) : isError ? (
          <StateMessage
            kind="error"
            title="No se pudieron cargar las transacciones"
            description="Vuelve a intentarlo en unos segundos."
            onRetry={() => refetch()}
          />
        ) : (
          <DataTable
            rows={rows}
            columns={columns}
            getRowId={(t) => t.id}
            caption={title}
            initialSort={{ key: 'date', dir: 'desc' }}
            pageSize={pageSize}
            emptyDescription={
              search
                ? `Ningún pedido coincide con "${search}".`
                : 'No hay pedidos con estos filtros.'
            }
          />
        )}
      </section>
    </Card>
  );
}
