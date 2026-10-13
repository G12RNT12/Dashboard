import { useId } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { ChartCard } from '@/components/ChartCard';
import { ChartTooltip } from '@/components/ChartTooltip';
import { DeltaBadge } from '@/components/DeltaBadge';
import { useChartAnimation } from '@/hooks/useChartAnimation';
import { useRevenue } from '@/hooks/useDashboardData';
import { useFilters } from '@/hooks/useFilters';
import { useFormat } from '@/hooks/useFormat';
import { SERIES, axisProps, chartMargin, cursorLine, gridProps, svgId } from '@/lib/chartTheme';
import { rangeLabels } from '@/lib/format';

/** Gráfico principal del Resumen: evolución de ingresos con el total del periodo. */
export function RevenueChart({ className }: { className?: string }) {
  const { data = [], isLoading, isError, refetch } = useRevenue();
  const { range } = useFilters();
  const { money, compactMoney } = useFormat();
  const anim = useChartAnimation();
  const gradientId = svgId(useId());

  const total = data.reduce((s, p) => s + p.revenue, 0);
  const previous = data.reduce((s, p) => s + p.previousRevenue, 0);
  const change = previous ? ((total - previous) / previous) * 100 : 0;
  const color = SERIES[0];

  return (
    <ChartCard
      className={className}
      title="Ingresos"
      subtitle={`${range === '12m' ? 'Por mes' : 'Por día'}, ${rangeLabels[range].long.toLowerCase()}`}
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && data.length === 0}
      onRetry={() => refetch()}
      height={300}
      summary={
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <AnimatedNumber
            value={total}
            format={money}
            className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
          />
          <span className="flex items-center gap-1.5 text-sm text-ink-subtle">
            <DeltaBadge value={change} />
            {rangeLabels[range].previous}
          </span>
        </div>
      }
      dataTable={{
        columns: ['Periodo', 'Ingresos', 'Pedidos'],
        rows: data.map((p) => [p.label, money(p.revenue), p.orders]),
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={chartMargin}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.38} />
              <stop offset="70%" stopColor={color} stopOpacity={0.06} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} minTickGap={24} />
          <YAxis {...axisProps} tickFormatter={compactMoney} width={78} />
          <Tooltip
            cursor={cursorLine}
            content={<ChartTooltip valueFormatter={(v) => money(v)} colors={{ Ingresos: color }} />}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Ingresos"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            activeDot={{ r: 5, strokeWidth: 2, stroke: 'rgb(var(--surface))', fill: color }}
            {...anim}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
