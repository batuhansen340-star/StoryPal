import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const ONBOARDING_KEY = 'storypal_onboarding_done';
const GUEST_KEY = 'storypal_guest_user';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  isGuest: boolean;
  createdAt: string;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  // Check Supabase session first
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    return {
      id: session.user.id,
      email: session.user.email ?? '',
      displayName: session.user.user_metadata?.display_name ?? session.user.email?.split('@')[0] ?? 'Story Explorer',
      isGuest: false,
      createdAt: session.user.created_at,
    };
  }

  // Check for guest user
  const guestJson = await AsyncStorage.getItem(GUEST_KEY);
  if (guestJson) {
    try {
      return JSON.parse(guestJson);
    } catch {
      return null;
    }
  }

  return null;
}

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  const user = data.user;
  return {
    id: user.id,
    email: user.email ?? '',
    displayName: user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'Story Explorer',
    isGuest: false,
    createdAt: user.created_at,
  };
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: email.split('@')[0] },
    },
  });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Sign up failed — please try again');

  const user = data.user;

  // Create profile row (trigger removed — doing it from app)
  const { error: profileErr } = await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email ?? email,
  }, { onConflict: 'id' });
  // Profile creation is best-effort — user can still use the app

  return {
    id: user.id,
    email: user.email ?? '',
    displayName: user.user_metadata?.display_name ?? email.split('@')[0],
    isGuest: false,
    createdAt: user.created_at,
  };
}

export async function signInAsGuest(): Promise<AuthUser> {
  const guest: AuthUser = {
    id: `guest_${Date.now()}`,
    email: '',
    displayName: 'Story Explorer',
    isGuest: true,
    createdAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(GUEST_KEY, JSON.stringify(guest));
  return guest;
}

export async function signOut(): Promise<void> {
  try { await supabase.auth.signOut(); } catch { /* guest has no supabase session */ }
  await AsyncStorage.removeItem(GUEST_KEY);
}

export async function isOnboardingDone(): Promise<boolean> {
  const val = await AsyncStorage.getItem(ONBOARDING_KEY);
  return val === 'true';
}

export async function setOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}
