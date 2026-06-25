import React, { useState, useEffect } from 'react';
import { LogOut, AlertCircle, CheckCircle, FileText, ClipboardList, BookOpen, Users, LayoutDashboard, Settings } from 'lucide-react';

const AdminUserManagement = ({ token, user: currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
      setUsers(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateForm = () => {
    setIsEditing(false);
    setEditUserId(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('student');
    setShowForm(true);
    setError('');
    setSuccessMsg('');
  };

  const handleOpenEditForm = (user) => {
    setIsEditing(true);
    setEditUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setPassword(''); // leave blank for editing unless they want to change it (not supported in backend yet, but we'll ignore)
    setRole(user.role);
    setShowForm(true);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setFormLoading(true);

    try {
      let res;
      if (isEditing) {
        res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/users/${editUserId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name, email, role })
        });
      } else {
        if (!password) throw new Error('Password is required for new users');
        res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name, email, password, role })
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');

      setSuccessMsg(`User ${isEditing ? 'updated' : 'created'} successfully!`);
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setError('');
    setSuccessMsg('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete user');

      setSuccessMsg('User deleted successfully');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading && users.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading users...</div>;
  }

  return (
    <div className="fade-in card" style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem' }}>User Management</h2>
        <button className="btn btn-primary" onClick={handleOpenCreateForm}>
          ＋ Create User
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <span><AlertCircle size={18} /></span><span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <span><CheckCircle size={18} /></span><span>{successMsg}</span>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '24px', marginBottom: '30px', background: 'rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            {isEditing ? 'Edit User' : 'Create New User'}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" className="form-input" required 
                value={name} onChange={e => setName(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" className="form-input" required 
                value={email} onChange={e => setEmail(e.target.value)} 
              />
            </div>
            {!isEditing && (
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" className="form-input" required={!isEditing}
                  value={password} onChange={e => setPassword(e.target.value)} 
                />
              </div>
            )}
            <div className="form-group">
              <label>Role</label>
              <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Saving...' : 'Save User'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Role</th>
              <th style={{ padding: '12px' }}>Joined</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <td style={{ padding: '12px', fontWeight: '500' }}>{u.name}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{u.email}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${u.role}`}>{u.role}</span>
                </td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '4px 10px', fontSize: '0.8rem', marginRight: '5px' }}
                    onClick={() => handleOpenEditForm(u)}
                  >
                    Edit
                  </button>
                  {u._id !== currentUser.id && (
                    <button 
                      className="btn" 
                      style={{ padding: '4px 10px', fontSize: '0.8rem', background: '#fee2e2', color: '#ef4444' }}
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;
