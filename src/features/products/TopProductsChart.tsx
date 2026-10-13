import { useId } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from '@/components/ChartCard';
import { ChartTooltip } from '@/components/ChartTooltip';
import { useChartAnimation } from '@/hooks/useChartAnimation';
import { useProducts } from '@/hooks/useDashboardData';
import { useFormat } from '@/hooks/useFormat';
import { SERIES, axisProps, cursorBand, gridProps, svgId } from '@/lib/chartTheme';
import { formatNumber } from '@/lib/format';

const TOP = 8;

/** Los productos que más facturan en el periodo. */
export function TopProductsChart({ className }: { className?: string }) {
  const { data = [], isLoading, isError, refetch } = useProducts();
  const { money, compactMoney } = useFormat();
  const anim = useChartAnimation();
  const gradientId = svgId(useId());
  const top = data.slice(0, TOP);
  const color = SERIES[0];

  return (
    <ChartCard
      className={className}
      title={`Top ${TOP} productos`}
      subtitle="Por ingresos del periodo"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && top.length === 0}
      onRetry={() => refetch()}
      height={340}
      dataTable={{
        columns: ['Producto', 'Ingresos', 'Unidades'],
        rows: top.map((p) => [p.name, money(p.revenue), formatNumber(p.unitsSold)]),
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={top}
          layout="vertical"
          margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
          barCategoryGap={8}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.55} />
              <stop offset="100%" stopColor={color} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} vertical horizontal={false} />
          <XAxis type="number" {...axisProps} tickFormatter={compactMoney} />
          <YAxis
            type="category"
            dataKey="name"
            {...axisProps}
            width={172}
            tickFormatter={(v: string) => (v.length > 24 ? `${v.slice(0, 23)}…` : v)}
          />
          <Tooltip
            cursor={cursorBand}
            content={<ChartTooltip valueFormatter={(v) => money(v)} colors={{ Ingresos: color }} />}
          />
          <Bar
            dataKey="revenue"
            name="Ingresos"
            fill={`url(#${gradientId})`}
            radius={[0, 6, 6, 0]}
            maxBarSize={22}
            {...anim}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
