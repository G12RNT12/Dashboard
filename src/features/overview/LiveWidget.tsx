import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { Card } from '@/components/Card';
import { ChartTooltip } from '@/components/ChartTooltip';
import { useLiveMetrics } from '@/hooks/useLiveMetrics';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SERIES, axisProps, cursorLine, gridProps } from '@/lib/chartTheme';
import { cn } from '@/lib/cn';
import { formatNumber } from '@/lib/format';

const color = SERIES[1];
const formatInt = (n: number) => formatNumber(n);
const formatRate = (n: number) => formatNumber(n, { decimals: 1 });

/** Widget "en vivo": visitantes activos, actualizado cada 3 s con un pulso al llegar cada dato. */
export function LiveWidget() {
  const [paused, setPaused] = useState(false);
  const { points, latest, delta } = useLiveMetrics({ paused });
  const reduced = useReducedMotion();
  const lastIndex = points.length - 1;

  return (
    <Card hover={false} className="flex flex-col p-5 sm:p-6">
      <section aria-labelledby="live-title" className="flex flex-1 flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id="live-title"
              className="flex items-center gap-2 text-[15px] font-semibold text-ink"
            >
              <span className="relative flex size-2.5" aria-hidden="true">
                {!paused && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                )}
                <span
                  className={cn(
                    'relative inline-flex size-2.5 rounded-full',
                    paused ? 'bg-ink-subtle' : 'bg-emerald-500',
                  )}
                />
              </span>
              En vivo
            </h2>
            <p className="mt-0.5 text-sm text-ink-subtle">
              {paused ? 'Actualización en pausa' : 'Se actualiza cada 3 segundos'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            {paused ? (
              <Play className="size-3.5" aria-hidden="true" />
            ) : (
              <Pause className="size-3.5" aria-hidden="true" />
            )}
            {paused ? 'Reanudar' : 'Pausar'}
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <Stat label="Visitantes ahora" pulseKey={latest.time} reduced={reduced}>
            <AnimatedNumber value={latest.visitors} format={formatInt} duration={0.6} />
            <span
              className={cn(
                'tabular ml-2 text-xs font-semibold',
                delta >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400',
              )}
            >
              {delta >= 0 ? '+' : '−'}
              {Math.abs(delta)}
            </span>
          </Stat>
          <Stat label="Pedidos por minuto" pulseKey={latest.time} reduced={reduced}>
            <AnimatedNumber value={latest.ordersPerMinute} format={formatRate} duration={0.6} />
          </Stat>
        </div>

        <div className="min-h-[180px] flex-1" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="label" {...axisProps} minTickGap={48} />
              <YAxis
                {...axisProps}
                width={36}
                domain={['dataMin - 20', 'dataMax + 20']}
                allowDecimals={false}
              />
              <Tooltip
                cursor={cursorLine}
                isAnimationActive={false}
                content={<ChartTooltip valueFormatter={(v) => formatNumber(v)} />}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                name="Visitantes"
                stroke={color}
                strokeWidth={2.5}
                isAnimationActive={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'rgb(var(--surface))' }}
                dot={(props: { cx?: number; cy?: number; index?: number }) =>
                  props.index === lastIndex && props.cx != null && props.cy != null ? (
                    <LastDot
                      key={`dot-${latest.time}`}
                      cx={props.cx}
                      cy={props.cy}
                      reduced={reduced}
                    />
                  ) : (
                    <g key={`dot-${props.index}`} />
                  )
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </Card>
  );
}

function Stat({
  label,
  pulseKey,
  reduced,
  children,
}: {
  label: string;
  pulseKey: number;
  reduced: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-2/70 px-3 py-2.5">
      {/* Destello sutil cada vez que llega un dato nuevo */}
      <AnimatePresence initial={false}>
        {!reduced && (
          <motion.span
            key={pulseKey}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{ backgroundColor: color }}
            initial={{ opacity: 0.16 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
      <p className="relative text-xs text-ink-muted">{label}</p>
      <p className="relative mt-0.5 flex items-baseline text-2xl font-semibold text-ink">
        {children}
      </p>
    </div>
  );
}

/** Último punto de la serie con un anillo que se expande (pulso). */
function LastDot({ cx, cy, reduced }: { cx: number; cy: number; reduced: boolean }) {
  return (
    <g>
      {!reduced && (
        <motion.circle
          cx={cx}
          cy={cy}
          fill={color}
          initial={{ r: 4, opacity: 0.5 }}
          animate={{ r: 16, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      )}
      <circle cx={cx} cy={cy} r={4.5} fill={color} stroke="rgb(var(--surface))" strokeWidth={2} />
    </g>
  );
}
