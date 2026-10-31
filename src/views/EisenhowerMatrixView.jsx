import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import TaskCard from '../components/TaskCard';
import ProjectScopeBar from '../components/ProjectScopeBar';
import { AlertCircle, CalendarClock, Users, Trash2, Plus } from 'lucide-react';

export default function EisenhowerMatrixView({ onEditTask, onNewTask }) {
  const { filteredTasks, updateTask, t } = useApp();
  const [dragOverQuad, setDragOverQuad] = useState(null);
  const [mobileQuadrant, setMobileQuadrant] = useState('all');

  const QUADRANTS = [
    {
      id: 'urgent',
      title: t('do_first'),
      subtitle: t('urgent_important'),
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-500/10',
      borderColor: 'border-red-200 dark:border-red-900/50',
      dropHoverClass: 'bg-red-100/50 dark:bg-red-500/20'
    },
    {
      id: 'high',
      title: t('schedule'),
      subtitle: t('not_urgent_important'),
      icon: CalendarClock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-500/10',
      borderColor: 'border-orange-200 dark:border-orange-900/50',
      dropHoverClass: 'bg-orange-100/50 dark:bg-orange-500/20'
    },
    {
      id: 'medium',
      title: t('delegate'),
      subtitle: t('urgent_not_important'),
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      borderColor: 'border-blue-200 dark:border-blue-900/50',
      dropHoverClass: 'bg-blue-100/50 dark:bg-blue-500/20'
    },
    {
      id: 'low',
      title: t('dont_do'),
      subtitle: t('not_urgent_not_important'),
      icon: Trash2,
      color: 'text-slate-500',
      bgColor: 'bg-slate-50 dark:bg-slate-500/10',
      borderColor: 'border-slate-200 dark:border-slate-700/50',
      dropHoverClass: 'bg-slate-100/50 dark:bg-slate-500/20'
    }
  ];

  const handleDragOver = useCallback((e, quadId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverQuad(quadId);
  }, []);

  const handleDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverQuad(null);
    }
  }, []);

  const handleDrop = useCallback((e, quadId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTask(taskId, { priority: quadId });
    }
    setDragOverQuad(null);
  }, [updateTask]);

  const displayedQuadrants = mobileQuadrant === 'all'
    ? QUADRANTS
    : QUADRANTS.filter(q => q.id === mobileQuadrant);

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-full h-auto lg:h-full flex flex-col lg:overflow-hidden custom-scrollbar">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-1">{t('matrix')}</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t('matrix_desc')}</p>
      </div>
      
      <ProjectScopeBar />

      {/* Mobile Quadrant Quick Switcher (Visible on < lg screens) */}
      <div className="lg:hidden mb-3.5 flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1">
        <button
          onClick={() => setMobileQuadrant('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            mobileQuadrant === 'all'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-50'
          }`}
        >
          <span>{t('all_quadrants')}</span>
          <span className="ml-1.5 text-[10px] opacity-75 font-bold">({filteredTasks.length})</span>
        </button>

        {QUADRANTS.map(q => {
          const count = filteredTasks.filter(t => t.priority === q.id).length;
          const isSelected = mobileQuadrant === q.id;
          const Icon = q.icon;
          return (
            <button
              key={q.id}
              onClick={() => setMobileQuadrant(q.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-50'
              }`}
            >
              <Icon size={13} className={isSelected ? 'text-white' : q.color} />
              <span>{q.title}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quadrants Grid */}
      <div className={`grid grid-cols-1 ${mobileQuadrant === 'all' ? 'lg:grid-cols-2 lg:grid-rows-2' : ''} gap-4 sm:gap-6 flex-1 h-auto lg:h-full min-h-0`}>
        {displayedQuadrants.map(quad => {
          const quadTasks = filteredTasks.filter(t => t.priority === quad.id);
          const isDragOver = dragOverQuad === quad.id;
          const Icon = quad.icon;

          return (
            <div
              key={quad.id}
              className={`flex flex-col rounded-2xl border-2 transition-all overflow-hidden ${quad.borderColor} ${isDragOver ? quad.dropHoverClass : quad.bgColor} ${
                mobileQuadrant === 'all' ? 'h-auto lg:h-full min-h-[220px] lg:min-h-0' : 'flex-1 min-h-[420px] lg:min-h-0'
              }`}
              onDragOver={(e) => handleDragOver(e, quad.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, quad.id)}
            >
              {/* Header */}
              <div className="p-3 sm:p-4 border-b border-inherit bg-white/60 dark:bg-navy-900/60 flex items-center justify-between gap-2 backdrop-blur-sm shadow-xs z-10 relative">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-lg ${quad.bgColor} flex-shrink-0 border border-inherit`}>
                    <Icon size={16} className={quad.color} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-sm sm:text-base ${quad.color} truncate`}>{quad.title}</h3>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-navy-800/80 rounded-full px-2 py-0.5 tabular-nums border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                        {quadTasks.length}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 dark:text-slate-400 truncate">{quad.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => onNewTask?.(null, quad.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-white/80 dark:hover:bg-navy-800/80 transition-colors cursor-pointer"
                    title={`${t('new_task')}: ${quad.title}`}
                    aria-label={`${t('new_task')}: ${quad.title}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className={`p-3 sm:p-4 space-y-2.5 sm:space-y-3 relative custom-scrollbar overflow-y-auto flex-1 ${
                mobileQuadrant === 'all'
                  ? 'min-h-[120px] max-h-[480px] lg:max-h-none'
                  : 'min-h-[200px] max-h-none'
              }`}>
                {quadTasks.map(task => (
                  <TaskCard key={task.id} task={task} onEdit={onEditTask} />
                ))}
                
                {quadTasks.length === 0 && (
                  <div className={`py-8 sm:py-12 flex flex-col items-center justify-center text-center transition-opacity duration-300 ${isDragOver ? 'opacity-100' : 'opacity-60'}`}>
                    <div className={`p-2.5 sm:p-3 rounded-full mb-2 ${isDragOver ? quad.bgColor : 'bg-white/60 dark:bg-navy-800/60 shadow-xs'}`}>
                      <Icon size={22} className={isDragOver ? quad.color : 'text-slate-400 dark:text-slate-500'} />
                    </div>
                    <p className={`text-xs sm:text-sm font-medium ${isDragOver ? quad.color : 'text-slate-400 dark:text-slate-500'}`}>
                      {isDragOver ? t('drop_here') : t('no_tasks_quadrant')}
                    </p>
                    <button
                      onClick={() => onNewTask?.(null, quad.id)}
                      className="mt-2 text-[11px] font-semibold text-blue-500 hover:underline cursor-pointer"
                    >
                      + {t('new_task')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
