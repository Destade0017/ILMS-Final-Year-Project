import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Mail, ExternalLink } from 'lucide-react';

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Forgot password request failed');
      }

      setSuccess('Reset link generated successfully!');
      
      // If we are in local development fallback mode, grab the URL/Token directly
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
    <div className="auth-wrapper">
      <div className="auth-card card fade-in">
        <div className="auth-header">
          <h2>Recover Password</h2>
          <p>Enter your email to request a reset link</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {devResetLink ? (
          <div className="card" style={{ padding: '16px', background: 'rgba(37, 99, 235, 0.04)', marginBottom: '20px', borderLeft: '3px solid var(--primary)', fontSize: '0.875rem' }}>
            <strong style={{ display: 'block', marginBottom: '8px' }}>Local Dev Mode Reset Link:</strong>
            <p style={{ wordBreak: 'break-all', marginBottom: '12px', color: 'var(--text-secondary)' }}>
              {devResetLink}
            </p>
            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={() => {
                const token = devResetLink.substring(devResetLink.lastIndexOf('/') + 1);
                resetWithToken(token);
              }}
            >
              <ExternalLink size={16} /> Open Reset Password Page
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="e.g. student@ilms.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading || success}
            >
              {loading ? 'Generating...' : (
                <>
                  <Mail size={18} /> Request Reset Link
                </>
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          Remembered your password?{' '}
          <span className="auth-link" onClick={loginView}>
            Login here
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
