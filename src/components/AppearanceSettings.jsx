import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Check,
  Palette,
  Sparkles,
  Sliders,
} from 'lucide-react';

export default function AppearanceSettings() {
  const {
    themeId,
    setThemeId,
    customAccent,
    setCustomAccent,
    activeThemeObj,
    compactLayout,
    setCompactLayout,
    presetThemes,
    t,
  } = useApp();

  const [hexInput, setHexInput] = useState(customAccent || '#e88fa8');

  // Switch theme cleanly without popup toast notification
  const handleSelectTheme = (id) => {
    setThemeId(id);
    const selected = presetThemes.find((theme) => theme.id === id);
    if (selected) {
      setHexInput(selected.primary);
    }
  };

  const handleHexInputChange = (e) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setCustomAccent(val);
    }
  };

  const handleColorPickerChange = (e) => {
    const val = e.target.value;
    setHexInput(val);
    setCustomAccent(val);
  };

  return (
    <div className="space-y-6 animate-fade-in w-full max-w-4xl mx-auto pb-12">
      {/* Main Appearance Settings Card */}
      <div className="glass-card p-5 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm bg-white dark:bg-navy-900/90">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-colors"
              style={{ backgroundColor: activeThemeObj.primary }}
            >
              <Palette size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('appearance_settings') === 'appearance_settings' ? 'Appearance Settings' : t('appearance_settings')}
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t('choose_aesthetic') === 'choose_aesthetic' ? 'Choose your workspace aesthetic' : t('choose_aesthetic')}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors border"
              style={{
                backgroundColor: 'var(--theme-accent-light)',
                color: 'var(--theme-accent)',
                borderColor: 'var(--theme-accent-border)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--theme-accent)' }}
              />
              <span>{activeThemeObj.name}</span>
            </span>
          </div>
        </div>

        {/* 10 Designer Themes Grid */}
        <div className="pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles size={13} style={{ color: activeThemeObj.primary }} />
              <span>{t('theme_palettes') === 'theme_palettes' ? '10 Premium Themes' : t('theme_palettes')}</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              Active: <strong style={{ color: activeThemeObj.primary }}>{activeThemeObj.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-3.5">
            {presetThemes.map((theme) => {
              const isSelected = themeId === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`group relative p-3.5 sm:p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                    isSelected
                      ? 'bg-slate-100/90 dark:bg-navy-800 border-2 shadow-sm scale-[1.02]'
                      : 'bg-white dark:bg-navy-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/70 dark:hover:bg-navy-700/60'
                  }`}
                  style={{
                    borderColor: isSelected ? theme.primary : undefined,
                    boxShadow: isSelected ? `0 4px 14px ${theme.primary}25` : undefined,
                  }}
                  title={`${theme.name} (${theme.primary})`}
                >
                  {/* Swatch Circle with Checkmark when selected */}
                  <div
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {isSelected && (
                      <Check
                        size={18}
                        className="text-white drop-shadow stroke-[3] animate-scale-in"
                      />
                    )}
                  </div>

                  {/* Theme Name */}
                  <div className="min-w-0 w-full">
                    <p
                      className={`text-xs font-bold truncate ${
                        isSelected
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                      }`}
                    >
                      {theme.name}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 dark:text-slate-400 uppercase mt-0.5">
                      {theme.primary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Accent Color & Compact Layout Row */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Custom Accent Color Picker */}
          <div className="space-y-1.5">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {t('custom_accent') === 'custom_accent' ? 'Custom Accent Color' : t('custom_accent')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('try_own_hex') === 'try_own_hex' ? 'Try your own HEX color' : t('try_own_hex')}
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <label
                className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-600 shadow-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-105 flex-shrink-0"
                style={{ backgroundColor: activeThemeObj.primary }}
                title="Click to open color picker"
              >
                <input
                  type="color"
                  value={activeThemeObj.primary}
                  onChange={handleColorPickerChange}
                  className="sr-only"
                />
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  placeholder="#E88FA8"
                  maxLength={7}
                  className="w-28 sm:w-32 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono font-bold uppercase text-xs tracking-wider text-center focus:outline-none focus:ring-2"
                  style={{
                    borderColor: themeId === 'custom' ? activeThemeObj.primary : undefined,
                  }}
                />
              </div>

              {themeId === 'custom' && (
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: 'var(--theme-accent-light)',
                    color: 'var(--theme-accent)',
                    borderColor: 'var(--theme-accent-border)',
                  }}
                >
                  Custom Active
                </span>
              )}
            </div>
          </div>

          {/* Compact Task Layout Setting */}
          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-navy-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
            <input
              type="checkbox"
              id="compactTaskLayout"
              checked={compactLayout}
              onChange={(e) => setCompactLayout(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-600 focus:ring-2 cursor-pointer"
              style={{ accentColor: activeThemeObj.primary }}
            />
            <label htmlFor="compactTaskLayout" className="text-xs cursor-pointer select-none">
              <span className="font-extrabold text-slate-800 dark:text-slate-100 block">
                {t('compact_task_layout') === 'compact_task_layout' ? 'Compact task layout' : t('compact_task_layout')}
              </span>
              <span className="text-slate-500 dark:text-slate-400 block mt-0.5 leading-normal">
                {t('compact_task_desc') === 'compact_task_desc'
                  ? 'Streamlined task card density for high-volume Kanban & Table workflows.'
                  : t('compact_task_desc')}
              </span>
            </label>
          </div>

        </div>

      </div>
    </div>
  );
}
