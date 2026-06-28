import { useState } from 'react';
import { AlertCircle, CheckCircle, KeyRound, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ResetPassword = ({ token, setAuth, loginView }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password reset failed');

      setSuccess('Password updated! Signing you in…');

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
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper-center">
      <div className="auth-card fade-in">
        {/* Logo */}
        <div className="auth-mini-logo" style={{ marginBottom: '28px' }}>
          <div className="auth-mini-monogram">L</div>
          <span className="auth-mini-name">Learnova</span>
        </div>

        <div className="auth-header">
          <h2>Set a new password</h2>
          <p>Choose a strong password for your account</p>
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
            <label htmlFor="new-password">New Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="new-password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || !!success}
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
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              className="form-input"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || !!success}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '4px', padding: '11px 18px' }}
            disabled={loading || !!success}
          >
            {loading ? 'Updating…' : (<><KeyRound size={16} /> Reset Password</>)}
          </button>
        </form>

        <div className="auth-footer">
          <span className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={loginView}>
            <ArrowLeft size={14} /> Back to Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
