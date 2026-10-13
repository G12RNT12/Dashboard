import { useId, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from '@/components/ChartCard';
import { ChartTooltip } from '@/components/ChartTooltip';
import { useChartAnimation } from '@/hooks/useChartAnimation';
import { useProducts } from '@/hooks/useDashboardData';
import { SERIES, axisProps, chartMargin, cursorBand, gridProps, svgId } from '@/lib/chartTheme';
import { formatNumber } from '@/lib/format';

/** Unidades vendidas por categoría (agregadas a partir del catálogo). */
export function UnitsByCategoryChart({ className }: { className?: string }) {
  const { data = [], isLoading, isError, refetch } = useProducts();
  const anim = useChartAnimation(150);
  const gradientId = svgId(useId());
  const color = SERIES[1];

  const rows = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + p.unitsSold));
    return [...map.entries()]
      .map(([category, units]) => ({ category, units }))
      .sort((a, b) => b.units - a.units);
  }, [data]);

  return (
    <ChartCard
      className={className}
      title="Unidades vendidas por categoría"
      subtitle={`${formatNumber(rows.reduce((s, r) => s + r.units, 0))} unidades en el periodo`}
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && rows.length === 0}
      onRetry={() => refetch()}
      height={340}
      dataTable={{
        columns: ['Categoría', 'Unidades'],
        rows: rows.map((r) => [r.category, formatNumber(r.units)]),
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={chartMargin} barCategoryGap="24%">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.55} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="category"
            {...axisProps}
            interval={0}
            tick={{ ...axisProps.tick, fontSize: 11 }}
          />
          <YAxis
            {...axisProps}
            width={48}
            tickFormatter={(v: number) => formatNumber(v, { compact: true })}
          />
          <Tooltip
            cursor={cursorBand}
            content={
              <ChartTooltip valueFormatter={(v) => formatNumber(v)} colors={{ Unidades: color }} />
            }
          />
          <Bar
            dataKey="units"
            name="Unidades"
            fill={`url(#${gradientId})`}
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
            {...anim}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
