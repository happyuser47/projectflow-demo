import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, Sparkles } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={18} />,
    error: <AlertTriangle className="text-red-500" size={18} />,
    info: <Info className="text-blue-500" size={18} />,
    magic: <Sparkles className="text-purple-500" size={18} />
  };

  const bgs = {
    success: 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-500/30',
    error: 'bg-white dark:bg-slate-800 border-red-200 dark:border-red-500/30',
    info: 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-500/30',
    magic: 'bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-500/30'
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-left">
      <div className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border ${bgs[toast.type || 'info']} max-w-sm backdrop-blur-md`}>
        <div className="mt-0.5">
          {icons[toast.type || 'info']}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">
            {toast.title}
          </p>
          {toast.message && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {toast.message}
            </p>
          )}
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
