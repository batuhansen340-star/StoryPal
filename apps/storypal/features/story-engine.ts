import * as aiGateway from '../../../packages/shared/services/ai-gateway';
import { saveStory as saveLocalStory } from '../../../packages/shared/services/story-storage';
import { recordStoryCreation, getTodayStoryCount } from '../../../packages/shared/services/usage-limiter';
import { supabase } from '../../../packages/shared/services/supabase';
import { AGE_GROUPS } from '../constants/themes';
import type { AgeGroup, Story, PersonalizationData } from '../../../packages/shared/types';

const FREE_DAILY_LIMIT = 2;

export interface StoryCreationParams {
  userId: string;
  theme: string;
  character: string;
  ageGroup: AgeGroup;
  language: string;
  isPremium: boolean;
  personalization?: PersonalizationData;
}

export interface StoryCreationCallbacks {
  onStatusChange: (status: string) => void;
  onProgress: (current: number, total: number) => void;
}

export async function checkCanCreateStory(
  userId: string,
  isPremium: boolean,
): Promise<{ canCreate: boolean; remaining: number; reason?: string }> {
  if (isPremium) {
    return { canCreate: true, remaining: Infinity };
  }

  const todayCount = await getTodayStoryCount();
  const remaining = Math.max(0, FREE_DAILY_LIMIT - todayCount);

  if (remaining <= 0) {
    return {
      canCreate: false,
      remaining: 0,
      reason: 'You have reached your daily story limit. Upgrade to Premium for unlimited stories!',
    };
  }

  return { canCreate: true, remaining };
}

export async function createFullStory(
  params: StoryCreationParams,
  callbacks: StoryCreationCallbacks,
): Promise<Story> {
  const { userId, theme, character, ageGroup, language, isPremium } = params;
  const { onStatusChange, onProgress } = callbacks;
  const ageConfig = AGE_GROUPS[ageGroup];
  const totalSteps = ageConfig.pages + 2; // text + cover + pages

  // Check usage limits
  const { canCreate, reason } = await checkCanCreateStory(userId, isPremium);
  if (!canCreate) {
    throw new Error(reason ?? 'Cannot create story');
  }

  // Step 1: Generate story text
  onStatusChange('Writing your story...');
  onProgress(0, totalSteps);

  const storyData = await aiGateway.generateStoryText({
    theme,
    character,
    ageGroup,
    language,
  });

  onProgress(1, totalSteps);

  // Step 2: Generate cover image
  onStatusChange('Painting the cover...');
  const coverImageUrl = await aiGateway.generateCoverImage({
    title: storyData.title,
    theme,
    character,
  });

  onProgress(2, totalSteps);

  // Step 3: Save story to database
  onStatusChange('Saving your story...');
  const savedStory = await saveLocalStory({
    title: storyData.title,
    theme,
    character,
    language,
    pages: JSON.stringify(storyData.pages),
    imageUrls: '[]',
    coverUrl: coverImageUrl,
  });

  // Step 4: Generate page images and save pages
  const pageData: {
    story_id: string;
    page_number: number;
    text: string;
    image_url: string | null;
    image_prompt: string;
  }[] = [];

  for (let i = 0; i < storyData.pages.length; i++) {
    const page = storyData.pages[i];
    onStatusChange(`Drawing page ${i + 1}...`);

    let imageUrl: string | null = null;
    try {
      imageUrl = await aiGateway.generateStoryImage({
        prompt: page.imagePrompt,
        theme,
        character,
      });
    } catch {
      // Continue without image if generation fails
    }

    pageData.push({
      story_id: savedStory.id,
      page_number: i + 1,
      text: page.text,
      image_url: imageUrl,
      image_prompt: page.imagePrompt,
    });

    onProgress(i + 3, totalSteps);
  }

  // Save pages to Supabase
  if (pageData.length > 0) {
    await supabase.from('story_pages').insert(pageData).throwOnError();
  }

  // Log usage
  await recordStoryCreation();

  onStatusChange('Story complete!');
  onProgress(totalSteps, totalSteps);

  return {
    id: savedStory.id,
    userId,
    title: storyData.title,
    theme,
    character,
    ageGroup,
    language,
    coverImageUrl,
    pages: pageData.map((p, idx) => ({
      id: `${savedStory.id}-${idx}`,
      storyId: savedStory.id,
      pageNumber: p.page_number,
      text: p.text,
      imageUrl: p.image_url,
      imagePrompt: p.image_prompt,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
