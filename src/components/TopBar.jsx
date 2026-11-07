import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { STATUSES, PRIORITIES } from '../utils/constants';
import { formatBackupDate, getRelativeBackupTime } from '../utils/helpers';
import { Search, Plus, Sun, Moon, Filter, X, Menu, StickyNote, ChevronDown, Layers, Pencil, ShieldCheck, ShieldAlert, Clock, Download, CheckCircle2, Settings, Cloud, ChevronRight, ShoppingBag, Palette } from 'lucide-react';

export default function TopBar({ onNewTask }) {
  const {
    isDark, toggleTheme,
    activeView, setActiveView,
    lastProjectView,
    projects, tasks, team,
    filters, setFilters, clearFilters,
    setMobileMenuOpen,
    activeProjectId, setActiveProjectId,
    openNewProjectModal, openEditProjectModal,
    notesDrawer, openNotes, closeNotes,
    lastBackupDate, backupReminderDays, isBackupDue, triggerBackup, openBackupSettings, openCloudPitch, language,
    isDemo, openDemoModal,
    activeThemeObj, setSettingsTab,
    t,
  } = useApp();

  const [showFilters, setShowFilters] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [backupDropdownOpen, setBackupDropdownOpen] = useState(false);
  const projectDropdownRef = useRef(null);

  const activeProject = projects.find(p => p.id === activeProjectId);
  const hasActiveFilters = filters.project !== 'all' || filters.status !== 'all' || filters.priority !== 'all' || filters.member !== 'all';

  const handleSelectProjectScope = (projId) => {
    setActiveProjectId(projId);
    setProjectDropdownOpen(false);
    if (activeView === 'settings') {
      setActiveView(lastProjectView || 'kanban');
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target)) {
        setProjectDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (backupDropdownOpen) setBackupDropdownOpen(false);
        if (projectDropdownOpen) setProjectDropdownOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [backupDropdownOpen, projectDropdownOpen]);

  return (
    <div className="flex-shrink-0 relative z-20 border-b border-slate-200 dark:border-slate-700/50 bg-white dark:bg-navy-900 px-3 sm:px-6 py-2 sm:py-3">
      {/* Primary Top Bar Row: Left nav/title, Desktop Search, Right Actions */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-3 w-full">
        {/* Left: Title + Mobile Menu Toggle + Project Selector (sm+) */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-shrink">
          <button
            className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer flex-shrink-0"
            onClick={() => setMobileMenuOpen(true)}
            aria-label={t('toggle_nav') || 'Toggle navigation menu'}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm sm:text-lg md:text-xl font-bold text-slate-800 dark:text-white truncate">
            {t(activeView)}
          </h1>

          <div className="hidden sm:block w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5 flex-shrink-0" />

          {/* Interactive Project Scope Selector in TopBar (Hidden on mobile to preserve layout, visible on sm+) */}
          <div className="hidden sm:block relative flex-shrink-0" ref={projectDropdownRef}>
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs hover:shadow cursor-pointer group"
              title={t('switch_project_focus')}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-xs"
                style={{ backgroundColor: activeProject ? activeProject.color : '#3b82f6' }}
              />
              <span className="max-w-[110px] sm:max-w-[170px] truncate text-[11px] sm:text-xs">
                {activeProject ? activeProject.name : (t('all_projects') || 'All Projects')}
              </span>
              <ChevronDown size={13} className={`text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200 ${projectDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {projectDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-scale-up">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700/60 mb-1 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t('select_project_scope')}
                  </p>
                  <span className="text-[10px] text-blue-500 font-semibold">{projects.length} {t('available')}</span>
                </div>

                <button
                  onClick={() => handleSelectProjectScope('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    activeProjectId === 'all'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers size={13} className="text-blue-500" />
                    <span>{t('all_projects') || 'All Projects'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 tabular-nums">
                    {tasks.length} {t('tasks')}
                  </span>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-700/40" />

                {/* Scrollable list of projects */}
                <div className="max-h-56 overflow-y-auto custom-scrollbar pr-0.5">
                  {projects.map(p => {
                    const pTasks = tasks.filter(t => t.projectId === p.id);
                    const isSelected = activeProjectId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectProjectScope(p.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                          <span className="truncate">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          <span className="text-[10px] text-slate-400 tabular-nums">
                            {pTasks.length} {t('tasks')}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectDropdownOpen(false);
                              openEditProjectModal(p);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-blue-500 hover:bg-slate-200/60 dark:hover:bg-slate-600/60 transition-colors"
                            title={t('edit_project')}
                          >
                            <Pencil size={11} />
                          </button>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Create Project in Dropdown */}
                <div className="p-2 border-t border-slate-100 dark:border-slate-700/60 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProjectDropdownOpen(false);
                      openNewProjectModal();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-500/30 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>{t('create_project')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search (Desktop only: hidden md:block) */}
        <div className="hidden md:block flex-1 max-w-md mx-2 lg:mx-4 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder={t('search_placeholder')}
            className="input-field !pl-10 py-2 text-[13px] w-full"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Always Visible Backup Status Pill & Quick Action Popover */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setBackupDropdownOpen(!backupDropdownOpen)}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-xs hover:shadow cursor-pointer ${
                !lastBackupDate
                  ? 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300/80 dark:border-amber-500/30'
                  : isBackupDue
                  ? 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300/80 dark:border-amber-500/30'
                  : 'bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700'
              }`}
              title={
                lastBackupDate
                  ? `${t('last_backup_taken')}: ${formatBackupDate(lastBackupDate, language)} (${getRelativeBackupTime(lastBackupDate, t)})`
                  : t('never_backed_up')
              }
              aria-label={t('backup_status') || 'Backup Status'}
            >
              <div className="relative flex items-center justify-center">
                {!lastBackupDate ? (
                  <ShieldAlert size={15} className="text-amber-600 dark:text-amber-400" />
                ) : isBackupDue ? (
                  <Clock size={15} className="text-amber-600 dark:text-amber-400" />
                ) : (
                  <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
                )}
                <span
                  className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
                    !lastBackupDate || isBackupDue
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>

              {/* Visible on sm: and up without clipping */}
              <span className="hidden sm:inline text-[11px] sm:text-xs whitespace-nowrap">
                {lastBackupDate ? (
                  <>
                    <span className="text-slate-400 dark:text-slate-500 mr-1 font-normal">{t('backup_short') || 'Backup'}:</span>
                    <span className="font-bold">{getRelativeBackupTime(lastBackupDate, t)}</span>
                  </>
                ) : (
                  <span className="font-bold text-amber-700 dark:text-amber-300">{t('no_backup') || 'No Backup'}</span>
                )}
              </span>
            </button>

            {/* Backup Status Modal (Clean Centered Modal across Mobile & Desktop) */}
            {backupDropdownOpen && createPortal(
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
                onClick={() => setBackupDropdownOpen(false)}
              >
                <div
                  className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 w-full max-w-sm sm:max-w-md animate-scale-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-700/60 mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        !lastBackupDate || isBackupDue
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {!lastBackupDate ? <ShieldAlert size={17} /> : isBackupDue ? <Clock size={17} /> : <ShieldCheck size={17} />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                          {t('backup_status') || 'Backup Status'}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {t('workspace_data_protection') || 'Workspace Data Protection'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!lastBackupDate ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                          {t('never_backed_up')}
                        </span>
                      ) : isBackupDue ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                          {t('backup_recommended')}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 size={11} />
                          <span>{t('backup_up_to_date')}</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setBackupDropdownOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
                        aria-label={t('close') || 'Close'}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Details Box */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200/60 dark:border-slate-800 mb-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">{t('last_backup_taken')}:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-right">
                        {lastBackupDate ? formatBackupDate(lastBackupDate, language) : t('never_backed_up')}
                      </span>
                    </div>

                    {lastBackupDate && (
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/50 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">{t('time_elapsed') || 'Elapsed'}:</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded text-[11px] border border-blue-200/60 dark:border-blue-500/20">
                          {getRelativeBackupTime(lastBackupDate, t)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/50 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">{t('backup_reminder_setting')}:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                        {backupReminderDays > 0 ? (backupReminderDays === 1 ? t('every_1_day') : t(`every_${backupReminderDays}_days`)) : t('reminder_off')}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={async () => {
                        setBackupDropdownOpen(false);
                        await triggerBackup();
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-97"
                      style={{ backgroundColor: 'var(--theme-accent, #3b82f6)' }}
                    >
                      <Download size={15} />
                      <span>{t('backup_now')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBackupDropdownOpen(false);
                        openBackupSettings();
                      }}
                      className="inline-flex items-center gap-1.5 py-2.5 px-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      title={t('backup_settings')}
                    >
                      <Settings size={15} />
                      <span className="hidden sm:inline">{t('settings')}</span>
                    </button>
                  </div>

                  {/* Upgrade to Cloud sync trigger */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                    <button
                      type="button"
                      onClick={() => {
                        setBackupDropdownOpen(false);
                        openCloudPitch();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-800/50 hover:border-blue-400 dark:hover:border-blue-600 text-xs font-semibold text-blue-700 dark:text-blue-300 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Cloud size={16} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                        <span className="truncate">{t('want_automatic_backups') || 'Want automatic cloud backups?'}</span>
                      </div>
                      <ChevronRight size={14} className="text-blue-500 group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1" />
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${showFilters || hasActiveFilters
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-slate-300'
              }`}
            title={t('filters')}
          >
            <Filter size={18} />
          </button>

          {/* Notes toggle (Desktop) */}
          <button
            onClick={() => {
              if (notesDrawer.isOpen) {
                closeNotes();
              } else {
                openNotes({ tab: activeProjectId !== 'all' ? 'project' : 'task' });
              }
            }}
            className={`hidden md:inline-flex p-2 rounded-xl transition-colors cursor-pointer ${
              notesDrawer.isOpen
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 shadow-xs'
                : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 dark:hover:text-amber-400'
            }`}
            title={t('notes')}
            aria-label={t('notes')}
          >
            <StickyNote size={18} />
          </button>

          {/* Theme Palette & Appearance button */}
          <button
            onClick={() => {
              setSettingsTab('appearance');
              setActiveView('settings');
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-slate-300 transition-colors cursor-pointer relative group"
            title={`Workspace Theme: ${activeThemeObj?.name || 'Default'} (Click to change)`}
            aria-label="Appearance & Themes"
          >
            <Palette size={18} style={{ color: activeThemeObj?.primary }} />
            <span
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-navy-900 shadow-xs"
              style={{ backgroundColor: activeThemeObj?.primary }}
            />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-slate-300 transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Settings shortcut button (Desktop) */}
          <button
            onClick={() => setActiveView('settings')}
            className={`hidden md:inline-flex p-2 rounded-xl transition-colors cursor-pointer ${
              activeView === 'settings'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-slate-300'
            }`}
            title={t('settings_title') || 'Settings'}
            aria-label={t('settings_title') || 'Settings'}
          >
            <Settings size={18} />
          </button>

          {/* New Task button */}
          <button onClick={onNewTask} className="btn-primary text-xs sm:text-[13px] py-1.5 sm:py-2 px-2.5 sm:px-4">
            <Plus size={16} />
            <span className="hidden sm:inline">{t('new_task')}</span>
          </button>

          {/* Demo Mode Etsy Purchase CTA */}
          {isDemo && (
            <button
              type="button"
              onClick={() => openDemoModal('general')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm hover:shadow transition-all active:scale-97 cursor-pointer"
              title="Get Full Offline Edition on Etsy"
            >
              <ShoppingBag size={14} />
              <span className="hidden md:inline">Buy Full Edition</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Mobile Search bar (md:hidden) */}
      <div className="md:hidden mt-2 relative w-full">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filters.search}
          onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
          placeholder={t('search_placeholder')}
          className="input-field !pl-10 py-2 text-[13px] w-full"
        />
        {filters.search && (
          <button
            onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-3 animate-slide-up">
          {/* Project filter */}
          <select
            value={filters.project}
            onChange={e => setFilters(prev => ({ ...prev, project: e.target.value }))}
            className="input-field py-1.5 text-[12px] flex-1 min-w-[130px] sm:flex-none sm:w-auto sm:max-w-[150px]"
          >
            <option value="all">{t('all_projects')}</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          {/* Status filter */}
          <select
            value={filters.status}
            onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="input-field py-1.5 text-[12px] flex-1 min-w-[130px] sm:flex-none sm:w-auto sm:max-w-[140px]"
          >
            <option value="all">{t('all_statuses')}</option>
            {STATUSES.map(s => <option key={s.id} value={s.id}>{t(s.id)}</option>)}
          </select>

          {/* Priority filter */}
          <select
            value={filters.priority}
            onChange={e => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="input-field py-1.5 text-[12px] flex-1 min-w-[130px] sm:flex-none sm:w-auto sm:max-w-[140px]"
          >
            <option value="all">{t('all_priorities')}</option>
            {PRIORITIES.map(p => <option key={p.id} value={p.id}>{t(p.id)}</option>)}
          </select>

          {/* Member filter */}
          <select
            value={filters.member}
            onChange={e => setFilters(prev => ({ ...prev, member: e.target.value }))}
            className="input-field py-1.5 text-[12px] flex-1 min-w-[130px] sm:flex-none sm:w-auto sm:max-w-[140px] md:max-w-[150px]"
          >
            <option value="all">{t('all_members')}</option>
            {team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[12px] text-blue-500 hover:text-blue-600 font-medium whitespace-nowrap cursor-pointer"
            >
              {t('clear_filters')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
