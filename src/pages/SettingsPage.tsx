import { AnimatePresence, motion } from 'framer-motion';
import { Check, Monitor, Moon, RotateCcw, Sun, type LucideIcon } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Card } from '@/components/Card';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader';
import type { MotionPreference, ThemePreference } from '@/context/settings';
import { useSettings } from '@/hooks/useSettings';
import { cn } from '@/lib/cn';
import { currencyOptions, formatCurrency, type Currency } from '@/lib/format';

const THEMES: Array<{ value: ThemePreference; label: string; icon: LucideIcon }> = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Oscuro', icon: Moon },
  { value: 'system', label: 'Como el sistema', icon: Monitor },
];

const MOTION: Array<{ value: MotionPreference; label: string; hint: string }> = [
  {
    value: 'system',
    label: 'Como el sistema',
    hint: 'Respeta la opción "reducir movimiento" del sistema operativo.',
  },
  { value: 'full', label: 'Completas', hint: 'Todas las transiciones y gráficos animados.' },
  {
    value: 'reduced',
    label: 'Reducidas',
    hint: 'Sin desplazamientos ni dibujo progresivo de gráficos.',
  },
];

export function SettingsPage() {
  const settings = useSettings();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Mensaje breve de confirmación tras cada cambio (se guarda solo en localStorage).
  useEffect(() => {
    if (savedAt === null) return;
    const id = window.setTimeout(() => setSavedAt(null), 1800);
    return () => window.clearTimeout(id);
  }, [savedAt]);

  const update: typeof settings.update = (patch) => {
    settings.update(patch);
    setSavedAt(Date.now());
  };

  return (
    <Page className="max-w-3xl">
      <PageHeader
        title="Configuración"
        description="Las preferencias se guardan en este navegador."
        actions={
          <div aria-live="polite" className="h-6">
            <AnimatePresence>
              {savedAt && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                >
                  <Check className="size-4" aria-hidden="true" />
                  Preferencias guardadas
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        }
      />

      <Section title="Tema" description="Cómo se ve el panel.">
        <fieldset>
          <legend className="sr-only">Tema</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <OptionCard
                key={value}
                name="theme"
                checked={settings.theme === value}
                onChange={() => update({ theme: value })}
              >
                <Icon className="size-5 text-ink-subtle" aria-hidden="true" />
                <span className="font-medium text-ink">{label}</span>
              </OptionCard>
            ))}
          </div>
        </fieldset>
      </Section>

      <Section
        title="Moneda"
        description="Los importes se convierten con un tipo de cambio fijo de demostración."
      >
        <label htmlFor="currency" className="mb-1.5 block text-sm font-medium text-ink">
          Moneda de los importes
        </label>
        <select
          id="currency"
          value={settings.currency}
          onChange={(e) => update({ currency: e.target.value as Currency })}
          className="h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink sm:max-w-xs"
        >
          {(Object.keys(currencyOptions) as Currency[]).map((c) => (
            <option key={c} value={c}>
              {currencyOptions[c].label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-ink-subtle">
          Ejemplo: {formatCurrency(1234.5, settings.currency, { decimals: true })}
        </p>
      </Section>

      <Section title="Animaciones" description="Reduce el movimiento si te distrae o te marea.">
        <fieldset>
          <legend className="sr-only">Animaciones</legend>
          <div className="grid gap-3">
            {MOTION.map((m) => (
              <OptionCard
                key={m.value}
                name="motion"
                checked={settings.motion === m.value}
                onChange={() => update({ motion: m.value })}
                row
              >
                <span>
                  <span className="block font-medium text-ink">{m.label}</span>
                  <span className="block text-sm text-ink-subtle">{m.hint}</span>
                </span>
              </OptionCard>
            ))}
          </div>
        </fieldset>
      </Section>

      <Card
        hover={false}
        className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Restablecer preferencias</h2>
          <p className="mt-0.5 text-sm text-ink-subtle">
            Vuelve al tema del sistema, dólares y animaciones por defecto.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            settings.reset();
            setSavedAt(Date.now());
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-2"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Restablecer
        </button>
      </Card>
    </Page>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card hover={false} className="p-5 sm:p-6">
      <section>
        <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
        <p className="mb-4 mt-0.5 text-sm text-ink-subtle">{description}</p>
        {children}
      </section>
    </Card>
  );
}

/** Opción tipo tarjeta basada en un radio nativo (teclado y lectores de pantalla gratis). */
function OptionCard({
  name,
  checked,
  onChange,
  row = false,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  row?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      className={cn(
        'relative flex cursor-pointer gap-3 rounded-xl border p-4 text-sm transition-colors',
        row ? 'items-start' : 'flex-col items-start',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-violet',
        checked
          ? 'border-brand-violet/60 bg-brand-violet/[0.06]'
          : 'border-line hover:border-ink-subtle/40 hover:bg-surface-2/50',
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {row && (
        <span
          aria-hidden="true"
          className={cn(
            'mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border-2',
            checked ? 'border-brand-violet' : 'border-ink-subtle/50',
          )}
        >
          {checked && <span className="size-1.5 rounded-full bg-brand-violet" />}
        </span>
      )}
      {children}
      {!row && checked && (
        <Check className="absolute right-3 top-3 size-4 text-brand-violet" aria-hidden="true" />
      )}
    </label>
  );
}
