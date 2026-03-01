import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const LOCAL_USAGE_KEY = 'storypal_daily_usage';
const FREE_DAILY_LIMIT = 2;

interface LocalUsage {
  date: string;
  count: number;
}

async function getLocalUsage(): Promise<LocalUsage> {
  const json = await AsyncStorage.getItem(LOCAL_USAGE_KEY);
  const today = new Date().toISOString().split('T')[0];

  if (!json) return { date: today, count: 0 };

  try {
    const usage = JSON.parse(json) as LocalUsage;
    if (usage.date !== today) return { date: today, count: 0 };
    return usage;
  } catch {
    return { date: today, count: 0 };
  }
}

async function incrementLocalUsage(): Promise<void> {
  const usage = await getLocalUsage();
  usage.count += 1;
  usage.date = new Date().toISOString().split('T')[0];
  await AsyncStorage.setItem(LOCAL_USAGE_KEY, JSON.stringify(usage));
}

async function getSupabaseUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

export async function getTodayStoryCount(): Promise<number> {
  const userId = await getSupabaseUserId();

  if (!userId) {
    const local = await getLocalUsage();
    return local.count;
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await supabase
      .from('usage_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action', 'story_created')
      .gte('created_at', `${today}T00:00:00`);

    if (error) throw error;
    return count ?? 0;
  } catch {
    const local = await getLocalUsage();
    return local.count;
  }
}

export async function canCreateStory(isPremium: boolean): Promise<{ allowed: boolean; remaining: number }> {
  if (isPremium) {
    return { allowed: true, remaining: 999 };
  }

  const count = await getTodayStoryCount();
  const remaining = Math.max(0, FREE_DAILY_LIMIT - count);

  return {
    allowed: remaining > 0,
    remaining,
  };
}

export async function recordStoryCreation(): Promise<void> {
  const userId = await getSupabaseUserId();

  if (!userId) {
    await incrementLocalUsage();
    return;
  }

  try {
    await supabase.from('usage_logs').insert({
      user_id: userId,
      action: 'story_created',
      cost: 0,
      metadata: {},
    });
  } catch {
    await incrementLocalUsage();
  }
}
