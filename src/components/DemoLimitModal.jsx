import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, CheckCircle2, ExternalLink, X, Shield, Infinity as InfinityIcon, Download, HardDrive } from 'lucide-react';
import { ETSY_STORE_URL } from '../utils/demo';
import { useApp } from '../context/AppContext';

export default function DemoLimitModal({ isOpen, onClose, reason = 'general' }) {
  const { t } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const contentMap = {
    task_limit: {
      badge: 'Preview Limit Reached',
      title: 'Ready for Unlimited Tasks?',
      desc: 'You have tested task creation in the live demo! To manage unlimited tasks and projects for your real work, get the full offline edition.',
    },
    project_limit: {
      badge: 'Project Limit Reached',
      title: 'Ready for Unlimited Projects?',
      desc: 'In this live preview, you can test 1 custom project. The full version includes unlimited projects with custom colors and dedicated notes.',
    },
    export_disabled: {
      badge: 'Feature Reserved',
      title: 'Full Backups in Purchased Version',
      desc: 'Workspace JSON backups and exports are exclusively available in the full offline edition, keeping your data 100% private and portable.',
    },
    import_disabled: {
      badge: 'Feature Reserved',
      title: 'Workspace Import in Purchased Version',
      desc: 'Importing external workspace backups is reserved for the full offline edition. Purchase the lifetime license to restore your data.',
    },
    general: {
      badge: 'Lifetime Access',
      title: 'Get the Full ProjectFlow Edition',
      desc: 'Take complete control of your projects with our zero-subscription, local-first dashboard that runs anywhere without an internet connection.',
    },
  };

  const content = contentMap[reason] || contentMap.general;

  const benefits = [
    { icon: InfinityIcon, title: 'Unlimited Everything', desc: 'No limits on tasks, projects, notes, or team members.' },
    { icon: HardDrive, title: '100% Offline & Private', desc: 'Zero cloud tracking. Your data never leaves your computer.' },
    { icon: Download, title: 'Full Backup & Export', desc: 'Timestamped JSON exports and one-click workspace restoration.' },
    { icon: Shield, title: 'One-Time Purchase', desc: 'Lifetime personal & team license with no monthly fees.' },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-navy-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Gradient */}
        <div className="relative p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md text-white border border-white/20 mb-3">
            <Sparkles size={13} className="text-amber-300" />
            <span>{content.badge}</span>
          </div>

          <h3 className="text-xl font-extrabold tracking-tight mb-2">
            {content.title}
          </h3>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            {content.desc}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Included in the Full Offline Edition:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      {b.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-300/60 dark:border-amber-500/25 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <CheckCircle2 size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>
              <strong>Instant download:</strong> Receive the standalone <code className="font-mono text-[11px] bg-amber-500/20 px-1 py-0.5 rounded">ProjectFlow.html</code> file on Etsy immediately after purchase.
            </span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 sm:p-6 border-t border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-navy-900/40">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer order-2 sm:order-1 text-center"
          >
            Continue Testing Demo
          </button>

          <a
            href={ETSY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-97 shadow-lg shadow-blue-500/20 transition-all cursor-pointer order-1 sm:order-2"
          >
            <span>Get Full Version on Etsy</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
