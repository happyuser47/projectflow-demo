import { useState, useEffect, useCallback, useMemo } from 'react';
import { PRESET_THEMES, applyThemeCSS, getHoverHex } from '../utils/themes';

/**
 * Custom hook for Workspace Appearance & Theme Management:
 * - Light / Dark Mode Toggle
 * - 10 Designer Color Themes (Ocean Blue, Blush Pink, Sage Green, etc.)
 * - Custom HEX Accent Color Picker
 * - Compact Task Layout Toggle
 * - Instant CSS variable injection on document root
 */
export function useTheme() {
  // 1. Dark mode state
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('projectflow-theme');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // 2. Active Theme ID ('ocean', 'blush', 'sage', ..., or 'custom')
  const [themeId, setThemeIdState] = useState(() => {
    try {
      const saved = localStorage.getItem('projectflow-theme-id');
      if (saved && (PRESET_THEMES.some(t => t.id === saved) || saved === 'custom')) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'ocean';
  });

  // 3. Custom Accent HEX (#E88FA8 default from designer specification)
  const [customAccent, setCustomAccentState] = useState(() => {
    try {
      const saved = localStorage.getItem('projectflow-custom-accent');
      if (saved && /^#[0-9A-Fa-f]{6}$/.test(saved)) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return '#e88fa8';
  });

  // 4. Compact Task Layout toggle
  const [compactLayout, setCompactLayoutState] = useState(() => {
    try {
      const saved = localStorage.getItem('projectflow-compact-layout');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Calculate the currently active primary & hover accent colors
  const activeThemeObj = useMemo(() => {
    if (themeId === 'custom') {
      return {
        id: 'custom',
        name: 'Custom',
        primary: customAccent,
        hover: getHoverHex(customAccent),
      };
    }
    return PRESET_THEMES.find(t => t.id === themeId) || PRESET_THEMES[0];
  }, [themeId, customAccent]);

  // Sync Dark Mode class with <html>
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
      console.warn('Failed to persist dark theme:', e);
    }
  }, [isDark]);

  // Sync Compact Layout class with <html>
  useEffect(() => {
    const root = document.documentElement;
    if (compactLayout) {
      root.classList.add('compact-layout');
    } else {
      root.classList.remove('compact-layout');
    }
    try {
      localStorage.setItem('projectflow-compact-layout', String(compactLayout));
    } catch (e) {
      console.warn('Failed to persist compact layout:', e);
    }
  }, [compactLayout]);

  // Sync Theme CSS Variables with document root whenever theme changes
  useEffect(() => {
    applyThemeCSS(activeThemeObj.primary, activeThemeObj.hover);
    try {
      localStorage.setItem('projectflow-theme-id', themeId);
      if (themeId === 'custom') {
        localStorage.setItem('projectflow-custom-accent', customAccent);
      }
    } catch (e) {
      console.warn('Failed to persist theme settings:', e);
    }
  }, [activeThemeObj, themeId, customAccent]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const setThemeId = useCallback((newId) => {
    setThemeIdState(newId);
  }, []);

  const setCustomAccent = useCallback((hex) => {
    setCustomAccentState(hex);
    setThemeIdState('custom');
  }, []);

  const setCompactLayout = useCallback((val) => {
    setCompactLayoutState(typeof val === 'function' ? val : !!val);
  }, []);

  return {
    isDark,
    toggleTheme,
    themeId,
    setThemeId,
    customAccent,
    setCustomAccent,
    activeThemeObj,
    compactLayout,
    setCompactLayout,
    presetThemes: PRESET_THEMES,
  };
}
