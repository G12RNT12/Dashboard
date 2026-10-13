import { animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { easeOut } from '@/lib/motion';

interface AnimatedNumberProps {
  value: number;
  format: (n: number) => string;
  /** Duración en segundos. */
  duration?: number;
  className?: string;
}

/**
 * Número que cuenta desde 0 (o desde el valor anterior) hasta `value`.
 * Escribe directamente en el DOM en cada frame para no re-renderizar React.
 * Los lectores de pantalla solo leen el valor final.
 */
export function AnimatedNumber({ value, format, duration = 1.2, className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(0);
  const current = useRef(0);
  const formatRef = useRef(format);
  const reduced = useReducedMotion();

  // Si cambia el formato (p. ej. la moneda) se repinta sin reiniciar la animación.
  useEffect(() => {
    formatRef.current = format;
    if (ref.current) ref.current.textContent = format(current.current);
  }, [format]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced) {
      current.current = from.current = value;
      node.textContent = formatRef.current(value);
      return;
    }
    const controls = animate(from.current, value, {
      duration,
      ease: easeOut,
      onUpdate: (v) => {
        current.current = v;
        node.textContent = formatRef.current(v);
      },
    });
    from.current = value;
    return () => controls.stop();
  }, [value, duration, reduced]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true" className="tabular">
        {format(reduced ? value : 0)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
