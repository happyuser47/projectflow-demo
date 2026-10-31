import { createContext, useContext, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { loadAllData, saveToDB, exportAppData, STORE_KEYS } from '../hooks/useDatabase';
import { useTheme } from '../hooks/useTheme';
import { DEFAULT_PROJECTS, DEFAULT_TASKS, DEFAULT_TEAM, AVATAR_COLORS } from '../utils/constants';
import { generateId } from '../utils/helpers';
import { translations } from '../utils/i18n';
import { isDemoMode, DEMO_CONFIG } from '../utils/demo';
import Toast from '../components/Toast';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { isDark, toggleTheme } = useTheme();

  const [isInitialized, setIsInitialized] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((title, message, type = 'info') => {
    setToast({ title, message, type });
  }, []);

  // Core data
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);

  // UI state
  const [activeProjectId, setActiveProjectIdState] = useState('all');
  const [activeView, setActiveView] = useState('dashboard');
  const [lastProjectView, setLastProjectView] = useState('kanban');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track the most recent project workspace view so selecting a project while in settings returns user to that view
  useEffect(() => {
    if (activeView && activeView !== 'settings') {
      setLastProjectView(activeView);
    }
  }, [activeView]);

  const setActiveProjectId = useCallback((idOrFn) => {
    setActiveProjectIdState(idOrFn);
    setActiveView(currentView => {
      if (currentView === 'settings') {
        return lastProjectView || 'kanban';
      }
      return currentView;
    });
  }, [lastProjectView]);

  // Filter state
  const [filters, setFilters] = useState({
    project: 'all',
    status: 'all',
    priority: 'all',
    member: 'all',
    search: '',
  });

  // Language state
  const [language, setLanguage] = useState('en');

  // Backup reminder state
  const [lastBackupDate, setLastBackupDate] = useState(null);
  const [backupReminderDays, setBackupReminderDays] = useState(7);
  const [backupSnoozed, setBackupSnoozed] = useState(false);
  const [settingsTab, setSettingsTab] = useState('preferences');

  // Project Modal state
  const [projectModalState, setProjectModalState] = useState({ isOpen: false, project: null });

  const openNewProjectModal = useCallback(() => {
    if (isDemoMode() && projects.length >= DEFAULT_PROJECTS.length + DEMO_CONFIG.MAX_CUSTOM_PROJECTS) {
      setDemoModalState({ isOpen: true, reason: 'project_limit' });
      return;
    }
    setProjectModalState({ isOpen: true, project: null });
  }, [projects.length]);

  const openEditProjectModal = useCallback((project) => {
    setProjectModalState({ isOpen: true, project });
  }, []);

  const closeProjectModal = useCallback(() => {
    setProjectModalState({ isOpen: false, project: null });
  }, []);

  // Demo Modal state
  const [demoModalState, setDemoModalState] = useState({ isOpen: false, reason: 'general' });

  const openDemoModal = useCallback((reason = 'general') => {
    setDemoModalState({ isOpen: true, reason });
  }, []);

  const closeDemoModal = useCallback(() => {
    setDemoModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Notes Drawer state
  const [notesDrawer, setNotesDrawer] = useState({
    isOpen: false,
    tab: 'project',
    selectedTaskId: null,
    selectedProjectId: null,
  });

  const openNotes = useCallback(({ tab = null, taskId = null, projectId = null } = {}) => {
    setNotesDrawer(prev => {
      const targetTab = tab || (taskId ? 'task' : (prev.tab || (activeProjectId !== 'all' ? 'project' : 'task')));
      return {
        isOpen: true,
        tab: targetTab,
        selectedTaskId: taskId !== null ? taskId : prev.selectedTaskId,
        selectedProjectId: projectId || (activeProjectId !== 'all' ? activeProjectId : (projects[0]?.id || null)),
      };
    });
  }, [activeProjectId, projects]);

  const closeNotes = useCallback(() => {
    setNotesDrawer(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Load data on mount
  useEffect(() => {
    const initData = async () => {
      // First try to load local data
      const data = await loadAllData();
      if (data) {
        setProjects(data.projects && data.projects.length > 0 ? data.projects : DEFAULT_PROJECTS);
        setTasks(data.tasks && data.tasks.length > 0 ? data.tasks : DEFAULT_TASKS);
        setTeam(data.team && data.team.length > 0 ? data.team : DEFAULT_TEAM);
        setActiveProjectIdState(data.activeProjectId || 'all');
        setActiveView(data.activeView || 'dashboard');
        setSidebarCollapsed(data.sidebarCollapsed || false);
        setMobileMenuOpen(data.mobileMenuOpen || false);
        setFilters(data.filters || { project: 'all', status: 'all', priority: 'all', member: 'all', search: '' });
        if (data.language) setLanguage(data.language);
        if (data.lastBackupDate) setLastBackupDate(data.lastBackupDate);
        if (data.backupReminderDays !== undefined) setBackupReminderDays(data.backupReminderDays);
      } else {
        setProjects(DEFAULT_PROJECTS);
        setTasks(DEFAULT_TASKS);
        setTeam(DEFAULT_TEAM);
      }
      setIsInitialized(true);
    };
    initData();
  }, []);

  // Sync to database when state changes
  useEffect(() => {
    if (!isInitialized) return;

    // Save locally
    saveToDB(STORE_KEYS.PROJECTS, projects);
    saveToDB(STORE_KEYS.TASKS, tasks);
    saveToDB(STORE_KEYS.TEAM, team);
    saveToDB(STORE_KEYS.ACTIVE_PROJECT, activeProjectId);
    saveToDB(STORE_KEYS.ACTIVE_VIEW, activeView);
    saveToDB(STORE_KEYS.SIDEBAR_COLLAPSED, sidebarCollapsed);
    saveToDB(STORE_KEYS.MOBILE_MENU, mobileMenuOpen);
    saveToDB(STORE_KEYS.FILTERS, filters);
    saveToDB(STORE_KEYS.LANGUAGE, language);
    saveToDB(STORE_KEYS.LAST_BACKUP, lastBackupDate);
    saveToDB(STORE_KEYS.BACKUP_REMINDER_DAYS, backupReminderDays);
  }, [projects, tasks, team, activeProjectId, activeView, sidebarCollapsed, mobileMenuOpen, filters, language, lastBackupDate, backupReminderDays, isInitialized]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Project filter (from sidebar)
    if (activeProjectId && activeProjectId !== 'all') {
      result = result.filter(t => t.projectId === activeProjectId);
    }

    // Additional filters from top bar
    if (filters.project !== 'all') {
      result = result.filter(t => t.projectId === filters.project);
    }
    if (filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }
    if (filters.priority !== 'all') {
      result = result.filter(t => t.priority === filters.priority);
    }
    if (filters.member !== 'all') {
      result = result.filter(t => t.assigneeId === filters.member);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [tasks, activeProjectId, filters]);

  // Translation helper with template parameter support
  const t = useCallback((key, params) => {
    const langObj = translations[language] || translations['en'];
    let str = langObj[key] || translations['en'][key] || key;
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return str;
  }, [language]);

  // Project CRUD
  const addProject = useCallback((projectInput) => {
    if (isDemoMode() && projects.length >= DEFAULT_PROJECTS.length + DEMO_CONFIG.MAX_CUSTOM_PROJECTS) {
      openDemoModal('project_limit');
      return null;
    }

    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
    const isObject = typeof projectInput === 'object' && projectInput !== null;
    const name = isObject ? projectInput.name : projectInput;
    const color = isObject && projectInput.color ? projectInput.color : colors[projects.length % colors.length];
    const description = isObject ? (projectInput.description || '') : '';

    const newProject = {
      id: generateId('proj'),
      name,
      color,
      description,
      createdAt: new Date().toISOString(),
    };
    setProjects(prev => [...prev, newProject]);
    showToast(t('toast_project_created_title'), t('toast_project_created_msg', { name }), 'success');
    return newProject;
  }, [projects.length, setProjects, showToast, t]);

  const updateProject = useCallback((id, updates, quiet = false) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    if (!quiet) {
      showToast(t('toast_project_updated_title'), t('toast_project_updated_msg'), 'info');
    }
  }, [setProjects, showToast, t]);

  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    if (activeProjectId === id) setActiveProjectId('all');
    showToast(t('toast_project_deleted_title'), t('toast_project_deleted_msg'), 'success');
  }, [setProjects, setTasks, activeProjectId, setActiveProjectId, showToast, t]);

  // Task CRUD
  const addTask = useCallback((taskData) => {
    if (isDemoMode() && tasks.length >= DEFAULT_TASKS.length + DEMO_CONFIG.MAX_CUSTOM_TASKS) {
      openDemoModal('task_limit');
      return null;
    }

    const newTask = {
      id: generateId('task'),
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      projectId: taskData.projectId || (activeProjectId !== 'all' ? activeProjectId : projects[0]?.id),
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assigneeId: taskData.assigneeId || '',
      startDate: taskData.startDate || new Date().toISOString().split('T')[0],
      endDate: taskData.endDate || '',
      tags: taskData.tags || [],
      notes: taskData.notes || '',
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    showToast(t('toast_task_created_title'), t('toast_task_created_msg', { title: newTask.title }), 'success');
    return newTask;
  }, [activeProjectId, projects, setTasks, showToast, t]);

  const updateTask = useCallback((id, updates, quiet = false) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    if (!quiet) {
      showToast(t('toast_task_updated_title'), t('toast_task_updated_msg'), 'info');
    }
  }, [setTasks, showToast, t]);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast(t('toast_task_deleted_title'), t('toast_task_deleted_msg'), 'info');
  }, [setTasks, showToast, t]);

  const moveTask = useCallback((taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  }, [setTasks]);

  // Team management
  const addTeamMember = useCallback((name, role) => {
    const newMember = {
      id: generateId('tm-'),
      name,
      role,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    };
    setTeam(prev => [...prev, newMember]);
    showToast(t('toast_member_added_title'), t('toast_member_added_msg', { name }), 'success');
    return newMember;
  }, [setTeam, showToast, t]);

  const deleteTeamMember = useCallback((id) => {
    setTeam(prev => prev.filter(m => m.id !== id));
    setTasks(prev => prev.map(t => t.assigneeId === id ? { ...t, assigneeId: '' } : t));
    showToast(t('toast_member_removed_title'), t('toast_member_removed_msg'), 'info');
  }, [setTeam, setTasks, showToast, t]);

  // Clear all data
  const clearAllData = useCallback(() => {
    setProjects([]);
    setTasks([]);
    setTeam([]);
    setActiveProjectId('all');
    setFilters({ project: 'all', status: 'all', priority: 'all', member: 'all', search: '' });
    showToast(t('toast_data_cleared_title'), t('toast_data_cleared_msg'), 'success');
  }, [showToast, t]);

  // Reset to defaults
  const resetData = useCallback(() => {
    setProjects(DEFAULT_PROJECTS);
    setTasks(DEFAULT_TASKS);
    setTeam(DEFAULT_TEAM);
    setActiveProjectId('all');
    setFilters({ project: 'all', status: 'all', priority: 'all', member: 'all', search: '' });
    showToast(t('toast_data_reset_title'), t('toast_data_reset_msg'), 'success');
  }, [showToast, t]);

  const clearFilters = useCallback(() => {
    setFilters({ project: 'all', status: 'all', priority: 'all', member: 'all', search: '' });
  }, [setFilters]);

  // Backup calculations
  const daysSinceLastBackup = useMemo(() => {
    if (!lastBackupDate) return null;
    const diffMs = Date.now() - new Date(lastBackupDate).getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }, [lastBackupDate]);

  const isBackupDue = useMemo(() => {
    if (backupReminderDays <= 0) return false; // reminder turned off
    if (!lastBackupDate) return true; // never backed up yet
    const diffDays = (Date.now() - new Date(lastBackupDate).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= backupReminderDays;
  }, [lastBackupDate, backupReminderDays]);

  const triggerBackup = useCallback(async () => {
    if (isDemoMode()) {
      openDemoModal('export_disabled');
      return { success: false, demoBlocked: true };
    }

    try {
      const result = await exportAppData();
      if (result?.timestamp) {
        setLastBackupDate(result.timestamp);
        setBackupSnoozed(false);
        showToast(
          t('backup_up_to_date') || 'Backup Created',
          t('backup_success_toast', { filename: result.fileName }) || `Saved as ${result.fileName}`,
          'success'
        );
      }
      return result;
    } catch (err) {
      showToast(t('toast_backup_failed_title') || 'Backup Failed', err.message, 'error');
    }
  }, [showToast, t]);

  const snoozeBackupReminder = useCallback(() => {
    setBackupSnoozed(true);
  }, []);

  const openBackupSettings = useCallback(() => {
    setSettingsTab('data');
    setActiveView('settings');
  }, []);

  const openCloudPitch = useCallback(() => {
    setSettingsTab('cloud');
    setActiveView('settings');
  }, []);

  const value = useMemo(() => ({
    // Theme
    isDark, toggleTheme,
    // Data
    projects, tasks, team, filteredTasks,
    // UI State
    activeProjectId, setActiveProjectId,
    activeView, setActiveView,
    lastProjectView,
    sidebarCollapsed, setSidebarCollapsed,
    mobileMenuOpen, setMobileMenuOpen,
    filters, setFilters, clearFilters,
    // Language
    language, setLanguage, t,
    // Project CRUD
    addProject, updateProject, deleteProject,
    // Project Modal
    projectModalState, openNewProjectModal, openEditProjectModal, closeProjectModal,
    // Task CRUD
    addTask, updateTask, deleteTask, moveTask,
    // Team CRUD
    addTeamMember, deleteTeamMember,
    // Data management
    resetData, clearAllData, showToast,
    // Backup Management & Reminder
    lastBackupDate, setLastBackupDate,
    backupReminderDays, setBackupReminderDays,
    isBackupDue, daysSinceLastBackup,
    triggerBackup, backupSnoozed, snoozeBackupReminder,
    settingsTab, setSettingsTab, openBackupSettings, openCloudPitch,
    // Notes Drawer
    notesDrawer, setNotesDrawer, openNotes, closeNotes,
    // Demo Mode & Guardrails
    isDemo: isDemoMode(),
    demoModalState, openDemoModal, closeDemoModal,
    // System status
    isInitialized,
  }), [
    isDark, toggleTheme,
    projects, tasks, team, filteredTasks,
    activeProjectId, setActiveProjectId,
    activeView, setActiveView,
    sidebarCollapsed, setSidebarCollapsed,
    mobileMenuOpen, setMobileMenuOpen,
    filters, setFilters, clearFilters,
    language, setLanguage, t,
    addProject, updateProject, deleteProject,
    projectModalState, openNewProjectModal, openEditProjectModal, closeProjectModal,
    demoModalState, openDemoModal, closeDemoModal,
    addTask, updateTask, deleteTask, moveTask,
    addTeamMember, deleteTeamMember,
    resetData, clearAllData, showToast,
    lastBackupDate, backupReminderDays, isBackupDue, daysSinceLastBackup,
    triggerBackup, backupSnoozed, snoozeBackupReminder,
    settingsTab, openBackupSettings, openCloudPitch,
    notesDrawer, openNotes, closeNotes,
    lastProjectView,
    isInitialized,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
