import { useApp } from '../context/AppContext';
import {
  Cloud, HardDrive, Check, X, Sparkles,
  ArrowRight, Copy, CheckCircle2,
  Database, AlertCircle, ExternalLink
} from 'lucide-react';

/**
 * Compact Executive Banner Card for the Data Management Tab
 * Directly catches the user's eye right next to the manual backup action.
 */
export function CloudSyncBannerCard({ onOpenPitch }) {
  const { t } = useApp();

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white shadow-xl border border-white/20 transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, var(--theme-accent, #3b82f6) 0%, var(--theme-accent-hover, #1d4ed8) 100%)',
        boxShadow: '0 10px 25px -5px var(--theme-accent-shadow, rgba(59, 130, 246, 0.3))'
      }}
    >
      {/* Decorative ambient background blur */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-black/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md text-white border border-white/20">
            <Sparkles size={12} className="text-amber-300" />
            <span>{t('upgrade_badge') || 'UPGRADE'}</span>
            <span className="opacity-60">•</span>
            <span>{t('cloud_edition_short') || 'Cloud Sync'}</span>
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-snug">
            {t('cloud_banner_title') || 'Tired of Taking Manual Backups?'}
          </h3>

          <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed">
            {t('cloud_banner_desc') || 'In the offline edition, your data only exists in this browser cache. If cleared or unbacked, work is lost. Upgrade to Online Cloud Sync for zero-maintenance automated backups and instant multi-device access.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-white/90 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-300" />
              <span>{t('online_pro_1') || '100% Automated Cloud Backups'}</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-300" />
              <span>{t('online_pro_3') || 'Instant Multi-Device Sync'}</span>
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center">
          <button
            onClick={onOpenPitch}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-slate-50 active:scale-97 shadow-lg shadow-black/10 transition-all cursor-pointer"
            style={{ color: 'var(--theme-accent, #3b82f6)' }}
          >
            <span>{t('compare_editions_btn') || 'Compare Editions & Upgrade'}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Full Enterprise Comparison View: Offline vs Online Cloud Sync
 * Features:
 * - High-impact executive hero
 * - Friction & Pain Point Analysis
 * - Side-by-side Pros & Cons cards
 * - Detailed Feature Matrix
 * - Direct external link to Etsy to discuss with seller
 */
export function CloudSyncPitchView() {
  const { t, showToast } = useApp();

  const handleCopySummary = async () => {
    const summaryText = `*ProjectFlow Edition Comparison: Offline vs Online Cloud Sync*\n\n` +
      `Current Offline Edition (Limitations & Pain Points):\n` +
      `- Manual JSON backup burden (tedious and easy to forget)\n` +
      `- Catastrophic data loss risk if browser cache is cleared or disk crashes\n` +
      `- Single-device locked (no sync across phone, tablet, or secondary PC)\n` +
      `- Zero live team collaboration or concurrent task editing\n` +
      `- Version confusion from juggling multiple dated backup files\n\n` +
      `Online Cloud Sync Edition (Recommended Upgrade):\n` +
      `- 100% Automated continuous cloud backups (never lose a task or note)\n` +
      `- Instant multi-device sync across Mac, Windows, iOS, and Android\n` +
      `- Real-time team collaboration with concurrent editing and presence\n` +
      `- Automated version history & 1-click disaster rollback\n` +
      `- Enterprise-grade end-to-end TLS 1.3 / AES-256 cloud encryption\n\n` +
      `Contact Grafitly on Etsy (https://grafitly.etsy.com) to upgrade your workspace to the Online Cloud Edition.`;

    try {
      await navigator.clipboard.writeText(summaryText);
      showToast(
        t('copied') || 'Copied!',
        t('pitch_summary_copied') || 'Proposal summary copied to clipboard!',
        'success'
      );
    } catch {
      // Fallback
    }
  };

  const comparisonMatrix = [
    {
      feature: t('feature_automated_backup') || 'Automated Background Backups',
      offline: { val: t('val_offline_manual_only') || 'Manual JSON export only', status: 'bad' },
      online: { val: t('val_online_continuous') || '100% Automatic continuous sync', status: 'good' }
    },
    {
      feature: t('feature_data_safety') || 'Data Loss Protection',
      offline: { val: t('val_offline_fragile') || 'Vulnerable to browser cache clearing', status: 'bad' },
      online: { val: t('val_online_redundant') || 'Multi-zone redundant cloud protection', status: 'good' }
    },
    {
      feature: t('feature_cross_device') || 'Cross-Device Synchronization',
      offline: { val: t('val_offline_none') || 'Locked to single browser', status: 'bad' },
      online: { val: t('val_online_instant') || 'Live on Mac, Windows, iOS, Android', status: 'good' }
    },
    {
      feature: t('feature_collaboration') || 'Team Real-Time Collaboration',
      offline: { val: t('val_offline_single') || 'Single user only', status: 'bad' },
      online: { val: t('val_online_team') || 'Unlimited concurrent team members', status: 'good' }
    },
    {
      feature: t('feature_versioning') || 'Version History & Restore',
      offline: { val: t('val_offline_manual_files') || 'Manual file archiving only', status: 'bad' },
      online: { val: t('val_online_point_in_time') || 'Automated revision history', status: 'good' }
    },
    {
      feature: t('feature_offline_support') || 'Offline Operation',
      offline: { val: t('val_offline_isolated') || 'Isolated local storage (no sync)', status: 'bad' },
      online: { val: t('val_online_hybrid') || 'Full offline mode with auto-cloud sync', status: 'good' }
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16 w-full max-w-4xl mx-auto">
      
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
          <Cloud size={14} className="text-blue-500" />
          <span>{t('cloud_hero_badge') || 'Enterprise Cloud Sync Edition'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('cloud_hero_title') || 'Never Worry About Manual Backups Again'}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t('cloud_hero_subtitle') || 'Tired of having to download and organize JSON files? Upgrade to the Online Edition with zero-touch real-time cloud sync, automatic disaster recovery, and multi-device access.'}
        </p>

        {/* Quick Executive CTA Header Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="https://grafitly.etsy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-97 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <ExternalLink size={15} />
            <span>{t('inquire_cloud_btn') || 'Contact on Etsy'}</span>
          </a>

          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Copy size={14} />
            <span>{t('copy_pitch_summary') || 'Copy Proposal Summary'}</span>
          </button>
        </div>
      </div>

      {/* The Pain Point / Friction Box */}
      <div className="p-4 sm:p-6 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300/80 dark:border-amber-500/30 text-amber-950 dark:text-amber-100">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 border border-amber-500/30">
            <AlertCircle size={22} />
          </div>
          <div className="space-y-1.5 min-w-0 flex-1">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <span>{t('the_backup_dilemma') || 'The Friction of Manual Backups'}</span>
            </h4>
            <p className="text-xs sm:text-[13px] text-amber-800/90 dark:text-amber-200/90 leading-relaxed">
              In the offline edition, your tasks and projects live entirely inside your browser's local cache. 
              <strong> You must manually click "Backup Now", save JSON files, and store them securely.</strong> If your browser cache is cleaned, cookies expire, or your computer crashes, any unexported work is permanently lost.
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Pros & Cons Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Offline Local Edition */}
        <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <HardDrive size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {t('offline_edition_title') || 'Offline Local Edition'}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">Local-First Storage</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {t('current_edition_badge') || 'Your Current Setup'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              {t('offline_edition_desc') || 'Designed for single-user offline workflows with isolated browser-only data retention.'}
            </p>

            {/* Limitations & Tedium (Cons) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h5 className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <X size={13} />
                <span>{t('cons_heading') || 'Limitations & Tedium (Cons)'}</span>
              </h5>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2 font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-500/15 p-2 rounded-lg border border-amber-300/60 dark:border-amber-500/30">
                  <X size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{t('offline_con_1') || 'Manual Backup Burden: You must remember to export JSON files repeatedly'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{t('offline_con_2') || 'Catastrophic Loss Risk: Browser cache resets or hardware failure erase unbacked data'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{t('offline_con_3') || 'Single-Device Locked: Cannot access tasks across phone, tablet, or secondary PC'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{t('offline_con_4') || 'No Live Collaboration: Teammates cannot work together in real-time'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{t('offline_con_5') || 'Version Confusion: Managing dozens of manual backup files creates clutter'}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
            Included in your standalone license
          </div>
        </div>

        {/* Card 2: Online Cloud Sync Edition */}
        <div className="glass-card p-5 sm:p-6 rounded-2xl border-2 border-blue-500/70 dark:border-blue-500/60 shadow-xl shadow-blue-500/10 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent">
          {/* Subtle gradient accent tag */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-indigo-600 text-white text-[9px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow-xs">
            {t('recommended_upgrade_badge') || 'Recommended Upgrade'}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                <Cloud size={18} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{t('online_edition_title') || 'Online Cloud Sync Edition'}</span>
                  <Sparkles size={14} className="text-amber-500" />
                </h3>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Continuous Cloud Mirror</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              {t('online_edition_desc') || 'Designed for high-productivity teams and professionals who require zero-maintenance automated backups and cross-device sync.'}
            </p>

            {/* Key Advantages (Pros) */}
            <div className="space-y-2 pt-2 border-t border-blue-100 dark:border-blue-900/40">
              <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>{t('pros_heading') || 'Key Advantages (Pros)'}</span>
              </h5>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
                <li className="flex items-start gap-2 font-bold text-blue-700 dark:text-blue-300 bg-blue-500/10 dark:bg-blue-500/15 p-2 rounded-lg border border-blue-300/60 dark:border-blue-500/30">
                  <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>{t('online_pro_1') || 'Zero Manual Backups: Every click, task, and note is backed up continuously to cloud'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{t('online_pro_2') || 'Zero Data Loss Guarantee: Cloud redundant snapshots protect against browser/device failure'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{t('online_pro_3') || 'Instant Multi-Device Sync: Access seamlessly on desktop, laptop, tablet, and mobile'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{t('online_pro_4') || 'Real-Time Team Collaboration: Live multi-user task management and presence'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{t('online_pro_5') || 'Revision History & Rollback: Restore previous states or undo mistakes with one click'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{t('online_pro_6') || 'Enterprise-Grade Security: End-to-end TLS 1.3 / AES-256 cloud encryption'}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-blue-100 dark:border-blue-900/40">
            <a
              href="https://grafitly.etsy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 active:scale-97 text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <span>{t('inquire_cloud_btn') || 'Contact on Etsy'}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

      </div>

      {/* Feature Comparison Matrix Table */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <Database size={16} className="text-blue-500" />
          <span>Feature & Reliability Matrix</span>
        </h3>

        <div className="overflow-x-auto touch-momentum custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3 font-bold">Capability</th>
                <th className="py-2.5 px-3 font-bold w-1/3">Offline Local Edition</th>
                <th className="py-2.5 px-3 font-bold w-1/3 text-blue-600 dark:text-blue-400">Online Cloud Edition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {comparisonMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">
                    {row.feature}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1.5 ${row.offline.status === 'bad' ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                      {row.offline.status === 'bad' ? <X size={13} className="text-red-500" /> : <Check size={13} className="text-emerald-500" />}
                      <span>{row.offline.val}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
                      <CheckCircle2 size={13} className="text-blue-500" />
                      <span>{row.online.val}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Final Executive Inquiry Callout */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 border border-slate-800">
        <div className="space-y-1.5 text-center sm:text-left">
          <h4 className="text-sm sm:text-base font-extrabold text-white">
            Ready to eliminate manual backups for your organization?
          </h4>
          <p className="text-xs text-slate-300 max-w-lg">
            Migrate seamlessly with zero data loss. Reach out to our team on Etsy for cloud sync setup and onboarding.
          </p>
        </div>

        <a
          href="https://grafitly.etsy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20 active:scale-97 transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
        >
          <ExternalLink size={16} />
          <span>{t('inquire_cloud_btn') || 'Contact on Etsy'}</span>
        </a>
      </div>

    </div>
  );
}
