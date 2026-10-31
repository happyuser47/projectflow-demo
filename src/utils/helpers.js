import { differenceInDays, format, isAfter, isBefore, isToday, parseISO } from 'date-fns';

/**
 * Generate a unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get initials from a name (e.g., "Alice Chen" -> "AC")
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get relative due date text with internationalization support
 */
export function getRelativeDueDate(dateStr, t, lang = 'en') {
  if (!dateStr) return '';
  try {
    const date = parseISO(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = differenceInDays(date, today);

    if (diff < 0) {
      const overdueLabel = t ? t('overdue') : 'overdue';
      return `${Math.abs(diff)}d ${overdueLabel}`;
    }
    if (diff === 0) return t ? t('due_today') : 'Due today';
    if (diff === 1) return t ? t('due_tomorrow') : 'Due tomorrow';
    if (diff <= 7) {
      const leftLabel = t ? t('days_left') : 'left';
      return `${diff}d ${leftLabel}`;
    }
    const localeMap = { ja: 'ja-JP', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', en: 'en-US' };
    const locale = localeMap[lang] || 'en-US';
    return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date);
  } catch {
    return '';
  }
}

/**
 * Check if a date is overdue
 */
export function isOverdue(dateStr) {
  if (!dateStr) return false;
  try {
    const date = parseISO(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
  } catch {
    return false;
  }
}

/**
 * Calculate project completion percentage
 */
export function calculateProjectProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const done = tasks.filter(t => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

/**
 * Get overdue tasks (not done, end date past)
 */
export function getOverdueTasks(tasks) {
  if (!tasks) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return tasks.filter(t => {
    if (t.status === 'done' || !t.endDate) return false;
    try {
      return isBefore(parseISO(t.endDate), today);
    } catch {
      return false;
    }
  });
}

/**
 * Get tasks by status
 */
export function getTasksByStatus(tasks, status) {
  return tasks.filter(t => t.status === status);
}

/**
 * Get tasks for a specific project
 */
export function getProjectTasks(tasks, projectId) {
  if (!projectId || projectId === 'all') return tasks;
  return tasks.filter(t => t.projectId === projectId);
}

/**
 * Sort tasks by various fields
 */
export function sortTasks(tasks, sortField, sortDir = 'asc') {
  const sorted = [...tasks].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    
    if (sortField === 'priority') {
      const order = { urgent: 0, high: 1, medium: 2, low: 3 };
      valA = order[valA] ?? 4;
      valB = order[valB] ?? 4;
    }
    
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    
    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });
  
  return sortDir === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Format date for display with language locale support
 */
export function formatDate(dateStr, lang = 'en') {
  if (!dateStr) return '—';
  try {
    const localeMap = { ja: 'ja-JP', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', en: 'en-US' };
    const locale = localeMap[lang] || 'en-US';
    return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(parseISO(dateStr));
  } catch {
    return '—';
  }
}

/**
 * Format date short with language locale support
 */
export function formatDateShort(dateStr, lang = 'en') {
  if (!dateStr) return '—';
  try {
    const localeMap = { ja: 'ja-JP', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', en: 'en-US' };
    const locale = localeMap[lang] || 'en-US';
    return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(parseISO(dateStr));
  } catch {
    return '—';
  }
}

/**
 * Generate a timestamped backup filename including date and time
 * Example: ProjectFlow_Backup_2026-10-21_22-30-15.json
 */
export function generateBackupFileName() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `ProjectFlow_Backup_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.json`;
}

/**
 * Format backup timestamp into a clean, human-readable date & time
 */
export function formatBackupDate(isoString, lang = 'en') {
  if (!isoString) return null;
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return null;
    const localeMap = {
      ja: 'ja-JP',
      fr: 'fr-FR',
      de: 'de-DE',
      es: 'es-ES',
      en: 'en-US',
    };
    const locale = localeMap[lang] || 'en-US';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Get relative time description for backup (e.g. "Just now", "2 hours ago", "Yesterday")
 */
export function getRelativeBackupTime(isoString, t) {
  if (!isoString) return null;
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 2) return t ? t('just_now') : 'Just now';
    if (diffMins < 60) return `${diffMins} ${t ? t('minutes_ago') : 'minutes ago'}`;
    if (diffHours < 24) return `${diffHours} ${t ? t('hours_ago') : 'hours ago'}`;
    if (diffDays === 1) return t ? t('yesterday') : 'Yesterday';
    return `${diffDays} ${t ? t('days_ago') : 'days ago'}`;
  } catch {
    return null;
  }
}

