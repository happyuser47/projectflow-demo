import { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Layers, Folder, X, Plus } from 'lucide-react';

export default function ProjectScopeBar({ className = '' }) {
  const {
    projects,
    tasks,
    activeProjectId,
    setActiveProjectId,
    openNewProjectModal,
    t
  } = useApp();

  const containerRef = useRef(null);
  const activeBtnRef = useRef(null);

  const totalTasksCount = tasks.length;
  const activeProject = projects.find(p => p.id === activeProjectId);

  // Auto-scroll the active project pill into view when activeProjectId changes
  useEffect(() => {
    if (activeBtnRef.current && containerRef.current) {
      activeBtnRef.current.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    }
  }, [activeProjectId]);

  return (
    <div className={`flex items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-5 w-full min-w-0 ${className}`}>
      {/* Scrollable Project Pills Container */}
      <div className="flex-1 min-w-0 flex items-center">
        <span className="hidden sm:flex text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2 items-center gap-1 flex-shrink-0 select-none">
          <Folder size={12} className="text-slate-400" />
          <span>{t('project')}:</span>
        </span>

        {/* Scrollable Track */}
        <div 
          ref={containerRef}
          className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto hide-scrollbar scroll-smooth py-1 px-0.5"
        >
          {/* All Projects Pill */}
          <button
            ref={activeProjectId === 'all' ? activeBtnRef : null}
            onClick={() => setActiveProjectId('all')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex-shrink-0 shadow-xs ${
              activeProjectId === 'all'
                ? 'bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-500/20'
                : 'bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700/60'
            }`}
            title={t('show_all_projects')}
          >
            <Layers size={13} className={activeProjectId === 'all' ? 'text-white' : 'text-slate-400'} />
            <span className="whitespace-nowrap">{t('all_projects') || 'All Projects'}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
              activeProjectId === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}>
              {totalTasksCount}
            </span>
          </button>

          {/* Individual Project Pills */}
          {projects.map(proj => {
            const projTasks = tasks.filter(t => t.projectId === proj.id);
            const isSelected = activeProjectId === proj.id;

            return (
              <button
                key={proj.id}
                ref={isSelected ? activeBtnRef : null}
                onClick={() => setActiveProjectId(proj.id)}
                className={`group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex-shrink-0 border shadow-xs ${
                  isSelected
                    ? 'bg-white dark:bg-navy-800 text-slate-900 dark:text-white border-blue-500/80 dark:border-blue-500/80 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border-slate-200/80 dark:border-slate-700/60'
                }`}
                title={`${t('filter_to')} ${proj.name}`}
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 transition-transform ${isSelected ? 'scale-125' : 'group-hover:scale-110'}`}
                  style={{ backgroundColor: proj.color }}
                />
                <span className="truncate max-w-[90px] sm:max-w-[130px] md:max-w-[160px]">{proj.name}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                  isSelected
                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {projTasks.length}
                </span>
              </button>
            );
          })}

          {/* New Project Button */}
          <button
            onClick={() => openNewProjectModal()}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 transition-all cursor-pointer flex-shrink-0 shadow-xs group"
            title={t('create_project')}
          >
            <Plus size={13} className="text-blue-500 group-hover:scale-110 transition-transform" />
            <span>{t('new_project')}</span>
          </button>
        </div>
      </div>

      {/* Active Filter Helper Badge / Reset Action */}
      {activeProject && (
        <div className="flex items-center gap-1.5 flex-shrink-0 text-xs pl-1">
          <span className="hidden xl:inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {t('showing_only')} <strong className="text-slate-700 dark:text-slate-200 font-semibold max-w-[120px] truncate inline-block align-bottom">{activeProject.name}</strong> {t('tasks')}
          </span>
          <button
            onClick={() => setActiveProjectId('all')}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-500/20 transition-all cursor-pointer whitespace-nowrap shadow-xs"
            title={t('reset')}
          >
            <span>{t('show_all')}</span>
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
