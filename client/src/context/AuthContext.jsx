import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

export const ROLES = ['citizen', 'doctor', 'responder', 'admin'];

const AuthContext = createContext(null);
const STORAGE_KEY = 'ss_user';
const SESSION_KEY = 'ss_admin_session';
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes of inactivity auto-logout

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      // Admin session is strictly bound to the active tab via sessionStorage
      // If user is admin but has no active tab session token, require login again
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
      if (stored?.role === 'admin') {
        const activeTabSession = sessionStorage.getItem(SESSION_KEY);
        if (!activeTabSession) {
          // New tab or new window -> require admin login again!
          return null;
        }
      }
      return stored;
    } catch {
      return null;
    }
  });

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
    const fakeToken = btoa(JSON.stringify({ role, name: `Demo ${role}`, _id: `user-${role}` }));
    setUser({
      id: `demo-${role}`,
      name: `Officer ${role.toUpperCase()}`,
      role,
      token: `demo-jwt-${fakeToken}`,
    });
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem('ss_auth_event', JSON.stringify({ type: 'logout', t: Date.now() }));
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  // Sync state to storage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        if (user.role === 'admin') {
          // Mark active session for this specific browser tab
          sessionStorage.setItem(SESSION_KEY, 'active_' + Date.now());
        }
      } else {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      /* ignore */
    }
  }, [user]);

  // Security 1: Cross-tab / cross-window synchronization
  useEffect(() => {
    const handleStorageEvent = (e) => {
      if (e.key === 'ss_auth_event') {
        try {
          const payload = JSON.parse(e.newValue || '{}');
          if (payload.type === 'logout') {
            setUser(null);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  // Security 2: Auto-logout after 15 minutes of inactivity (mouse, keyboard, scroll, touch)
  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    let timeoutId;
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT_MS);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [user, logout]);
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
