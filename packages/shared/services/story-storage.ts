import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const LOCAL_STORIES_KEY = 'storypal_saved_stories';

export interface SavedStory {
  id: string;
  title: string;
  theme: string;
  character: string;
  language: string;
  pages: string;       // JSON string of StoryPageData[]
  imageUrls: string;   // JSON string of string[]
  coverUrl: string;
  createdAt: string;
}

// ── Local (AsyncStorage) helpers ────────────────────

async function getLocalStories(): Promise<SavedStory[]> {
  const json = await AsyncStorage.getItem(LOCAL_STORIES_KEY);
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

async function saveLocalStory(story: Omit<SavedStory, 'id' | 'createdAt'>): Promise<SavedStory> {
  const stories = await getLocalStories();
  const exists = stories.find(
    s => s.title === story.title && s.theme === story.theme && s.character === story.character
  );
  if (exists) return exists;

  const newStory: SavedStory = {
    ...story,
    id: `local_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  stories.unshift(newStory);
  await AsyncStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(stories));
  return newStory;
}

async function deleteLocalStory(id: string): Promise<void> {
  const stories = await getLocalStories();
  await AsyncStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(stories.filter(s => s.id !== id)));
}

async function getLocalStoryById(id: string): Promise<SavedStory | null> {
  const stories = await getLocalStories();
  return stories.find(s => s.id === id) ?? null;
}

// ── Supabase helpers ────────────────────────────────

async function getSupabaseUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

// ── Public API ──────────────────────────────────────

export async function getSavedStories(): Promise<SavedStory[]> {
  // Always get local stories — they're the source of truth
  const local = await getLocalStories();

  const userId = await getSupabaseUserId();
  if (!userId) {
    return local;
  }

  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*, story_pages(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      return local;
    }

    const supabaseStories: SavedStory[] = data.map((s: Record<string, unknown>) => {
      const sortedPages = ((s.story_pages as Record<string, unknown>[]) ?? [])
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
          (a.page_number as number) - (b.page_number as number)
        );

      const pagesArr = sortedPages.map((p: Record<string, unknown>) => ({
        text: p.text as string,
        imagePrompt: (p.image_prompt as string) ?? '',
      }));

      const imgUrls = sortedPages.map((p: Record<string, unknown>) => (p.image_url as string) ?? '');

      return {
        id: s.id as string,
        title: s.title as string,
        theme: s.theme as string,
        character: s.character as string,
        language: (s.language as string) ?? 'en',
        pages: JSON.stringify(pagesArr),
        imageUrls: JSON.stringify(imgUrls),
        coverUrl: (s.cover_image_url as string) ?? '',
        createdAt: s.created_at as string,
      };
    });

    // Merge: Supabase stories first, then local-only stories (not already in Supabase)
    const merged = [...supabaseStories];
    for (const ls of local) {
      const alreadyInSupabase = supabaseStories.some(
        ss => ss.title === ls.title && ss.theme === ls.theme && ss.character === ls.character
      );
      if (!alreadyInSupabase) {
        merged.push(ls);
      }
    }

    return merged;
  } catch {
    return local;
  }
}

export async function saveStory(story: Omit<SavedStory, 'id' | 'createdAt'>): Promise<SavedStory> {
  // Always save locally first — guarantees story is never lost
  const localResult = await saveLocalStory(story);

  // Also sync to Supabase if logged in
  const userId = await getSupabaseUserId();
  if (userId) {
    try {
      const { data: storyRow, error: storyErr } = await supabase
        .from('stories')
        .insert({
          user_id: userId,
          title: story.title,
          theme: story.theme,
          character: story.character,
          age_group: '3-5',
          language: story.language,
          cover_image_url: story.coverUrl || null,
        })
        .select()
        .single();

      if (storyErr) throw storyErr;

      let pagesArr: { text: string; imagePrompt: string }[] = [];
      try {
        const parsed = JSON.parse(story.pages);
        if (Array.isArray(parsed)) pagesArr = parsed;
      } catch {
        console.warn('[StoryStorage] Failed to parse story pages JSON');
      }

      let imgUrls: string[] = [];
      try {
        const parsed = JSON.parse(story.imageUrls);
        if (Array.isArray(parsed)) imgUrls = parsed;
      } catch {
        console.warn('[StoryStorage] Failed to parse imageUrls JSON');
      }

      if (pagesArr.length > 0) {
        const pageRows = pagesArr.map((p, i) => ({
          story_id: storyRow.id,
          page_number: i + 1,
          text: p.text,
          image_url: imgUrls[i] || null,
          image_prompt: p.imagePrompt ?? '',
        }));

        await supabase.from('story_pages').insert(pageRows);
      }
    } catch (err) {
      console.warn('[StoryStorage] Supabase sync failed, story saved locally:', err);
    }
  }

  return localResult;
}

export async function deleteStory(id: string): Promise<void> {
  // Always delete from local (since we always save locally)
  await deleteLocalStory(id);

  // Also delete from Supabase if it's a remote story
  if (!id.startsWith('local_')) {
    const userId = await getSupabaseUserId();
    if (userId) {
      try {
        await supabase.from('stories').delete().eq('id', id);
      } catch (err) {
        console.warn('[StoryStorage] Supabase delete failed:', err);
      }
    }
  }
}

export async function getStoryById(id: string): Promise<SavedStory | null> {
  if (id.startsWith('local_')) {
    return getLocalStoryById(id);
  }

  const userId = await getSupabaseUserId();
  if (!userId) {
    return getLocalStoryById(id);
  }

  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*, story_pages(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    const sortedPages = ((data.story_pages as Record<string, unknown>[]) ?? [])
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
        (a.page_number as number) - (b.page_number as number)
      );

    const pagesArr = sortedPages.map((p: Record<string, unknown>) => ({
      text: p.text as string,
      imagePrompt: (p.image_prompt as string) ?? '',
    }));

    const imgUrls = sortedPages.map((p: Record<string, unknown>) => (p.image_url as string) ?? '');

    return {
      id: data.id,
      title: data.title,
      theme: data.theme,
      character: data.character,
      language: data.language ?? 'en',
      pages: JSON.stringify(pagesArr),
      imageUrls: JSON.stringify(imgUrls),
      coverUrl: data.cover_image_url ?? '',
      createdAt: data.created_at,
    };
  } catch {
    return getLocalStoryById(id);
  }
}
