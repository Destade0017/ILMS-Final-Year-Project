import { useState } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff, UserPlus } from 'lucide-react';

const BRAND_FEATURES = [
  'Adaptive learning paths tailored to your level',
  'Diagnostic tests to personalise your journey',
  'Track progress across quizzes & assignments',
];

const Register = ({ setAuth, toggleView }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !role) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setSuccess('Account created! Redirecting…');

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
      }));

      setTimeout(() => {
        setAuth(data.data.token, {
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role,
        });
      }, 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* LEFT — Brand Panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-logo">
          <div className="auth-brand-monogram">L</div>
          <span className="auth-brand-name">Learnova</span>
        </div>

        <h1 className="auth-brand-headline">
          Start your<br />learning journey today.
        </h1>
        <p className="auth-brand-sub">
          Join thousands of students and lecturers using Learnova for smarter, adaptive education.
        </p>

        <div className="auth-brand-features">
          {BRAND_FEATURES.map((f, i) => (
            <div key={i} className="auth-brand-feature">
              <div className="auth-brand-feature-dot" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner fade-in">
          <div className="auth-mini-logo">
            <div className="auth-mini-monogram">L</div>
            <span className="auth-mini-name">Learnova</span>
          </div>

          <div className="auth-header">
            <h2>Create your account</h2>
            <p>Join the Intelligent Learning System</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <input
                type="text"
                id="reg-name"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <input
                type="email"
                id="reg-email"
                className="form-input"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  className="form-input"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="input-eye-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-role">I am a</label>
              <select
                id="reg-role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '4px', padding: '11px 18px' }}
              disabled={loading}
            >
              {loading ? 'Creating Account…' : (<><UserPlus size={16} /> Create Account</>)}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <span className="auth-link" onClick={toggleView}>Sign in here</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
