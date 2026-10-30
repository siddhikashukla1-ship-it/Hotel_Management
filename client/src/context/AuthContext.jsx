import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@hotelpro.com',
    password: 'admin123',
    role: 'Admin / General Manager',
    name: 'Alexander Wright'
  },
  staff: {
    email: 'staff@hotelpro.com',
    password: 'staff123',
    role: 'Staff / Front Desk',
    name: 'Elena Rostova'
  },
  guest: {
    email: 'guest@hotelpro.com',
    password: 'guest123',
    role: 'Guest / Customer',
    name: 'Sarah Jenkins'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hotelpro_token'));
  const [loading, setLoading] = useState(true);

  // Check initial authentication
  useEffect(() => {
    const verifyAuth = async () => {
      const savedToken = localStorage.getItem('hotelpro_token');
      if (savedToken) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('hotelpro_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('hotelpro_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('hotelpro_token');
    setToken(null);
    setUser(null);
  };

  const quickLogin = async (roleKey) => {
    const creds = DEMO_ACCOUNTS[roleKey];
    if (!creds) return;
    return await login(creds.email, creds.password);
  };

  const updateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (res.success && res.user) {
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Failed to update profile');
  };

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff' || user?.role === 'admin';
  const isGuest = user?.role === 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        isStaff,
        isGuest,
        login,
        register,
        logout,
        quickLogin,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

