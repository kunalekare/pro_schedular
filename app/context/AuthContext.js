'use client';

import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// ====================
// Auth Context
// ====================
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // holds logged-in user
  const [loading, setLoading] = useState(true); // loading state for auth
  const router = useRouter();

  // --------------------
  // Load user on mount
  // --------------------
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('timetable-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to parse stored user:", err);
      sessionStorage.removeItem('timetable-user');
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------
  // Login function
  // --------------------
  const login = useCallback((userData) => {
    sessionStorage.setItem('timetable-user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  // --------------------
  // Logout function
  // --------------------
  const logout = useCallback(() => {
    sessionStorage.removeItem('timetable-user');
    setUser(null);
    router.push('/login');
  }, [router]);

  // --------------------
  // Memoized context value
  // --------------------
  const value = useMemo(
    () => ({ user, login, logout, loading }),
    [user, login, logout, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
