import { useState } from 'react';
import { AlertCircle, CheckCircle, Mail, ExternalLink, ArrowLeft } from 'lucide-react';

const ForgotPassword = ({ loginView, resetWithToken }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [devResetLink, setDevResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDevResetLink('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Forgot password request failed');

      setSuccess('Reset link generated successfully!');

      // If in local dev fallback mode, expose reset URL directly
      if (data.data && data.data.resetUrl) {
        setDevResetLink(data.data.resetUrl);
      }
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
          <h2>Recover your password</h2>
          <p>Enter your email and we&apos;ll send you a reset link</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && !devResetLink && (
          <div className="alert alert-success">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        {devResetLink ? (
          <div style={{ background: 'var(--primary-muted)', border: '1px solid var(--border-focus)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: '20px', fontSize: '0.875rem' }}>
            <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>Dev Mode — Reset Link:</strong>
            <p style={{ wordBreak: 'break-all', marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              {devResetLink}
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
              onClick={() => {
                const token = devResetLink.substring(devResetLink.lastIndexOf('/') + 1);
                resetWithToken(token);
              }}
            >
              <ExternalLink size={14} /> Open Reset Page
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="forgot-email">Email Address</label>
              <input
                type="email"
                id="forgot-email"
                className="form-input"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? 'Sending…' : (<><Mail size={16} /> Send Reset Link</>)}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <span className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={loginView}>
            <ArrowLeft size={14} /> Back to Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
