import { useMediaQuery } from './useMediaQuery';
import { useSettings } from './useSettings';

/**
 * true si hay que reducir animaciones: por preferencia del sistema
 * (prefers-reduced-motion) o porque el usuario lo eligió en Configuración.
 */
export function useReducedMotion(): boolean {
  const { motion } = useSettings();
  const systemReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  if (motion === 'reduced') return true;
  if (motion === 'full') return false;
  return systemReduced;
}
