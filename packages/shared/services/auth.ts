import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = 'storypal_auth';
const ONBOARDING_KEY = 'storypal_onboarding_done';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  isGuest: boolean;
  createdAt: string;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const json = await AsyncStorage.getItem(AUTH_KEY);
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function signInWithEmail(email: string, _password: string): Promise<AuthUser> {
  const user: AuthUser = {
    id: `user_${email.replace(/[^a-z0-9]/gi, '_')}`,
    email,
    displayName: email.split('@')[0],
    isGuest: false,
    createdAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthUser> {
  return signInWithEmail(email, password);
}

export async function signInAsGuest(): Promise<AuthUser> {
  const user: AuthUser = {
    id: `guest_${Date.now()}`,
    email: '',
    displayName: 'Story Explorer',
    isGuest: true,
    createdAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export async function signOut(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}

export async function isOnboardingDone(): Promise<boolean> {
  const val = await AsyncStorage.getItem(ONBOARDING_KEY);
  return val === 'true';
}

export async function setOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}
