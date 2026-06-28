import { useState } from 'react';
import { AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

const BRAND_FEATURES = [
  'Adaptive learning paths tailored to your level',
  'Diagnostic tests to personalise your journey',
  'Track progress across quizzes & assignments',
];

const Login = ({ setAuth, toggleView, forgotView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
      }));

      setAuth(data.data.token, {
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
      });
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
          Intelligent<br />Learning, Simplified.
        </h1>
        <p className="auth-brand-sub">
          An adaptive LMS that personalises your educational path — so you learn smarter, not harder.
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
          {/* Mini logo (visible when brand panel is hidden on mobile) */}
          <div className="auth-mini-logo" style={{ display: 'flex' }}>
            <div className="auth-mini-monogram">L</div>
            <span className="auth-mini-name">Learnova</span>
          </div>

          <div className="auth-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue your learning journey</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                type="email"
                id="login-email"
                className="form-input"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="login-password" style={{ margin: 0 }}>Password</label>
                <span className="auth-link" style={{ fontSize: '0.8125rem' }} onClick={forgotView}>
                  Forgot password?
                </span>
              </div>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  className="form-input"
                  placeholder="••••••••"
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

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '6px', padding: '11px 18px' }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : (<>Sign In <ArrowRight size={16} /></>)}
            </button>
          </form>

          <div className="auth-footer">
            Don&apos;t have an account?{' '}
            <span className="auth-link" onClick={toggleView}>Create one here</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
