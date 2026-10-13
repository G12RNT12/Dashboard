import { DollarSign, Percent, ShoppingCart, UserPlus, type LucideIcon } from 'lucide-react';
import { Card } from '@/components/Card';
import { KpiCard, KpiCardSkeleton } from '@/components/KpiCard';
import { StateMessage } from '@/components/StateMessage';
import { useKpis } from '@/hooks/useDashboardData';
import { useFilters } from '@/hooks/useFilters';
import { useFormat } from '@/hooks/useFormat';
import { formatNumber, formatPercent, rangeLabels } from '@/lib/format';
import { SERIES } from '@/lib/chartTheme';
import type { KpiId } from '@/types';

const icons: Record<KpiId, LucideIcon> = {
  revenue: DollarSign,
  orders: ShoppingCart,
  newCustomers: UserPlus,
  conversion: Percent,
};

const formatInt = (n: number) => formatNumber(n);
const formatPct = (n: number) => formatPercent(n, 2);

export function KpiGrid() {
  const { data, isLoading, isError, refetch } = useKpis();
  const { range } = useFilters();
  const { money } = useFormat();

  const formatters = { currency: money, number: formatInt, percent: formatPct };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {isLoading && Array.from({ length: 4 }, (_, i) => <KpiCardSkeleton key={i} />)}

      {isError && (
        <Card hover={false} className="sm:col-span-2 xl:col-span-4">
          <StateMessage
            kind="error"
            title="No se pudieron cargar los indicadores"
            description="Vuelve a intentarlo en unos segundos."
            onRetry={() => refetch()}
          />
        </Card>
      )}

      {data?.map((kpi) => (
        <KpiCard
          key={kpi.id}
          label={kpi.label}
          value={kpi.value}
          changePct={kpi.changePct}
          format={formatters[kpi.format]}
          sparkline={kpi.sparkline}
          icon={icons[kpi.id]}
          comparison={rangeLabels[range].previous}
          color={SERIES[0]}
        />
      ))}
    </div>
  );
}
