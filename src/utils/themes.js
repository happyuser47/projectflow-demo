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
    sidebar: {
      bg: 'linear-gradient(180deg, #132440 0%, #0d192d 100%)',
      bgDark: 'linear-gradient(180deg, #0f1c32 0%, #080f1b 100%)',
      border: 'rgba(52, 120, 245, 0.22)',
      textMuted: '#9cb1d4',
    },
  },
  {
    id: 'blush',
    name: 'Blush Pink',
    primary: '#e88fa8',
    hover: '#d4758f',
    description: 'Soft, aesthetic & warm pastel rose',
    sidebar: {
      bg: 'linear-gradient(180deg, #3b1725 0%, #270e18 100%)',
      bgDark: 'linear-gradient(180deg, #280e18 0%, #18070e 100%)',
      border: 'rgba(232, 143, 168, 0.22)',
      textMuted: '#dbb9c3',
    },
  },
  {
    id: 'sage',
    name: 'Sage Green',
    primary: '#6f9b82',
    hover: '#5b866e',
    description: 'Calm, organic & grounding herbal green',
    sidebar: {
      bg: 'linear-gradient(180deg, #1b3226 0%, #112018 100%)',
      bgDark: 'linear-gradient(180deg, #14251c 0%, #0b1510 100%)',
      border: 'rgba(111, 155, 130, 0.22)',
      textMuted: '#b0cbbe',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    primary: '#9b83d1',
    hover: '#856bc0',
    description: 'Creative & balanced soft purple',
    sidebar: {
      bg: 'linear-gradient(180deg, #271b42 0%, #19102c 100%)',
      bgDark: 'linear-gradient(180deg, #1d1433 0%, #100a1e 100%)',
      border: 'rgba(155, 131, 209, 0.22)',
      textMuted: '#c5badf',
    },
  },
  {
    id: 'beige',
    name: 'Vanilla Beige',
    primary: '#a48a71',
    hover: '#8e735a',
    description: 'Warm, cozy & sophisticated earth tone',
    sidebar: {
      bg: 'linear-gradient(180deg, #33271d 0%, #221912 100%)',
      bgDark: 'linear-gradient(180deg, #241a12 0%, #150f09 100%)',
      border: 'rgba(164, 138, 113, 0.22)',
      textMuted: '#cdbfb2',
    },
  },
  {
    id: 'coral',
    name: 'Peach Coral',
    primary: '#d87d68',
    hover: '#c26652',
    description: 'Energetic, friendly & vibrant terracotta',
    sidebar: {
      bg: 'linear-gradient(180deg, #3a1d17 0%, #26110c 100%)',
      bgDark: 'linear-gradient(180deg, #2a140f 0%, #180905 100%)',
      border: 'rgba(216, 125, 104, 0.22)',
      textMuted: '#dfb7af',
    },
  },
  {
    id: 'teal',
    name: 'Mint Teal',
    primary: '#278f88',
    hover: '#1f7771',
    description: 'Deep, crisp & refreshing ocean teal',
    sidebar: {
      bg: 'linear-gradient(180deg, #103331 0%, #0a2120 100%)',
      bgDark: 'linear-gradient(180deg, #0c2624 0%, #061615 100%)',
      border: 'rgba(39, 143, 136, 0.22)',
      textMuted: '#9cc5c2',
    },
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    primary: '#8c4357',
    hover: '#763445',
    description: 'Luxurious, rich & bold wine berry',
    sidebar: {
      bg: 'linear-gradient(180deg, #3a1320 0%, #240a13 100%)',
      bgDark: 'linear-gradient(180deg, #280b15 0%, #16050b 100%)',
      border: 'rgba(140, 67, 87, 0.25)',
      textMuted: '#d4b4bc',
    },
  },
  {
    id: 'darkpro',
    name: 'Dark Pro',
    primary: '#a78bfa',
    hover: '#8b5cf6',
    description: 'High-contrast modern developer indigo-purple',
    sidebar: {
      bg: 'linear-gradient(180deg, #1b1b33 0%, #101021 100%)',
      bgDark: 'linear-gradient(180deg, #131326 0%, #0a0a16 100%)',
      border: 'rgba(167, 139, 250, 0.22)',
      textMuted: '#c5c4e8',
    },
  },
  {
    id: 'yellow',
    name: 'Butter Yellow',
    primary: '#b78b26',
    hover: '#9d751b',
    description: 'Warm golden amber & vintage mustard',
    sidebar: {
      bg: 'linear-gradient(180deg, #35260c 0%, #231805 100%)',
      bgDark: 'linear-gradient(180deg, #261a07 0%, #150e02 100%)',
      border: 'rgba(183, 139, 38, 0.22)',
      textMuted: '#d8c89f',
    },
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
 * Derives rich, theme-tailored sidebar gradient and colors
 */
export function getSidebarStylesForHex(hex) {
  if (!hex) {
    return PRESET_THEMES[0].sidebar;
  }
  const clean = hex.toLowerCase().trim();
  const match = PRESET_THEMES.find(t => t.primary.toLowerCase() === clean);
  if (match?.sidebar) {
    return match.sidebar;
  }

  const { r, g, b } = hexToRgb(clean);
  // Algorithmic deep theme tone for custom colors
  const rT = Math.max(14, Math.min(65, Math.round(r * 0.28)));
  const gT = Math.max(14, Math.min(65, Math.round(g * 0.28)));
  const bT = Math.max(18, Math.min(75, Math.round(b * 0.28)));

  const rB = Math.max(8, Math.min(42, Math.round(r * 0.16)));
  const gB = Math.max(8, Math.min(42, Math.round(g * 0.16)));
  const bB = Math.max(12, Math.min(50, Math.round(b * 0.16)));

  const rD = Math.max(5, Math.min(26, Math.round(r * 0.10)));
  const gD = Math.max(5, Math.min(26, Math.round(g * 0.10)));
  const bD = Math.max(7, Math.min(32, Math.round(b * 0.10)));

  return {
    bg: `linear-gradient(180deg, rgb(${rT}, ${gT}, ${bT}) 0%, rgb(${rB}, ${gB}, ${bB}) 100%)`,
    bgDark: `linear-gradient(180deg, rgb(${rB}, ${gB}, ${bB}) 0%, rgb(${rD}, ${gD}, ${bD}) 100%)`,
    border: `rgba(${r}, ${g}, ${b}, 0.22)`,
    textMuted: `rgba(${Math.min(255, r + 130)}, ${Math.min(255, g + 130)}, ${Math.min(255, b + 130)}, 0.72)`,
  };
}

/**
 * Injects CSS variables directly onto document root for instant live theming
 */
export function applyThemeCSS(primaryHex, hoverHex = null) {
  if (typeof document === 'undefined') return;

  const hex = primaryHex || '#3478f5';
  const hover = hoverHex || getHoverHex(hex);
  const { r, g, b } = hexToRgb(hex);
  const sidebarStyles = getSidebarStylesForHex(hex);

  const root = document.documentElement;
  root.style.setProperty('--theme-accent', hex);
  root.style.setProperty('--theme-accent-hover', hover);
  root.style.setProperty('--theme-accent-rgb', `${r}, ${g}, ${b}`);
  root.style.setProperty('--theme-accent-light', `rgba(${r}, ${g}, ${b}, 0.12)`);
  root.style.setProperty('--theme-accent-subtle', `rgba(${r}, ${g}, ${b}, 0.06)`);
  root.style.setProperty('--theme-accent-border', `rgba(${r}, ${g}, ${b}, 0.28)`);
  root.style.setProperty('--theme-accent-shadow', `rgba(${r}, ${g}, ${b}, 0.3)`);
  root.style.setProperty('--theme-accent-gradient', `linear-gradient(135deg, ${hex} 0%, ${hover} 100%)`);

  // Rich themed sidebar variables
  root.style.setProperty('--theme-sidebar-bg', sidebarStyles.bg);
  root.style.setProperty('--theme-sidebar-bg-dark', sidebarStyles.bgDark);
  root.style.setProperty('--theme-sidebar-border', sidebarStyles.border);
  root.style.setProperty('--theme-sidebar-text-muted', sidebarStyles.textMuted);
}

