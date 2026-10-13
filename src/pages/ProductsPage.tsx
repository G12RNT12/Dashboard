import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader';
import { ProductsTable } from '@/features/products/ProductsTable';
import { TopProductsChart } from '@/features/products/TopProductsChart';
import { UnitsByCategoryChart } from '@/features/products/UnitsByCategoryChart';

export function ProductsPage() {
  return (
    <Page>
      <PageHeader title="Productos" description="Qué se vende más y qué hay que reponer." />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <TopProductsChart className="xl:col-span-3" />
        <UnitsByCategoryChart className="xl:col-span-2" />
      </div>

      <ProductsTable />
    </Page>
  );
}
