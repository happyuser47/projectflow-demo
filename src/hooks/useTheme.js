import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for dark/light theme toggle with localStorage persistence
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('projectflow-theme');
      if (saved !== null) return JSON.parse(saved);
      // Default to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('projectflow-theme', JSON.stringify(isDark));
    } catch (e) {
      console.warn('Failed to persist theme:', e);
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  return { isDark, toggleTheme };
}
