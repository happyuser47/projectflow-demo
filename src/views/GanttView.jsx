import { useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { differenceInDays, addDays, format, parseISO, startOfDay, isWeekend } from 'date-fns';
import { getInitials } from '../utils/helpers';
import { PRIORITY_MAP } from '../utils/constants';
import ProjectScopeBar from '../components/ProjectScopeBar';

export default function GanttView({ onEditTask }) {
  const { filteredTasks, projects, team, isDark, language, t } = useApp();
  const scrollRef = useRef(null);

  // Filter tasks that have both start and end dates
  const ganttTasks = useMemo(() => {
    return filteredTasks
      .filter(t => t.startDate && t.endDate)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [filteredTasks]);

  // Calculate date range
  const { startDate, endDate, totalDays, dates } = useMemo(() => {
    if (ganttTasks.length === 0) {
      const today = new Date();
      const start = addDays(today, -7);
      const end = addDays(today, 30);
      const total = differenceInDays(end, start) + 1;
      const dateArr = [];
      for (let i = 0; i < total; i++) {
        dateArr.push(addDays(start, i));
      }
      return { startDate: start, endDate: end, totalDays: total, dates: dateArr };
    }

    let minDate = parseISO(ganttTasks[0].startDate);
    let maxDate = parseISO(ganttTasks[0].endDate);

    ganttTasks.forEach(t => {
      const s = parseISO(t.startDate);
      const e = parseISO(t.endDate);
      if (s < minDate) minDate = s;
      if (e > maxDate) maxDate = e;
    });

    // Add padding
    minDate = addDays(minDate, -3);
    maxDate = addDays(maxDate, 5);

    const total = differenceInDays(maxDate, minDate) + 1;
    const dateArr = [];
    for (let i = 0; i < total; i++) {
      dateArr.push(addDays(minDate, i));
    }

    return { startDate: minDate, endDate: maxDate, totalDays: total, dates: dateArr };
  }, [ganttTasks]);

  const DAY_WIDTH = 36;
  const ROW_HEIGHT = 48;
  const HEADER_HEIGHT = 60;
  const LEFT_PANEL_WIDTH = 320;

  // Group dates by month for headers
  const months = useMemo(() => {
    const result = [];
    let currentMonth = null;
    let currentStart = 0;
    const localeMap = { ja: 'ja-JP', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', en: 'en-US' };
    const locale = localeMap[language] || 'en-US';

    dates.forEach((d, i) => {
      const monthKey = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(d);
      if (monthKey !== currentMonth) {
        if (currentMonth) {
          result.push({ label: currentMonth, start: currentStart, width: (i - currentStart) * DAY_WIDTH });
        }
        currentMonth = monthKey;
        currentStart = i;
      }
    });
    if (currentMonth) {
      result.push({ label: currentMonth, start: currentStart, width: (dates.length - currentStart) * DAY_WIDTH });
    }
    return result;
  }, [dates, language]);

  // Today line position
  const todayIndex = useMemo(() => {
    const today = startOfDay(new Date());
    return differenceInDays(today, startDate);
  }, [startDate]);

  return (
    <div className="h-full flex flex-col p-3 sm:p-4 md:p-6 overflow-hidden">
      <ProjectScopeBar />
      
      {/* Mobile Swipe Notice */}
      <div className="sm:hidden mb-2 text-center">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700/60 inline-flex items-center gap-1">
          <span>↔</span>
          <span>{t('swipe_timeline_hint') || 'Swipe horizontally to explore timeline'}</span>
        </span>
      </div>

      {ganttTasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 shadow-sm">
          <div className="text-center p-6">
            <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">{t('no_gantt_tasks')}</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">{t('gantt_dates_hint')}</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 shadow-sm">
          {/* Right Panel: Timeline */}
          <div className="flex-1 overflow-auto touch-momentum" ref={scrollRef}>
          <div style={{ width: totalDays * DAY_WIDTH, minHeight: '100%' }}>
            {/* Timeline Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-slate-700" style={{ height: HEADER_HEIGHT }}>
              {/* Month row */}
              <div className="flex h-[30px]">
                {months.map((m, i) => (
                  <div
                    key={i}
                    className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center px-2 border-r border-slate-100 dark:border-slate-800"
                    style={{ width: m.width, left: m.start * DAY_WIDTH }}
                  >
                    {m.label}
                  </div>
                ))}
              </div>
              {/* Day row */}
              <div className="flex h-[30px]">
                {dates.map((d, i) => {
                  const isWkEnd = isWeekend(d);
                  const isToday = i === todayIndex;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-center text-[10px] font-medium border-r border-slate-100 dark:border-slate-800 ${
                        isToday
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold'
                          : isWkEnd
                            ? 'text-slate-300 dark:text-slate-600'
                            : 'text-slate-400 dark:text-slate-500'
                      }`}
                      style={{ width: DAY_WIDTH }}
                    >
                      {format(d, 'd')}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rows with bars */}
            <div className="relative">
              {/* Grid columns */}
              {dates.map((d, i) => {
                const isWkEnd = isWeekend(d);
                return (
                  <div
                    key={i}
                    className={`absolute top-0 bottom-0 border-r border-slate-50 dark:border-slate-800/50 ${
                      isWkEnd ? 'bg-slate-50/50 dark:bg-white/[0.01]' : ''
                    }`}
                    style={{ left: i * DAY_WIDTH, width: DAY_WIDTH, height: ganttTasks.length * ROW_HEIGHT }}
                  />
                );
              })}

              {/* Today line */}
              {todayIndex >= 0 && todayIndex < totalDays && (
                <div
                  className="absolute top-0 w-0.5 bg-red-500 z-20"
                  style={{
                    left: todayIndex * DAY_WIDTH + DAY_WIDTH / 2,
                    height: ganttTasks.length * ROW_HEIGHT,
                  }}
                >
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full absolute -top-1 -left-1" />
                </div>
              )}

              {/* Task bars */}
              {ganttTasks.map((task, rowIndex) => {
                const project = projects.find(p => p.id === task.projectId);
                const taskStart = parseISO(task.startDate);
                const taskEnd = parseISO(task.endDate);
                const startOffset = differenceInDays(taskStart, startDate);
                const duration = differenceInDays(taskEnd, taskStart) + 1;

                return (
                  <div
                    key={task.id}
                    className="relative border-b border-slate-50 dark:border-slate-800/50"
                    style={{ height: ROW_HEIGHT }}
                  >
                    <div
                      className="gantt-bar"
                      style={{
                        left: startOffset * DAY_WIDTH,
                        width: Math.max(duration * DAY_WIDTH - 4, 24),
                        backgroundColor: project?.color || '#3b82f6',
                        opacity: task.status === 'done' ? 0.6 : 0.9,
                      }}
                      onClick={() => onEditTask?.(task)}
                      title={`${task.title}\n${task.startDate} – ${task.endDate}`}
                    >
                      {duration > 2 && (
                        <span className="truncate">{task.title}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
