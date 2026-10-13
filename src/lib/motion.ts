import type { Transition, Variants } from 'framer-motion';

/** Curva "ease-out" suave usada en toda la app. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Contenedor que escalona la entrada de sus hijos. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

/** Entrada de cada tarjeta: fade + slide hacia arriba. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

/** Transición entre páginas. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn' } },
};

export const spring: Transition = { type: 'spring', stiffness: 380, damping: 32 };
