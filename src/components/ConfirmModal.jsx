import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onClose,
  variant = 'danger',
  requireMatch = null,
}) {
  const { t } = useApp();
  const [inputVal, setInputVal] = useState('');

  // Reset input whenever modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setInputVal('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Case-insensitive match check: "delete", "DELETE", "Delete", etc.
  const isMatchValid = !requireMatch || inputVal.trim().toLowerCase() === requireMatch.trim().toLowerCase();

  const handleConfirm = () => {
    if (!isMatchValid) return;
    onConfirm();
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header & Content */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
              variant === 'danger'
                ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
            }`}>
              <AlertTriangle size={22} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
                {title || t('confirm_action') || 'Are you sure?'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {message}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Optional Text Confirmation Input (e.g., must type "delete") */}
          {requireMatch && (
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 animate-fade-in">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('type_delete_to_confirm', { word: requireMatch }) || (
                  <>To confirm, please type <strong className="text-red-500 font-bold font-mono tracking-wider">{requireMatch}</strong> below:</>
                )}
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isMatchValid) {
                      e.preventDefault();
                      handleConfirm();
                    }
                  }}
                  placeholder={t('type_delete_placeholder', { word: requireMatch }) || `Type "${requireMatch}" to confirm...`}
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border font-mono transition-all outline-none ${
                    isMatchValid && inputVal.trim()
                      ? 'border-green-500 bg-green-50/40 dark:bg-green-500/10 text-green-700 dark:text-green-300 ring-2 ring-green-500/20 pr-9'
                      : inputVal.trim()
                      ? 'border-red-400 bg-red-50/30 dark:bg-red-500/10 text-red-600 dark:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  }`}
                />

                {isMatchValid && inputVal.trim() && (
                  <CheckCircle2
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-scale-up"
                  />
                )}
              </div>

              {inputVal.trim() && !isMatchValid && (
                <p className="text-[11px] text-red-500 dark:text-red-400 mt-1.5 font-medium animate-fade-in">
                  {t('text_does_not_match', { word: requireMatch }) || `Please type "${requireMatch}" to proceed (case-insensitive)`}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 px-5 sm:px-6 py-3.5 sm:py-4 bg-slate-50/80 dark:bg-navy-900/60 border-t border-slate-100 dark:border-slate-700/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            {cancelText || t('cancel') || 'Cancel'}
          </button>

          <button
            type="button"
            disabled={!isMatchValid}
            onClick={handleConfirm}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-lg transition-all ${
              !isMatchValid
                ? 'opacity-40 cursor-not-allowed bg-slate-400 dark:bg-slate-700 shadow-none'
                : variant === 'danger'
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/25 active:scale-97 cursor-pointer'
                : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25 active:scale-97 cursor-pointer'
            }`}
          >
            <Trash2 size={16} />
            {confirmText || t('yes_delete') || 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
