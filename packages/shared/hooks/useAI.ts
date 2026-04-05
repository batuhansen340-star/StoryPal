import { useState, useCallback } from 'react';
import type { AgeGroup, StoryGenerationResponse, PersonalizationData } from '../types';
import { recordStoryCreation } from '../services/usage-limiter';
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

const isDemoMode = !process.env.EXPO_PUBLIC_OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY === '';

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
    childName?: string;
    childAge?: number;
    characterDescription?: string;
    characterVisualDesc?: string;
  }) => {
    setState({
      status: 'generating-text',
      progress: 0,
      totalSteps: 5,
      currentStep: 'writingStory',
      story: null,
      imageUrls: [],
      coverUrl: null,
      error: null,
    });

    try {
      if (isDemoMode) {
        // Step 1: Writing story (fast but visible)
        await sleep(randomDelay(1000, 1500));

        const story = getDemoStory(params.theme, params.character, params.language, params.customPrompt);
        const totalSteps = 5;

        setState(prev => ({
          ...prev,
          status: 'generating-images',
          progress: 1,
          totalSteps,
          currentStep: 'paintingCover',
          story,
        }));

        // Step 2: Cover (quick)
        await sleep(randomDelay(800, 1200));

        const coverUrl = getCoverImage(params.theme);
        setState(prev => ({
          ...prev,
          progress: 2,
          coverUrl,
          currentStep: 'drawingPages',
        }));

        // Step 3: Page illustrations (fast batch)
        const themeImages = getThemeImages(params.theme, story.pages.length);
        const imageUrls: string[] = [];
        const batchDelay = randomDelay(600, 1000) / story.pages.length;

        for (let i = 0; i < story.pages.length; i++) {
          await sleep(batchDelay);
          imageUrls.push(themeImages[i]);
          setState(prev => ({
            ...prev,
            progress: 2,
            imageUrls: [...imageUrls],
            currentStep: `drawingPages:${i + 1}/${story.pages.length}`,
          }));
        }

        // Step 4: Magical touches
        setState(prev => ({
          ...prev,
          progress: 3,
          currentStep: 'magicSpark',
        }));
        await sleep(randomDelay(400, 600));

        // Step 5: Complete
        setState(prev => ({
          ...prev,
          progress: 4,
          currentStep: 'storyComplete',
        }));
        await sleep(300);

        setState(prev => ({
          ...prev,
          status: 'complete',
          progress: totalSteps,
          imageUrls,
          currentStep: 'storyComplete',
        }));

        recordStoryCreation().catch(() => {});
        return { story, imageUrls, coverUrl };
      }

      // Production mode: use real AI
      const { generateStoryText, generateCoverImage, generateStoryImage } = await import('../services/ai-gateway');

      const story = await generateStoryText(params);
      const totalPages = story.pages.length;
      const totalSteps = totalPages + 2; // text + cover + pages

      setState(prev => ({
        ...prev,
        status: 'generating-images',
        progress: 1,
        totalSteps,
        currentStep: 'paintingCover',
        story,
      }));

      // Generate cover + ALL page images in parallel for maximum speed
      const imageUrls: string[] = new Array(totalPages).fill('');
      let coverUrl = '';

      const coverPromise = generateCoverImage({
        title: story.title,
        theme: params.theme,
        character: params.characterVisualDesc ?? params.character,
      }).then(url => {
        coverUrl = url;
        setState(prev => ({
          ...prev,
          coverUrl: url,
          currentStep: 'drawingPages',
        }));
        return url;
      }).catch(() => '');

      // Fire all page images in parallel (batch of 6 for rate limit safety)
      const BATCH_SIZE = 6;
      const pagePromise = (async () => {
        for (let batch = 0; batch < totalPages; batch += BATCH_SIZE) {
          const batchPages = story.pages.slice(batch, batch + BATCH_SIZE);
          const batchPromises = batchPages.map((page) =>
            generateStoryImage({
              prompt: page.imagePrompt,
              theme: params.theme,
              character: params.characterVisualDesc ?? params.character,
            }).catch(() => '')
          );

          const results = await Promise.all(batchPromises);
          results.forEach((url, idx) => { imageUrls[batch + idx] = url; });

          setState(prev => ({
            ...prev,
            progress: Math.min(batch + BATCH_SIZE, totalPages) + 2,
            imageUrls: [...imageUrls],
            currentStep: `drawingPages:${batch + 1}-${Math.min(batch + BATCH_SIZE, totalPages)}/${totalPages}`,
          }));
        }
      })();

      // Wait for both cover and pages to finish
      await Promise.all([coverPromise, pagePromise]);

      setState(prev => ({
        ...prev,
        status: 'complete',
        progress: totalSteps,
        imageUrls,
        coverUrl,
        currentStep: 'storyComplete',
      }));

      recordStoryCreation().catch(() => {});
      return { story, imageUrls, coverUrl };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage,
        currentStep: 'oops',
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
