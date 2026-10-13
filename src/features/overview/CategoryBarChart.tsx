import { useId } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/components/ChartCard';
import { ChartTooltip } from '@/components/ChartTooltip';
import { useChartAnimation } from '@/hooks/useChartAnimation';
import { useSalesByCategory } from '@/hooks/useDashboardData';
import { useFormat } from '@/hooks/useFormat';
import { SERIES, axisProps, cursorBand, gridProps, svgId } from '@/lib/chartTheme';
import { formatPercent } from '@/lib/format';

/** Ventas por categoría: barras horizontales (las etiquetas largas se leen mejor). */
export function CategoryBarChart({ className }: { className?: string }) {
  const { data = [], isLoading, isError, refetch } = useSalesByCategory();
  const { money, compactMoney } = useFormat();
  const anim = useChartAnimation(150);
  const gradientId = svgId(useId());
  const color = SERIES[0];

  return (
    <ChartCard
      className={className}
      title="Ventas por categoría"
      subtitle="Ingresos del periodo"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && data.length === 0}
      onRetry={() => refetch()}
      height={320}
      dataTable={{
        columns: ['Categoría', 'Ingresos', 'Pedidos', '% del total'],
        rows: data.map((c) => [c.category, money(c.revenue), c.orders, formatPercent(c.share)]),
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
          barCategoryGap={10}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.55} />
              <stop offset="100%" stopColor={color} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} vertical horizontal={false} />
          <XAxis type="number" {...axisProps} tickFormatter={compactMoney} />
          <YAxis type="category" dataKey="category" {...axisProps} width={84} />
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
          >
            <LabelList
              dataKey="share"
              position="right"
              formatter={(v: number) => formatPercent(v, 0)}
              style={{ fill: 'rgb(var(--ink-muted))', fontSize: 12, fontWeight: 500 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
