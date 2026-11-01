import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

export const LightColors = {
  background: '#F8F9FD',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F4F9',
  surfaceTertiary: '#E8EDF5',
  border: '#E9ECF2',
  borderLight: '#F3F5F9',
  borderActive: '#FF2E93',

  textPrimary: '#1E232D',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  primary: '#FF2E93',
  primaryLight: '#FFF0F7',
  primaryHover: '#E82080',

  secondary: '#00D2D3',
  secondaryLight: '#E6FCFC',

  accent: '#A855F7',
  accentLight: '#F5EEFD',

  success: '#10B981',
  successLight: '#ECFDF5',

  warning: '#F59E0B',
  warningLight: '#FFFBEB',

  error: '#EF4444',
  errorLight: '#FEF2F2',

  tabBar: '#FFFFFF',
  tabIcon: '#94A3B8',
  tabIconActive: '#FF2E93',

  shadow: 'rgba(0, 0, 0, 0.05)',
  overlay: 'rgba(15, 23, 42, 0.4)',
  inputBg: '#FFFFFF',
};

export const DarkColors: typeof LightColors = {
  background: '#0F1218',
  surface: '#181C26',
  surfaceSecondary: '#212735',
  surfaceTertiary: '#2B3244',
  border: '#272E3F',
  borderLight: '#1E2433',
  borderActive: '#FF2E93',

  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',

  primary: '#FF2E93',
  primaryLight: '#2C1322',
  primaryHover: '#FF47A3',

  secondary: '#00D2D3',
  secondaryLight: '#0B292C',

  accent: '#A855F7',
  accentLight: '#231535',

  success: '#10B981',
  successLight: '#0A261D',

  warning: '#F59E0B',
  warningLight: '#2A1F0A',

  error: '#EF4444',
  errorLight: '#2D1214',

  tabBar: '#181C26',
  tabIcon: '#64748B',
  tabIconActive: '#FF2E93',

  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  inputBg: '#212735',
};

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  colors: typeof LightColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  colors: LightColors,
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const colors = mode === 'light' ? LightColors : DarkColors;
  const toggleTheme = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleTheme,
        colors,
        isDark: mode === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

