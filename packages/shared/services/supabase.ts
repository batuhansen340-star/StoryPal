import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function getUserStories(userId: string) {
  const { data, error } = await supabase
    .from('stories')
    .select('*, story_pages(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getStoryById(storyId: string) {
  const { data, error } = await supabase
    .from('stories')
    .select('*, story_pages(*)')
    .eq('id', storyId)
    .single();
  if (error) throw error;
  return data;
}

export async function saveStory(story: {
  user_id: string;
  title: string;
  theme: string;
  character: string;
  age_group: string;
  language: string;
  cover_image_url: string | null;
}) {
  const { data, error } = await supabase
    .from('stories')
    .insert(story)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveStoryPages(pages: {
  story_id: string;
  page_number: number;
  text: string;
  image_url: string | null;
  image_prompt: string;
}[]) {
  const { data, error } = await supabase
    .from('story_pages')
    .insert(pages)
    .select();
  if (error) throw error;
  return data;
}

export async function logUsage(log: {
  user_id: string;
  action: string;
  cost: number;
  metadata: Record<string, unknown>;
}) {
  const { error } = await supabase
    .from('usage_logs')
    .insert(log);
  if (error) throw error;
}

export async function getTodayUsageCount(userId: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const { count, error } = await supabase
    .from('usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', 'story_created')
    .gte('created_at', `${today}T00:00:00`);
  if (error) throw error;
  return count ?? 0;
}
