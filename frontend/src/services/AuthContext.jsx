import React, { useState, useCallback, useEffect } from 'react';
import { authAPI } from './api';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      if (!token) {
        setAuthReady(true);
        return;
      }

      try {
        const response = await authAPI.getCurrentUser();
        const currentUser = response.data.user;

        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch (error) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setAuthReady(true);
      }
    };

    validateSession();
  }, [token]);

  const login = useCallback((userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', accessToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    authReady
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
