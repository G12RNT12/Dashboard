import { createContext } from 'react';
import type { Currency } from '@/lib/format';

export type ThemePreference = 'light' | 'dark' | 'system';
/** 'system' respeta prefers-reduced-motion; 'reduced' fuerza animaciones mínimas. */
export type MotionPreference = 'system' | 'reduced' | 'full';

export interface Settings {
  theme: ThemePreference;
  currency: Currency;
  motion: MotionPreference;
  sidebarCollapsed: boolean;
}

export const SETTINGS_STORAGE_KEY = 'dashboard:settings';

export const defaultSettings: Settings = {
  theme: 'system',
  currency: 'USD',
  motion: 'system',
  sidebarCollapsed: false,
};

export interface SettingsContextValue extends Settings {
  /** Tema efectivo tras resolver 'system'. */
  resolvedTheme: 'light' | 'dark';
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);
