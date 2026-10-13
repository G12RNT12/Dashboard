import { useReducedMotion } from './useReducedMotion';

/** Props comunes de animación para series de Recharts (dibujo progresivo ~1200 ms). */
export function useChartAnimation(delay = 0) {
  const reduced = useReducedMotion();
  return {
    isAnimationActive: !reduced,
    animationDuration: 1200,
    animationBegin: delay,
    animationEasing: 'ease-out' as const,
  };
}
