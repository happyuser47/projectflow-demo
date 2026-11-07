import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getInitials, formatBackupDate, getRelativeBackupTime } from '../utils/helpers';
import { importAppData } from '../hooks/useDatabase';
import { LANGUAGES } from '../utils/i18n';
import ConfirmModal from '../components/ConfirmModal';
import { CloudSyncPitchView, CloudSyncBannerCard } from '../components/CloudSyncPitch';
import AppearanceSettings from '../components/AppearanceSettings';
import { Download, Upload, AlertTriangle, CheckCircle2, Users, Plus, X, Check, Trash2, Loader2, Globe, Database, RotateCcw, Eraser, ShieldCheck, ExternalLink, Clock, Bell, ShieldAlert, FileText, Cloud, Sparkles, Palette } from 'lucide-react';

export default function SettingsView() {
  const {
    team, addTeamMember, deleteTeamMember,
    language, setLanguage, t,
    clearAllData, resetData,
    lastBackupDate, backupReminderDays, setBackupReminderDays,
    triggerBackup, isBackupDue, daysSinceLastBackup,
    settingsTab, setSettingsTab,
    isDemo, openDemoModal
  } = useApp();
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  
  // Tabs: 'preferences', 'team', 'data', 'cloud'
  const [activeTab, setActiveTab] = useState(settingsTab || 'preferences');

  useEffect(() => {
    if (settingsTab) {
      setActiveTab(settingsTab);
    }
  }, [settingsTab]);

  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
      addTeamMember(newMemberName.trim(), newMemberRole.trim());
      setNewMemberName('');
      setNewMemberRole('');
      setIsAddingMember(false);
    }
  };

  const handleExport = async () => {
    if (isDemo) {
      openDemoModal('export_disabled');
      return;
    }
    await triggerBackup();
  };

  const handleImport = (e) => {
    if (isDemo) {
      if (e.target) e.target.value = '';
      openDemoModal('import_disabled');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const result = await importAppData(ev.target.result);
        if (result.success) {
          setImportStatus({ type: 'success', message: 'Data imported successfully! Refreshing...' });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setImportStatus({ type: 'error', message: `Import failed: ${result.error}` });
          setIsImporting(false);
        }
      } catch (err) {
        setImportStatus({ type: 'error', message: `Import failed: ${err.message}` });
        setIsImporting(false);
      }
    };
    reader.onerror = () => {
      setImportStatus({ type: 'error', message: 'Failed to read backup file.' });
      setIsImporting(false);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const tabs = [
    { id: 'appearance', label: t('appearance') || 'Appearance', icon: Palette, badge: '10 Themes' },
    { id: 'preferences', label: t('preferences') || 'Preferences', icon: Globe },
    { id: 'team', label: t('team_members') || 'Team Members', icon: Users },
    { id: 'data', label: t('workspace_data') || 'Data Management', icon: Database },
    { id: 'cloud', label: t('cloud_edition_short') || 'Cloud Sync', icon: Cloud, badge: t('upgrade_badge') || 'UPGRADE' },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 overflow-y-auto h-full flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        {/* Settings Header with Premium Pill Tabs */}
        <div className="mb-6 sticky top-0 bg-slate-50/90 dark:bg-[#0f172a]/90 backdrop-blur-md z-10 py-2 -mx-3 px-3 sm:-mx-4 sm:px-4 md:mx-0 md:px-0">
          <div className="flex p-1.5 bg-slate-200/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-inner overflow-x-auto hide-scrollbar gap-1 touch-momentum">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSettingsTab(tab.id);
                  }}
                  className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap cursor-pointer flex-shrink-0 sm:flex-1 ${
                    isActive 
                      ? 'bg-white dark:bg-slate-900 shadow-md shadow-slate-200/50 dark:shadow-none scale-[1.01]' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/30'
                  }`}
                  style={{
                    color: isActive ? 'var(--theme-accent)' : undefined,
                  }}
                >
                  <Icon size={16} style={{ color: isActive ? 'var(--theme-accent)' : undefined }} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-1 border transition-colors"
                      style={{
                        backgroundColor: isActive ? 'var(--theme-accent)' : 'var(--theme-accent-light)',
                        color: isActive ? '#ffffff' : 'var(--theme-accent)',
                        borderColor: isActive ? 'transparent' : 'var(--theme-accent-border)',
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'appearance' && (
          <AppearanceSettings />
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6 animate-fade-in pb-12">
            {/* Language Selection */}
            <div className="glass-card p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-1">
                <Globe size={16} className="text-slate-500 dark:text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">{t('language')}</h3>
              </div>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-4">{t('language_desc')}</p>
              <div className="max-w-xs">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Copyright & Product License */}
            <div className="glass-card p-4 sm:p-6 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl relative overflow-hidden">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      ProjectFlow Dashboard
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        v2.0
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t('product_license_title')}
                    </p>
                  </div>
                </div>

                <a
                  href="https://grafitly.etsy.com/listing/4606805658/project-manager-web-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 transition-all cursor-pointer shadow-sm"
                >
                  <Globe size={14} />
                  <span>{t('grafitly_brand')}</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2 font-semibold text-slate-800 dark:text-slate-200">
                  <span>© 2026 Grafitly. {t('all_rights_reserved')}</span>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                    {t('official_product')}
                  </span>
                </div>
                <p className="leading-relaxed">
                  {t('copyright_statement')}
                </p>
                <p className="text-[11px] text-slate-500 leading-normal pt-1 border-t border-slate-200/50 dark:border-slate-800">
                  {t('license_terms')}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6 animate-fade-in pb-12">
            {/* Cloud Sync Pitch Banner */}
            <CloudSyncBannerCard onOpenPitch={() => {
              setActiveTab('cloud');
              setSettingsTab('cloud');
            }} />

            {/* Workspace Demo Data Management */}
            <div className="glass-card p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-1">
                <Database size={16} className="text-slate-500 dark:text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">{t('workspace_data')}</h3>
              </div>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-4">{t('workspace_data_desc')}</p>

              <div className="flex flex-wrap gap-3">
                {/* Clear All Demo Data */}
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 transition-all cursor-pointer"
                >
                  <Eraser size={15} />
                  {t('clear_demo_data')}
                </button>

                {/* Reload Sample Demo Data */}
                <button
                  onClick={() => setShowRestoreConfirm(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all cursor-pointer"
                >
                  <RotateCcw size={15} />
                  {t('restore_demo_data')}
                </button>
              </div>
            </div>

            {/* Professional Backup & Recovery Center */}
            <div className="glass-card p-4 sm:p-6 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl relative">
              {/* Header */}
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs border ${
                    !lastBackupDate
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                      : isBackupDue
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                      : 'bg-green-500/15 border-green-500/30 text-green-600 dark:text-green-400'
                  }`}>
                    {lastBackupDate && !isBackupDue ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <span>{t('backup_safety_center')}</span>
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                      {t('export_desc')}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center">
                  {!lastBackupDate ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                      <ShieldAlert size={13} />
                      <span>{t('never_backed_up')}</span>
                    </span>
                  ) : isBackupDue ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                      <AlertTriangle size={13} />
                      <span>{t('backup_recommended')}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30">
                      <CheckCircle2 size={13} />
                      <span>{t('backup_up_to_date')}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Status & Last Backup Info Box */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 mb-5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400" />
                    <span>{t('last_backup_taken')}:</span>
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {lastBackupDate ? (
                      <>
                        <span>{formatBackupDate(lastBackupDate, language)}</span>
                        <span className="ml-2 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-500/20">
                          {getRelativeBackupTime(lastBackupDate, t)}
                        </span>
                      </>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 italic font-medium">
                        {t('never_backed_up')}
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 pt-2.5 border-t border-slate-200/50 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  <FileText size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="flex-1 min-w-0 break-words">
                    {t('backup_filename_hint', { filename: 'ProjectFlow_Backup_YYYY-MM-DD_HH-mm-ss.json' })}
                  </p>
                </div>
              </div>

              {/* Backup Reminder Setting Control */}
              <div className="mb-5 pb-5 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2 mb-1.5">
                  <Bell size={15} className="text-blue-500" />
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t('backup_reminder_setting')}
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  {t('backup_reminder_desc')}
                </p>

                <div className="max-w-xs">
                  <select
                    value={backupReminderDays}
                    onChange={(e) => setBackupReminderDays(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all cursor-pointer shadow-xs"
                  >
                    <option value={1}>{t('every_1_day')}</option>
                    <option value={3}>{t('every_3_days')}</option>
                    <option value={7}>{t('every_7_days')}</option>
                    <option value={14}>{t('every_14_days')}</option>
                    <option value={30}>{t('every_30_days')}</option>
                    <option value={0}>{t('reminder_off')}</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleExport} 
                  className="btn-primary text-xs py-2.5 px-4 shadow-sm hover:shadow transition-all"
                >
                  <Download size={15} />
                  <span>{t('backup_now_btn')}</span>
                </button>
              </div>
            </div>

            {/* Import */}
            <div className="glass-card p-4 sm:p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{t('import_data')}</h3>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-4">{t('import_desc')}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                disabled={isImporting}
                onChange={handleImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="btn-primary bg-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isImporting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t('importing')}
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    {t('import_btn')}
                  </>
                )}
              </button>
            </div>

            {/* Import Status */}
            {importStatus && (
              <div className={`flex items-center gap-3 p-4 rounded-xl animate-slide-up ${importStatus.type === 'success'
                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                }`}>
                {importStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                <span className="text-[13px] font-medium">{importStatus.message}</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6 animate-fade-in pb-12">
            {/* Team Members */}
            <div className="glass-card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-500 dark:text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">{t('team_members')}</h3>
                </div>
                <button
                  onClick={() => setIsAddingMember(!isAddingMember)}
                  className="text-[12px] font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  {isAddingMember ? <X size={14} /> : <Plus size={14} />}
                  {isAddingMember ? t('cancel') : t('add_member')}
                </button>
              </div>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-4">{t('team_desc')}</p>

              {isAddingMember && (
                <div className="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-end gap-3 animate-slide-up">
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">{t('name')}</label>
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={e => setNewMemberName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      autoFocus
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">{t('role')}</label>
                    <input
                      type="text"
                      value={newMemberRole}
                      onChange={e => setNewMemberRole(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddMember(); }}
                      placeholder="e.g. Frontend Engineer"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={handleAddMember}
                    disabled={!newMemberName.trim() || !newMemberRole.trim()}
                    className="w-full sm:w-auto btn-primary py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed h-[38px]"
                  >
                    <Check size={16} />
                    {t('add')}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {team.map(member => (
                  <div key={member.id} className="group relative flex items-center gap-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 cursor-default pr-9">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0"
                      style={{ backgroundColor: member.avatarColor }}
                    >
                      {getInitials(member.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">{member.name}</p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight truncate mt-0.5">{member.role}</p>
                    </div>
                    <button
                      onClick={() => setMemberToDelete(member)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-70 group-hover:opacity-100 focus:opacity-100 transition-all cursor-pointer"
                      title={t('remove_member_title') || 'Remove Member'}
                      aria-label={t('remove_member_title') || 'Remove Member'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'cloud' && (
          <CloudSyncPitchView />
        )}
      </div>

      {/* Delete Member Confirmation Modal */}
      <ConfirmModal
        isOpen={!!memberToDelete}
        title={t('remove_member_title') || 'Remove Team Member'}
        message={memberToDelete ? `${memberToDelete.name}: ${t('remove_member_confirm') || 'Are you sure you want to remove this member from the team?'}` : ''}
        confirmText={t('yes_remove') || 'Yes, Remove'}
        cancelText={t('cancel') || 'Cancel'}
        onConfirm={() => {
          if (memberToDelete) {
            deleteTeamMember(memberToDelete.id);
            setMemberToDelete(null);
          }
        }}
        onClose={() => setMemberToDelete(null)}
      />

      {/* Clear All Demo Data Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        title={t('confirm_clear_title') || 'Clear All Workspace Data?'}
        message={t('confirm_clear_msg') || 'This will permanently remove all current projects and tasks from your dashboard.'}
        confirmText={t('yes_clear') || 'Yes, Clear All Data'}
        cancelText={t('cancel') || 'Cancel'}
        variant="danger"
        requireMatch="delete"
        onConfirm={() => {
          clearAllData();
          setShowClearConfirm(false);
        }}
        onClose={() => setShowClearConfirm(false)}
      />

      {/* Reload Demo Data Modal */}
      <ConfirmModal
        isOpen={showRestoreConfirm}
        title={t('confirm_restore_title') || 'Reload Sample Data?'}
        message={t('confirm_restore_msg') || 'This will reset your workspace back to the initial demo projects and tasks.'}
        confirmText={t('yes_restore') || 'Yes, Load Sample Data'}
        cancelText={t('cancel') || 'Cancel'}
        variant="warning"
        onConfirm={() => {
          resetData();
          setShowRestoreConfirm(false);
        }}
        onClose={() => setShowRestoreConfirm(false)}
      />
    </div>
  );
}
