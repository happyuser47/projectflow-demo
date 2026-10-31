import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { STATUS_MAP, PRIORITY_MAP } from '../utils/constants';
import { getInitials, formatDateShort, sortTasks } from '../utils/helpers';
import ProjectScopeBar from '../components/ProjectScopeBar';
import { ArrowUpDown, ArrowUp, ArrowDown, StickyNote } from 'lucide-react';

export default function TableView({ onEditTask }) {
  const { filteredTasks, projects, team, isDark, language, openNotes, t } = useApp();
  const [sortField, setSortField] = useState('title');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedTasks = useMemo(() => {
    return sortTasks(filteredTasks, sortField, sortDir);
  }, [filteredTasks, sortField, sortDir]);

  const columns = [
    { id: 'title', label: t('title'), width: 'flex-1 min-w-[220px]' },
    { id: 'projectId', label: t('project'), width: 'w-[140px]' },
    { id: 'status', label: t('status'), width: 'w-[120px]' },
    { id: 'priority', label: t('priority'), width: 'w-[100px]' },
    { id: 'assigneeId', label: t('assignee'), width: 'w-[150px]' },
    { id: 'startDate', label: t('start_date'), width: 'w-[90px]' },
    { id: 'endDate', label: t('end_date'), width: 'w-[90px]' },
  ];

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="text-slate-300 dark:text-slate-600" />;
    return sortDir === 'asc'
      ? <ArrowUp size={12} className="text-blue-500" />
      : <ArrowDown size={12} className="text-blue-500" />;
  };

  return (
    <div className="h-full flex flex-col p-3 sm:p-4 md:p-6 overflow-hidden">
      <ProjectScopeBar />
      <div className="hidden md:block flex-1 overflow-auto custom-scrollbar p-0 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 shadow-sm">
        <table className="w-full min-w-[900px] hidden md:table">
          {/* Header */}
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50 dark:bg-navy-800 border-b border-slate-200 dark:border-slate-700">
              {columns.map(col => (
                <th
                  key={col.id}
                  onClick={() => handleSort(col.id)}
                  className={`${col.width} text-left px-4 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors select-none`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    <SortIcon field={col.id} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {sortedTasks.map((task, i) => {
              const project = projects.find(p => p.id === task.projectId);
              const assignee = team.find(m => m.id === task.assigneeId);
              const status = STATUS_MAP[task.status];
              const priority = PRIORITY_MAP[task.priority];

              return (
                <tr
                  key={task.id}
                  onClick={() => onEditTask?.(task)}
                  className={`table-row cursor-pointer border-b border-slate-100 dark:border-slate-800 ${
                    i % 2 === 0 ? 'bg-white dark:bg-navy-900' : 'bg-slate-50/50 dark:bg-navy-900'
                  }`}
                >
                  {/* Title */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 max-w-[320px]">
                      <p className="text-[13px] font-medium text-slate-800 dark:text-slate-200 truncate">
                        {task.title}
                      </p>
                      {task.notes && task.notes.trim() && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openNotes({ tab: 'task', taskId: task.id });
                          }}
                          className="text-amber-500 hover:text-amber-600 dark:text-amber-400 p-0.5 rounded hover:bg-amber-50 dark:hover:bg-amber-500/15 flex-shrink-0 cursor-pointer"
                          title={`${t('task_notes')}: ${task.notes.slice(0, 50)}...`}
                        >
                          <StickyNote size={12} className="fill-amber-400/30" />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Project */}
                  <td className="px-4 py-3">
                    {project && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
                        <span className="text-[12px] text-slate-600 dark:text-slate-400 truncate">{project.name}</span>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    {status && (
                      <span
                        className="badge"
                        style={{
                          backgroundColor: isDark ? `${status.color}20` : `${status.color}18`,
                          color: isDark ? '#ffffff' : status.color,
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: status.color }} />
                        {t(status.id)}
                      </span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3">
                    {priority && (
                      <span
                        className="badge"
                        style={{
                          backgroundColor: isDark ? priority.darkBg : priority.bg,
                          color: isDark ? '#ffffff' : priority.color,
                        }}
                      >
                        {t(priority.id)}
                      </span>
                    )}
                  </td>

                  {/* Assignee */}
                  <td className="px-4 py-3">
                    {assignee ? (
                      <div className="flex items-center gap-2">
                        <div className="avatar avatar-sm text-[9px]" style={{ backgroundColor: assignee.avatarColor }}>
                          {getInitials(assignee.name)}
                        </div>
                        <span className="text-[12px] text-slate-600 dark:text-slate-400">{assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-[12px] text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </td>

                  {/* Start Date */}
                  <td className="px-4 py-3">
                    <span className="text-[12px] text-slate-500 dark:text-slate-400 tabular-nums">{formatDateShort(task.startDate, language)}</span>
                  </td>

                  {/* End Date */}
                  <td className="px-4 py-3">
                    <span className="text-[12px] text-slate-500 dark:text-slate-400 tabular-nums">{formatDateShort(task.endDate, language)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedTasks.length === 0 && (
          <div className="flex items-center justify-center py-16 hidden md:flex">
            <p className="text-sm text-slate-400 dark:text-slate-500">{t('no_tasks_filter')}</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex-1 overflow-y-auto p-3 xs:p-4 space-y-3 bg-slate-50 dark:bg-navy-900 touch-momentum">
        {/* Mobile Sort Control */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('tasks')}</span>
          <select 
            value={sortField} 
            onChange={e => handleSort(e.target.value)}
            className="text-xs font-semibold bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 outline-none shadow-xs text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {columns.map(c => <option key={c.id} value={c.id}>{t('sorted_by')} {c.label}</option>)}
          </select>
        </div>

        {sortedTasks.map(task => {
          const project = projects.find(p => p.id === task.projectId);
          const assignee = team.find(m => m.id === task.assigneeId);
          const status = STATUS_MAP[task.status];
          const priority = PRIORITY_MAP[task.priority];

          return (
            <div 
              key={task.id}
              onClick={() => onEditTask?.(task)}
              className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {task.title}
                </h4>
                {priority && (
                  <span
                    className="badge flex-shrink-0"
                    style={{
                      backgroundColor: isDark ? priority.darkBg : priority.bg,
                      color: isDark ? '#ffffff' : priority.color,
                      fontSize: '10px'
                    }}
                  >
                    {t(priority.id) || priority.label}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {project && (
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/30 px-2 py-1 rounded-md">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{project.name}</span>
                  </div>
                )}
                {status && (
                  <span
                    className="badge px-2 py-1 rounded-md"
                    style={{
                      backgroundColor: isDark ? `${status.color}20` : `${status.color}18`,
                      color: isDark ? '#ffffff' : status.color,
                      fontSize: '11px'
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: status.color }} />
                    {t(status.id) || status.label}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-medium uppercase">{t('start_date')}:</span>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{formatDateShort(task.startDate, language)}</span>
                  </div>
                  <div className="w-px h-3 bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-medium uppercase">{t('end_date')}:</span>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{formatDateShort(task.endDate, language)}</span>
                  </div>
                </div>
                
                {assignee && (
                  <div className="avatar avatar-sm text-[10px]" style={{ backgroundColor: assignee.avatarColor }}>
                    {getInitials(assignee.name)}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {sortedTasks.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-slate-400 dark:text-slate-500">{t('no_tasks_filter')}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 px-4 py-2">
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          {sortedTasks.length} {sortedTasks.length !== 1 ? t('tasks') : t('task')}
          {sortField !== 'title' && ` · ${t('sorted_by')} ${columns.find(c => c.id === sortField)?.label || sortField}`}
        </p>
      </div>
    </div>
  );
}
