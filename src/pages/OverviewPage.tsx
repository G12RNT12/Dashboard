import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader';
import { CategoryBarChart } from '@/features/overview/CategoryBarChart';
import { ChannelDonutChart } from '@/features/overview/ChannelDonutChart';
import { KpiGrid } from '@/features/overview/KpiGrid';
import { LiveWidget } from '@/features/overview/LiveWidget';
import { PeriodComparisonChart } from '@/features/overview/PeriodComparisonChart';
import { RevenueChart } from '@/features/overview/RevenueChart';
import { TransactionsTable } from '@/features/overview/TransactionsTable';
import { useFilters } from '@/hooks/useFilters';
import { rangeLabels } from '@/lib/format';

export function OverviewPage() {
  const { range } = useFilters();

  return (
    <Page>
      <PageHeader
        title="Resumen"
        description={`Cómo va la tienda en los ${rangeLabels[range].short.toLowerCase()} más recientes.`}
      />

      <KpiGrid />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <RevenueChart className="xl:col-span-2" />
        <LiveWidget />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <CategoryBarChart />
        <ChannelDonutChart />
        <PeriodComparisonChart className="lg:col-span-2 xl:col-span-1" />
      </div>

      <TransactionsTable />
    </Page>
  );
}
