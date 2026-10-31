import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BarChart3,
  Table2,
  StickyNote,
  Settings
} from 'lucide-react';

export default function MobileBottomNav() {
  const {
    activeView,
    setActiveView,
    notesDrawer,
    openNotes,
    closeNotes,
    activeProjectId,
    t
  } = useApp();

  const handleSelectView = (viewId) => {
    if (notesDrawer.isOpen) {
      closeNotes();
    }
    setActiveView(viewId);
  };

  const handleToggleNotes = () => {
    if (notesDrawer.isOpen) {
      closeNotes();
    } else {
      openNotes({ tab: activeProjectId !== 'all' ? 'project' : 'task' });
    }
  };

  return (
    <nav
      className="md:hidden mobile-bottom-nav px-2 py-1 flex items-center justify-between select-none"
      aria-label="Mobile Navigation"
    >
      {/* 1. Dashboard */}
      <button
        onClick={() => handleSelectView('dashboard')}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
          activeView === 'dashboard' && !notesDrawer.isOpen
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        aria-label={t('dashboard')}
      >
        <LayoutDashboard size={20} className={activeView === 'dashboard' && !notesDrawer.isOpen ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
          {t('dashboard')}
        </span>
      </button>

      {/* 2. Kanban */}
      <button
        onClick={() => handleSelectView('kanban')}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
          activeView === 'kanban' && !notesDrawer.isOpen
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        aria-label={t('nav_kanban')}
      >
        <BarChart3 size={20} className={activeView === 'kanban' && !notesDrawer.isOpen ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
          {t('nav_kanban')}
        </span>
      </button>

      {/* 3. Table */}
      <button
        onClick={() => handleSelectView('table')}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
          activeView === 'table' && !notesDrawer.isOpen
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        aria-label={t('nav_table')}
      >
        <Table2 size={20} className={activeView === 'table' && !notesDrawer.isOpen ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
          {t('nav_table')}
        </span>
      </button>

      {/* 4. Notes Drawer Toggle */}
      <button
        onClick={handleToggleNotes}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
          notesDrawer.isOpen
            ? 'text-amber-600 dark:text-amber-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        aria-label={t('notes')}
      >
        <div className="relative flex items-center justify-center">
          <StickyNote size={20} className={notesDrawer.isOpen ? 'stroke-[2.5] fill-amber-500/20' : 'stroke-2'} />
          {notesDrawer.isOpen && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </div>
        <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
          {t('notes')}
        </span>
      </button>

      {/* 5. Settings */}
      <button
        onClick={() => handleSelectView('settings')}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
          activeView === 'settings' && !notesDrawer.isOpen
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        aria-label={t('settings_title') || 'Settings'}
      >
        <Settings size={20} className={activeView === 'settings' && !notesDrawer.isOpen ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
          {t('settings')}
        </span>
      </button>
    </nav>
  );
}
