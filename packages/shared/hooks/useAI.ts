import { useState, useCallback } from 'react';
import type { AgeGroup, StoryGenerationResponse } from '../types';

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

const DEMO_STORIES: Record<string, Record<string, StoryGenerationResponse>> = {
  space: {
    luna: {
      title: 'Luna and the Star Dragon',
      pages: [
        { text: 'One night, Luna looked up at the sky and saw a shooting star fall behind the moon.', imagePrompt: 'girl looking at shooting star' },
        { text: '"I must find that star!" she said, and hopped into her rocket ship made of cardboard and dreams.', imagePrompt: 'girl in cardboard rocket' },
        { text: 'In space, she met a tiny dragon made of starlight. "Hello! I am Cosmo," it sparkled.', imagePrompt: 'star dragon in space' },
        { text: 'Cosmo was lost and missed the constellation family. Luna said, "I will help you find them!"', imagePrompt: 'luna and dragon flying' },
        { text: 'Together they flew past planets of candy and moons of cheese, laughing all the way.', imagePrompt: 'candy planets in space' },
      ],
    },
    default: {
      title: 'Journey Through the Stars',
      pages: [
        { text: 'Far beyond the clouds, a magical spaceship waited for its next adventure.', imagePrompt: 'magical spaceship' },
        { text: 'The stars twinkled like diamonds, lighting the way through the cosmic ocean.', imagePrompt: 'twinkling stars' },
        { text: 'On Planet Giggles, everyone laughed instead of talking. What a funny place!', imagePrompt: 'funny planet with laughing aliens' },
        { text: 'The bravest explorer made friends with creatures from every corner of the galaxy.', imagePrompt: 'space friends together' },
        { text: 'And when the adventure was done, every star shone a little brighter. The end!', imagePrompt: 'bright stars ending' },
      ],
    },
  },
  ocean: {
    whiskers: {
      title: "Whiskers' Ocean Quest",
      pages: [
        { text: 'Whiskers the magic cat found a golden shell that whispered secrets of the deep sea.', imagePrompt: 'cat with golden shell' },
        { text: 'With a splash and a spin, Whiskers dove under the waves into a world of blue and green.', imagePrompt: 'cat diving underwater' },
        { text: 'A friendly octopus named Ollie wrapped a tentacle around Whiskers for a hug!', imagePrompt: 'octopus hugging cat' },
        { text: '"The coral castle needs your magic!" Ollie said. So off they swam, side by side.', imagePrompt: 'swimming to coral castle' },
        { text: 'Whiskers sprinkled magic sparkles and the coral bloomed in rainbow colors! Everyone cheered!', imagePrompt: 'rainbow coral celebration' },
      ],
    },
    default: {
      title: 'Secrets of the Deep Blue',
      pages: [
        { text: 'Under the ocean waves, a hidden kingdom sparkled with treasures untold.', imagePrompt: 'underwater kingdom' },
        { text: 'Colorful fish danced in circles, creating a rainbow beneath the sea.', imagePrompt: 'dancing colorful fish' },
        { text: 'A gentle whale sang the most beautiful song that echoed through the water.', imagePrompt: 'singing whale' },
        { text: 'Together, all the sea creatures built a friendship bridge from shells and coral.', imagePrompt: 'shell bridge underwater' },
        { text: 'The ocean was full of love, and every wave carried a new story. The end!', imagePrompt: 'happy ocean ending' },
      ],
    },
  },
  forest: {
    clover: {
      title: 'Clover and the Enchanted Tree',
      pages: [
        { text: 'Clover the bunny hopped through the forest and found a tree that glowed golden.', imagePrompt: 'bunny near golden tree' },
        { text: '"Who goes there?" said the tree. "I am Clover, and I am looking for adventure!"', imagePrompt: 'talking tree with bunny' },
        { text: 'The tree opened a secret door in its trunk, revealing a staircase of mushrooms.', imagePrompt: 'mushroom staircase inside tree' },
        { text: 'At the bottom, tiny fairies were having a tea party with acorn cups!', imagePrompt: 'fairy tea party' },
        { text: 'Clover joined the party and made the best friends ever. What a magical day!', imagePrompt: 'bunny at fairy party' },
      ],
    },
    default: {
      title: 'The Enchanted Forest Adventure',
      pages: [
        { text: 'Deep in the forest, where the sunlight danced through the leaves, magic was everywhere.', imagePrompt: 'sunlit magical forest' },
        { text: 'Tiny mushroom houses lined the path, each one home to a different woodland friend.', imagePrompt: 'mushroom houses in forest' },
        { text: 'A wise old fox shared stories of the ancient forest and its wonderful secrets.', imagePrompt: 'wise fox telling stories' },
        { text: 'The fireflies lit up the evening sky like a thousand tiny lanterns.', imagePrompt: 'fireflies lighting forest' },
        { text: 'In this magical forest, every creature had a story, and every story had a happy ending!', imagePrompt: 'happy forest ending' },
      ],
    },
  },
};

