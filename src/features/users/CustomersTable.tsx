import { useMemo, useState } from 'react';
import { Card } from '@/components/Card';
import { DataTable, type Column } from '@/components/DataTable';
import { FilterSelect } from '@/components/FilterSelect';
import { TableSkeleton } from '@/components/Skeleton';
import { StateMessage } from '@/components/StateMessage';
import { Badge } from '@/components/StatusBadge';
import { customerStatusMeta } from '@/lib/statusMeta';
import { useUsers } from '@/hooks/useDashboardData';
import { useFilters } from '@/hooks/useFilters';
import { useFormat } from '@/hooks/useFormat';
import { formatDateLong, formatNumber } from '@/lib/format';
import { matchesSearch } from '@/lib/search';
import type { Customer, CustomerStatus } from '@/types';

type StatusFilter = CustomerStatus | 'all';

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Todos los clientes' },
  { value: 'active', label: 'Activos' },
  { value: 'new', label: 'Nuevos' },
  { value: 'inactive', label: 'Inactivos' },
];

export function CustomersTable() {
  const { data, isLoading, isError, refetch } = useUsers();
  const { search } = useFilters();
  const { money } = useFormat();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [country, setCountry] = useState('all');

  const customers = useMemo(() => data?.customers ?? [], [data]);

  const countryOptions = useMemo(
    () => [
      { value: 'all', label: 'Todos los países' },
      ...[...new Set(customers.map((c) => c.country))].sort().map((c) => ({ value: c, label: c })),
    ],
    [customers],
  );

  const rows = useMemo(
    () =>
      customers.filter(
        (c) =>
          (status === 'all' || c.status === status) &&
          (country === 'all' || c.country === country) &&
          matchesSearch(search, c.name, c.email, c.id, c.country),
      ),
    [customers, status, country, search],
  );

  const columns = useMemo<Column<Customer>[]>(
    () => [
      {
        key: 'name',
        header: 'Cliente',
        sortValue: (c) => c.name,
        render: (c) => (
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-semibold text-ink-muted"
            >
              {c.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')}
            </span>
            <div className="min-w-0 max-w-[120px] sm:max-w-none">
              <p className="truncate font-medium text-ink">{c.name}</p>
              <p className="truncate text-xs text-ink-subtle">{c.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'country',
        header: 'País',
        sortValue: (c) => c.country,
        render: (c) => <span className="text-ink-muted">{c.country}</span>,
        hideBelow: 'md',
      },
      {
        key: 'signup',
        header: 'Alta',
        sortValue: (c) => c.signupDate,
        render: (c) => (
          <span className="whitespace-nowrap text-ink-muted">{formatDateLong(c.signupDate)}</span>
        ),
        hideBelow: 'lg',
      },
      {
        key: 'orders',
        header: 'Pedidos',
        align: 'right',
        sortValue: (c) => c.orders,
        render: (c) => formatNumber(c.orders),
        hideBelow: 'sm',
      },
      {
        key: 'spent',
        header: 'Gasto total',
        align: 'right',
        sortValue: (c) => c.totalSpent,
        render: (c) => <span className="font-medium">{money(c.totalSpent)}</span>,
      },
      {
        key: 'status',
        header: 'Estado',
        sortValue: (c) => c.status,
        render: (c) => <Badge {...customerStatusMeta[c.status]} />,
      },
    ],
    [money],
  );

  return (
    <Card hover={false} className="p-5 sm:p-6">
      <section aria-labelledby="customers-title">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="customers-title" className="text-[15px] font-semibold text-ink">
              Clientes
            </h2>
            <p className="mt-0.5 text-sm text-ink-subtle">Ordenados por gasto total</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <FilterSelect
              label="Filtrar por estado"
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
            />
            <FilterSelect
              label="Filtrar por país"
              value={country}
              onChange={setCountry}
              options={countryOptions}
            />
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={10} />
        ) : isError ? (
          <StateMessage
            kind="error"
            title="No se pudieron cargar los clientes"
            description="Vuelve a intentarlo en unos segundos."
            onRetry={() => refetch()}
          />
        ) : (
          <DataTable
            rows={rows}
            columns={columns}
            getRowId={(c) => c.id}
            caption="Clientes"
            initialSort={{ key: 'spent', dir: 'desc' }}
            pageSize={10}
            emptyDescription="Ningún cliente coincide con la búsqueda o los filtros."
          />
        )}
      </section>
    </Card>
  );
}
