/**
 * ProjectFlow - 10 Premium Themes & Appearance System
 * Accurately matching the 10 designer palettes:
 * Ocean Blue, Blush Pink, Sage Green, Lavender, Vanilla Beige,
 * Peach Coral, Mint Teal, Burgundy, Dark Pro, Butter Yellow.
 */

export const PRESET_THEMES = [
  {
    id: 'ocean',
    name: 'Ocean Blue',
    primary: '#3478f5',
    hover: '#2563eb',
    description: 'Vibrant & focused classic corporate blue',
  },
  {
    id: 'blush',
    name: 'Blush Pink',
    primary: '#e88fa8',
    hover: '#d4758f',
    description: 'Soft, aesthetic & warm pastel rose',
  },
  {
    id: 'sage',
    name: 'Sage Green',
    primary: '#6f9b82',
    hover: '#5b866e',
    description: 'Calm, organic & grounding herbal green',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    primary: '#9b83d1',
    hover: '#856bc0',
    description: 'Creative & balanced soft purple',
  },
  {
    id: 'beige',
    name: 'Vanilla Beige',
    primary: '#a48a71',
    hover: '#8e735a',
    description: 'Warm, cozy & sophisticated earth tone',
  },
  {
    id: 'coral',
    name: 'Peach Coral',
    primary: '#d87d68',
    hover: '#c26652',
    description: 'Energetic, friendly & vibrant terracotta',
  },
  {
    id: 'teal',
    name: 'Mint Teal',
    primary: '#278f88',
    hover: '#1f7771',
    description: 'Deep, crisp & refreshing ocean teal',
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    primary: '#8c4357',
    hover: '#763445',
    description: 'Luxurious, rich & bold wine berry',
  },
  {
    id: 'darkpro',
    name: 'Dark Pro',
    primary: '#a78bfa',
    hover: '#8b5cf6',
    description: 'High-contrast modern developer indigo-purple',
  },
  {
    id: 'yellow',
    name: 'Butter Yellow',
    primary: '#b78b26',
    hover: '#9d751b',
    description: 'Warm golden amber & vintage mustard',
  },
];

/**
 * Converts a hex color (#ffffff or #fff) to an {r, g, b} object
 */
export function hexToRgb(hex) {
  if (!hex) return { r: 52, g: 120, b: 245 };
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num) || cleanHex.length !== 6) {
    return { r: 52, g: 120, b: 245 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Derives a slightly darkened hover color from a hex
 */
export function getHoverHex(hex) {
  const { r, g, b } = hexToRgb(hex);
  const factor = 0.88;
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val * factor)));
  const rH = clamp(r).toString(16).padStart(2, '0');
  const gH = clamp(g).toString(16).padStart(2, '0');
  const bH = clamp(b).toString(16).padStart(2, '0');
  return `#${rH}${gH}${bH}`;
}

/**
 * Injects CSS variables directly onto document root for instant live theming
 */
export function applyThemeCSS(primaryHex, hoverHex = null) {
  if (typeof document === 'undefined') return;

  const hex = primaryHex || '#3478f5';
  const hover = hoverHex || getHoverHex(hex);
  const { r, g, b } = hexToRgb(hex);

  const root = document.documentElement;
  root.style.setProperty('--theme-accent', hex);
  root.style.setProperty('--theme-accent-hover', hover);
  root.style.setProperty('--theme-accent-rgb', `${r}, ${g}, ${b}`);
  root.style.setProperty('--theme-accent-light', `rgba(${r}, ${g}, ${b}, 0.12)`);
  root.style.setProperty('--theme-accent-subtle', `rgba(${r}, ${g}, ${b}, 0.06)`);
  root.style.setProperty('--theme-accent-border', `rgba(${r}, ${g}, ${b}, 0.28)`);
  root.style.setProperty('--theme-accent-shadow', `rgba(${r}, ${g}, ${b}, 0.3)`);
  root.style.setProperty('--theme-accent-gradient', `linear-gradient(135deg, ${hex} 0%, ${hover} 100%)`);
}

