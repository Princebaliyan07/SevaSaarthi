import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const ROLES = ['citizen', 'doctor', 'responder', 'admin'];

const AuthContext = createContext(null);
const STORAGE_KEY = 'ss_user';

/**
 * Prototype auth. Replaced by real JWT login when backend auth module is connected.
 * Until then, loginAs(role) lets you preview role-based screens (e.g. Command centre).
 */
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

  const loginAs = useCallback((role = 'citizen') => {
    setUser({ id: `demo-${role}`, name: `Demo ${role}`, role });
  }, []);
  const logout = useCallback(() => setUser(null), []);
  const hasRole = useCallback((...roles) => !!user && roles.includes(user.role), [user]);

  const value = useMemo(() => ({ user, role: user?.role ?? 'citizen', loginAs, logout, hasRole }), [user, loginAs, logout, hasRole]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
