import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { useFilters } from '@/hooks/useFilters';
import { pageVariants } from '@/lib/motion';
import { Header } from './Header';
import { MobileSidebar } from './MobileSidebar';
import { Sidebar } from './Sidebar';

export function MainLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const { setSearch } = useFilters();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = useCallback(() => setMobileOpen(false), []);

  // Al cambiar de página: limpiar la búsqueda y volver arriba.
  useEffect(() => {
    setSearch('');
    window.scrollTo({ top: 0 });
  }, [location.pathname, setSearch]);

  return (
    <div className="flex min-h-screen bg-canvas">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lift"
      >
        Saltar al contenido
      </a>

      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={closeMenu} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMenu={() => setMobileOpen(true)} />
        <main
          id="contenido"
          tabIndex={-1}
          className="flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
