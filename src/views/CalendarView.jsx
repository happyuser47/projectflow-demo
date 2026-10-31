import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isSameDay, parseISO, isWithinInterval, startOfDay, endOfDay
} from 'date-fns';
import { useApp } from '../context/AppContext';
import ProjectScopeBar from '../components/ProjectScopeBar';

export default function CalendarView({ onEditTask, onNewTask }) {
  const { filteredTasks, language, t } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [popoverDay, setPopoverDay] = useState(null);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // Priority styling map with light and dark mode variants
  const priorityStyles = {
    urgent: { bg: 'bg-red-50 dark:bg-red-500/20', text: 'text-red-600 dark:text-white', border: 'border-red-500' },
    high: { bg: 'bg-orange-50 dark:bg-orange-500/20', text: 'text-orange-600 dark:text-white', border: 'border-orange-500' },
    medium: { bg: 'bg-blue-50 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-white', border: 'border-blue-500' },
    low: { bg: 'bg-slate-100 dark:bg-slate-500/20', text: 'text-slate-600 dark:text-white', border: 'border-slate-500' }
  };

  // Map tasks with parsed dates for easy comparison
  const tasksWithDates = useMemo(() => {
    return filteredTasks.filter(t => t.startDate && t.endDate).map(t => ({
      ...t,
      parsedStart: startOfDay(parseISO(t.startDate)),
      parsedEnd: endOfDay(parseISO(t.endDate))
    }));
  }, [filteredTasks]);

  const getTasksForDay = (day) => {
    const targetDay = startOfDay(day);
    return tasksWithDates.filter(t => 
      isWithinInterval(targetDay, { start: t.parsedStart, end: t.parsedEnd })
    ).sort((a, b) => {
      const pMap = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
    });
  };

  const locale = useMemo(() => {
    const localeMap = { ja: 'ja-JP', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', en: 'en-US' };
    return localeMap[language] || 'en-US';
  }, [language]);

  const monthTitle = useMemo(() => {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(currentDate);
  }, [currentDate, locale]);

  const weekDays = useMemo(() => {
    const baseSunday = new Date(2026, 9, 4); // Oct 4, 2026 is a Sunday
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(baseSunday);
      d.setDate(baseSunday.getDate() + i);
      return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
    });
  }, [locale]);

  return (
    <div className="h-full flex flex-col p-3 sm:p-4 md:p-6 bg-slate-50 dark:bg-slate-900 animate-fade-in text-slate-800 dark:text-slate-200">
      <ProjectScopeBar />

      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <CalendarIcon size={18} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white capitalize">
            {monthTitle}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={goToToday}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {t('today') || 'Today'}
          </button>
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-lg overflow-hidden">
            <button 
              onClick={prevMonth}
              className="p-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700/50"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextMonth}
              className="p-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Grid Structure */}
      <div className="hidden md:flex flex-1 border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden flex-col min-h-0 bg-white dark:bg-slate-900 shadow-lg dark:shadow-2xl">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/80 flex-shrink-0">
          {weekDays.map(day => (
            <div key={day} className="py-3 text-center text-[11px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 overflow-y-auto">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const dayTasks = getTasksForDay(day);
            const showPopover = popoverDay && isSameDay(popoverDay, day);

            return (
              <div 
                key={day.toISOString()} 
                className={`relative min-h-[120px] lg:min-h-[150px] p-1.5 lg:p-2 border-b border-r border-slate-200 dark:border-slate-700/50 flex flex-col transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30
                  ${!isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-800/50'}
                  ${idx % 7 === 6 ? 'border-r-0' : ''}
                  ${isToday ? 'ring-1 ring-inset ring-blue-500/50 bg-blue-50 dark:bg-blue-500/[0.02]' : ''}
                `}
                onClick={() => onNewTask?.()}
              >
                {/* Day Cell Header */}
                <div className="flex justify-between items-center mb-1.5 flex-shrink-0">
                  <span className={`w-6 h-6 lg:w-7 lg:h-7 flex items-center justify-center rounded-full text-xs font-semibold
                    ${isToday ? 'bg-blue-500 text-white shadow-md dark:shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 
                      isCurrentMonth ? 'text-slate-700 dark:text-white' : 'text-slate-400 dark:text-slate-500'}
                  `}>
                    {format(day, 'd')}
                  </span>
                </div>

                {/* Premium Task Badges */}
                <div className="flex-1 flex flex-col gap-1">
                  {dayTasks.slice(0, 3).map(task => {
                    const styles = priorityStyles[task.priority] || priorityStyles.medium;
                    return (
                      <div
                        key={task.id}
                        onClick={(e) => { e.stopPropagation(); onEditTask?.(task); }}
                        className={`px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-md text-[9px] lg:text-[10px] font-medium cursor-pointer transition-all hover:brightness-110 truncate border-l-[3px] flex-shrink-0 ${styles.bg} ${styles.text} ${styles.border}`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    );
                  })}
                  
                  {/* Overflow Protection */}
                  {dayTasks.length > 3 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPopoverDay(showPopover ? null : day);
                      }}
                      className="text-left px-1.5 py-0.5 text-[9px] lg:text-[10px] font-semibold text-slate-500 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors mt-0.5 flex-shrink-0"
                    >
                      {t('n_more', { count: dayTasks.length - 3 }) || `+ ${dayTasks.length - 3} more`}
                    </button>
                  )}
                </div>

                {/* Absolute-Positioned Popover (Prevent edge clipping) */}
                {showPopover && (
                  <div 
                    className={`absolute z-50 top-8 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl dark:shadow-2xl p-3 flex flex-col animate-scale-in ${
                      idx % 7 === 0 ? 'left-1' : idx % 7 === 6 ? 'right-1' : 'left-1/2 -translate-x-1/2'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        {new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(day)}
                      </span>
                      <button onClick={() => setPopoverDay(null)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar pr-1">
                      {dayTasks.map(task => {
                        const styles = priorityStyles[task.priority] || priorityStyles.medium;
                        return (
                          <div 
                            key={task.id} 
                            onClick={() => { setPopoverDay(null); onEditTask?.(task); }}
                            className={`px-2 py-1.5 rounded-md text-[11px] font-medium cursor-pointer transition-all hover:brightness-110 truncate border-l-[3px] flex-shrink-0 ${styles.bg} ${styles.text} ${styles.border}`}
                          >
                            {task.title}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Agenda Structure */}
      <div className="md:hidden flex-1 overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
        {days.filter(d => isSameMonth(d, currentDate)).map(day => {
          const isToday = isSameDay(day, new Date());
          const dayTasks = getTasksForDay(day);

          return (
            <div 
              key={day.toISOString()} 
              className={`p-4 flex flex-col gap-3 transition-colors ${isToday ? 'bg-blue-50/50 dark:bg-blue-500/[0.02]' : ''}`}
              onClick={() => onNewTask?.()}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold
                    ${isToday ? 'bg-blue-500 text-white shadow-md' : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800'}
                  `}>
                    {format(day, 'd')}
                  </span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    {new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(day)}
                  </span>
                </div>
                {dayTasks.length > 0 && (
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {dayTasks.length} {dayTasks.length === 1 ? t('task') : t('tasks')}
                  </span>
                )}
              </div>

              {dayTasks.length > 0 ? (
                <div className="flex flex-col gap-2 pl-11">
                  {dayTasks.map(task => {
                    const styles = priorityStyles[task.priority] || priorityStyles.medium;
                    return (
                      <div
                        key={task.id}
                        onClick={(e) => { e.stopPropagation(); onEditTask?.(task); }}
                        className={`px-3 py-2 rounded-lg text-[13px] font-medium cursor-pointer transition-all hover:brightness-110 border-l-[3px] shadow-sm ${styles.bg} ${styles.text} ${styles.border}`}
                      >
                        {task.title}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="pl-11 py-1">
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 italic">{t('no_tasks')}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
