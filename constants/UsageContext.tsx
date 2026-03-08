import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FREE_DAILY_LIMIT = 1;
const STORAGE_KEY = 'storypal_daily_usage';

interface UsageContextType {
  dailyStoriesUsed: number;
  canCreateStory: boolean;
  incrementUsage: () => Promise<void>;
  freeLimit: number;
}

const UsageContext = createContext<UsageContextType>({
  dailyStoriesUsed: 0,
  canCreateStory: true,
  incrementUsage: async () => {},
  freeLimit: FREE_DAILY_LIMIT,
});

export function UsageProvider({ children }: { children: React.ReactNode }) {
  const [dailyStoriesUsed, setDailyStoriesUsed] = useState(0);

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        const today = new Date().toISOString().split('T')[0];
        if (data.date === today) {
          setDailyStoriesUsed(data.count);
        } else {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
          setDailyStoriesUsed(0);
        }
      }
    } catch {
      // Storage read failed
    }
  };

  const incrementUsage = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    const newCount = dailyStoriesUsed + 1;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: newCount }));
    setDailyStoriesUsed(newCount);
  }, [dailyStoriesUsed]);

  const canCreateStory = dailyStoriesUsed < FREE_DAILY_LIMIT;

  return (
    <UsageContext.Provider value={{ dailyStoriesUsed, canCreateStory, incrementUsage, freeLimit: FREE_DAILY_LIMIT }}>
      {children}
    </UsageContext.Provider>
  );
}

export const useUsage = () => useContext(UsageContext);
