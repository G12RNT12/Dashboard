import { motion, type HTMLMotionProps } from 'framer-motion';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLMotionProps<'div'> {
  /** Eleva la tarjeta al pasar el ratón (sombra + desplazamiento + escala opcional). */
  hover?: 'lift' | 'lift-scale' | false;
}

/**
 * Superficie base de todas las tarjetas. Hereda la animación de entrada (fadeUp)
 * del contenedor escalonado de la página.
 */
export function Card({ hover = 'lift', className, children, ...rest }: CardProps) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={
        hover
          ? { y: -3, scale: hover === 'lift-scale' ? 1.02 : 1, transition: { duration: 0.2 } }
          : undefined
      }
      className={cn(
        'relative rounded-2xl border border-line/80 bg-surface shadow-card',
        'transition-shadow duration-300',
        hover && 'hover:shadow-lift',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
