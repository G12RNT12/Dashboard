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
import { useUsers } from '@/hooks/useDashboardData';
import { SERIES, axisProps, cursorBand, gridProps, svgId } from '@/lib/chartTheme';
import { formatNumber } from '@/lib/format';

/** Clientes nuevos por país (suma = KPI "Clientes nuevos"). */
export function CountryChart({ className }: { className?: string }) {
  const { data, isLoading, isError, refetch } = useUsers();
  const anim = useChartAnimation(150);
  const gradientId = svgId(useId());
  const rows = data?.byCountry ?? [];
  const color = SERIES[1];

  return (
    <ChartCard
      className={className}
      title="Clientes nuevos por país"
      subtitle={`${formatNumber(rows.reduce((s, r) => s + r.customers, 0))} altas en el periodo`}
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && rows.length === 0}
      onRetry={() => refetch()}
      height={300}
      dataTable={{
        columns: ['País', 'Clientes nuevos'],
        rows: rows.map((r) => [r.country, formatNumber(r.customers)]),
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 0, right: 44, bottom: 0, left: 0 }}
          barCategoryGap={8}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.55} />
              <stop offset="100%" stopColor={color} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} vertical horizontal={false} />
          <XAxis
            type="number"
            {...axisProps}
            tickFormatter={(v: number) => formatNumber(v, { compact: true })}
          />
          <YAxis type="category" dataKey="country" {...axisProps} width={104} />
          <Tooltip
            cursor={cursorBand}
            content={
              <ChartTooltip
                valueFormatter={(v) => formatNumber(v)}
                colors={{ 'Clientes nuevos': color }}
              />
            }
          />
          <Bar
            dataKey="customers"
            name="Clientes nuevos"
            fill={`url(#${gradientId})`}
            radius={[0, 6, 6, 0]}
            maxBarSize={22}
            {...anim}
          >
            <LabelList
              dataKey="customers"
              position="right"
              formatter={(v: number) => formatNumber(v)}
              style={{ fill: 'rgb(var(--ink-muted))', fontSize: 12, fontWeight: 500 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
