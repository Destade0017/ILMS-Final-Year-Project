import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ProfileSettings from './components/ProfileSettings';
function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem('user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  
  const [authView, setAuthView] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith('/reset-password/') && path.length > 16) {
      return 'reset';
    }
    return 'login';
  });
  
  const [resetToken, setResetToken] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith('/reset-password/')) {
      return path.replace('/reset-password/', '');
    }
    return '';
  });
  
  const [mainView, setMainView] = useState('dashboard');

  useEffect(() => {
    if (authView === 'reset' && resetToken) {
      window.history.replaceState({}, document.title, '/');
    }
  }, [authView, resetToken]);

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
