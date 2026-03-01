import AsyncStorage from '@react-native-async-storage/async-storage';

const STORIES_KEY = 'storypal_saved_stories';

export interface SavedStory {
  id: string;
  title: string;
  theme: string;
  character: string;
  language: string;
  pages: string;
  imageUrls: string;
  coverUrl: string;
  createdAt: string;
}

export async function getSavedStories(): Promise<SavedStory[]> {
  const json = await AsyncStorage.getItem(STORIES_KEY);
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

export async function saveStory(story: Omit<SavedStory, 'id' | 'createdAt'>): Promise<SavedStory> {
  const stories = await getSavedStories();

  const exists = stories.find(
    s => s.title === story.title && s.theme === story.theme && s.character === story.character
  );
  if (exists) return exists;

  const newStory: SavedStory = {
    ...story,
    id: `story_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  stories.unshift(newStory);
  await AsyncStorage.setItem(STORIES_KEY, JSON.stringify(stories));
  return newStory;
}

export async function deleteStory(id: string): Promise<void> {
  const stories = await getSavedStories();
  const filtered = stories.filter(s => s.id !== id);
  await AsyncStorage.setItem(STORIES_KEY, JSON.stringify(filtered));
}

export async function getStoryById(id: string): Promise<SavedStory | null> {
  const stories = await getSavedStories();
  return stories.find(s => s.id === id) ?? null;
}
