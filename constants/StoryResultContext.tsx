import React, { createContext, useContext, useState, useCallback } from 'react';
import type { StoryGenerationResponse } from '../packages/shared/types';

interface StoryResult {
  title: string;
  pages: StoryGenerationResponse['pages'];
  imageUrls: string[];
  coverUrl: string;
  themeId: string;
  characterId: string;
  language: string;
  voiceCharacterId: string;
}

interface StoryResultContextType {
  storyResult: StoryResult | null;
  setStoryResult: (result: StoryResult) => void;
  clearStoryResult: () => void;
}

const StoryResultContext = createContext<StoryResultContextType>({
  storyResult: null,
  setStoryResult: () => {},
  clearStoryResult: () => {},
});

export function StoryResultProvider({ children }: { children: React.ReactNode }) {
  const [storyResult, setStoryResultState] = useState<StoryResult | null>(null);

  const setStoryResult = useCallback((result: StoryResult) => {
    setStoryResultState(result);
  }, []);

  const clearStoryResult = useCallback(() => {
    setStoryResultState(null);
  }, []);

  return (
    <StoryResultContext.Provider value={{ storyResult, setStoryResult, clearStoryResult }}>
      {children}
    </StoryResultContext.Provider>
  );
}

export function useStoryResult() {
  return useContext(StoryResultContext);
}
