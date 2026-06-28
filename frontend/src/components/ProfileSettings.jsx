import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const ProfileSettings = ({ token, goBack }) => {
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();

  const [name, setName] = useState(() => localStorage.getItem('name') || storedUser.name || '');
  const [email, setEmail] = useState(() => localStorage.getItem('email') || storedUser.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialisation handled in useState
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password: password || undefined }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Profile updated successfully!');
        if (data.data.name) localStorage.setItem('name', data.data.name);
        if (data.data.email) localStorage.setItem('email', data.data.email);
        setPassword('');
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch {
      setError('Server error, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const userRole = storedUser.role || '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* ── TOP BAR ───────────────────────────────────────── */}
      <header className="app-topbar">
        <div className="app-topbar-logo">
          <div className="app-topbar-monogram">L</div>
          <span className="app-topbar-name">Learnova</span>
        </div>
        <div className="app-topbar-divider" />
        <span className="app-topbar-breadcrumb">Profile Settings</span>
        <div className="app-topbar-actions">
          <button className="btn btn-secondary btn-sm" onClick={goBack}>
            <ArrowLeft size={15} /> Back to Dashboard
          </button>
        </div>
      </header>

      {/* ── PAGE CONTENT ─────────────────────────────────── */}
      <div className="page-wrapper fade-in" style={{ maxWidth: '680px' }}>

        {/* User Avatar + Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--primary-muted)',
            border: '2px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--primary)',
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}>
            {getInitials(name)}
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {name || 'Your Name'}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{email}</div>
            {userRole && (
              <span className={`badge badge-${userRole}`} style={{ marginTop: '6px' }}>
                {userRole}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            <CheckCircle size={16} /> {success}
          </div>
        )}

        <form onSubmit={handleUpdate}>

          {/* ── ACCOUNT INFO ─────────────────── */}
          <div className="card" style={{ padding: '28px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={17} style={{ color: 'var(--primary)' }} /> Account Information
            </h2>

            <div className="form-group">
              <label htmlFor="profile-name">Full Name</label>
              <input
                type="text"
                id="profile-name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="profile-email">
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Mail size={13} /> Email Address
                </span>
              </label>
              <input
                type="email"
                id="profile-email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* ── SECURITY ─────────────────────── */}
          <div className="card" style={{ padding: '28px', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={17} style={{ color: 'var(--primary)' }} /> Security
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Leave blank to keep your current password.
            </p>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="profile-password">New Password</label>
              <input
                type="password"
                id="profile-password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password"
                minLength={6}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '10px 24px' }}>
              <Save size={15} />
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
