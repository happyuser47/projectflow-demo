import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { STATUSES } from '../utils/constants';
import TaskCard from '../components/TaskCard';
import ProjectScopeBar from '../components/ProjectScopeBar';
import { Plus } from 'lucide-react';

export default function KanbanView({ onEditTask, onNewTask }) {
  const { filteredTasks, moveTask, t } = useApp();
  const [dragOverCol, setDragOverCol] = useState(null);
  const [mobileColumn, setMobileColumn] = useState('all');

  const handleDragOver = useCallback((e, statusId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(statusId);
  }, []);

  const handleDragLeave = useCallback((e) => {
    // Only reset if leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverCol(null);
    }
  }, []);

  const handleDrop = useCallback((e, statusId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, statusId);
    }
    setDragOverCol(null);
  }, [moveTask]);

  const handleQuickAdd = (statusId) => {
    onNewTask?.(statusId);
  };

  const displayedStatuses = mobileColumn === 'all' 
    ? STATUSES 
    : STATUSES.filter(s => s.id === mobileColumn);

  return (
    <div className="p-3 sm:p-4 lg:p-6 h-full flex flex-col overflow-y-auto lg:overflow-x-auto custom-scrollbar">
      <ProjectScopeBar />

      {/* Mobile Column Quick Switcher (Visible on < lg screens) */}
      <div className="lg:hidden mb-3.5 flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1">
        <button
          onClick={() => setMobileColumn('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            mobileColumn === 'all'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-50'
          }`}
        >
          <span>{t('all_columns')}</span>
          <span className="ml-1.5 text-[10px] opacity-75 font-bold">({filteredTasks.length})</span>
        </button>

        {STATUSES.map(s => {
          const count = filteredTasks.filter(t => t.status === s.id).length;
          const isSelected = mobileColumn === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setMobileColumn(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-50'
              }`}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span>{t(s.id)}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Columns Grid / Carousel */}
      <div className={`flex ${mobileColumn === 'all' ? 'overflow-x-auto snap-carousel pb-6' : 'flex-col'} lg:flex-row gap-4 sm:gap-6 h-auto lg:h-full min-w-full lg:min-w-max lg:pb-0 flex-1 touch-momentum`}>
        {displayedStatuses.map(status => {
          const columnTasks = filteredTasks.filter(t => t.status === status.id);
          const isDragOver = dragOverCol === status.id;

          return (
            <div
              key={status.id}
              className={`kanban-column flex flex-col bg-slate-50/50 dark:bg-navy-800/40 lg:bg-transparent rounded-2xl lg:rounded-none p-4 lg:p-0 border border-slate-200/80 dark:border-slate-800 lg:border-transparent ${
                mobileColumn === 'all'
                  ? 'w-[85vw] xs:w-[320px] snap-card flex-shrink-0 lg:w-auto lg:flex-1 lg:min-w-[280px] lg:max-w-[320px]'
                  : 'w-full'
              } ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, status.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 lg:px-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }} />
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">{t(status.id)}</h3>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-white/5 rounded-full px-2 py-0.5 tabular-nums shadow-xs lg:shadow-none">
                    {columnTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => handleQuickAdd(status.id)}
                  className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-white lg:hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer shadow-xs lg:shadow-none bg-white lg:bg-transparent dark:bg-navy-700 lg:dark:bg-transparent"
                  title={`${t('new_task')}: ${t(status.id)}`}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-3 lg:space-y-2.5 overflow-y-auto pb-2 lg:pr-1 custom-scrollbar">
                {columnTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                  />
                ))}

                {/* Empty column state */}
                {columnTasks.length === 0 && (
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors ${
                    isDragOver
                      ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-500/5'
                      : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-navy-900/50 lg:bg-transparent'
                  }`}>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {isDragOver ? t('drop_here') : (t('no_tasks') || 'No tasks in this column')}
                    </p>
                    <button
                      onClick={() => handleQuickAdd(status.id)}
                      className="mt-2 text-[11px] text-blue-500 hover:underline font-semibold cursor-pointer"
                    >
                      + {t('new_task')}
                    </button>
                  </div>
                )}

                {/* Drop zone indicator when dragging */}
                {isDragOver && columnTasks.length > 0 && (
                  <div className="border-2 border-dashed border-blue-400 rounded-xl p-3 flex items-center justify-center bg-blue-50/50 dark:bg-blue-500/5 animate-fade-in">
                    <p className="text-[11px] text-blue-500 font-medium">{t('drop_here')}</p>
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
