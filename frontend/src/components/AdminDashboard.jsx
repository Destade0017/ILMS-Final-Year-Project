import { useState } from 'react';
import { LogOut, Settings, BarChart2, Users, BookOpen } from 'lucide-react';
import AdminAnalytics from './AdminAnalytics';
import AdminUserManagement from './AdminUserManagement';
import AdminCourseManagement from './AdminCourseManagement';

const NAV_ITEMS = [
  { key: 'analytics', label: 'Analytics',       icon: BarChart2 },
  { key: 'users',     label: 'User Management',  icon: Users },
  { key: 'courses',   label: 'Course Management', icon: BookOpen },
];

/** Returns the first two initials of a name */
const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const AdminDashboard = ({ token, user, logout, goToProfile }) => {
  const [activeTab, setActiveTab] = useState('analytics');

  const activeItem = NAV_ITEMS.find((n) => n.key === activeTab);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* ── TOP BAR ───────────────────────────────────────────────── */}
      <header className="app-topbar">
        <div className="app-topbar-logo">
          <div className="app-topbar-monogram">L</div>
          <span className="app-topbar-name">Learnova</span>
        </div>

        <div className="app-topbar-divider" />
        <span className="app-topbar-breadcrumb">Admin Workspace</span>

        <div className="app-topbar-actions">
          <div className="app-topbar-user">
            <div className="app-topbar-avatar">{getInitials(user.name)}</div>
            <div className="app-topbar-user-info">
              <span className="app-topbar-user-name">{user.name}</span>
              <span className="app-topbar-user-role">{user.role}</span>
            </div>
          </div>

          <div className="app-topbar-divider" />

          <button className="btn btn-ghost btn-sm" onClick={goToProfile} title="Profile Settings">
            <Settings size={16} />
            <span style={{ display: 'none' }}>Profile</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={logout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      {/* ── SIDEBAR + CONTENT ────────────────────────────────────────── */}
      <div className="admin-shell fade-in">

        {/* Sidebar */}
        <nav className="admin-sidebar" aria-label="Admin navigation">
          <div className="admin-sidebar-label">Navigation</div>

          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`sidebar-nav-item ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main className="admin-content">
          {/* Page heading */}
          <div style={{ marginBottom: '28px' }}>
            <h1 className="page-title">{activeItem?.label}</h1>
            <p className="page-subtitle">
              {activeTab === 'analytics' && 'Platform-wide metrics and activity log'}
              {activeTab === 'users'     && 'View, search, and manage all registered users'}
              {activeTab === 'courses'   && 'Manage courses, enrollments, and content'}
            </p>
          </div>

          {activeTab === 'analytics' && <AdminAnalytics token={token} />}
          {activeTab === 'users'     && <AdminUserManagement token={token} user={user} />}
          {activeTab === 'courses'   && <AdminCourseManagement token={token} />}
        </main>

      </div>
    </div>
  );
};

export default AdminDashboard;
