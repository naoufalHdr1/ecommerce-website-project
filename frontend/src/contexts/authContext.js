import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../utils/config';

// Create the Authentication Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('user'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    setIsLoggedIn(true);
    setUser(userData?.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, API_BASE_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for using Auth Context
export const useAuth = () => useContext(AuthContext);
