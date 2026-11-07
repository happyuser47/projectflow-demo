import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { STATUSES, PRIORITIES } from '../utils/constants';
import { X, Trash2, AlertTriangle, Repeat, Sparkles } from 'lucide-react';
import { getInitials } from '../utils/helpers';
import { RECURRING_FREQUENCIES, computeNextRecurrenceDates } from '../utils/recurring';

export default function TaskModal({ task, onClose }) {
  const { projects, team, addTask, updateTask, deleteTask, t } = useApp();
  const isEditing = !!task?.id;

  const [form, setForm] = useState({
    title: '',
    description: '',
    projectId: projects[0]?.id || '',
    status: 'todo',
    priority: 'medium',
    assigneeId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    tags: '',
    notes: '',
    recurring: 'none',
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        projectId: task.projectId || projects[0]?.id || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        assigneeId: task.assigneeId || '',
        startDate: task.startDate || '',
        endDate: task.endDate || '',
        tags: (task.tags || []).join(', '),
        notes: task.notes || '',
        recurring: task.recurring || 'none',
      });
    }
  }, [task, projects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const taskData = {
      ...form,
      title: form.title.trim(),
      notes: form.notes || '',
      tags: form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      recurring: form.recurring || 'none',
    };

    if (isEditing) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    onClose();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        className="modal-content bg-white dark:bg-navy-800 rounded-2xl shadow-2xl w-[95vw] max-w-lg sm:mx-4 max-h-[90vh] sm:max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            {isEditing ? t('edit_task') : t('create_task')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 custom-scrollbar">
          {/* Title */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t('title')}</label>
            <input
              type="text"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder={t('task_title_placeholder')}
              className="input-field"
              autoFocus
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t('description')}</label>
            <textarea
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder={t('task_desc_placeholder')}
              className="input-field min-h-[80px] resize-y"
              rows={3}
            />
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Project */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t('project')}</label>
              <select
                value={form.projectId}
                onChange={e => handleChange('projectId', e.target.value)}
                className="input-field"
              >
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t('status')}</label>
              <select
                value={form.status}
                onChange={e => handleChange('status', e.target.value)}
                className="input-field"
              >
                {STATUSES.map(s => <option key={s.id} value={s.id}>{t(s.id)}</option>)}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t('priority')}</label>
              <select
                value={form.priority}
                onChange={e => handleChange('priority', e.target.value)}
                className="input-field"
              >
                {PRIORITIES.map(p => <option key={p.id} value={p.id}>{t(p.id)}</option>)}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t('assignee')}</label>
              <select
                value={form.assigneeId}
                onChange={e => handleChange('assigneeId', e.target.value)}
                className="input-field"
              >
                <option value="">{t('unassigned')}</option>
                {team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t('start_date')}</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => handleChange('startDate', e.target.value)}
                className="input-field"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t('end_date')}</label>
              <input
                type="date"
                value={form.endDate}
                onChange={e => handleChange('endDate', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Recurring Task Schedule (Premium Feature) */}
          <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-50/60 dark:bg-navy-900/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <Repeat size={13} style={{ color: 'var(--theme-accent)' }} />
                <span>{t('recurring_task') || 'Recurring Task'}</span>
              </label>
              {form.recurring && form.recurring !== 'none' && (
                <span
                  className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border transition-colors uppercase tracking-wider"
                  style={{
                    backgroundColor: 'var(--theme-accent-light)',
                    color: 'var(--theme-accent)',
                    borderColor: 'var(--theme-accent-border)',
                  }}
                >
                  {t('active') || 'Active'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <select
                value={form.recurring}
                onChange={e => handleChange('recurring', e.target.value)}
                className="input-field text-xs sm:text-sm font-semibold"
              >
                {RECURRING_FREQUENCIES.map(f => (
                  <option key={f.id} value={f.id}>
                    {t(`recur_${f.id}`) || f.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400 px-1 py-0.5 leading-tight">
                {form.recurring === 'none' ? (
                  <span>{t('recurring_none_hint') || 'One-time task. Does not repeat.'}</span>
                ) : (
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {t('recurring_active_hint') || 'When marked Done, the next scheduled occurrence will automatically be created in To Do.'}
                  </span>
                )}
              </div>
            </div>

            {form.recurring && form.recurring !== 'none' && (
              (() => {
                const previewDates = computeNextRecurrenceDates(form.startDate, form.endDate, form.recurring);
                return (
                  <div
                    className="flex items-center gap-2 p-2 rounded-lg text-xs border"
                    style={{
                      backgroundColor: 'var(--theme-accent-subtle)',
                      borderColor: 'var(--theme-accent-border)',
                      color: 'var(--theme-accent)',
                    }}
                  >
                    <Repeat size={13} className="flex-shrink-0" />
                    <span>
                      {t('next_due_label') || 'Next occurrence will be scheduled for:'}{' '}
                      <strong className="font-bold underline">{previewDates.nextEndDate}</strong>
                    </span>
                  </div>
                );
              })()
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t('tags')}</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => handleChange('tags', e.target.value)}
              placeholder={t('tags_placeholder')}
              className="input-field"
            />
          </div>

          {/* Task Notes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {t('task_notes')}
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {t('task_notes_hint')}
              </span>
            </div>
            <textarea
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
              placeholder={t('task_notes_placeholder')}
              className="input-field min-h-[90px] resize-y bg-amber-50/20 dark:bg-amber-500/5 focus:bg-amber-50/40 dark:focus:bg-amber-500/10 border-amber-200/70 dark:border-amber-900/40"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 dark:border-slate-700 flex-shrink-0 bg-slate-50/50 dark:bg-navy-900/50 rounded-b-2xl">
          <div>
            {isEditing && !showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/30 bg-red-50/50 hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-650 dark:hover:text-white hover:border-transparent transition-all cursor-pointer"
              >
                <Trash2 size={14} />
                <span>{t('delete')}</span>
              </button>
            )}
            {showDeleteConfirm && (
              <div className="flex items-center gap-2 animate-fade-in">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-97 transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>{t('yes_delete')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  {t('cancel')}
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary text-xs sm:text-[13px] py-2 px-3.5 sm:px-4">
              {isEditing ? t('save_changes') : t('create_task')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
