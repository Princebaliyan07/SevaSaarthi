import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

export const ROLES = ['citizen', 'doctor', 'responder', 'admin'];

const AuthContext = createContext(null);
const STORAGE_KEY = 'ss_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [user]);

  // Real backend login
  const login = useCallback(async (phone, password) => {
    try {
      const res = await api.post('/auth/login', { phone, password });
      const authData = res.data?.data;
      if (authData?.user && authData?.token) {
        const fullUser = {
          ...authData.user,
          id: authData.user._id || authData.user.id,
          token: authData.token,
        };
        setUser(fullUser);
        return { success: true, user: fullUser };
      }
      throw new Error('Invalid authentication response');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      return { success: false, error: msg };
    }
  }, []);

  // Quick prototype / dev switcher with mock JWT token for API authorization
  const loginAs = useCallback((role = 'citizen') => {
    // Standard mock token format or payload for rapid preview
    const fakeToken = btoa(JSON.stringify({ role, name: `Demo ${role}`, _id: `user-${role}` }));
    setUser({
      id: `demo-${role}`,
      name: `Officer ${role.toUpperCase()}`,
      role,
      token: `demo-jwt-${fakeToken}`,
    });
  }, []);

  const logout = useCallback(() => setUser(null), []);
  const hasRole = useCallback((...roles) => !!user && roles.includes(user.role), [user]);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? 'citizen',
      isAdmin: user?.role === 'admin',
      login,
      loginAs,
      logout,
      hasRole,
    }),
    [user, login, loginAs, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
