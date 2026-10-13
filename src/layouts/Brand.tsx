import { AnimatePresence, motion } from 'framer-motion';

export function Brand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex h-16 items-center gap-3 px-3">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-violet to-brand-cyan text-white shadow-glow"
      >
        <svg viewBox="0 0 32 32" className="size-5" fill="none">
          <path
            d="M9 22V10l14 12V10"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="min-w-0 whitespace-nowrap leading-tight"
          >
            <p className="text-[15px] font-semibold text-ink">Nébula Shop</p>
            <p className="text-xs text-ink-subtle">Panel de ventas</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
