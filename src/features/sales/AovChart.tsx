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
import { ChartCard } from '@/components/ChartCard';
import { ChartTooltip } from '@/components/ChartTooltip';
import { useChartAnimation } from '@/hooks/useChartAnimation';
import { useRevenue } from '@/hooks/useDashboardData';
import { useFormat } from '@/hooks/useFormat';
import { SERIES, axisProps, chartMargin, cursorLine, gridProps, svgId } from '@/lib/chartTheme';

/** Ticket medio (ingresos / pedidos) por periodo. */
export function AovChart({ className }: { className?: string }) {
  const { data = [], isLoading, isError, refetch } = useRevenue();
  const { money } = useFormat();
  const anim = useChartAnimation(150);
  const gradientId = svgId(useId());
  const color = SERIES[0];

  const revenue = data.reduce((s, p) => s + p.revenue, 0);
  const orders = data.reduce((s, p) => s + p.orders, 0);
  const avg = orders ? revenue / orders : 0;

  return (
    <ChartCard
      className={className}
      title="Ticket medio"
      subtitle={`Media del periodo: ${money(avg, { decimals: true })}`}
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && data.length === 0}
      onRetry={() => refetch()}
      dataTable={{
        columns: ['Periodo', 'Ticket medio'],
        rows: data.map((p) => [p.label, money(p.avgOrderValue, { decimals: true })]),
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={chartMargin}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} minTickGap={24} />
          <YAxis
            {...axisProps}
            width={56}
            domain={['dataMin - 4', 'dataMax + 4']}
            tickFormatter={(v: number) => money(v)}
          />
          <Tooltip
            cursor={cursorLine}
            content={
              <ChartTooltip
                valueFormatter={(v) => money(v, { decimals: true })}
                colors={{ 'Ticket medio': color }}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="avgOrderValue"
            name="Ticket medio"
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
