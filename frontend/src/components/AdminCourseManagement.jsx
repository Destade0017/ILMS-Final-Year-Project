import React, { useState, useEffect } from 'react';
import { LogOut, AlertCircle, CheckCircle, FileText, ClipboardList, BookOpen, Users, LayoutDashboard, Settings } from 'lucide-react';

const AdminCourseManagement = ({ token }) => {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form States
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedLecturerId, setSelectedLecturerId] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [coursesRes, lecturersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/courses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/users?role=lecturer`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const coursesData = await coursesRes.json();
      const lecturersData = await lecturersRes.json();

      if (!coursesRes.ok) throw new Error(coursesData.message || 'Failed to fetch courses');
      if (!lecturersRes.ok) throw new Error(lecturersData.message || 'Failed to fetch lecturers');

      setCourses(coursesData.data);
      setLecturers(lecturersData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignForm = (course) => {
    setSelectedCourseId(course._id);
    setSelectedLecturerId(course.lecturer?._id || '');
    setShowAssignForm(true);
    setError('');
    setSuccessMsg('');
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setFormLoading(true);

    if (!selectedLecturerId) {
      setError('Please select a lecturer');
      setFormLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/courses/${selectedCourseId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lecturerId: selectedLecturerId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');

      setSuccessMsg('Lecturer assigned successfully!');
      setShowAssignForm(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleRemoveLecturer = async (courseId) => {
    if (!window.confirm('Are you sure you want to unassign this lecturer?')) return;
    
    setError('');
    setSuccessMsg('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/courses/${courseId}/remove`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to remove lecturer');

      setSuccessMsg('Lecturer unassigned successfully');
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading && courses.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading courses...</div>;
  }

  return (
    <div className="fade-in card" style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Course Management</h2>

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

      {showAssignForm && (
        <form onSubmit={handleAssignSubmit} className="card" style={{ padding: '24px', marginBottom: '30px', background: 'rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Assign Lecturer to Course</h3>
          
          <div className="form-group" style={{ maxWidth: '400px' }}>
            <label>Select Lecturer</label>
            <select 
              className="form-input" 
              value={selectedLecturerId} 
              onChange={e => setSelectedLecturerId(e.target.value)}
              required
            >
              <option value="" disabled>-- Select Lecturer --</option>
              {lecturers.map(l => (
                <option key={l._id} value={l._id}>{l.name} ({l.email})</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Assigning...' : 'Assign Lecturer'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowAssignForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={{ overflowX: 'auto' }}>
        <div className="table-responsive">
<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
              <th style={{ padding: '12px' }}>Course Code</th>
              <th style={{ padding: '12px' }}>Title</th>
              <th style={{ padding: '12px' }}>Assigned Lecturer</th>
              <th style={{ padding: '12px' }}>Students</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--accent)' }}>{c.code}</td>
                <td style={{ padding: '12px', fontWeight: '500' }}>{c.title}</td>
                <td style={{ padding: '12px' }}>
                  {c.lecturer ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-lecturer">{c.lecturer.name}</span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                  )}
                </td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                  {c.students?.length || 0}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '4px 10px', fontSize: '0.8rem', marginRight: '5px' }}
                    onClick={() => handleOpenAssignForm(c)}
                  >
                    Assign
                  </button>
                  {c.lecturer && (
                    <button 
                      className="btn" 
                      style={{ padding: '4px 10px', fontSize: '0.8rem', background: '#fee2e2', color: '#ef4444' }}
                      onClick={() => handleRemoveLecturer(c._id)}
                    >
                      Unassign
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
</div>
      </div>
    </div>
  );
};

export default AdminCourseManagement;
