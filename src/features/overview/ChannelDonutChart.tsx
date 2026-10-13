import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartCard } from '@/components/ChartCard';
import { ChartTooltip } from '@/components/ChartTooltip';
import { useChartAnimation } from '@/hooks/useChartAnimation';
import { useChannels } from '@/hooks/useDashboardData';
import { useFormat } from '@/hooks/useFormat';
import { SERIES } from '@/lib/chartTheme';
import { formatPercent } from '@/lib/format';

/** Reparto de ingresos por canal: dona + leyenda con valores (la identidad no depende solo del color). */
export function ChannelDonutChart({ className }: { className?: string }) {
  const { data = [], isLoading, isError, refetch } = useChannels();
  const { money, compactMoney } = useFormat();
  const anim = useChartAnimation(250);
  const total = data.reduce((s, c) => s + c.revenue, 0);

  return (
    <ChartCard
      className={className}
      title="Ingresos por canal"
      subtitle="De dónde llegan las ventas"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && data.length === 0}
      onRetry={() => refetch()}
      height={320}
      dataTable={{
        columns: ['Canal', 'Ingresos', '% del total'],
        rows: data.map((c) => [c.channel, money(c.revenue), formatPercent(c.share)]),
      }}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="relative min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<ChartTooltip valueFormatter={(v) => money(v)} />} />
              <Pie
                data={data}
                dataKey="revenue"
                nameKey="channel"
                innerRadius="66%"
                outerRadius="94%"
                paddingAngle={2}
                cornerRadius={4}
                stroke="rgb(var(--surface))"
                strokeWidth={2}
                {...anim}
              >
                {data.map((c, i) => (
                  <Cell key={c.channel} fill={SERIES[i % SERIES.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-xs text-ink-subtle">Total</p>
              <p className="tabular text-lg font-semibold text-ink">{compactMoney(total)}</p>
            </div>
          </div>
        </div>

        <ul className="space-y-1.5 text-sm">
          {data.map((c, i) => (
            <li key={c.channel} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: SERIES[i % SERIES.length] }}
                aria-hidden="true"
              />
              <span className="truncate text-ink-muted">{c.channel}</span>
              <span className="tabular ml-auto text-ink-muted">{compactMoney(c.revenue)}</span>
              <span className="tabular w-10 text-right font-medium text-ink">
                {formatPercent(c.share, 0)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}
