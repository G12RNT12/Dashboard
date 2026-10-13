import type { ThemePreference } from '@/context/settings';
import { useSettings } from './useSettings';

/** Tema actual y acciones para cambiarlo. */
export function useTheme() {
  const { theme, resolvedTheme, update } = useSettings();
  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    setTheme: (next: ThemePreference) => update({ theme: next }),
    toggle: () => update({ theme: resolvedTheme === 'dark' ? 'light' : 'dark' }),
  };
}
