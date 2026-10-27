import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin, fetchCurrentAdmin, adminLogout } from '../services/adminService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('emergency_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('emergency_admin_token') || null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        try {
          const res = await fetchCurrentAdmin();
          if (res && res.admin) {
            setAdmin(res.admin);
            localStorage.setItem('emergency_admin_user', JSON.stringify(res.admin));
          }
        } catch (error) {
          // Token expired or invalid
          setToken(null);
          setAdmin(null);
          localStorage.removeItem('emergency_admin_token');
          localStorage.removeItem('emergency_admin_user');
        }
      }
      setLoading(false);
    };

    verifySession();
  }, [token]);

  const login = async (email, password) => {
    const res = await adminLogin(email, password);
    if (res.token && res.admin) {
      setToken(res.token);
      setAdmin(res.admin);
      localStorage.setItem('emergency_admin_token', res.token);
      localStorage.setItem('emergency_admin_user', JSON.stringify(res.admin));
      return res.admin;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = async () => {
    try {
      if (token) {
        await adminLogout();
      }
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      setToken(null);
      setAdmin(null);
      localStorage.removeItem('emergency_admin_token');
      localStorage.removeItem('emergency_admin_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