function getDemoStory(theme: string, character: string): StoryGenerationResponse {
  const themeStories = DEMO_STORIES[theme] ?? DEMO_STORIES.space;
  return themeStories[character] ?? themeStories.default ?? DEMO_STORIES.space.default;
}

const PLACEHOLDER_IMAGES = [
  'https://placehold.co/1024x1024/FF6B6B/FFFFFF?text=Page+1&font=raleway',
  'https://placehold.co/1024x1024/4ECDC4/FFFFFF?text=Page+2&font=raleway',
  'https://placehold.co/1024x1024/FFE66D/2D2D2D?text=Page+3&font=raleway',
  'https://placehold.co/1024x1024/A18CD1/FFFFFF?text=Page+4&font=raleway',
  'https://placehold.co/1024x1024/52B788/FFFFFF?text=Page+5&font=raleway',
  'https://placehold.co/1024x1024/FF8E53/FFFFFF?text=Page+6&font=raleway',
  'https://placehold.co/1024x1024/00B4D8/FFFFFF?text=Page+7&font=raleway',
  'https://placehold.co/1024x1024/C77DFF/FFFFFF?text=Page+8&font=raleway',
  'https://placehold.co/1024x1024/DDA15E/FFFFFF?text=Page+9&font=raleway',
  'https://placehold.co/1024x1024/FFB6C1/2D2D2D?text=Page+10&font=raleway',
];

const COVER_PLACEHOLDER = 'https://placehold.co/1024x1024/FF6B6B/FFFFFF?text=Cover&font=raleway';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
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
  }) => {
    setState({
      status: 'generating-text',
      progress: 0,
      totalSteps: 0,
      currentStep: 'Writing your story...',
      story: null,
      imageUrls: [],
      coverUrl: null,
      error: null,
    });

    try {
      // Demo mode: simulate AI generation with delays
      if (isDemoMode) {
        await sleep(1500);

        const story = getDemoStory(params.theme, params.character);
        const totalSteps = story.pages.length + 2;

        setState(prev => ({
          ...prev,
          status: 'generating-images',
          progress: 1,
          totalSteps,
          currentStep: 'Creating cover illustration...',
          story,
        }));

        await sleep(1200);

        const coverUrl = COVER_PLACEHOLDER;
        setState(prev => ({
          ...prev,
          progress: 2,
          coverUrl,
          currentStep: 'Drawing page illustrations...',
        }));

        const imageUrls: string[] = [];
        for (let i = 0; i < story.pages.length; i++) {
          await sleep(800);
          imageUrls.push(PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]);

          setState(prev => ({
            ...prev,
            progress: i + 3,
            imageUrls: [...imageUrls],
            currentStep: `Drawing page ${i + 1} of ${story.pages.length}...`,
          }));
        }

        await sleep(500);

        setState(prev => ({
          ...prev,
          status: 'complete',
          progress: totalSteps,
          imageUrls,
          currentStep: 'Story complete!',
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
        currentStep: 'Creating cover illustration...',
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
        currentStep: 'Drawing page illustrations...',
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
          currentStep: `Drawing page ${i + 2} of ${story.pages.length}...`,
        }));
      }

      setState(prev => ({
        ...prev,
        status: 'complete',
        progress: totalImages + 1,
        imageUrls,
        currentStep: 'Story complete!',
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
