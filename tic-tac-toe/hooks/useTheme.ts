import { useGameStore } from './useGameStore';

type Theme = 'dark' | 'light';

export function useTheme() {
  const { theme, crtEnabled, setTheme, toggleCRT } = useGameStore();

  const colors = {
    dark: {
      bg: '#1a1a2e',
      bgSecondary: '#16213e',
      fg: '#00ff88',
      fgDim: '#00cc6a',
      accent: '#ff006e',
      accentDim: '#cc0058',
      grid: '#0f3460',
      xColor: '#00ff88',
      oColor: '#ff006e',
      winLine: '#ffbe0b',
      scanline: 'rgba(0, 255, 136, 0.08)',
      vignette: 'rgba(0, 0, 0, 0.6)',
    },
    light: {
      bg: '#f8f9fa',
      bgSecondary: '#e9ecef',
      fg: '#1a1a2e',
      fgDim: '#343a40',
      accent: '#ff006e',
      accentDim: '#cc0058',
      grid: '#dee2e6',
      xColor: '#00cc6a',
      oColor: '#cc0058',
      winLine: '#e85d04',
      scanline: 'rgba(0, 0, 0, 0.05)',
      vignette: 'rgba(0, 0, 0, 0.15)',
    },
  } as const;

  return {
    theme,
    crtEnabled,
    colors: colors[theme as Theme],
    setTheme,
    toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    toggleCRT,
    isDark: theme === 'dark',
  };
}
