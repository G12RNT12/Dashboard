import { useId } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { useChartAnimation } from '@/hooks/useChartAnimation';
import { SERIES, svgId } from '@/lib/chartTheme';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

/** Mini gráfico de tendencia sin ejes (decorativo: el dato real está en el KPI). */
export function Sparkline({ data, color = SERIES[0], height = 44 }: SparklineProps) {
  const id = svgId(useId());
  const anim = useChartAnimation(150);
  const points = data.map((v, i) => ({ i, v }));

  return (
    <div aria-hidden="true" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 4, right: 0, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${id})`}
            dot={false}
            {...anim}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
