/**
 * ProjectFlow - Premium Recurring Task System
 * 
 * Provides automated recurring schedules for tasks:
 * - Daily, Weekdays (Mon-Fri), Weekly, Bi-weekly, Monthly
 * - Safe local date calculations (avoids timezone drifts)
 * - Automatic next-occurrence generation upon task completion
 */

export const RECURRING_FREQUENCIES = [
  { id: 'none', label: 'Does not repeat', short: 'None' },
  { id: 'daily', label: 'Daily (Every day)', short: 'Daily', days: 1 },
  { id: 'weekdays', label: 'Weekdays (Mon - Fri)', short: 'Weekdays' },
  { id: 'weekly', label: 'Weekly (Every week)', short: 'Weekly', days: 7 },
  { id: 'biweekly', label: 'Bi-weekly (Every 2 weeks)', short: 'Bi-weekly', days: 14 },
  { id: 'monthly', label: 'Monthly (Every month)', short: 'Monthly' },
];

/**
 * Safely parse 'YYYY-MM-DD' into local midnight Date
 */
export function parseLocalDate(str) {
  if (!str) return new Date();
  const parts = str.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return new Date();
  }
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

/**
 * Format local Date object to 'YYYY-MM-DD'
 */
export function formatLocalDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculate the next recurrence dates based on frequency
 * @param {string} startDate - 'YYYY-MM-DD'
 * @param {string} endDate - 'YYYY-MM-DD'
 * @param {string} frequency - 'daily' | 'weekdays' | 'weekly' | 'biweekly' | 'monthly'
 * @returns {{ nextStartDate: string, nextEndDate: string }}
 */
export function computeNextRecurrenceDates(startDate, endDate, frequency) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Determine base anchor date (priority: endDate -> startDate -> today)
  let baseDate = endDate ? parseLocalDate(endDate) : (startDate ? parseLocalDate(startDate) : new Date(today));

  // If anchor date is already in the past, advance from today
  if (baseDate < today) {
    baseDate = new Date(today);
  }

  const nextEnd = new Date(baseDate);

  switch (frequency) {
    case 'daily':
      nextEnd.setDate(nextEnd.getDate() + 1);
      break;

    case 'weekdays': {
      const day = nextEnd.getDay();
      if (day === 5) {
        // Friday -> next is Monday (+3)
        nextEnd.setDate(nextEnd.getDate() + 3);
      } else if (day === 6) {
        // Saturday -> Monday (+2)
        nextEnd.setDate(nextEnd.getDate() + 2);
      } else if (day === 0) {
        // Sunday -> Monday (+1)
        nextEnd.setDate(nextEnd.getDate() + 1);
      } else {
        // Mon-Thu -> +1
        nextEnd.setDate(nextEnd.getDate() + 1);
      }
      break;
    }

    case 'weekly':
      nextEnd.setDate(nextEnd.getDate() + 7);
      break;

    case 'biweekly':
      nextEnd.setDate(nextEnd.getDate() + 14);
      break;

    case 'monthly': {
      const currentDay = nextEnd.getDate();
      nextEnd.setMonth(nextEnd.getMonth() + 1);
      // Handle month day overflow (e.g., Jan 31 -> Feb 28/29)
      if (nextEnd.getDate() !== currentDay) {
        nextEnd.setDate(0); // sets to last day of previous month
      }
      break;
    }

    default:
      nextEnd.setDate(nextEnd.getDate() + 7);
  }

  // Calculate task duration to preserve same interval for nextStartDate
  let nextStart = null;
  if (startDate && endDate) {
    const s = parseLocalDate(startDate);
    const e = parseLocalDate(endDate);
    const diffMs = e.getTime() - s.getTime();
    if (diffMs >= 0) {
      nextStart = new Date(nextEnd.getTime() - diffMs);
    }
  }

  if (!nextStart) {
    nextStart = new Date(nextEnd);
  }

  return {
    nextStartDate: formatLocalDate(nextStart),
    nextEndDate: formatLocalDate(nextEnd),
  };
}

/**
 * Returns human-readable frequency description
 */
export function getRecurrenceDescription(frequency, t) {
  if (!frequency || frequency === 'none') return null;
  const match = RECURRING_FREQUENCIES.find(f => f.id === frequency);
  return match ? (t ? t(`recur_${frequency}`) || match.label : match.label) : null;
}

