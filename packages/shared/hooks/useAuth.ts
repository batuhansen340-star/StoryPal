import { useState, useEffect, useCallback } from 'react';
import {
  type AuthUser,
  getAuthUser,
  signInWithEmail,
  signUpWithEmail,
  signInAsGuest,
  signOut as authSignOut,
} from '../services/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const u = await getAuthUser();
    setUser(u);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const u = await signInWithEmail(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const u = await signUpWithEmail(email, password);
    setUser(u);
    return u;
  }, []);

  const guestLogin = useCallback(async () => {
    const u = await signInAsGuest();
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(async () => {
    await authSignOut();
    setUser(null);
  }, []);

  return { user, loading, login, register, guestLogin, signOut, refresh };
}
