import { useState, useEffect, useCallback, useRef } from 'react';
import {
  type AuthUser,
  getAuthUser,
  signInWithEmail,
  signUpWithEmail,
  signInAsGuest,
  signOut as authSignOut,
} from '../services/auth';
import { supabase } from '../services/supabase';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const u = await getAuthUser();
      if (mounted.current) {
        setUser(u);
        setLoading(false);
      }
    } catch {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted.current) return;

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          displayName: session.user.user_metadata?.display_name ?? session.user.email?.split('@')[0] ?? 'Story Explorer',
          isGuest: false,
          createdAt: session.user.created_at,
        });
        setLoading(false);
      } else {
        // Session cleared — check if guest is still active
        refresh();
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
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
