import { ChevronDown } from 'lucide-react';
import { useId } from 'react';

interface FilterSelectProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
}

/** Select nativo con estilo del tema (accesible y usable en móvil sin librerías). */
export function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps<T>) {
  const id = useId();
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-9 w-full appearance-none rounded-lg border border-line bg-surface pl-3 pr-8 text-sm text-ink transition-colors hover:border-ink-subtle/50 sm:w-auto"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
        aria-hidden="true"
      />
    </div>
  );
}
