import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const LOCAL_PROFILES_KEY = 'storypal_child_profiles';

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatarId: string;
  createdAt: string;
}

const AVATARS = [
  { id: 'boy', emoji: '\u{1F466}' },
  { id: 'girl', emoji: '\u{1F467}' },
  { id: 'child', emoji: '\u{1F9D2}' },
  { id: 'baby', emoji: '\u{1F476}' },
  { id: 'bear', emoji: '\u{1F43B}' },
  { id: 'lion', emoji: '\u{1F981}' },
];

export function getAvatarEmoji(avatarId: string): string {
  return AVATARS.find(a => a.id === avatarId)?.emoji ?? '\u{1F9D2}';
}

export function getAvatarOptions() {
  return AVATARS;
}

export function ageToAgeGroup(age: number): '3-5' | '5-7' | '7-10' {
  if (age <= 5) return '3-5';
  if (age <= 7) return '5-7';
  return '7-10';
}

// ── Local helpers ──────────────────────────

async function getLocalProfiles(): Promise<ChildProfile[]> {
  const json = await AsyncStorage.getItem(LOCAL_PROFILES_KEY);
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

async function saveLocalProfiles(profiles: ChildProfile[]): Promise<void> {
  await AsyncStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(profiles));
}

// ── Supabase helper ────────────────────────

async function getSupabaseUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

// ── Public API ─────────────────────────────

export async function getChildProfiles(): Promise<ChildProfile[]> {
  const local = await getLocalProfiles();

  const userId = await getSupabaseUserId();
  if (!userId) return local;

  try {
    const { data, error } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return local;

    const remote: ChildProfile[] = data.map((r: Record<string, unknown>) => ({
      id: r.id as string,
      name: r.name as string,
      age: r.age as number,
      avatarId: (r.avatar_id as string) ?? 'child',
      createdAt: r.created_at as string,
    }));

    // Merge: remote first, then local-only
    const merged = [...remote];
    for (const lp of local) {
      if (!remote.some(rp => rp.name === lp.name && rp.age === lp.age)) {
        merged.push(lp);
      }
    }
    return merged;
  } catch {
    return local;
  }
}

export async function createChildProfile(profile: { name: string; age: number; avatarId: string }): Promise<ChildProfile> {
  const newProfile: ChildProfile = {
    id: `local_${Date.now()}`,
    name: profile.name,
    age: profile.age,
    avatarId: profile.avatarId,
    createdAt: new Date().toISOString(),
  };

  // Save locally first
  const local = await getLocalProfiles();
  local.push(newProfile);
  await saveLocalProfiles(local);

  // Sync to Supabase
  const userId = await getSupabaseUserId();
  if (userId) {
    try {
      await supabase.from('child_profiles').insert({
        user_id: userId,
        name: profile.name,
        age: profile.age,
        avatar_id: profile.avatarId,
      });
    } catch (err) {
      console.warn('[ChildProfiles] Supabase sync failed:', err);
    }
  }

  return newProfile;
}

export async function deleteChildProfile(id: string): Promise<void> {
  // Delete locally
  const local = await getLocalProfiles();
  await saveLocalProfiles(local.filter(p => p.id !== id));

  // Delete from Supabase
  if (!id.startsWith('local_')) {
    const userId = await getSupabaseUserId();
    if (userId) {
      try {
        await supabase.from('child_profiles').delete().eq('id', id);
      } catch (err) {
        console.warn('[ChildProfiles] Supabase delete failed:', err);
      }
    }
  }
}
