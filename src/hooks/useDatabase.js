import { DEFAULT_PROJECTS, DEFAULT_TASKS, DEFAULT_TEAM } from '../utils/constants';
import { generateBackupFileName } from '../utils/helpers';
import { isDemoMode } from '../utils/demo';

const STORE_KEYS = {
  PROJECTS: 'projectflow-projects',
  TASKS: 'projectflow-tasks',
  TEAM: 'projectflow-team',
  ACTIVE_PROJECT: 'projectflow-active-project',
  ACTIVE_VIEW: 'projectflow-active-view',
  SIDEBAR_COLLAPSED: 'projectflow-sidebar-collapsed',
  MOBILE_MENU: 'projectflow-mobile-menu',
  FILTERS: 'projectflow-filters',
  LANGUAGE: 'projectflow-language',
  LAST_BACKUP: 'projectflow-last-backup-date',
  BACKUP_REMINDER_DAYS: 'projectflow-backup-reminder-days',
};

// In-memory fallback in case storage is disabled or restricted
const memoryStorage = new Map();

/**
 * Resolves the appropriate storage engine:
 * - In Live Demo Mode (e.g. Vercel), uses sessionStorage so data is ephemeral
 * - In Full Mode (local ProjectFlow.html / localhost), uses localStorage for permanent storage
 */
function getActiveStorage() {
  if (typeof window === 'undefined') return null;
  try {
    if (isDemoMode() && window.sessionStorage) {
      return window.sessionStorage;
    }
    if (window.localStorage) {
      return window.localStorage;
    }
  } catch (err) {
    console.warn('[ProjectFlow] Storage access error:', err);
  }
  return null;
}

/**
 * Safe storage reader compatible with file:// URLs and session isolation
 */
function getStorageItem(key) {
  try {
    const storage = getActiveStorage();
    if (storage) {
      const val = storage.getItem(key);
      if (val !== null && val !== undefined) {
        return JSON.parse(val);
      }
    }
  } catch (err) {
    console.warn(`[ProjectFlow] Storage read error for ${key}:`, err);
  }
  return memoryStorage.get(key) || null;
}

/**
 * Safe storage writer compatible with file:// URLs and session isolation
 */
function setStorageItem(key, data) {
  try {
    const storage = getActiveStorage();
    if (storage) {
      storage.setItem(key, JSON.stringify(data));
      return;
    }
  } catch (err) {
    console.warn(`[ProjectFlow] Storage write error for ${key}:`, err);
  }
  memoryStorage.set(key, data);
}

/**
 * Loads all app data instantly from local storage with fallback defaults
 */
export async function loadAllData() {
  try {
    const projects = getStorageItem(STORE_KEYS.PROJECTS) || DEFAULT_PROJECTS;
    const tasks = getStorageItem(STORE_KEYS.TASKS) || DEFAULT_TASKS;
    const team = getStorageItem(STORE_KEYS.TEAM) || DEFAULT_TEAM;

    const activeProjectId = getStorageItem(STORE_KEYS.ACTIVE_PROJECT) || 'all';
    const activeView = getStorageItem(STORE_KEYS.ACTIVE_VIEW) || 'dashboard';
    const sidebarCollapsed = getStorageItem(STORE_KEYS.SIDEBAR_COLLAPSED) ?? false;
    const mobileMenuOpen = getStorageItem(STORE_KEYS.MOBILE_MENU) ?? false;

    const filters = getStorageItem(STORE_KEYS.FILTERS) || {
      project: 'all',
      status: 'all',
      priority: 'all',
      member: 'all',
      search: '',
    };
    const language = getStorageItem(STORE_KEYS.LANGUAGE) || 'en';
    const lastBackupDate = getStorageItem(STORE_KEYS.LAST_BACKUP) || null;
    const backupReminderDays = getStorageItem(STORE_KEYS.BACKUP_REMINDER_DAYS) ?? 7;

    return {
      projects,
      tasks,
      team,
      activeProjectId,
      activeView,
      sidebarCollapsed,
      mobileMenuOpen,
      filters,
      language,
      lastBackupDate,
      backupReminderDays,
    };
  } catch (error) {
    console.error('[ProjectFlow] Error loading data from storage:', error);
    // Always return full valid defaults so the app never breaks
    return {
      projects: DEFAULT_PROJECTS,
      tasks: DEFAULT_TASKS,
      team: DEFAULT_TEAM,
      activeProjectId: 'all',
      activeView: 'dashboard',
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      filters: { project: 'all', status: 'all', priority: 'all', member: 'all', search: '' },
      language: 'en',
      lastBackupDate: null,
      backupReminderDays: 7,
    };
  }
}

/**
 * Saves a specific piece of data to storage
 */
export async function saveToDB(key, data) {
  setStorageItem(key, data);
}

export { STORE_KEYS };

/**
 * Export all app data as JSON (for local file export)
 * Generates a timestamped filename with date and time (e.g. ProjectFlow_Backup_2026-10-21_22-30-15.json)
 */
export async function exportAppData() {
  if (isDemoMode()) {
    return {
      success: false,
      demoBlocked: true,
      message: 'Workspace JSON export is disabled in the Live Demo. Please purchase the full edition on Etsy.',
    };
  }

  const data = await loadAllData();
  const timestamp = new Date().toISOString();
  const fileName = generateBackupFileName();

  const exportPayload = {
    ...data,
    backupMetadata: {
      exportedAt: timestamp,
      appName: 'ProjectFlow',
      version: '2.0',
      fileName,
    }
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Update last backup date in persistent storage
  setStorageItem(STORE_KEYS.LAST_BACKUP, timestamp);

  return { success: true, timestamp, fileName };
}

/**
 * Import app data from JSON
 */
export async function importAppData(jsonString) {
  if (isDemoMode()) {
    return {
      success: false,
      demoBlocked: true,
      error: 'Workspace import is disabled in the Live Demo. Please purchase the full edition on Etsy.',
    };
  }

  try {
    const data = JSON.parse(jsonString);
    if (data.projects) setStorageItem(STORE_KEYS.PROJECTS, data.projects);
    if (data.tasks) setStorageItem(STORE_KEYS.TASKS, data.tasks);
    if (data.team) setStorageItem(STORE_KEYS.TEAM, data.team);
    if (data.activeProjectId) setStorageItem(STORE_KEYS.ACTIVE_PROJECT, data.activeProjectId);
    if (data.activeView) setStorageItem(STORE_KEYS.ACTIVE_VIEW, data.activeView);
    if (data.sidebarCollapsed !== undefined) setStorageItem(STORE_KEYS.SIDEBAR_COLLAPSED, data.sidebarCollapsed);
    if (data.mobileMenuOpen !== undefined) setStorageItem(STORE_KEYS.MOBILE_MENU, data.mobileMenuOpen);
    if (data.filters) setStorageItem(STORE_KEYS.FILTERS, data.filters);
    if (data.language) setStorageItem(STORE_KEYS.LANGUAGE, data.language);
    if (data.lastBackupDate) setStorageItem(STORE_KEYS.LAST_BACKUP, data.lastBackupDate);
    if (data.backupReminderDays !== undefined) setStorageItem(STORE_KEYS.BACKUP_REMINDER_DAYS, data.backupReminderDays);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
