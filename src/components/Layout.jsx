import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import TaskModal from './TaskModal';
import ProjectModal from './ProjectModal';
import NotesDrawer from './NotesDrawer';
import BackupReminderBanner from './BackupReminderBanner';
import MobileBottomNav from './MobileBottomNav';
import DemoBanner from './DemoBanner';
import DemoLimitModal from './DemoLimitModal';
import DashboardView from '../views/DashboardView';
import KanbanView from '../views/KanbanView';
import GanttView from '../views/GanttView';
import TableView from '../views/TableView';
import SettingsView from '../views/SettingsView';
import CalendarView from '../views/CalendarView';
import EisenhowerMatrixView from '../views/EisenhowerMatrixView';
import { useApp } from '../context/AppContext';

export default function Layout() {
  const {
    isInitialized,
    activeView,
    mobileMenuOpen,
    setMobileMenuOpen,
    projectModalState,
    closeProjectModal,
    demoModalState,
    openDemoModal,
    closeDemoModal,
    isTaskLimitReached,
    t
  } = useApp();
  const [modalTask, setModalTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEditTask = (task) => {
    setModalTask(task);
    setShowModal(true);
  };

  const handleNewTask = (statusOverride, priorityOverride) => {
    if (isTaskLimitReached) {
      openDemoModal('task_limit');
      return;
    }

    let initial = null;
    if (typeof statusOverride === 'string') {
      initial = { status: statusOverride };
    } else if (statusOverride && typeof statusOverride === 'object') {
      initial = { ...statusOverride };
    }
    if (priorityOverride) {
      initial = { ...(initial || {}), priority: priorityOverride };
    }
    setModalTask(initial);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalTask(null);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'kanban':
        return <KanbanView onEditTask={handleEditTask} onNewTask={handleNewTask} />;
      case 'gantt':
        return <GanttView onEditTask={handleEditTask} />;
      case 'calendar':
        return <CalendarView onEditTask={handleEditTask} onNewTask={handleNewTask} />;
      case 'table':
        return <TableView onEditTask={handleEditTask} />;
      case 'matrix':
        return <EisenhowerMatrixView onEditTask={handleEditTask} onNewTask={handleNewTask} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-navy-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('loading_workspace') || 'Loading Workspace...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-navy-900 text-slate-800 dark:text-slate-200 overflow-hidden">
      {/* Demo Banner (Only visible in Live Demo Mode) */}
      <DemoBanner onOpenDemoModal={openDemoModal} />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <TopBar onNewTask={() => handleNewTask()} />
          <BackupReminderBanner />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-navy-900 relative pb-20 md:pb-0 touch-momentum">
            {renderView()}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav onNewTask={() => handleNewTask()} />

      {/* Notes Drawer */}
      <NotesDrawer onEditTask={handleEditTask} />

      {/* Task Modal */}
      {showModal && (
        <TaskModal task={modalTask} onClose={handleCloseModal} />
      )}

      {/* Project Modal */}
      {projectModalState.isOpen && (
        <ProjectModal project={projectModalState.project} onClose={closeProjectModal} />
      )}

      {/* Demo Limit / Sales Guardrail Modal */}
      <DemoLimitModal
        isOpen={demoModalState.isOpen}
        reason={demoModalState.reason}
        onClose={closeDemoModal}
      />
    </div>
  );
}

