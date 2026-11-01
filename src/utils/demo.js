/**
 * ProjectFlow Demo Mode Utilities & Guardrails
 * 
 * Ensures prospective customers on Etsy can test drive every feature
 * on Vercel without being able to use it as a permanent free project manager.
 * 
 * CRITICAL GUARANTEE:
 * When running as a local file (ProjectFlow.html via file:// protocol) or local development,
 * isDemoMode() ALWAYS returns false, guaranteeing 100% unrestricted functionality
 * for paying customers.
 */

export const ETSY_STORE_URL = 'https://grafitly.etsy.com';

export const DEMO_CONFIG = {
  MAX_CUSTOM_TASKS: 3,
  MAX_CUSTOM_PROJECTS: 1,
};

/**
 * Robust detection of whether the application is running in Live Demo Mode.
 * 
 * Returns TRUE ONLY when:
 * 1. Running on Vercel (*.vercel.app or Vercel domains)
 * 2. Explicitly enabled via VITE_DEMO_MODE=true
 * 3. Testing locally with ?demo=true query param
 * 
 * Returns FALSE when:
 * 1. Opened as a local file (file:/// protocol) -> Purchased ProjectFlow.html
 * 2. Running on localhost / 127.0.0.1 (unless ?demo=true is explicitly set)
 */
export function isDemoMode() {
  if (typeof window === 'undefined') return false;

  // 1. Standalone local file (Purchased Etsy product): NEVER demo mode
  if (window.location.protocol === 'file:') {
    return false;
  }

  // 2. Explicit environment variable check (set in Vercel build or .env)
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    return true;
  }

  // 3. Local development check: only demo if explicitly requested via query param
  const hostname = (window.location.hostname || '').toLowerCase();
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
    return window.location.search.includes('demo=true');
  }

  // 4. Vercel deployment detection
  if (hostname.endsWith('.vercel.app') || hostname.includes('vercel')) {
    return true;
  }

  // 5. Any other remote web hosting (e.g., Netlify, Render, custom demo domains)
  return true;
}

