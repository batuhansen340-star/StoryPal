import { useState, useCallback } from 'react';
import type { AgeGroup, StoryGenerationResponse, PersonalizationData } from '../types';
import { DEMO_STORIES_EN, INTERACTIVE_DEMO } from './demo-stories-en';
import {
  DEMO_STORIES_TR,
  DEMO_STORIES_ES,
  DEMO_STORIES_AR,
  DEMO_STORIES_JA,
  DEMO_STORIES_DE,
  DEMO_STORIES_FR,
  DEMO_STORIES_KO,
  DEMO_STORIES_PT,
  DEMO_STORIES_HI,
} from './demo-stories-intl';
import { buildCustomDemo } from './demo-custom';
import { getThemeImages, getCoverImage } from './demo-images';

type AIStatus = 'idle' | 'generating-text' | 'generating-images' | 'complete' | 'error';

interface AIState {
  status: AIStatus;
  progress: number;
  totalSteps: number;
  currentStep: string;
  story: StoryGenerationResponse | null;
  imageUrls: string[];
  coverUrl: string | null;
  error: string | null;
}

type DemoStories = Record<string, Record<string, StoryGenerationResponse>>;

const DEMO_BY_LANG: Record<string, DemoStories> = {
  en: DEMO_STORIES_EN,
  tr: DEMO_STORIES_TR,
  es: DEMO_STORIES_ES,
  ar: DEMO_STORIES_AR,
  ja: DEMO_STORIES_JA,
  de: DEMO_STORIES_DE,
  fr: DEMO_STORIES_FR,
  ko: DEMO_STORIES_KO,
  pt: DEMO_STORIES_PT,
  hi: DEMO_STORIES_HI,
};

function getDemoStory(theme: string, character: string, language: string = 'en', customPrompt?: string): StoryGenerationResponse {
  if (customPrompt) {
    return buildCustomDemo(customPrompt, language);
  }

  // 50% chance of interactive demo for space/luna in English
  if (theme === 'space' && character === 'luna' && language === 'en' && Math.random() > 0.5) {
    return INTERACTIVE_DEMO;
  }

  const langStories = DEMO_BY_LANG[language] ?? DEMO_BY_LANG.en;
  const themeStories = langStories[theme] ?? langStories[Object.keys(langStories)[0]];
  if (!themeStories) {
    const fallback = DEMO_BY_LANG.en;
    const fallbackTheme = fallback[theme] ?? fallback.space;
    return fallbackTheme[character] ?? fallbackTheme.default;
  }
  return themeStories[character] ?? themeStories.default ?? DEMO_STORIES_EN.space.default;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

const isDemoMode = !process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL === '';

export function useAI() {
  const [state, setState] = useState<AIState>({
    status: 'idle',
    progress: 0,
    totalSteps: 0,
    currentStep: '',
    story: null,
    imageUrls: [],
    coverUrl: null,
    error: null,
  });

  const generateFullStory = useCallback(async (params: {
    theme: string;
    character: string;
    ageGroup: AgeGroup;
    language: string;
    personalization?: PersonalizationData;
    customPrompt?: string;
  }) => {
    setState({
      status: 'generating-text',
      progress: 0,
      totalSteps: 5,
      currentStep: '\u270D\uFE0F Writing your story...',
      story: null,
      imageUrls: [],
      coverUrl: null,
      error: null,
    });

    try {
      if (isDemoMode) {
        // Step 1: Writing story (2s)
        await sleep(randomDelay(1800, 2500));

        const story = getDemoStory(params.theme, params.character, params.language, params.customPrompt);
        const totalSteps = 5;

        setState(prev => ({
          ...prev,
          status: 'generating-images',
          progress: 1,
          totalSteps,
          currentStep: '\uD83C\uDFA8 Designing the cover...',
          story,
        }));

        // Step 2: Cover (2s)
        await sleep(randomDelay(1800, 2500));

        const coverUrl = getCoverImage(params.theme);
        setState(prev => ({
          ...prev,
          progress: 2,
          coverUrl,
          currentStep: '\uD83D\uDD8C\uFE0F Painting illustrations...',
        }));

        // Step 3: Page illustrations (2-3s total)
        const themeImages = getThemeImages(params.theme, story.pages.length);
        const imageUrls: string[] = [];
        const batchDelay = randomDelay(1500, 2500) / story.pages.length;

        for (let i = 0; i < story.pages.length; i++) {
          await sleep(batchDelay);
          imageUrls.push(themeImages[i]);
          setState(prev => ({
            ...prev,
            progress: 2,
            imageUrls: [...imageUrls],
            currentStep: `\uD83D\uDD8C\uFE0F Painting page ${i + 1} of ${story.pages.length}...`,
          }));
        }

        // Step 4: Magical touches (1s)
        setState(prev => ({
          ...prev,
          progress: 3,
          currentStep: '\u2728 Adding magical touches...',
        }));
        await sleep(randomDelay(800, 1200));

        // Step 5: Complete (0.5s)
        setState(prev => ({
          ...prev,
          progress: 4,
          currentStep: '\uD83D\uDCD6 Your story is ready!',
        }));
        await sleep(500);

        setState(prev => ({
          ...prev,
          status: 'complete',
          progress: totalSteps,
          imageUrls,
          currentStep: '\uD83D\uDCD6 Your story is ready!',
        }));

        return { story, imageUrls, coverUrl };
      }

      // Production mode: use real AI
      const { generateStoryText } = await import('../services/ai-gateway');
      const { generateCoverImage, generateStoryImage } = await import('../services/ai-gateway');

      const story = await generateStoryText(params);
      const totalImages = story.pages.length + 1;

      setState(prev => ({
        ...prev,
        status: 'generating-images',
        progress: 1,
        totalSteps: totalImages + 1,
        currentStep: '\uD83C\uDFA8 Creating cover illustration...',
        story,
      }));

      const coverUrl = await generateCoverImage({
        title: story.title,
        theme: params.theme,
        character: params.character,
      });

      setState(prev => ({
        ...prev,
        progress: 2,
        coverUrl,
        currentStep: '\uD83D\uDD8C\uFE0F Drawing page illustrations...',
      }));

      const imageUrls: string[] = [];
      for (let i = 0; i < story.pages.length; i++) {
        const page = story.pages[i];
        try {
          const url = await generateStoryImage({
            prompt: page.imagePrompt,
            theme: params.theme,
            character: params.character,
          });
          imageUrls.push(url);
        } catch {
          imageUrls.push('');
        }

        setState(prev => ({
          ...prev,
          progress: i + 3,
          imageUrls: [...imageUrls],
          currentStep: `\uD83D\uDD8C\uFE0F Drawing page ${i + 1} of ${story.pages.length}...`,
        }));
      }

      setState(prev => ({
        ...prev,
        status: 'complete',
        progress: totalImages + 1,
        imageUrls,
        currentStep: '\uD83D\uDCD6 Story complete!',
      }));

      return { story, imageUrls, coverUrl };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage,
        currentStep: 'Oops! Something went wrong.',
      }));
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      progress: 0,
      totalSteps: 0,
      currentStep: '',
      story: null,
      imageUrls: [],
      coverUrl: null,
      error: null,
    });
  }, []);

  return { ...state, generateFullStory, reset };
}
