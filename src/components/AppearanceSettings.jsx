import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Check,
  Palette,
  Sparkles,
  Copy,
  Layers,
  LayoutDashboard,
  Calendar,
  Settings,
  CheckCircle2,
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
    showToast,
    isDark,
    t,
  } = useApp();

  const [hexInput, setHexInput] = useState(customAccent || '#e88fa8');
  const [copied, setCopied] = useState(false);

  const handleSelectTheme = (id) => {
    setThemeId(id);
    const selected = presetThemes.find((theme) => theme.id === id);
    if (selected) {
      setHexInput(selected.primary);
      showToast(
        selected.name,
        `Theme switched to ${selected.name}`,
        'magic'
      );
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

  const handleCopyPalette = async () => {
    const paletteText =
      `/* ProjectFlow Theme Palette: ${activeThemeObj.name} */\n` +
      `--theme-accent: ${activeThemeObj.primary};\n` +
      `--theme-accent-hover: ${activeThemeObj.hover};\n` +
      `Preset: ${themeId}\n` +
      `Mode: ${isDark ? 'Dark' : 'Light'}\n` +
      `Compact Layout: ${compactLayout ? 'Enabled' : 'Disabled'}`;

    try {
      await navigator.clipboard.writeText(paletteText);
      setCopied(true);
      showToast(
        t('theme_colors_copied') || 'Theme Colors Copied!',
        `${activeThemeObj.name} (${activeThemeObj.primary}) copied to clipboard.`,
        'success'
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in w-full max-w-4xl mx-auto pb-12">
      {/* 1. Header & Themes Section */}
      <div className="glass-card p-5 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm bg-white dark:bg-navy-900/90">
        {/* Title bar */}
        <div className="flex items-start justify-between gap-3 pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('appearance_settings') || 'Appearance Settings'}
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
              {t('choose_aesthetic') || 'Choose your workspace aesthetic'}
            </p>
          </div>

          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-500/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('live_preview') || 'Live preview'}</span>
            </span>
          </div>
        </div>

        {/* 10 Theme Cards in 2 Rows of 5 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-3.5">
          {presetThemes.map((theme) => {
            const isSelected = themeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleSelectTheme(theme.id)}
                className={`group relative p-3 sm:p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                  isSelected
                    ? 'bg-slate-50/90 dark:bg-navy-800 border-2 shadow-sm'
                    : 'bg-white dark:bg-navy-850/80 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50'
                }`}
                style={{
                  borderColor: isSelected ? theme.primary : undefined,
                  boxShadow: isSelected ? `0 4px 14px ${theme.primary}20` : undefined,
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
                </div>
              </button>
            );
          })}
        </div>

        {/* 2. Custom Accent Color Row */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {t('custom_accent') || 'Custom Accent Color'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('try_own_hex') || 'Try your own HEX color'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Color swatch picker trigger */}
            <label
              className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-600 shadow-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-105 flex-shrink-0"
              style={{ backgroundColor: activeThemeObj.primary }}
              title="Click to choose custom color"
            >
              <input
                type="color"
                value={activeThemeObj.primary}
                onChange={handleColorPickerChange}
                className="sr-only"
              />
            </label>

            {/* HEX Input */}
            <div className="relative">
              <input
                type="text"
                value={hexInput}
                onChange={handleHexInputChange}
                placeholder="#E88FA8"
                maxLength={7}
                className="w-28 sm:w-32 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-navy-950 text-slate-800 dark:text-slate-100 font-mono font-bold uppercase text-xs tracking-wider text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {themeId === 'custom' && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                Active
              </span>
            )}
          </div>
        </div>

        {/* 3. Compact Task Layout Toggle */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2.5 cursor-pointer select-none group w-fit">
            <span
              onClick={() => setCompactLayout(!compactLayout)}
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                compactLayout
                  ? 'border-transparent shadow-xs'
                  : 'border-slate-400 dark:border-slate-500 bg-white dark:bg-navy-800'
              }`}
              style={{
                backgroundColor: compactLayout ? activeThemeObj.primary : undefined,
              }}
            >
              {compactLayout && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
              {t('compact_task_layout') || 'Compact task layout'}
            </span>
          </label>
        </div>

        {/* 4. Mockup Dashboard Frame */}
        <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-lg bg-white dark:bg-navy-950 flex flex-col md:flex-row transition-all">
          {/* Mini Mockup Sidebar */}
          <div className="w-full md:w-48 bg-[#0b1222] text-slate-300 p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 flex-shrink-0">
            <div className="space-y-4">
              {/* Brand Logo */}
              <div className="flex items-center gap-2 px-1">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: activeThemeObj.primary }}
                >
                  <Layers size={12} />
                </div>
                <span className="text-xs font-black text-white tracking-tight">ProjectFlow</span>
              </div>

              {/* Navigation items */}
              <div className="space-y-1">
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs"
                  style={{ backgroundColor: activeThemeObj.primary }}
                >
                  <LayoutDashboard size={13} />
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200">
                  <span className="w-3.5 h-3.5 flex items-center justify-center">☰</span>
                  <span>Tasks</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200">
                  <Calendar size={13} />
                  <span>Calendar</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200">
                  <Settings size={13} />
                  <span>Settings</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
              © 2026 Grafitly
            </div>
          </div>

          {/* Mini Mockup Dashboard Body */}
          <div className="flex-1 p-5 sm:p-6 bg-slate-50/70 dark:bg-navy-900/90 space-y-4">
            {/* Header with Title & + New Task button */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Dashboard
              </h4>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs transition-transform cursor-default"
                style={{ backgroundColor: activeThemeObj.primary }}
              >
                <span>+ New Task</span>
              </button>
            </div>

            {/* Metric Cards Row */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-white dark:bg-navy-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Open Tasks
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  17
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-navy-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Completed
                </p>
                <p
                  className="text-2xl font-black mt-1"
                  style={{ color: activeThemeObj.primary }}
                >
                  3
                </p>
              </div>
            </div>

            {/* Project Progress Section */}
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-navy-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                  Project Progress
                </h5>
              </div>

              {/* Website 65% */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600 dark:text-slate-300">Website</span>
                  <span className="text-[11px] font-bold text-slate-500">65%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-navy-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: '65%', backgroundColor: activeThemeObj.primary }}
                  />
                </div>
              </div>

              {/* Mobile App 40% */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600 dark:text-slate-300">Mobile App</span>
                  <span className="text-[11px] font-bold text-slate-500">40%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-navy-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: '40%', backgroundColor: activeThemeObj.primary }}
                  />
                </div>
              </div>

              {/* API Integration 80% */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600 dark:text-slate-300">API Integration</span>
                  <span className="text-[11px] font-bold text-slate-500">80%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-navy-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: '80%', backgroundColor: activeThemeObj.primary }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Explanatory Subtitle / Caption matching Image 2 */}
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
          {t('theme_preview_desc') ||
            'Yeh conceptual preview hai. Theme select karke dekh sakte hain ke dashboard ka visual effect kaisa hota hai.'}
        </p>

        {/* 6. Copy Selected Theme Colors Button */}
        <div className="mt-4 pt-1 flex justify-center">
          <button
            type="button"
            onClick={handleCopyPalette}
            className="w-full py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white bg-black hover:bg-slate-900 active:scale-98 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>{t('copy_theme_colors') || 'Copy selected theme colors'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
