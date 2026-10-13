import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { spring } from '@/lib/motion';
import type { NavItem } from './navigation';

interface NavListProps {
  items: NavItem[];
  collapsed?: boolean;
  /** Distingue el indicador animado del sidebar de escritorio y del móvil. */
  layoutGroup: string;
  onNavigate?: () => void;
}

/** Lista de enlaces con indicador activo animado (se desliza entre elementos). */
export function NavList({ items, collapsed = false, layoutGroup, onNavigate }: NavListProps) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ to, label, icon: Icon }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            aria-label={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                'group relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors',
                isActive ? 'text-ink' : 'text-ink-muted hover:bg-surface-2 hover:text-ink',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId={`nav-active-${layoutGroup}`}
                    transition={spring}
                    className="absolute inset-0 rounded-xl bg-brand-violet/10 ring-1 ring-brand-violet/25 dark:bg-brand-violet/15"
                  />
                )}
                <Icon
                  aria-hidden="true"
                  className={cn(
                    'relative size-5 shrink-0 transition-colors',
                    isActive ? 'text-brand-violet' : 'text-ink-subtle group-hover:text-ink',
                  )}
                />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.15 }}
                      className="relative whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
