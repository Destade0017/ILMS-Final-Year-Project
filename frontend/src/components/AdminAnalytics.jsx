import { useState, useEffect } from 'react';
import {
  AlertCircle, FileText, BookOpen, Users,
  GraduationCap, UserCheck, TrendingUp, Upload,
  Activity,
} from 'lucide-react';

/* Stat card component */
const StatCard = ({ title, value, icon: Icon, colorClass = 'blue' }) => (
  <div className="stat-card">
    <div className={`stat-card-icon ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div className="stat-card-body">
      <div className="stat-card-label">{title}</div>
      <div className="stat-card-value">{value ?? '—'}</div>
    </div>
  </div>
);

const AdminAnalytics = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, actsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/activities`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="stat-card">
            <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 28, width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <AlertCircle size={16} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard title="Total Users"        value={stats.totalUsers}           icon={Users}         colorClass="blue" />
        <StatCard title="Students"           value={stats.totalStudents}        icon={GraduationCap} colorClass="cyan" />
        <StatCard title="Lecturers"          value={stats.totalLecturers}       icon={UserCheck}     colorClass="green" />
        <StatCard title="Total Courses"      value={stats.totalCourses}         icon={BookOpen}      colorClass="purple" />
        <StatCard title="Total Assessments"  value={stats.totalAssessments}     icon={FileText}      colorClass="orange" />
        <StatCard title="Submissions"        value={stats.totalSubmissions}     icon={Upload}        colorClass="blue" />
        <StatCard title="Avg Score"          value={`${stats.averageStudentScore}%`} icon={TrendingUp} colorClass="green" />
      </div>

      {/* DETAIL PANELS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Top Courses */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="section-header" style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Top Performing Courses</h3>
          </div>
          {stats.topPerformingCourses.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-state-icon"><BookOpen size={22} /></div>
              <p>No course data available yet.</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {stats.topPerformingCourses.map((course) => (
                <li key={course.courseId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-light)', padding: '1px 8px', borderRadius: '999px', display: 'inline-block', marginBottom: '4px' }}>
                      {course.code}
                    </span>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {course.title}
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.9rem', flexShrink: 0, marginLeft: 12 }}>
                    {course.avgScore}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Activities */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="section-header" style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Activity</h3>
            <Activity size={16} color="var(--text-muted)" />
          </div>
          {activities.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-state-icon"><Activity size={22} /></div>
              <p>No activities logged yet.</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {activities.map((act) => (
                <li key={act._id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'flex-start', gap: 8 }}>
                    <strong style={{ fontSize: '0.875rem', textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                      {act.action.replace(/_/g, ' ')}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                      {new Date(act.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 500 }}>{act.user?.name || 'Unknown User'}</span>
                    {act.target && <span> · {act.target}</span>}
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

export default AdminAnalytics;
