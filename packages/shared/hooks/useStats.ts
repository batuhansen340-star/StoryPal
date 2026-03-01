import { useState, useEffect, useCallback } from 'react';
import { getSavedStories, type SavedStory } from '../services/story-storage';

export interface StoryStats {
  totalStories: number;
  totalPages: number;
  favoriteTheme: string | null;
  favoriteCharacter: string | null;
  languagesUsed: string[];
  storiesByTheme: Record<string, number>;
  storiesByCharacter: Record<string, number>;
  storiesThisWeek: number;
  storiesThisMonth: number;
  longestStreak: number;
  currentStreak: number;
}

function getStartOfWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(now);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getStartOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function computeStreaks(stories: SavedStory[]): { longest: number; current: number } {
  if (stories.length === 0) return { longest: 0, current: 0 };

  const daySet = new Set<string>();
  for (const s of stories) {
    daySet.add(new Date(s.createdAt).toISOString().split('T')[0]);
  }

  const sortedDays = [...daySet].sort().reverse();
  if (sortedDays.length === 0) return { longest: 0, current: 0 };

  // Current streak
  let current = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (sortedDays[0] === today || sortedDays[0] === yesterday) {
    current = 1;
    for (let i = 1; i < sortedDays.length; i++) {
      const prev = new Date(sortedDays[i - 1]);
      const curr = new Date(sortedDays[i]);
      const diffDays = (prev.getTime() - curr.getTime()) / 86400000;
      if (Math.abs(diffDays - 1) < 0.1) {
        current++;
      } else {
        break;
      }
    }
  }

  // Longest streak
  const ascending = [...sortedDays].reverse();
  let longest = 1;
  let streak = 1;
  for (let i = 1; i < ascending.length; i++) {
    const prev = new Date(ascending[i - 1]);
    const curr = new Date(ascending[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / 86400000;
    if (Math.abs(diffDays - 1) < 0.1) {
      streak++;
      longest = Math.max(longest, streak);
    } else {
      streak = 1;
    }
  }

  return { longest, current };
}

function computeStats(stories: SavedStory[]): StoryStats {
  const storiesByTheme: Record<string, number> = {};
  const storiesByCharacter: Record<string, number> = {};
  const langSet = new Set<string>();
  let totalPages = 0;

  const weekStart = getStartOfWeek();
  const monthStart = getStartOfMonth();
  let storiesThisWeek = 0;
  let storiesThisMonth = 0;

  for (const s of stories) {
    storiesByTheme[s.theme] = (storiesByTheme[s.theme] ?? 0) + 1;
    storiesByCharacter[s.character] = (storiesByCharacter[s.character] ?? 0) + 1;
    langSet.add(s.language);

    try {
      const pages = JSON.parse(s.pages);
      if (Array.isArray(pages)) totalPages += pages.length;
    } catch { /* ignore */ }

    const created = new Date(s.createdAt);
    if (created >= weekStart) storiesThisWeek++;
    if (created >= monthStart) storiesThisMonth++;
  }

  const favoriteTheme = Object.entries(storiesByTheme).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const favoriteCharacter = Object.entries(storiesByCharacter).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const { longest, current } = computeStreaks(stories);

  return {
    totalStories: stories.length,
    totalPages,
    favoriteTheme,
    favoriteCharacter,
    languagesUsed: [...langSet],
    storiesByTheme,
    storiesByCharacter,
    storiesThisWeek,
    storiesThisMonth,
    longestStreak: longest,
    currentStreak: current,
  };
}

export function useStats() {
  const [stats, setStats] = useState<StoryStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const stories = await getSavedStories();
      setStats(computeStats(stories));
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, refresh };
}
