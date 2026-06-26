import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ProfileSettings from './components/ProfileSettings';
function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
  const [resetToken, setResetToken] = useState('');
  const [appLoading, setAppLoading] = useState(true);
  const [mainView, setMainView] = useState('dashboard');

  // Check localStorage for existing session on load & handle url reset parameters
  useEffect(() => {
    const cachedToken = localStorage.getItem('token');
    const cachedUser = localStorage.getItem('user');

    if (cachedToken && cachedUser) {
      setToken(cachedToken);
      setUser(JSON.parse(cachedUser));
    }
    
    // Parse password reset URL
    const path = window.location.pathname;
    if (path.startsWith('/reset-password/')) {
      const tokenFromPath = path.replace('/reset-password/', '');
      if (tokenFromPath) {
        setResetToken(tokenFromPath);
        setAuthView('reset');
        window.history.replaceState({}, document.title, '/');
      }
    }

    setAppLoading(false);
  }, []);

  const setAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setAuthView('login');
  };

  if (appLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
        Initializing ILMS application...
      </div>
    );
  }

  // If not logged in, render auth views
  if (!token) {
    if (authView === 'login') {
      return (
        <Login 
          setAuth={setAuth} 
          toggleView={() => setAuthView('register')} 
          forgotView={() => setAuthView('forgot')}
        />
      );
    }
    if (authView === 'register') {
      return (
        <Register 
          setAuth={setAuth} 
          toggleView={() => setAuthView('login')} 
        />
      );
    }
    if (authView === 'forgot') {
      return (
        <ForgotPassword 
          loginView={() => setAuthView('login')} 
          resetWithToken={(t) => { setResetToken(t); setAuthView('reset'); }}
        />
      );
    }
    if (authView === 'reset') {
      return (
        <ResetPassword 
          token={resetToken} 
          setAuth={setAuth}
          loginView={() => setAuthView('login')} 
        />
      );
    }
  }

  // If logged in, render the main dashboard or profile
  if (mainView === 'profile') {
    return (
      <ProfileSettings 
        token={token} 
        userRole={user.role} 
        goBack={() => setMainView('dashboard')} 
      />
    );
  }

  if (user.role === 'admin') {
    return (
      <AdminDashboard 
        token={token} 
        user={user} 
        logout={logout} 
        goToProfile={() => setMainView('profile')}
      />
    );
  }

  return (
    <Dashboard 
      token={token} 
      user={user} 
      logout={logout} 
      goToProfile={() => setMainView('profile')}
    />
  );
}

export default App;
