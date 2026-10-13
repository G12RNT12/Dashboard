import { Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card } from '@/components/Card';
import { DataTable, type Column } from '@/components/DataTable';
import { FilterSelect } from '@/components/FilterSelect';
import { TableSkeleton } from '@/components/Skeleton';
import { StateMessage } from '@/components/StateMessage';
import { Badge } from '@/components/StatusBadge';
import { stockStatusMeta } from '@/lib/statusMeta';
import { useProducts } from '@/hooks/useDashboardData';
import { useFilters } from '@/hooks/useFilters';
import { useFormat } from '@/hooks/useFormat';
import { formatNumber } from '@/lib/format';
import { CATEGORY_OPTIONS } from '@/lib/options';
import { matchesSearch } from '@/lib/search';
import type { Product, ProductCategory, StockStatus } from '@/types';

type StockFilter = StockStatus | 'all';

const STOCK_OPTIONS: Array<{ value: StockFilter; label: string }> = [
  { value: 'all', label: 'Todo el stock' },
  { value: 'in_stock', label: 'En stock' },
  { value: 'low_stock', label: 'Stock bajo' },
  { value: 'out_of_stock', label: 'Agotados' },
];

export function ProductsTable() {
  const { data = [], isLoading, isError, refetch } = useProducts();
  const { search } = useFilters();
  const { money } = useFormat();
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [stock, setStock] = useState<StockFilter>('all');

  const rows = useMemo(
    () =>
      data.filter(
        (p) =>
          (category === 'all' || p.category === category) &&
          (stock === 'all' || p.stockStatus === stock) &&
          matchesSearch(search, p.name, p.id, p.category),
      ),
    [data, category, stock, search],
  );

  const columns = useMemo<Column<Product>[]>(
    () => [
      {
        key: 'name',
        header: 'Producto',
        sortValue: (p) => p.name,
        render: (p) => (
          <div className="min-w-0 max-w-[140px] sm:max-w-none">
            <p className="truncate font-medium text-ink">{p.name}</p>
            <p className="truncate text-xs text-ink-subtle">{p.id}</p>
          </div>
        ),
      },
      {
        key: 'category',
        header: 'Categoría',
        sortValue: (p) => p.category,
        render: (p) => <span className="text-ink-muted">{p.category}</span>,
        hideBelow: 'md',
      },
      {
        key: 'price',
        header: 'Precio',
        align: 'right',
        sortValue: (p) => p.price,
        render: (p) => money(p.price, { decimals: true }),
        hideBelow: 'lg',
      },
      {
        key: 'units',
        header: 'Vendidas',
        align: 'right',
        sortValue: (p) => p.unitsSold,
        render: (p) => formatNumber(p.unitsSold),
        hideBelow: 'sm',
      },
      {
        key: 'revenue',
        header: 'Ingresos',
        align: 'right',
        sortValue: (p) => p.revenue,
        render: (p) => <span className="font-medium">{money(p.revenue)}</span>,
      },
      {
        key: 'rating',
        header: 'Valoración',
        align: 'right',
        sortValue: (p) => p.rating,
        render: (p) => (
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            {formatNumber(p.rating, { decimals: 1 })}
          </span>
        ),
        hideBelow: 'lg',
      },
      {
        key: 'stock',
        header: 'Stock',
        sortValue: (p) => p.stock,
        render: (p) => (
          <div className="flex items-center gap-2">
            <Badge {...stockStatusMeta[p.stockStatus]} />
            <span className="tabular text-xs text-ink-subtle">{formatNumber(p.stock)} u.</span>
          </div>
        ),
      },
    ],
    [money],
  );

  return (
    <Card hover={false} className="p-5 sm:p-6">
      <section aria-labelledby="products-title">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="products-title" className="text-[15px] font-semibold text-ink">
              Catálogo
            </h2>
            <p className="mt-0.5 text-sm text-ink-subtle">Ventas e inventario de cada producto</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <FilterSelect
              label="Filtrar por categoría"
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
            />
            <FilterSelect
              label="Filtrar por stock"
              value={stock}
              onChange={setStock}
              options={STOCK_OPTIONS}
            />
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={10} />
        ) : isError ? (
          <StateMessage
            kind="error"
            title="No se pudo cargar el catálogo"
            description="Vuelve a intentarlo en unos segundos."
            onRetry={() => refetch()}
          />
        ) : (
          <DataTable
            rows={rows}
            columns={columns}
            getRowId={(p) => p.id}
            caption="Catálogo de productos"
            initialSort={{ key: 'revenue', dir: 'desc' }}
            pageSize={10}
            emptyDescription="Ningún producto coincide con la búsqueda o los filtros."
          />
        )}
      </section>
    </Card>
  );
}
