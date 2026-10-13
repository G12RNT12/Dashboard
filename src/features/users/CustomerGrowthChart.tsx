import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/components/ChartCard';
import { ChartLegend } from '@/components/ChartLegend';
import { ChartTooltip } from '@/components/ChartTooltip';
import { useChartAnimation } from '@/hooks/useChartAnimation';
import { useUsers } from '@/hooks/useDashboardData';
import { useFilters } from '@/hooks/useFilters';
import { SERIES, axisProps, chartMargin, cursorLine, gridProps } from '@/lib/chartTheme';
import { formatNumber, rangeLabels } from '@/lib/format';

/** Clientes que compran vs. clientes nuevos (misma unidad → un solo eje). */
export function CustomerGrowthChart({ className }: { className?: string }) {
  const { data, isLoading, isError, refetch } = useUsers();
  const { range } = useFilters();
  const anim = useChartAnimation();
  const growth = data?.growth ?? [];
  const [active, fresh] = [SERIES[0], SERIES[1]];

  return (
    <ChartCard
      className={className}
      title="Clientes"
      subtitle={`Compradores y altas, ${rangeLabels[range].long.toLowerCase()}`}
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && growth.length === 0}
      onRetry={() => refetch()}
      height={300}
      dataTable={{
        columns: ['Periodo', 'Compradores', 'Nuevos'],
        rows: growth.map((g) => [
          g.label,
          formatNumber(g.activeCustomers),
          formatNumber(g.newCustomers),
        ]),
      }}
    >
      <div className="flex h-full flex-col">
        <ChartLegend
          className="mb-3"
          items={[
            { label: 'Compradores', color: active },
            { label: 'Clientes nuevos', color: fresh },
          ]}
        />
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growth} margin={chartMargin}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="label" {...axisProps} minTickGap={24} />
              <YAxis
                {...axisProps}
                width={52}
                tickFormatter={(v: number) => formatNumber(v, { compact: true })}
              />
              <Tooltip
                cursor={cursorLine}
                content={<ChartTooltip valueFormatter={(v) => formatNumber(v)} />}
              />
              <Line
                type="monotone"
                dataKey="activeCustomers"
                name="Compradores"
                stroke={active}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: 'rgb(var(--surface))' }}
                {...anim}
              />
              <Line
                type="monotone"
                dataKey="newCustomers"
                name="Clientes nuevos"
                stroke={fresh}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: 'rgb(var(--surface))' }}
                {...anim}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartCard>
  );
}
