import { useApp } from '../context/AppContext';
import { PRIORITY_MAP, TAG_COLORS } from '../utils/constants';
import { getInitials, getRelativeDueDate, isOverdue } from '../utils/helpers';
import { Clock, AlertCircle, ChevronUp, Minus, ChevronDown, StickyNote } from 'lucide-react';

const PRIORITY_CONFIG = {
  urgent: {
    icon: AlertCircle,
    styles: 'bg-red-50 text-red-600 border-red-200/80 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30',
  },
  high: {
    icon: ChevronUp,
    styles: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
  },
  medium: {
    icon: Minus,
    styles: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30',
  },
  low: {
    icon: ChevronDown,
    styles: 'bg-slate-100 text-slate-600 border-slate-200/80 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  },
};

export default function TaskCard({ task, onEdit, onDragStart }) {
  const { projects, team, isDark, language, openNotes, t } = useApp();
  const project = projects.find(p => p.id === task.projectId);
  const assignee = team.find(m => m.id === task.assigneeId);
  const priority = PRIORITY_MAP[task.priority];
  const overdue = task.status !== 'done' && isOverdue(task.endDate);
  const dueText = getRelativeDueDate(task.endDate, t, language);

  return (
    <div
      className="task-card animate-fade-in"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.currentTarget.classList.add('dragging');
        onDragStart?.(task.id);
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove('dragging');
      }}
      onClick={() => onEdit?.(task)}
    >
      {/* Project label with colored left border */}
      {project && (
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-1 h-3.5 rounded-full" style={{ backgroundColor: project.color }} />
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {project.name}
          </span>
        </div>
      )}

      {/* Title */}
      <h4 className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-snug mb-2">
        {task.title}
      </h4>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.tags.map(tag => {
            const tagStyle = TAG_COLORS[tag] || { bg: '#f1f5f9', color: '#475569', darkBg: '#1e293b' };
            return (
              <span
                key={tag}
                className="badge"
                style={{
                  backgroundColor: isDark ? tagStyle.darkBg : tagStyle.bg,
                  color: isDark ? '#ffffff' : tagStyle.color,
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}

      {/* Footer: Due date + Note badge + Priority Tag + Assignee */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5 min-w-0">
          {dueText && (
            <div className={`flex items-center gap-1 text-[11px] font-medium ${
              overdue ? 'text-red-500 font-semibold' : 'text-slate-400 dark:text-slate-500'
            }`}>
              <Clock size={11} />
              <span>{dueText}</span>
            </div>
          )}
          {task.notes && task.notes.trim() && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openNotes({ tab: 'task', taskId: task.id });
              }}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30 dark:hover:bg-amber-500/25 transition-colors cursor-pointer"
              title={`${t('task_notes')}: ${task.notes.slice(0, 60)}`}
              aria-label={t('task_notes')}
            >
              <StickyNote size={10} className="fill-amber-400/30 text-amber-600 dark:text-amber-400" />
              <span>{t('notes')}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Priority short tag with color grading */}
          {priority && (
            (() => {
              const config = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
              const Icon = config.icon;
              return (
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight border transition-colors ${config.styles}`}
                  title={`${t('priority') || 'Priority'}: ${t(priority.id)}`}
                >
                  <Icon size={10} className="stroke-[2.5]" />
                  <span>{t(priority.id)}</span>
                </span>
              );
            })()
          )}

          {/* Assignee avatar */}
          {assignee && (
            <div
              className="avatar avatar-sm text-[9px] shadow-2xs"
              style={{ backgroundColor: assignee.avatarColor }}
              title={assignee.name}
            >
              {getInitials(assignee.name)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
