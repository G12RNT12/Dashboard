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
import { useRevenue } from '@/hooks/useDashboardData';
import { useFilters } from '@/hooks/useFilters';
import { useFormat } from '@/hooks/useFormat';
import { SERIES, axisProps, chartMargin, cursorLine, gridProps } from '@/lib/chartTheme';
import { rangeLabels } from '@/lib/format';

/**
 * Comparación de dos periodos sobre el mismo eje (misma unidad: ingresos).
 * El periodo anterior va discontinuo para distinguirlo también sin color.
 */
export function PeriodComparisonChart({ className }: { className?: string }) {
  const { data = [], isLoading, isError, refetch } = useRevenue();
  const { range } = useFilters();
  const { money, compactMoney } = useFormat();
  const anim = useChartAnimation(200);
  const [current, previous] = [SERIES[0], SERIES[1]];

  return (
    <ChartCard
      className={className}
      title="Comparación de periodos"
      height={320}
      subtitle={`Ingresos, ${rangeLabels[range].long.toLowerCase()}`}
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && data.length === 0}
      onRetry={() => refetch()}
      dataTable={{
        columns: ['Periodo', 'Actual', 'Anterior'],
        rows: data.map((p) => [p.label, money(p.revenue), money(p.previousRevenue)]),
      }}
    >
      <div className="flex h-full flex-col">
        <ChartLegend
          className="mb-3"
          items={[
            { label: 'Actual', color: current },
            { label: 'Anterior', color: previous, dashed: true },
          ]}
        />
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={chartMargin}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="label" {...axisProps} minTickGap={24} />
              <YAxis {...axisProps} tickFormatter={compactMoney} width={78} />
              <Tooltip
                cursor={cursorLine}
                content={<ChartTooltip valueFormatter={(v) => money(v)} />}
              />
              <Line
                type="monotone"
                dataKey="previousRevenue"
                name="Periodo anterior"
                stroke={previous}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'rgb(var(--surface))' }}
                {...anim}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Periodo actual"
                stroke={current}
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
