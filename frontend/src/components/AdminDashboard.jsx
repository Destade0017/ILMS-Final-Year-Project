import React, { useState } from 'react';
import { LogOut, AlertCircle, CheckCircle, FileText, ClipboardList, BookOpen, Users, LayoutDashboard, Settings } from 'lucide-react';
import AdminAnalytics from './AdminAnalytics';
import AdminUserManagement from './AdminUserManagement';
import AdminCourseManagement from './AdminCourseManagement';

const AdminDashboard = ({ token, user, logout }) => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'users', 'courses'

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }} className="fade-in">
      {/* HEADER SECTION */}
      <header className="card mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>ILMS Admin Workspace</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Welcome, {user.name}</span>
            <span className={`badge badge-${user.role}`}>{user.role}</span>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button 
          className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics Dashboard
        </button>
        <button 
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('courses')}
        >
          Course Management
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'analytics' && <AdminAnalytics token={token} />}
      {activeTab === 'users' && <AdminUserManagement token={token} user={user} />}
      {activeTab === 'courses' && <AdminCourseManagement token={token} />}

    </div>
  );
};

export default AdminDashboard;
