import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { spring } from '@/lib/motion';
import { Brand } from './Brand';
import { NavList } from './NavList';
import { mainNav, secondaryNav } from './navigation';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

/** Menú deslizable para móvil y tablet (< lg). Se cierra con Escape, al tocar fuera o al navegar. */
export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={spring}
            className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col border-r border-line bg-surface px-3 shadow-lift"
          >
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar menú"
                className="grid size-10 place-items-center rounded-xl text-ink-muted hover:bg-surface-2 hover:text-ink"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="mt-4 flex flex-1 flex-col justify-between pb-6" aria-label="Secciones">
              <NavList items={mainNav} layoutGroup="mobile" onNavigate={onClose} />
              <div className="border-t border-line pt-3">
                <NavList items={secondaryNav} layoutGroup="mobile" onNavigate={onClose} />
              </div>
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
