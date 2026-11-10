import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getInitials, calculateProjectProgress } from '../utils/helpers';
import { VIEWS } from '../utils/constants';
import ConfirmModal from './ConfirmModal';
import {
  LayoutDashboard, BarChart3, Calendar, Table2, PieChart,
  Plus, Pencil, Trash2, Check, X, ChevronDown, ChevronRight, ChevronLeft,
  Diamond, Settings, Menu, Grid2X2, ExternalLink
} from 'lucide-react';

const ICON_MAP = {
  LayoutDashboard, BarChart3, Calendar, Table2, PieChart, Grid2X2
};

export default function Sidebar() {
  const {
    projects, tasks,
    activeProjectId, setActiveProjectId,
    activeView, setActiveView,
    lastProjectView,
    sidebarCollapsed, setSidebarCollapsed,
    mobileMenuOpen, setMobileMenuOpen,
    deleteProject,
    openNewProjectModal, openEditProjectModal,
    t
  } = useApp();

  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleStartEdit = (proj) => {
    setEditingProject(proj.id);
    setEditName(proj.name);
  };

  const handleSaveEdit = (id) => {
    if (editName.trim()) {
      updateProject(id, { name: editName.trim() });
    }
    setEditingProject(null);
  };

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const proj = addProject(newProjectName.trim());
      handleSelectProject(proj.id);
      setNewProjectName('');
      setAddingProject(false);
    }
  };

  const handleDeleteProject = (e, proj) => {
    e.stopPropagation();
    setProjectToDelete(proj);
  };

  const handleSelectView = (viewId) => {
    setActiveView(viewId);
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false);
    }
  };

  const handleSelectProject = (projId) => {
    setActiveProjectId(projId);
    if (activeView === 'settings') {
      setActiveView(lastProjectView || 'kanban');
    }
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false);
    }
  };

  if (sidebarCollapsed && !mobileMenuOpen) {
    return (
      <aside
        className="sidebar-panel hidden md:flex w-[60px] h-screen flex-col items-center py-4 flex-shrink-0 transition-all duration-300 select-none shadow-md z-20"
        style={{
          background: 'var(--theme-sidebar-bg)',
          borderColor: 'var(--theme-sidebar-border)',
        }}
      >
        {/* Top: App Logo & Expand Toggle */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md text-white transition-colors"
            style={{ backgroundColor: 'var(--theme-accent, #3b82f6)', boxShadow: '0 4px 12px var(--theme-accent-shadow, rgba(59, 130, 246, 0.3))' }}
          >
            <Diamond size={16} className="text-white" />
          </div>
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title={t('expand_sidebar') || 'Expand Sidebar'}
            aria-label={t('expand_sidebar') || 'Expand Sidebar'}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div
          className="w-7 h-px my-3"
          style={{ backgroundColor: 'var(--theme-sidebar-border)' }}
        />

        {/* View Icons */}
        <div className="flex flex-col gap-1 items-center flex-1 overflow-y-auto custom-scrollbar w-full px-2">
          {VIEWS.map(v => {
            const Icon = ICON_MAP[v.icon];
            const isActive = activeView === v.id;
            return (
              <button
                key={v.id}
                onClick={() => handleSelectView(v.id)}
                className={`w-full p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center relative group ${isActive
                  ? 'text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                style={{
                  backgroundColor: isActive ? 'var(--theme-accent, #3b82f6)' : undefined,
                  boxShadow: isActive ? '0 4px 12px var(--theme-accent-shadow, rgba(59, 130, 246, 0.3))' : undefined,
                }}
                title={t(v.id)}
                aria-label={t(v.id)}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>

        {/* Footer Actions: Settings */}
        <div
          className="mt-auto flex flex-col items-center gap-1 w-full px-2 pt-3 pb-3 border-t"
          style={{ borderColor: 'var(--theme-sidebar-border)' }}
        >
          <button
            onClick={() => handleSelectView('settings')}
            className={`w-full p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${activeView === 'settings'
              ? 'text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            style={{
              backgroundColor: activeView === 'settings' ? 'var(--theme-accent, #3b82f6)' : undefined,
              boxShadow: activeView === 'settings' ? '0 4px 12px var(--theme-accent-shadow, rgba(59, 130, 246, 0.3))' : undefined,
            }}
            title={t('settings_title') || 'Settings'}
            aria-label={t('settings_title') || 'Settings'}
          >
            <Settings size={18} />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`sidebar-panel fixed md:static inset-y-0 left-0 z-50 w-[270px] h-screen flex flex-col flex-shrink-0 transition-transform duration-300 shadow-md ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${sidebarCollapsed ? 'md:hidden' : ''}`}
      style={{
        background: 'var(--theme-sidebar-bg)',
        borderColor: 'var(--theme-sidebar-border)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--theme-sidebar-border)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg text-white transition-colors"
            style={{ backgroundColor: 'var(--theme-accent, #3b82f6)', boxShadow: '0 4px 12px var(--theme-accent-shadow, rgba(59, 130, 246, 0.3))' }}
          >
            <Diamond size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-[15px] tracking-tight">ProjectFlow</span>
        </div>
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              setMobileMenuOpen(false);
            } else {
              setSidebarCollapsed(true);
            }
          }}
          className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          title={t('collapse_sidebar')}
        >
          {window.innerWidth < 768 ? <X size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto py-3 px-3">
        {/* Views */}
        <div className="mb-5">
          <p
            className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2"
            style={{ color: 'var(--theme-sidebar-text-muted)' }}
          >
            {t('views') || 'Views'}
          </p>
          <div className="flex flex-col gap-0.5">
            {VIEWS.map(v => {
              const Icon = ICON_MAP[v.icon];
              return (
                <button
                  key={v.id}
                  onClick={() => handleSelectView(v.id)}
                  className={`sidebar-link ${activeView === v.id ? 'active' : ''}`}
                >
                  <Icon size={17} />
                  <span>{t(v.id)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects */}
        <div className="mb-5">
          <div className="flex items-center justify-between px-3 mb-1">
            <button
              onClick={() => setProjectsExpanded(!projectsExpanded)}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              {projectsExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <span>{t('projects') || 'Projects'}</span>
            </button>
            <button
              onClick={() => openNewProjectModal()}
              className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
              title={t('add_project')}
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span
              className="text-[10px] font-medium"
              style={{ color: 'var(--theme-sidebar-text-muted)' }}
            >
              {t('project_filter_label')}
            </span>
            {activeProjectId !== 'all' && (
              <button
                onClick={() => handleSelectProject('all')}
                className="text-[10px] font-semibold cursor-pointer transition-colors"
                style={{ color: 'var(--theme-accent)' }}
              >
                {t('reset')}
              </button>
            )}
          </div>

          {projectsExpanded && (
            <div className="flex flex-col gap-1">
              {/* All Projects option */}
              <button
                onClick={() => handleSelectProject('all')}
                className={`sidebar-link justify-between transition-all ${activeProjectId === 'all'
                  ? '!bg-white/15 !text-white font-semibold border-l-[3px] pl-[9px] shadow-sm'
                  : 'hover:bg-white/5 text-white/80'
                  }`}
                style={activeProjectId === 'all' ? { borderLeftColor: 'var(--theme-accent)' } : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: activeProjectId === 'all' ? 'var(--theme-accent)' : 'rgba(255, 255, 255, 0.4)'
                    }}
                  />
                  <span className="truncate text-[13px]">{t('all_projects') || 'All Projects'}</span>
                </div>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-medium tabular-nums flex-shrink-0">
                  {tasks.length}
                </span>
              </button>

              {projects.map(proj => {
                const projectTasks = tasks.filter(t => t.projectId === proj.id);
                const progress = calculateProjectProgress(projectTasks);
                const isSelected = activeProjectId === proj.id;

                return (
                  <div
                    key={proj.id}
                    onClick={() => handleSelectProject(proj.id)}
                    onDoubleClick={(e) => { e.stopPropagation(); openEditProjectModal(proj); }}
                    style={isSelected ? { borderLeftColor: proj.color } : {}}
                    className={`group sidebar-link justify-between transition-all cursor-pointer ${isSelected
                      ? '!bg-white/15 !text-white font-semibold border-l-[3px] pl-[9px] shadow-sm'
                      : 'hover:bg-white/5 text-white/80'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                        style={{
                          backgroundColor: proj.color,
                          boxShadow: isSelected ? `0 0 8px ${proj.color}80` : 'none',
                        }}
                      />
                      <span className="truncate text-[13px]">{proj.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[11px] text-white/60 tabular-nums">{progress}%</span>
                      <span className="text-[10px] px-1 py-0.5 rounded bg-white/10 text-white/80 font-medium tabular-nums">
                        {projectTasks.length}
                      </span>
                      <div className="hidden group-hover:flex items-center gap-0.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditProjectModal(proj); }}
                          className="p-1 text-white/60 hover:text-white hover:bg-white/15 rounded transition-colors cursor-pointer"
                          title={t('edit_project')}
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteProject(e, proj)}
                          className="p-1 text-white/60 hover:text-red-300 hover:bg-white/15 rounded transition-colors cursor-pointer"
                          title={t('delete_project')}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Prominent Add Project Button */}
              <button
                onClick={() => openNewProjectModal()}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-white/20 hover:border-white/40 text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-semibold cursor-pointer group"
              >
                <Plus size={14} style={{ color: 'var(--theme-accent)' }} className="group-hover:scale-110 transition-transform" />
                <span>{t('add_project')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation & Copyright Notice */}
      <div
        className="px-3 py-3 border-t space-y-1"
        style={{ borderColor: 'var(--theme-sidebar-border)' }}
      >
        <button
          onClick={() => handleSelectView('settings')}
          className={`sidebar-link w-full ${activeView === 'settings' ? 'active' : ''}`}
        >
          <Settings size={17} />
          <span>{t('settings_title') || 'Settings'}</span>
        </button>
        <a
          href="https://grafitly.etsy.com/listing/4606805658/project-manager-web-app"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-link w-full text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between group"
          title="Need help? Contact the seller on Etsy"
        >
          <div className="flex items-center gap-2.5">
            <ExternalLink size={17} />
            <span>{t('report_issue') || 'Report an Issue'}</span>
          </div>
          <span
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-1.5 py-0.5 rounded font-semibold border"
            style={{
              backgroundColor: 'var(--theme-accent-light)',
              color: '#ffffff',
              borderColor: 'var(--theme-accent-border)',
            }}
          >
            Etsy
          </span>
        </a>

        {/* Professional Copyright & Reserved Attribution */}
        <div
          className="pt-2 px-3 border-t mt-2 flex flex-col gap-0.5"
          style={{ borderColor: 'var(--theme-sidebar-border)' }}
        >
          <div className="flex items-center justify-between text-[11px] text-white/60 font-medium">
            <span>© 2026 Grafitly</span>
            <a
              href="https://grafitly.etsy.com/listing/4606805658/project-manager-web-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] hover:underline transition-colors font-semibold"
              style={{ color: 'var(--theme-accent)' }}
            >
              Visit Grafitly
            </a>
          </div>
          <p
            className="text-[10px] leading-normal"
            style={{ color: 'var(--theme-sidebar-text-muted)' }}
          >
            {t('all_rights_reserved')}
          </p>
        </div>
      </div>

      {/* Delete Project Confirmation Modal */}
      <ConfirmModal
        isOpen={!!projectToDelete}
        title={t('delete_project')}
        message={projectToDelete ? `Are you sure you want to delete "${projectToDelete.name}" and all of its associated tasks?` : ''}
        confirmText={t('yes_delete') || 'Delete Project'}
        cancelText={t('cancel') || 'Cancel'}
        onConfirm={() => {
          if (projectToDelete) {
            deleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }
        }}
        onClose={() => setProjectToDelete(null)}
      />
    </aside>
  );
}
