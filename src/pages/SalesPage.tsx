import { useCallback, useState } from 'react';
import { FilterSelect } from '@/components/FilterSelect';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader';
import { CategoryBarChart } from '@/features/overview/CategoryBarChart';
import { ChannelDonutChart } from '@/features/overview/ChannelDonutChart';
import { TransactionsTable } from '@/features/overview/TransactionsTable';
import { AovChart } from '@/features/sales/AovChart';
import { OrdersChart } from '@/features/sales/OrdersChart';
import { CATEGORY_OPTIONS } from '@/lib/options';
import type { ProductCategory, Transaction, TransactionStatus } from '@/types';

type StatusFilter = TransactionStatus | 'all';
type CategoryFilter = ProductCategory | 'all';

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'completed', label: 'Completados' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'refunded', label: 'Reembolsados' },
  { value: 'failed', label: 'Fallidos' },
];

export function SalesPage() {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const filter = useCallback(
    (t: Transaction) =>
      (status === 'all' || t.status === status) && (category === 'all' || t.category === category),
    [status, category],
  );

  return (
    <Page>
      <PageHeader title="Ventas" description="Pedidos, ticket medio y origen de los ingresos." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <OrdersChart />
        <AovChart />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategoryBarChart />
        <ChannelDonutChart />
      </div>

      <TransactionsTable
        title="Transacciones"
        pageSize={10}
        filter={filter}
        toolbar={
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <FilterSelect
              label="Filtrar por estado"
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
            />
            <FilterSelect
              label="Filtrar por categoría"
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
            />
          </div>
        }
      />
    </Page>
  );
}
