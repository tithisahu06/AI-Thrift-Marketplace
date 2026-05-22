import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rwai_token');
    if (token) {
      getMe()
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('rwai_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const r = await apiLogin({ email, password });
    localStorage.setItem('rwai_token', r.data.token);
    setUser(r.data.user);
    toast.success(`👋 Welcome back, ${r.data.user.name}!`);
    return r.data.user;
  };

  const register = async (name, email, password) => {
    const r = await apiRegister({ name, email, password });
    localStorage.setItem('rwai_token', r.data.token);
    setUser(r.data.user);
    toast.success(`🎉 Welcome to WearAI, ${r.data.user.name}!`);
    return r.data.user;
  };

  const logout = () => {
    localStorage.removeItem('rwai_token');
    setUser(null);
    toast('👋 Signed out');
  };

  // Demo login (no backend needed)
  const demoLogin = (name = 'Demo User', email = 'demo@wearai.com') => {
    const demoUser = { _id: 'demo', name, email, avatar: '', initials: name[0].toUpperCase() };
    setUser(demoUser);
    toast.success(`👋 Welcome, ${name}!`);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
