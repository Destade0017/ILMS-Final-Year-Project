import React, { useState } from 'react';
import { AlertCircle, CheckCircle, KeyRound } from 'lucide-react';

const ResetPassword = ({ token, setAuth, loginView }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      setSuccess('Password updated successfully! Logging you in...');

      // Save token and user details to localStorage
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role
      }));

      // Delay slightly for success message to display
      setTimeout(() => {
        setAuth(data.data.token, {
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role
        });
      }, 1000);

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
          <h2>Reset Password</h2>
          <p>Choose a new password for your account</p>
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || success}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Updating Password...' : (
              <>
                <KeyRound size={18} /> Reset Password
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Return to{' '}
          <span className="auth-link" onClick={loginView}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
