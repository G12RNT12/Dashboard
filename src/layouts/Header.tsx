import { Menu, Search, X } from 'lucide-react';
import { RangeSelector } from '@/components/RangeSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useFilters } from '@/hooks/useFilters';

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { search, setSearch } = useFilters();

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menú"
          className="grid size-10 place-items-center rounded-xl border border-line bg-surface text-ink-muted hover:text-ink lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>

        <div
          role="search"
          className="order-last w-full sm:order-none sm:w-auto sm:max-w-sm sm:flex-1"
        >
          <label htmlFor="global-search" className="sr-only">
            Buscar en las tablas
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
              aria-hidden="true"
            />
            <input
              id="global-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar pedidos, clientes o productos"
              className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-9 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-violet/60 [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Borrar búsqueda"
                className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-ink-subtle hover:text-ink"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <RangeSelector />
          <ThemeToggle />
          <div className="flex items-center gap-3 pl-1">
            <span
              className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-brand-violet to-brand-cyan text-sm font-semibold text-white"
              aria-hidden="true"
            >
              AL
            </span>
            <div className="hidden leading-tight xl:block">
              <p className="text-sm font-medium text-ink">Alex López</p>
              <p className="text-xs text-ink-subtle">Administración</p>
            </div>
            <span className="sr-only">Sesión iniciada como Alex López</span>
          </div>
        </div>
      </div>
    </header>
  );
}
