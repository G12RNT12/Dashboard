import { useId } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from '@/components/ChartCard';
import { ChartTooltip } from '@/components/ChartTooltip';
import { useChartAnimation } from '@/hooks/useChartAnimation';
import { useRevenue } from '@/hooks/useDashboardData';
import { useFilters } from '@/hooks/useFilters';
import { SERIES, axisProps, chartMargin, cursorBand, gridProps, svgId } from '@/lib/chartTheme';
import { formatNumber, rangeLabels } from '@/lib/format';

/** Pedidos por día/mes. Va en un gráfico aparte de los ingresos (no se mezclan escalas). */
export function OrdersChart({ className }: { className?: string }) {
  const { data = [], isLoading, isError, refetch } = useRevenue();
  const { range } = useFilters();
  const anim = useChartAnimation();
  const gradientId = svgId(useId());
  const color = SERIES[1];
  const total = data.reduce((s, p) => s + p.orders, 0);

  return (
    <ChartCard
      className={className}
      title="Pedidos"
      subtitle={`${formatNumber(total)} pedidos, ${rangeLabels[range].long.toLowerCase()}`}
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && data.length === 0}
      onRetry={() => refetch()}
      dataTable={{
        columns: ['Periodo', 'Pedidos'],
        rows: data.map((p) => [p.label, formatNumber(p.orders)]),
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={chartMargin} barCategoryGap="22%">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.55} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} minTickGap={16} />
          <YAxis
            {...axisProps}
            width={52}
            tickFormatter={(v: number) => formatNumber(v, { compact: true })}
          />
          <Tooltip
            cursor={cursorBand}
            content={
              <ChartTooltip valueFormatter={(v) => formatNumber(v)} colors={{ Pedidos: color }} />
            }
          />
          <Bar
            dataKey="orders"
            name="Pedidos"
            fill={`url(#${gradientId})`}
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
            {...anim}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
