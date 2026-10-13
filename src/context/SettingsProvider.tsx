import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { SETTINGS_STORAGE_KEY, SettingsContext, defaultSettings, type Settings } from './settings';

function readStoredSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw
      ? { ...defaultSettings, ...(JSON.parse(raw) as Partial<Settings>) }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(readStoredSettings);
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
  const resolvedTheme: 'light' | 'dark' =
    settings.theme === 'system' ? (systemDark ? 'dark' : 'light') : settings.theme;

  // Persistencia en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Modo privado o almacenamiento lleno: la app sigue funcionando en memoria.
    }
  }, [settings]);

  // Aplica el tema a <html> con una transición de color temporal
  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    if (isDark === (resolvedTheme === 'dark')) return;
    root.classList.add('theme-transition');
    root.classList.toggle('dark', resolvedTheme === 'dark');
    const id = window.setTimeout(() => root.classList.remove('theme-transition'), 400);
    return () => window.clearTimeout(id);
  }, [resolvedTheme]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);
  const reset = useCallback(() => setSettings(defaultSettings), []);

  const value = useMemo(
    () => ({ ...settings, resolvedTheme, update, reset }),
    [settings, resolvedTheme, update, reset],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
