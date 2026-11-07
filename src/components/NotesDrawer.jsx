import { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { STATUS_MAP, PRIORITY_MAP } from '../utils/constants';
import { getInitials, getRelativeDueDate } from '../utils/helpers';
import {
  StickyNote,
  X,
  Folder,
  CheckSquare,
  Search,
  ChevronDown,
  ExternalLink,
  Check,
  Copy,
  Trash2,
  ListChecks,
  Clock,
  ChevronRight,
  AlertCircle,
  ChevronUp,
  Minus,
} from 'lucide-react';

const PRIORITY_ICONS = {
  urgent: AlertCircle,
  high: ChevronUp,
  medium: Minus,
  low: ChevronDown,
};

export default function NotesDrawer({ onEditTask }) {
  const {
    projects,
    tasks,
    team,
    activeProjectId,
    updateProject,
    updateTask,
    notesDrawer,
    setNotesDrawer,
    closeNotes,
    language,
    t,
  } = useApp();

  const { isOpen, tab = 'project', selectedTaskId, selectedProjectId } = notesDrawer;

  // Single source of truth for active tab
  const activeTab = tab || 'project';

  // Selected project for Project Notes (from notesDrawer or fallback to active/first project)
  const currentProjectId =
    selectedProjectId || (activeProjectId !== 'all' ? activeProjectId : projects[0]?.id || '');

  // Selected task for Task Notes (from notesDrawer)
  const currentTaskId = selectedTaskId || null;

  // Tab switching handler
  const handleSelectTab = (newTab) => {
    setNotesDrawer((prev) => ({ ...prev, tab: newTab }));
  };

  // Task selection handler
  const handleSelectTask = (taskId) => {
    setNotesDrawer((prev) => ({ ...prev, selectedTaskId: taskId, tab: 'task' }));
    setIsTaskPickerOpen(false);
  };

  // Project selection handler
  const handleSelectProject = (projId) => {
    setNotesDrawer((prev) => ({ ...prev, selectedProjectId: projId }));
  };

  // Filter & Search inside Task Notes
  const [taskProjectFilter, setTaskProjectFilter] = useState(
    activeProjectId !== 'all' ? activeProjectId : 'all'
  );
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [isTaskPickerOpen, setIsTaskPickerOpen] = useState(false);

  // UI state for quick actions
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const textareaRef = useRef(null);
  const pickerDropdownRef = useRef(null);

  // Sync taskProjectFilter if activeProjectId changes
  useEffect(() => {
    if (activeProjectId !== 'all') {
      setTaskProjectFilter(activeProjectId);
    }
  }, [activeProjectId]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (isTaskPickerOpen) {
          setIsTaskPickerOpen(false);
        } else {
          closeNotes();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isTaskPickerOpen, closeNotes]);

  // Close task picker dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerDropdownRef.current && !pickerDropdownRef.current.contains(e.target)) {
        setIsTaskPickerOpen(false);
      }
    };
    if (isTaskPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTaskPickerOpen]);

  // Current active project object
  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === currentProjectId) || projects[0] || null;
  }, [projects, currentProjectId]);

  // Current active task object
  const currentTask = useMemo(() => {
    return tasks.find((t) => t.id === currentTaskId) || null;
  }, [tasks, currentTaskId]);

  // Tasks with notes count
  const tasksWithNotesCount = useMemo(() => {
    return tasks.filter((t) => t.notes && t.notes.trim().length > 0).length;
  }, [tasks]);

  // Filtered task list for task selection
  const filteredTasksForPicker = useMemo(() => {
    return tasks.filter((task) => {
      if (taskProjectFilter !== 'all' && task.projectId !== taskProjectFilter) {
        return false;
      }
      if (taskSearchQuery.trim()) {
        const q = taskSearchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesTags = (task.tags || []).some((tag) => tag.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTags) return false;
      }
      return true;
    });
  }, [tasks, taskProjectFilter, taskSearchQuery]);

  // Word & character stats
  const activeNoteText = useMemo(() => {
    if (activeTab === 'task') {
      return currentTask?.notes || '';
    }
    return currentProject?.notes || '';
  }, [activeTab, currentTask, currentProject]);

  const wordCount = useMemo(() => {
    const trimmed = activeNoteText.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [activeNoteText]);

  const charCount = activeNoteText.length;

  // Handlers for note edits
  const handleNoteChange = (newText) => {
    if (activeTab === 'task' && currentTask) {
      updateTask(currentTask.id, { notes: newText }, true);
    } else if (activeTab === 'project' && currentProject) {
      updateProject(currentProject.id, { notes: newText }, true);
    }
  };

  const handleInsertText = (snippet) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      handleNoteChange(activeNoteText + (activeNoteText ? '\n' : '') + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = activeNoteText.substring(0, start);
    const after = activeNoteText.substring(end);
    const updated = before + snippet + after;
    handleNoteChange(updated);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + snippet.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleInsertTimestamp = () => {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
    handleInsertText(`\n[${dateFormatted}, ${formatted}] `);
  };

  const handleInsertChecklist = () => {
    handleInsertText(`\n- [ ] `);
  };

  const handleInsertBullet = () => {
    handleInsertText(`\n• `);
  };

  const handleCopyNote = async () => {
    if (!activeNoteText) return;
    try {
      await navigator.clipboard.writeText(activeNoteText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearNote = () => {
    handleNoteChange('');
    setShowClearConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 transition-opacity"
        onClick={closeNotes}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white dark:bg-navy-800 shadow-2xl border-l border-slate-200 dark:border-slate-700 z-50 flex flex-col animate-slide-left"
        role="dialog"
        aria-label={t('notes') || 'Notes'}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-700/80 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs flex-shrink-0">
              <StickyNote size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-[15px] font-bold text-slate-800 dark:text-white leading-tight">
                {activeTab === 'task' ? t('task_notes') : t('project_notes')}
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                {activeTab === 'task' ? t('task_notes_desc') : t('project_notes_desc')}
              </p>
            </div>
          </div>
          <button
            onClick={closeNotes}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title={t('close') || 'Close'}
            aria-label={t('close') || 'Close'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Project Notes vs Task Notes */}
        <div className="px-4 sm:px-5 pt-2.5 sm:pt-3 pb-2 flex-shrink-0">
          <div className="flex p-1 bg-slate-100 dark:bg-navy-900/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => handleSelectTab('project')}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2.5 sm:px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'project'
                  ? 'bg-white dark:bg-navy-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Folder size={14} />
              <span>{t('project_notes')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('task')}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2.5 sm:px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'task'
                  ? 'bg-white dark:bg-navy-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <CheckSquare size={14} />
              <span>{t('task_notes')}</span>
              {tasksWithNotesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                  {tasksWithNotesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 flex flex-col gap-4 custom-scrollbar touch-momentum pb-8">
          {/* ======================= TAB: TASK NOTES ======================= */}
          {activeTab === 'task' && (
            <div className="flex-1 flex flex-col gap-4 min-h-0">
              {/* Task Selector Section */}
              <div className="space-y-2 relative" ref={pickerDropdownRef}>
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {t('select_or_assign_task')}
                  </label>
                  {currentTask && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsTaskPickerOpen((prev) => !prev);
                      }}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {isTaskPickerOpen ? t('close') || 'Done' : t('select_task')}
                    </button>
                  )}
                </div>

                {/* Combobox Trigger: shows current task summary or prompt to select */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTaskPickerOpen((prev) => !prev);
                    }}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 hover:bg-slate-100/70 dark:bg-navy-900/60 dark:hover:bg-navy-900 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    {currentTask ? (
                      <div className="flex items-center gap-2.5 min-w-0">
                        {(() => {
                          const status = STATUS_MAP[currentTask.status];
                          const proj = projects.find((p) => p.id === currentTask.projectId);
                          return (
                            <>
                              <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: proj?.color || '#94a3b8' }}
                                title={proj?.name}
                              />
                              <div className="min-w-0">
                                <p className="text-[13px] font-semibold text-slate-800 dark:text-white truncate">
                                  {currentTask.title}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate">
                                    {proj?.name}
                                  </span>
                                  <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                                    {t(status?.id || 'todo')}
                                  </span>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                        <CheckSquare size={16} />
                        <span className="text-[13px] font-medium">
                          {t('select_or_assign_task')}
                        </span>
                      </div>
                    )}
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform flex-shrink-0 ${
                        isTaskPickerOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Task Picker Dropdown Menu */}
                  {isTaskPickerOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-navy-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-30 animate-fade-in flex flex-col gap-2.5 max-h-[380px]">
                      {/* Filter Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Project Filter */}
                        <select
                          value={taskProjectFilter}
                          onChange={(e) => setTaskProjectFilter(e.target.value)}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="all">{t('all_projects')}</option>
                          {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>

                        {/* Search Input */}
                        <div className="relative">
                          <Search
                            size={13}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <input
                            type="text"
                            value={taskSearchQuery}
                            onChange={(e) => setTaskSearchQuery(e.target.value)}
                            placeholder={t('search_tasks') || 'Search tasks...'}
                            className="w-full pl-7 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
                          />
                        </div>
                      </div>

                      {/* Task List */}
                      <div className="overflow-y-auto max-h-[260px] divide-y divide-slate-100 dark:divide-slate-800 custom-scrollbar pr-0.5">
                        {filteredTasksForPicker.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500">
                            {t('no_tasks_found')}
                          </div>
                        ) : (
                          filteredTasksForPicker.map((item) => {
                            const isSelected = item.id === currentTaskId;
                            const itemProject = projects.find((p) => p.id === item.projectId);
                            const itemStatus = STATUS_MAP[item.status];
                            const itemPriority = PRIORITY_MAP[item.priority];
                            const PriorityIcon = PRIORITY_ICONS[item.priority] || Minus;
                            const hasNotes = !!(item.notes && item.notes.trim());

                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelectTask(item.id)}
                                className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between gap-2.5 transition-colors cursor-pointer group ${
                                  isSelected
                                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                    : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <div
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: itemProject?.color || '#94a3b8' }}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-[12px] font-medium truncate">
                                        {item.title}
                                      </p>
                                      {hasNotes && (
                                        <StickyNote
                                          size={11}
                                          className="text-amber-500 dark:text-amber-400 flex-shrink-0 fill-amber-500/30"
                                          title={t('has_notes')}
                                        />
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                      <span>{itemProject?.name}</span>
                                      <span>•</span>
                                      <span>{t(itemStatus?.id || 'todo')}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <span
                                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border"
                                    style={{
                                      backgroundColor: itemPriority?.bg,
                                      color: itemPriority?.color,
                                      borderColor: `${itemPriority?.color}40`,
                                    }}
                                  >
                                    <PriorityIcon size={9} />
                                    <span>{t(itemPriority?.id || 'medium')}</span>
                                  </span>
                                  {isSelected && (
                                    <Check
                                      size={14}
                                      className="text-blue-600 dark:text-blue-400"
                                    />
                                  )}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Task Details Card & Note Area */}
              {currentTask ? (
                <div className="flex-1 flex flex-col gap-3 min-h-[320px]">
                  {/* Task Card Header Summary */}
                  {(() => {
                    const taskProject = projects.find((p) => p.id === currentTask.projectId);
                    const taskAssignee = team.find((m) => m.id === currentTask.assigneeId);
                    const taskStatus = STATUS_MAP[currentTask.status];
                    const taskPriority = PRIORITY_MAP[currentTask.priority];
                    const PriorityIcon = PRIORITY_ICONS[currentTask.priority] || Minus;
                    const dueText = getRelativeDueDate(currentTask.endDate, t, language);

                    return (
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-900/40 flex flex-col gap-2 relative">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            {taskProject && (
                              <div className="flex items-center gap-1.5 mb-1">
                                <div
                                  className="w-1.5 h-3.5 rounded-full"
                                  style={{ backgroundColor: taskProject.color }}
                                />
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                  {taskProject.name}
                                </span>
                              </div>
                            )}
                            <h3 className="text-[14px] font-bold text-slate-800 dark:text-white leading-snug">
                              {currentTask.title}
                            </h3>
                          </div>

                          {/* Quick open task in full TaskModal */}
                          <button
                            type="button"
                            onClick={() => onEditTask?.(currentTask)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-blue-200/80 dark:border-blue-500/30 transition-colors cursor-pointer flex-shrink-0"
                            title={t('open_task_details')}
                          >
                            <span>{t('open_task_details')}</span>
                            <ExternalLink size={12} />
                          </button>
                        </div>

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                          {/* Status */}
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold"
                            style={{
                              backgroundColor: `${taskStatus?.color}15`,
                              color: taskStatus?.color,
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: taskStatus?.color }}
                            />
                            {t(taskStatus?.id || 'todo')}
                          </span>

                          {/* Priority */}
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border"
                            style={{
                              backgroundColor: taskPriority?.bg,
                              color: taskPriority?.color,
                              borderColor: `${taskPriority?.color}40`,
                            }}
                          >
                            <PriorityIcon size={10} />
                            {t(taskPriority?.id || 'medium')}
                          </span>

                          {/* Due Date */}
                          {dueText && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                              <Clock size={11} />
                              {dueText}
                            </span>
                          )}

                          {/* Assignee */}
                          {taskAssignee && (
                            <div className="ml-auto flex items-center gap-1.5">
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-xs"
                                style={{ backgroundColor: taskAssignee.avatarColor }}
                              >
                                {getInitials(taskAssignee.name)}
                              </div>
                              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                                {taskAssignee.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Editor Toolbar */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <Check size={11} />
                        {t('auto_saved')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {wordCount} {t('words')} • {charCount} {t('chars')}
                      </span>
                    </div>

                    {/* Quick Formatting Tools */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleInsertTimestamp}
                        className="px-2 py-1 rounded text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        title={t('insert_timestamp')}
                      >
                        + {t('insert_timestamp')}
                      </button>
                      <button
                        type="button"
                        onClick={handleInsertChecklist}
                        className="px-2 py-1 rounded text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        title={t('insert_checklist')}
                      >
                        + {t('insert_checklist')}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyNote}
                        disabled={!activeNoteText}
                        className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40 transition-colors cursor-pointer"
                        title={t('copy_notes')}
                      >
                        {copied ? (
                          <span className="text-[11px] text-emerald-600 font-semibold px-1">
                            {t('copied')}
                          </span>
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(true)}
                        disabled={!activeNoteText}
                        className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-40 transition-colors cursor-pointer"
                        title={t('clear_notes')}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Clear Confirm Modal / Inline Strip */}
                  {showClearConfirm && (
                    <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center justify-between animate-fade-in text-xs">
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {t('confirm_clear_notes')}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleClearNote}
                          className="px-2 py-0.5 rounded bg-red-600 text-white font-semibold hover:bg-red-700 cursor-pointer"
                        >
                          {t('clear_notes')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowClearConfirm(false)}
                          className="px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={currentTask.notes || ''}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    placeholder={t('task_notes_placeholder')}
                    className="input-field flex-1 resize-none bg-amber-50/20 dark:bg-amber-500/5 focus:bg-amber-50/40 dark:focus:bg-amber-500/10 border-amber-200/80 dark:border-amber-900/40 text-[13.5px] leading-relaxed p-4 rounded-xl min-h-[220px]"
                  />
                </div>
              ) : (
                /* Empty state when no task is selected yet */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl min-h-[280px]">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 shadow-xs">
                    <CheckSquare size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                    {t('no_task_selected')}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mb-4">
                    {t('choose_task_prompt')}
                  </p>

                  {/* Quick Task Pick List */}
                  {filteredTasksForPicker.length > 0 && (
                    <div className="w-full max-w-sm flex flex-col gap-1.5 text-left">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                        {t('all_projects_tasks')}
                      </p>
                      {filteredTasksForPicker.slice(0, 5).map((item) => {
                        const proj = projects.find((p) => p.id === item.projectId);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectTask(item.id)}
                            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-navy-800 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 flex items-center justify-between gap-2 transition-all cursor-pointer group text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: proj?.color || '#94a3b8' }}
                              />
                              <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
                                {item.title}
                              </span>
                            </div>
                            <ChevronRight
                              size={14}
                              className="text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5 flex-shrink-0"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ======================= TAB: PROJECT NOTES ======================= */}
          {activeTab === 'project' && (
            <div className="flex-1 flex flex-col gap-4 min-h-0">
              {projects.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-6">
                  <div>
                    <StickyNote
                      size={36}
                      className="mx-auto text-slate-300 dark:text-slate-600 mb-3"
                    />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {t('no_projects')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-3 min-h-[320px]">
                  {/* Project Selector Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                      {t('active_project')}
                    </label>
                    <div className="relative">
                      <select
                        value={currentProjectId}
                        onChange={(e) => handleSelectProject(e.target.value)}
                        className="input-field appearance-none pr-8 cursor-pointer font-semibold text-slate-800 dark:text-white"
                      >
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Project Banner Info */}
                  {currentProject && (
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-900/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: currentProject.color }}
                        />
                        <div className="min-w-0">
                          <h4 className="text-[13px] font-bold text-slate-800 dark:text-white truncate">
                            {currentProject.name}
                          </h4>
                          {currentProject.description && (
                            <p className="text-[11px] text-slate-400 truncate">
                              {currentProject.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-navy-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        {tasks.filter((t) => t.projectId === currentProject.id).length}{' '}
                        {t('tasks_total') || 'tasks'}
                      </span>
                    </div>
                  )}

                  {/* Editor Toolbar */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <Check size={11} />
                        {t('auto_saved')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {wordCount} {t('words')} • {charCount} {t('chars')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleInsertTimestamp}
                        className="px-2 py-1 rounded text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        title={t('insert_timestamp')}
                      >
                        + {t('insert_timestamp')}
                      </button>
                      <button
                        type="button"
                        onClick={handleInsertChecklist}
                        className="px-2 py-1 rounded text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        title={t('insert_checklist')}
                      >
                        + {t('insert_checklist')}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyNote}
                        disabled={!activeNoteText}
                        className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40 transition-colors cursor-pointer"
                        title={t('copy_notes')}
                      >
                        {copied ? (
                          <span className="text-[11px] text-emerald-600 font-semibold px-1">
                            {t('copied')}
                          </span>
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(true)}
                        disabled={!activeNoteText}
                        className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-40 transition-colors cursor-pointer"
                        title={t('clear_notes')}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Clear Confirm Modal / Inline Strip */}
                  {showClearConfirm && (
                    <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center justify-between animate-fade-in text-xs">
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {t('confirm_clear_notes')}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleClearNote}
                          className="px-2 py-0.5 rounded bg-red-600 text-white font-semibold hover:bg-red-700 cursor-pointer"
                        >
                          {t('clear_notes')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowClearConfirm(false)}
                          className="px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Project Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={currentProject?.notes || ''}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    placeholder={`${t('write_notes_for')} ${currentProject?.name || ''}...`}
                    className="input-field flex-1 resize-none bg-yellow-50/25 dark:bg-yellow-500/5 focus:bg-yellow-50/40 dark:focus:bg-yellow-500/10 border-yellow-200/80 dark:border-yellow-900/40 text-[13.5px] leading-relaxed p-4 rounded-xl min-h-[220px]"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
