import React, { useState, useEffect } from 'react';
import { LogOut, AlertCircle, CheckCircle, FileText, ClipboardList, BookOpen, Users, LayoutDashboard, Settings } from 'lucide-react';

const AdminAnalytics = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, actsRes] = await Promise.all([
        fetch('http://localhost:5001/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5001/api/admin/activities', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const statsData = await statsRes.json();
      const actsData = await actsRes.json();

      if (!statsRes.ok) throw new Error(statsData.message || 'Failed to fetch stats');
      if (!actsRes.ok) throw new Error(actsData.message || 'Failed to fetch activities');

      setStats(statsData.data);
      setActivities(actsData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading analytics...</div>;
  }

  if (error) {
    return <div className="alert alert-error"><span><AlertCircle size={18} /></span><span>{error}</span></div>;
  }

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>System Overview</h2>
      
      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <StatCard title="Total Users" value={stats.totalUsers} icon="👥" />
        <StatCard title="Students" value={stats.totalStudents} icon="🎓" />
        <StatCard title="Lecturers" value={stats.totalLecturers} icon="👨‍🏫" />
        <StatCard title="Total Courses" value={stats.totalCourses} icon="📚" />
        <StatCard title="Total Assessments" value={stats.totalAssessments} icon="Article" />
        <StatCard title="Submissions" value={stats.totalSubmissions} icon="📤" />
        <StatCard title="Avg Score" value={`${stats.averageStudentScore}%`} icon="📈" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* TOP COURSES */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Top Performing Courses</h3>
          {stats.topPerformingCourses.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No data available yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {stats.topPerformingCourses.map(course => (
                <li key={course.courseId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <span><strong style={{ color: 'var(--accent)' }}>{course.code}</strong> - {course.title}</span>
                  <span style={{ fontWeight: 'bold' }}>{course.avgScore}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RECENT ACTIVITIES */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Recent Activities</h3>
          {activities.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No activities logged yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {activities.map(act => (
                <li key={act._id} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong>{act.action.replace(/_/g, ' ')}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(act.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--accent)' }}>{act.user?.name || 'Unknown User'}</span>
                    {act.target && <span> on {act.target}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
    <div style={{ fontSize: '2rem' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>{title}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
    </div>
  </div>
);

export default AdminAnalytics;
