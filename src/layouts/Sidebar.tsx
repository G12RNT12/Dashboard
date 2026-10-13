import { motion } from 'framer-motion';
import { PanelLeftClose } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { spring } from '@/lib/motion';
import { Brand } from './Brand';
import { NavList } from './NavList';
import { mainNav, secondaryNav } from './navigation';

/** Sidebar de escritorio (≥ lg). Se colapsa animando su ancho; el estado se guarda en ajustes. */
export function Sidebar() {
  const { sidebarCollapsed: collapsed, update } = useSettings();
  const label = collapsed ? 'Expandir menú lateral' : 'Contraer menú lateral';

  return (
    <motion.aside
      aria-label="Navegación principal"
      initial={false}
      animate={{ width: collapsed ? 76 : 248 }}
      transition={spring}
      className="sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-line/80 bg-surface/70 px-3 backdrop-blur-xl lg:flex"
    >
      <Brand collapsed={collapsed} />

      <nav className="mt-4 flex flex-1 flex-col justify-between pb-4" aria-label="Secciones">
        <NavList items={mainNav} collapsed={collapsed} layoutGroup="desktop" />
        <div className="flex flex-col gap-1 border-t border-line/80 pt-3">
          <NavList items={secondaryNav} collapsed={collapsed} layoutGroup="desktop" />
          <button
            type="button"
            onClick={() => update({ sidebarCollapsed: !collapsed })}
            aria-label={label}
            aria-expanded={!collapsed}
            title={label}
            className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <motion.span
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={spring}
              className="grid shrink-0 place-items-center"
            >
              <PanelLeftClose className="size-5" aria-hidden="true" />
            </motion.span>
            {!collapsed && <span className="whitespace-nowrap">Contraer</span>}
          </button>
        </div>
      </nav>
    </motion.aside>
  );
}
