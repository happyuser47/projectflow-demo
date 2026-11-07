import { useApp } from '../context/AppContext';
import { ShieldAlert, Download, Clock, X, ChevronRight, Cloud } from 'lucide-react';

export default function BackupReminderBanner() {
  const {
    isDemo,
    isBackupDue,
    backupSnoozed,
    snoozeBackupReminder,
    lastBackupDate,
    daysSinceLastBackup,
    triggerBackup,
    openBackupSettings,
    openCloudPitch,
    t
  } = useApp();

  if (isDemo || !isBackupDue || backupSnoozed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-indigo-500/10 dark:from-amber-500/20 dark:via-blue-500/20 dark:to-indigo-500/20 border-b border-amber-200/70 dark:border-amber-500/30 px-3 sm:px-6 py-2.5 sm:py-3 transition-all animate-slide-down flex-shrink-0">
      {/* Mobile Layout (< sm) */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
              {lastBackupDate ? <Clock size={14} /> : <ShieldAlert size={14} />}
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
              {t('backup_reminder_banner_title')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
              {t('backup_recommended')}
            </span>
            <button
              onClick={snoozeBackupReminder}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              title={t('remind_later')}
              aria-label={t('remind_later') || 'Dismiss reminder'}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
          {lastBackupDate
            ? t('backup_overdue_banner_msg', { days: daysSinceLastBackup })
            : t('backup_never_banner_msg')}
        </p>

        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={triggerBackup}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white active:scale-97 shadow-xs transition-all cursor-pointer whitespace-nowrap"
            style={{ backgroundColor: 'var(--theme-accent, #3b82f6)' }}
          >
            <Download size={13} />
            <span>{t('backup_now_short') || 'Backup Now'}</span>
          </button>

          <button
            onClick={openCloudPitch}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border shadow-xs transition-all cursor-pointer truncate"
            style={{
              color: 'var(--theme-accent, #3b82f6)',
              borderColor: 'var(--theme-accent-border, rgba(59, 130, 246, 0.3))'
            }}
          >
            <Cloud size={13} style={{ color: 'var(--theme-accent, #3b82f6)' }} className="flex-shrink-0" />
            <span className="truncate">{t('cloud_edition_short') || 'Cloud Sync'}</span>
          </button>
        </div>
      </div>

      {/* Desktop / Tablet Layout (sm+) */}
      <div className="hidden sm:flex items-center justify-between gap-3">
        {/* Left: Icon + Text */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 dark:bg-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-500/30 shadow-xs">
            {lastBackupDate ? <Clock size={16} /> : <ShieldAlert size={16} />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {t('backup_reminder_banner_title')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                {t('backup_recommended')}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal truncate">
              {lastBackupDate
                ? t('backup_overdue_banner_msg', { days: daysSinceLastBackup })
                : t('backup_never_banner_msg')}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={triggerBackup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white active:scale-97 shadow-sm transition-all cursor-pointer"
            style={{ backgroundColor: 'var(--theme-accent, #3b82f6)' }}
          >
            <Download size={13} />
            <span>{t('backup_now_btn')}</span>
          </button>

          <button
            onClick={openCloudPitch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border shadow-xs transition-all cursor-pointer"
            style={{
              color: 'var(--theme-accent, #3b82f6)',
              borderColor: 'var(--theme-accent-border, rgba(59, 130, 246, 0.3))'
            }}
          >
            <Cloud size={13} style={{ color: 'var(--theme-accent, #3b82f6)' }} />
            <span>{t('tired_of_backups_cta') || 'Tired of backups? Go Cloud'}</span>
          </button>

          <button
            onClick={openBackupSettings}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <span>{t('settings')}</span>
            <ChevronRight size={13} />
          </button>

          <button
            onClick={snoozeBackupReminder}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
            title={t('remind_later')}
            aria-label={t('remind_later') || 'Dismiss reminder'}
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
