import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { STATUSES, PRIORITIES } from '../utils/constants';
import { getInitials, calculateProjectProgress, getOverdueTasks } from '../utils/helpers';
import { ArrowRight, Sparkles, Folder, Plus } from 'lucide-react';
import PillMetricCard from '../components/PillMetricCard';

export default function DashboardView() {
  const {
    projects,
    tasks,
    team,
    filteredTasks,
    activeProjectId,
    setActiveProjectId,
    setActiveView,
    openNewProjectModal,
    isDark,
    t
  } = useApp();

  const stats = useMemo(() => {
    const allTasks = filteredTasks;
    const doneTasks = allTasks.filter(t => t.status === 'done');
    const overdueTasks = getOverdueTasks(allTasks);
    const completionPct = allTasks.length > 0 ? Math.round((doneTasks.length / allTasks.length) * 100) : 0;

    return {
      totalProjects: projects.length,
      totalTasks: allTasks.length,
      completedTasks: doneTasks.length,
      completionPct,
      overdueTasks: overdueTasks.length,
      teamMembers: team.length,
    };
  }, [projects, filteredTasks, team]);

  // Status breakdown
  const statusData = useMemo(() => {
    return STATUSES.map(s => ({
      ...s,
      label: t(s.id),
      count: filteredTasks.filter(t => t.status === s.id).length,
    }));
  }, [filteredTasks, t]);

  // Priority distribution
  const priorityData = useMemo(() => {
    return PRIORITIES.map(p => ({
      ...p,
      label: t(p.id),
      count: filteredTasks.filter(t => t.priority === p.id).length,
    }));
  }, [filteredTasks, t]);

  // Team workload
  const teamWorkload = useMemo(() => {
    return team.map(m => ({
      ...m,
      taskCount: filteredTasks.filter(t => t.assigneeId === m.id).length,
    })).sort((a, b) => b.taskCount - a.taskCount);
  }, [team, filteredTasks]);

  // Project progress
  const projectProgress = useMemo(() => {
    return projects.map(p => {
      const projTasks = tasks.filter(t => t.projectId === p.id);
      return {
        ...p,
        progress: calculateProjectProgress(projTasks),
        total: projTasks.length,
        completed: projTasks.filter(t => t.status === 'done').length,
      };
    });
  }, [projects, tasks]);

  // Completion trend (mock 6-week data)
  const trendData = useMemo(() => {
    const weeks = ['6w ago', '5w ago', '4w ago', '3w ago', '2w ago', 'This week'];
    const base = stats.completionPct;
    return weeks.map((label, i) => ({
      label,
      value: Math.max(0, Math.min(100, base - (5 - i) * Math.floor(Math.random() * 12 + 5) + i * 8)),
    }));
  }, [stats.completionPct]);

  // Donut chart
  const totalForDonut = statusData.reduce((sum, s) => sum + s.count, 0) || 1;

  const statCards = [
    { label: t('projects'), valueText: stats.totalProjects, color: 'blue', percentage: 100 },
    { label: t('open_tasks'), valueText: stats.totalTasks - stats.completedTasks, color: 'amber', percentage: stats.totalTasks > 0 ? ((stats.totalTasks - stats.completedTasks) / stats.totalTasks * 100) : 0 },
    { label: t('completed'), valueText: `${stats.completionPct}%`, color: 'emerald', percentage: stats.completionPct },
    { label: t('overdue'), valueText: stats.overdueTasks, color: 'red', percentage: stats.overdueTasks > 0 ? 100 : 0 },
    { label: t('team'), valueText: stats.teamMembers, color: 'purple', percentage: 100 },
  ];

  const maxPriority = Math.max(...priorityData.map(p => p.count), 1);
  const maxWorkload = Math.max(...teamWorkload.map(m => m.taskCount), 1);
  const currentProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="p-3 sm:p-4 md:p-6 overflow-y-auto h-full custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 stagger-children">
        {/* Active Project Context Banner */}
        {currentProject && (
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 p-3 sm:p-3.5 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent border border-blue-500/20 backdrop-blur-sm shadow-sm animate-fade-in">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 max-w-full sm:max-w-[65%]">
              <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: currentProject.color }}></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: currentProject.color }}></span>
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400">{t('active_scope')}</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[120px] sm:max-w-xs">{currentProject.name}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-semibold flex-shrink-0">
                    {filteredTasks.length} {filteredTasks.length === 1 ? t('task') : t('tasks')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setActiveView('kanban')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t('open_kanban_board')}</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => setActiveProjectId('all')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={t('show_all_projects')}
              >
                {t('show_all_projects')}
              </button>
            </div>
          </div>
        )}

        {/* Stat Cards Row */}
        <div className="flex flex-wrap items-center gap-3">
          {statCards.map((card, i) => (
            <PillMetricCard
              key={i}
              label={card.label}
              valueText={card.valueText}
              percentage={card.percentage}
              color={card.color}
            />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Status Breakdown - Donut */}
          <div className="glass-card p-4 sm:p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">{t('status_breakdown')}</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {(() => {
                    let offset = 0;
                    const radius = 45;
                    const circumference = 2 * Math.PI * radius;
                    return statusData.map((s, i) => {
                      const pct = s.count / totalForDonut;
                      const dashLength = pct * circumference;
                      const rotation = offset * 360 - 90;
                      offset += pct;
                      return (
                        <circle
                          key={s.id}
                          cx="60" cy="60" r={radius}
                          fill="none"
                          stroke={s.color}
                          strokeWidth="16"
                          strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                          transform={`rotate(${rotation} 60 60)`}
                          className="transition-all duration-700"
                        />
                      );
                    });
                  })()}
                  <text x="60" y="55" textAnchor="middle" className="fill-slate-800 dark:fill-white text-2xl font-extrabold" style={{ fontSize: '28px' }}>{stats.totalTasks}</text>
                  <text x="60" y="72" textAnchor="middle" className="fill-slate-400 text-xs uppercase font-medium" style={{ fontSize: '10px' }}>{(t('tasks') || 'TASKS').toUpperCase()}</text>
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                {statusData.map(s => (
                  <div key={s.id} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-[12px] text-slate-600 dark:text-slate-400 flex-1">{s.label}</span>
                    <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 tabular-nums w-5 text-right">{s.count}</span>
                    <span className="text-[10px] text-slate-400 tabular-nums w-8 text-right">
                      {totalForDonut > 0 ? Math.round((s.count / totalForDonut) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Priority Distribution - Bar Chart */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">{t('priority_distribution')}</h3>
            <div className="flex items-end gap-4 h-[120px] mt-4">
              {priorityData.map(p => (
                <div key={p.id} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 tabular-nums">{p.count}</span>
                  <div className="w-full relative" style={{ height: '80px' }}>
                    <div
                      className="absolute bottom-0 w-full rounded-t-md transition-all duration-700"
                      style={{
                        backgroundColor: p.color,
                        height: `${maxPriority > 0 ? (p.count / maxPriority) * 100 : 0}%`,
                        minHeight: p.count > 0 ? '4px' : '0',
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Workload - Horizontal Bar */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">{t('team_workload')}</h3>
            <div className="space-y-3">
              {teamWorkload.length === 0 ? (
                <p className="text-[12px] text-slate-400 dark:text-slate-500 py-8 text-center">{t('no_members') || 'No team members added yet'}</p>
              ) : (
                teamWorkload.map(m => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="avatar avatar-sm text-[9px]" style={{ backgroundColor: m.avatarColor }}>
                      {getInitials(m.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300 truncate">{m.name.split(' ')[0]}</span>
                        <span className="text-[11px] font-bold text-slate-500 tabular-nums">{m.taskCount}</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(m.taskCount / maxWorkload) * 100}%`,
                            backgroundColor: m.avatarColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Project Progress */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">{t('project_progress')}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t('click_project_to_view')}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openNewProjectModal()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 transition-all cursor-pointer shadow-xs"
                  title={t('create_project')}
                >
                  <Plus size={13} />
                  <span>{t('new_project')}</span>
                </button>
              </div>
            </div>
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
              {projectProgress.length === 0 ? (
                <p className="text-[12px] text-slate-400 dark:text-slate-500 py-8 text-center">{t('no_projects') || 'No projects available'}</p>
              ) : (
                projectProgress.map(p => {
                  const isSelected = activeProjectId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveProjectId(p.id);
                        setActiveView('kanban');
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer border ${
                        isSelected
                          ? 'bg-blue-500/10 border-blue-500/40 shadow-sm ring-1 ring-blue-500/30'
                          : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:shadow-sm'
                      }`}
                      title={`${t('open_board_title')}: ${p.name}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-3 h-3 rounded shadow-sm flex-shrink-0" style={{ backgroundColor: p.color }} />
                          <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                            {p.name}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-500 dark:text-blue-400">
                              {t('active')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                            {p.completed} / {p.total}
                          </span>
                          <span className="text-[11px] font-semibold text-blue-500 dark:text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                            {t('board')} <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                      <div className="h-4 bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden relative shadow-inner">
                        <div
                          className="h-full transition-all duration-700 ease-out flex items-center px-2 rounded-full"
                          style={{
                            width: `${Math.max(p.progress, 0)}%`,
                            backgroundColor: p.color,
                            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.2))`
                          }}
                        >
                          {p.progress > 15 && (
                            <span className="text-[9px] font-bold text-white drop-shadow truncate">
                              {p.progress}%
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Completion Trend - Line Chart */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">{t('completion_trend')}</h3>
            <div className="relative h-[140px]">
              <svg width="100%" height="140" viewBox="0 0 400 140" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(v => (
                  <line key={v} x1="40" y1={120 - v * 1.1} x2="390" y2={120 - v * 1.1} stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="0.5" />
                ))}
                {/* Y-axis labels */}
                {[0, 50, 100].map(v => (
                  <text key={v} x="30" y={124 - v * 1.1} textAnchor="end" className="fill-slate-400" style={{ fontSize: '9px' }}>{v}%</text>
                ))}
                {/* Line */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={trendData.map((d, i) => `${60 + i * 64},${120 - d.value * 1.1}`).join(' ')}
                />
                {/* Area fill */}
                <polygon
                  fill="url(#trendGrad)"
                  points={`60,120 ${trendData.map((d, i) => `${60 + i * 64},${120 - d.value * 1.1}`).join(' ')} ${60 + 5 * 64},120`}
                />
                {/* Gradient */}
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Dots */}
                {trendData.map((d, i) => (
                  <circle key={i} cx={60 + i * 64} cy={120 - d.value * 1.1} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                ))}
                {/* X labels */}
                {trendData.map((d, i) => (
                  <text key={i} x={60 + i * 64} y="138" textAnchor="middle" className="fill-slate-400" style={{ fontSize: '8px' }}>{d.label}</text>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
