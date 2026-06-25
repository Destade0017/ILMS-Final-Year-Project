import React, { useState } from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';

const Login = ({ setAuth, toggleView, forgotView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user details to localStorage
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role
      }));

      // Update parent Auth state
      setAuth(data.data.token, {
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role
      });
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
          <h2>Welcome Back</h2>
          <p>Login to your ILMS account</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="e.g. sarah.adams@ilms.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
              <span className="auth-link" style={{ fontSize: '0.8rem' }} onClick={forgotView}>
                Forgot Password?
              </span>
            </div>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : (
              <>
                Login <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <span className="auth-link" onClick={toggleView}>
            Register here
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
