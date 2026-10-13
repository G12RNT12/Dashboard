import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/cn';

/**
 * Contenedor de página: orquesta la entrada escalonada de todas las tarjetas
 * hijas que usen la variante `fadeUp` (Card, ChartCard, PageHeader…).
 */
export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={cn('mx-auto flex w-full max-w-[1440px] flex-col gap-6', className)}
    >
      {children}
    </motion.div>
  );
}
