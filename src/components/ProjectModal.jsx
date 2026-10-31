import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Folder, FolderPlus, Trash2, Check, Palette } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#64748b', // Slate
];

export default function ProjectModal({ project, onClose }) {
  const { addProject, updateProject, deleteProject, setActiveProjectId, t } = useApp();
  const isEditing = !!project?.id;

  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [description, setDescription] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setColor(project.color || '#3b82f6');
      setDescription(project.description || '');
    } else {
      setName('');
      setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
      setDescription('');
    }
  }, [project]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !showDeleteConfirm) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showDeleteConfirm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing) {
      updateProject(project.id, {
        name: name.trim(),
        color,
        description: description.trim(),
      });
    } else {
      const newProj = addProject({
        name: name.trim(),
        color,
        description: description.trim(),
      });
      if (newProj?.id) {
        setActiveProjectId(newProj.id);
      }
    }
    onClose();
  };

  const handleDelete = () => {
    if (project?.id) {
      deleteProject(project.id);
      onClose();
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in"
        onClick={onClose}
      >
        <form
          onSubmit={handleSubmit}
          className="modal-content bg-white dark:bg-navy-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/70">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-colors"
                style={{ backgroundColor: color }}
              >
                {isEditing ? <Folder size={20} /> : <FolderPlus size={20} />}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-white">
                  {isEditing ? t('edit_project') : t('create_project')}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isEditing ? t('edit_project_subtitle') : t('create_project_subtitle')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-5 space-y-4">
            {/* Project Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                {t('project_name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('project_name_placeholder')}
                className="input-field"
                autoFocus
                required
              />
            </div>

            {/* Color Swatches */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center justify-between">
                <span>{t('project_color')}</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">{color}</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map(c => {
                  const isSelected = color.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                        isSelected ? 'scale-110 ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-navy-800' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    >
                      {isSelected && <Check size={14} className="text-white drop-shadow" />}
                    </button>
                  );
                })}

                {/* Custom Color Input */}
                <label className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title={t('custom_color') || 'Custom Color'}>
                  <Palette size={14} className="text-slate-500 dark:text-slate-300" />
                  <input
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Description (Optional) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                {t('project_description')}
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={t('project_desc_placeholder')}
                rows={3}
                className="input-field resize-none text-[13px]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-slate-700/70 bg-slate-50/50 dark:bg-navy-900/50">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:text-white hover:bg-red-500 dark:text-red-400 dark:hover:bg-red-600 transition-all cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>{t('delete')}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="btn-primary text-xs py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing ? t('save_project') : t('create_project')}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <ConfirmModal
          isOpen={true}
          title={t('delete_project_confirm')}
          message={t('delete_project_warning')}
          confirmText={t('yes_delete')}
          cancelText={t('cancel')}
          onConfirm={handleDelete}
          onClose={() => setShowDeleteConfirm(false)}
          variant="danger"
        />
      )}
    </>
  );
}
