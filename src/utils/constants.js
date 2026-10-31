// Status definitions
export const STATUSES = [
  { id: 'todo', label: 'To Do', color: '#94a3b8', dotColor: '#94a3b8' },
  { id: 'in-progress', label: 'In Progress', color: '#3b82f6', dotColor: '#3b82f6' },
  { id: 'review', label: 'In Review', color: '#f59e0b', dotColor: '#f59e0b' },
  { id: 'done', label: 'Done', color: '#22c55e', dotColor: '#22c55e' },
];

export const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.id, s]));

// Priority definitions
export const PRIORITIES = [
  { id: 'low', label: 'Low', color: '#64748b', bg: '#f1f5f9', darkBg: '#1e293b' },
  { id: 'medium', label: 'Medium', color: '#3b82f6', bg: '#eff6ff', darkBg: '#1e3a5f' },
  { id: 'high', label: 'High', color: '#f97316', bg: '#fff7ed', darkBg: '#431407' },
  { id: 'urgent', label: 'Urgent', color: '#ef4444', bg: '#fef2f2', darkBg: '#450a0a' },
];

export const PRIORITY_MAP = Object.fromEntries(PRIORITIES.map(p => [p.id, p]));

// Avatar colors for team members
export const AVATAR_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
];

// Tag colors
export const TAG_COLORS = {
  design: { bg: '#ede9fe', color: '#7c3aed', darkBg: '#2e1065' },
  frontend: { bg: '#e0f2fe', color: '#0284c7', darkBg: '#0c4a6e' },
  backend: { bg: '#fef3c7', color: '#b45309', darkBg: '#451a03' },
  devops: { bg: '#d1fae5', color: '#059669', darkBg: '#064e3b' },
  ui: { bg: '#fce7f3', color: '#db2777', darkBg: '#500724' },
  auth: { bg: '#fee2e2', color: '#dc2626', darkBg: '#450a0a' },
  component: { bg: '#e0e7ff', color: '#4f46e5', darkBg: '#1e1b4b' },
  planning: { bg: '#f0fdf4', color: '#16a34a', darkBg: '#052e16' },
  architecture: { bg: '#faf5ff', color: '#9333ea', darkBg: '#3b0764' },
  testing: { bg: '#fff1f2', color: '#e11d48', darkBg: '#4c0519' },
};

// Default team members
export const DEFAULT_TEAM = [
  { id: 'tm-1', name: 'Alice Chen', role: 'Project Lead', avatarColor: AVATAR_COLORS[0] },
  { id: 'tm-2', name: 'Bob Smith', role: 'Developer', avatarColor: AVATAR_COLORS[1] },
  { id: 'tm-3', name: 'Carol White', role: 'Designer', avatarColor: AVATAR_COLORS[2] },
  { id: 'tm-4', name: 'Dan Kim', role: 'Backend Dev', avatarColor: AVATAR_COLORS[3] },
  { id: 'tm-5', name: 'Emily Davis', role: 'QA Engineer', avatarColor: AVATAR_COLORS[4] },
];

// Views for sidebar navigation
export const VIEWS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'PieChart' },
  { id: 'kanban', label: 'Kanban', icon: 'LayoutDashboard' },
  { id: 'gantt', label: 'Gantt', icon: 'BarChart3' },
  { id: 'calendar', label: 'Calendar', icon: 'Calendar' },
  { id: 'table', label: 'Table', icon: 'Table2' },
  { id: 'matrix', label: 'Eisenhower Matrix', icon: 'Grid2X2' },
];

// Generate seed data
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

export const DEFAULT_PROJECTS = [
  { id: 'proj-1', name: 'Website Redesign', color: '#ef4444', createdAt: new Date().toISOString() },
  { id: 'proj-2', name: 'Mobile App', color: '#22c55e', createdAt: new Date().toISOString() },
  { id: 'proj-3', name: 'API Integration', color: '#f59e0b', createdAt: new Date().toISOString() },
];

