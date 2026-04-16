import { useEffect, useState } from 'react';
import type { Theme } from '../components/app/theme';

const readStoredTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return (window.localStorage.getItem('leetnotes-theme') as Theme) || 'light';
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    window.localStorage.setItem('leetnotes-theme', theme);

    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-eyecare');
    root.classList.add(`theme-${theme}`);

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return { theme, setTheme };
};
