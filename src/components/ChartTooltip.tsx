import { motion } from 'framer-motion';
import type { TooltipProps } from 'recharts';

interface ChartTooltipProps extends TooltipProps<number, string> {
  valueFormatter?: (value: number, name: string) => string;
  /** Título alternativo (por defecto, la etiqueta del eje X). */
  titleFormatter?: (label: string) => string;
  /** Fuerza el color del marcador cuando la serie usa un degradado (url(#…)). */
  colors?: Record<string, string>;
}

/**
 * Tooltip personalizado para todos los gráficos. Recharts le inyecta
 * `active`, `payload` y `label`; aparece con un pequeño fade + scale.
 */
export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = (v) => String(v),
  titleFormatter,
  colors,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const title = titleFormatter ? titleFormatter(String(label ?? '')) : label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className="min-w-[160px] rounded-xl border border-line bg-surface/95 px-3 py-2.5 shadow-lift backdrop-blur-md"
    >
      {title !== undefined && title !== '' && (
        <p className="mb-1.5 text-xs font-medium text-ink-muted">{title}</p>
      )}
      <ul className="space-y-1">
        {payload.map((item) => {
          const name = String(item.name ?? item.dataKey ?? '');
          const raw = colors?.[name] ?? item.color ?? (item.payload as { fill?: string })?.fill;
          const color = raw && !raw.startsWith('url') ? raw : undefined;
          return (
            <li key={name} className="flex items-center gap-2 text-sm">
              {color && (
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
              <span className="text-ink-muted">{name}</span>
              <span className="tabular ml-auto pl-3 font-semibold text-ink">
                {valueFormatter(Number(item.value ?? 0), name)}
              </span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