export const DEFAULT_TASKS = [
  // Website Redesign tasks
  {
    id: 'task-1', title: 'API Tracking End Point', description: 'Set up analytics tracking endpoints for the new website', projectId: 'proj-1',
    status: 'todo', priority: 'high', assigneeId: 'tm-2', startDate: daysFromNow(-10), endDate: daysFromNow(-3), tags: ['backend'],
  },
  {
    id: 'task-2', title: 'Auditor Board Feature Testing', description: 'Complete QA testing for the auditor board feature', projectId: 'proj-1',
    status: 'todo', priority: 'urgent', assigneeId: 'tm-5', startDate: daysFromNow(-8), endDate: daysFromNow(-1), tags: ['testing'],
  },
  {
    id: 'task-3', title: 'Design Homepage Wireframes', description: 'Create wireframes for the new homepage layout', projectId: 'proj-1',
    status: 'in-progress', priority: 'high', assigneeId: 'tm-3', startDate: daysFromNow(-5), endDate: daysFromNow(2), tags: ['design', 'frontend'],
  },
  {
    id: 'task-4', title: 'Implement Navigation Component', description: 'Build the responsive navigation bar component', projectId: 'proj-1',
    status: 'in-progress', priority: 'medium', assigneeId: 'tm-2', startDate: daysFromNow(-3), endDate: daysFromNow(5), tags: ['frontend', 'component'],
  },
  {
    id: 'task-5', title: 'Setup CI/CD Pipeline', description: 'Configure continuous integration and deployment pipeline', projectId: 'proj-1',
    status: 'review', priority: 'high', assigneeId: 'tm-2', startDate: daysFromNow(-15), endDate: daysFromNow(-3), tags: ['devops'],
  },
  {
    id: 'task-6', title: 'Figma Design For Sign Up And Sign In', description: 'Design the authentication pages in Figma', projectId: 'proj-1',
    status: 'review', priority: 'medium', assigneeId: 'tm-3', startDate: daysFromNow(-7), endDate: daysFromNow(-1), tags: ['design', 'ui'],
  },
  {
    id: 'task-7', title: 'Reach Mobile App UI', description: 'Research mobile app UI patterns and compile findings', projectId: 'proj-1',
    status: 'todo', priority: 'low', assigneeId: 'tm-3', startDate: daysFromNow(-2), endDate: daysFromNow(10), tags: ['design'],
  },
  {
    id: 'task-8', title: 'Log In Page UI Design', description: 'Design the login page user interface', projectId: 'proj-1',
    status: 'todo', priority: 'medium', assigneeId: 'tm-5', startDate: daysFromNow(0), endDate: daysFromNow(7), tags: ['design', 'ui'],
  },
  {
    id: 'task-9', title: 'QA for Financial Dashboard', description: 'Quality assurance testing for the financial dashboard', projectId: 'proj-1',
    status: 'review', priority: 'high', assigneeId: 'tm-1', startDate: daysFromNow(-6), endDate: daysFromNow(-2), tags: ['testing'],
  },
  // Mobile App tasks
  {
    id: 'task-10', title: 'App Architecture Planning', description: 'Plan the overall mobile app architecture', projectId: 'proj-2',
    status: 'done', priority: 'high', assigneeId: 'tm-3', startDate: daysFromNow(-20), endDate: daysFromNow(-10), tags: ['architecture', 'planning'],
  },
  {
    id: 'task-11', title: 'Design System Setup', description: 'Create the design system and component library', projectId: 'proj-2',
    status: 'review', priority: 'medium', assigneeId: 'tm-3', startDate: daysFromNow(-5), endDate: daysFromNow(1), tags: ['design', 'frontend'],
    notes: 'Design tokens defined in Tailwind config.\n- [x] Primary and neutral color palettes\n- [ ] Contrast audit for WCAG AA standard',
  },
  {
    id: 'task-12', title: 'Test Log In And Sign Up Page', description: 'Test login and signup flows for edge cases', projectId: 'proj-2',
    status: 'in-progress', priority: 'medium', assigneeId: 'tm-1', startDate: daysFromNow(-3), endDate: daysFromNow(4), tags: ['testing'],
  },
  {
    id: 'task-13', title: 'Push Notification Service', description: 'Implement push notification integration', projectId: 'proj-2',
    status: 'todo', priority: 'high', assigneeId: 'tm-4', startDate: daysFromNow(1), endDate: daysFromNow(8), tags: ['backend'],
    notes: 'Push credentials and API tokens configured.\nCheck APNs certificate expiry before release.',
  },
  {
    id: 'task-14', title: 'Offline Mode Support', description: 'Add offline data caching and sync functionality', projectId: 'proj-2',
    status: 'todo', priority: 'medium', assigneeId: 'tm-2', startDate: daysFromNow(3), endDate: daysFromNow(12), tags: ['frontend', 'backend'],
  },
  {
    id: 'task-15', title: 'User Profile Screen', description: 'Build the user profile management screen', projectId: 'proj-2',
    status: 'done', priority: 'low', assigneeId: 'tm-3', startDate: daysFromNow(-12), endDate: daysFromNow(-5), tags: ['design', 'frontend'],
  },
  // API Integration tasks
  {
    id: 'task-16', title: 'Payment API Fix', description: 'Fix payment processing API integration bugs', projectId: 'proj-3',
    status: 'todo', priority: 'urgent', assigneeId: 'tm-4', startDate: daysFromNow(-5), endDate: daysFromNow(-2), tags: ['backend'],
  },
  {
    id: 'task-17', title: 'Rate Limiting Middleware', description: 'Implement API rate limiting middleware', projectId: 'proj-3',
    status: 'review', priority: 'high', assigneeId: 'tm-4', startDate: daysFromNow(-8), endDate: daysFromNow(-1), tags: ['backend'],
  },
  {
    id: 'task-18', title: 'OAuth2 Integration', description: 'Set up OAuth2 authentication flow with third-party providers', projectId: 'proj-3',
    status: 'done', priority: 'high', assigneeId: 'tm-5', startDate: daysFromNow(-20), endDate: daysFromNow(-8), tags: ['backend', 'auth'],
  },
  {
    id: 'task-19', title: 'API Documentation', description: 'Write comprehensive API documentation with examples', projectId: 'proj-3',
    status: 'in-progress', priority: 'medium', assigneeId: 'tm-1', startDate: daysFromNow(-4), endDate: daysFromNow(3), tags: ['backend'],
  },
  {
    id: 'task-20', title: 'Webhook System', description: 'Build webhook delivery system for third-party integrations', projectId: 'proj-3',
    status: 'todo', priority: 'medium', assigneeId: 'tm-2', startDate: daysFromNow(2), endDate: daysFromNow(10), tags: ['backend'],
  },
];
