import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import { brand, chartSeries, status } from './src/theme/palette';

/** Las superficies cambian con el tema, así que se leen de variables CSS (src/index.css). */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand,
        status,
        chart: Object.fromEntries(chartSeries.map((c, i) => [String(i + 1), c])),
        canvas: token('canvas'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        line: token('line'),
        ink: token('ink'),
        'ink-muted': token('ink-muted'),
        'ink-subtle': token('ink-subtle'),
      },
      boxShadow: {
        card: '0 1px 2px rgb(15 23 42 / 0.04), 0 4px 16px -4px rgb(15 23 42 / 0.08)',
        lift: '0 2px 4px rgb(15 23 42 / 0.06), 0 16px 32px -8px rgb(15 23 42 / 0.18)',
        glow: '0 0 0 1px rgb(139 92 246 / 0.25), 0 12px 40px -12px rgb(139 92 246 / 0.45)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
