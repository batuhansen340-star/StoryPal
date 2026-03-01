import { supabase } from './supabase';
import type { AgeGroup, StoryGenerationResponse, PersonalizationData, CharacterSheet } from '../types';

const SAFETY_POSITIVE = 'safe for children, friendly, colorful, whimsical, storybook illustration style';
const SAFETY_NEGATIVE = 'scary, violent, dark, horror, blood, weapon, nsfw, realistic, photograph, different appearance, inconsistent features';

export async function generateStoryText(params: {
  theme: string;
  character: string;
  ageGroup: AgeGroup;
  language: string;
  personalization?: PersonalizationData;
  customPrompt?: string;
}): Promise<StoryGenerationResponse> {
  const body: Record<string, unknown> = {
    theme: params.theme,
    character: params.character,
    ageGroup: params.ageGroup,
    language: params.language,
    personalization: params.personalization,
  };

  if (params.customPrompt) {
    body.customPrompt = params.customPrompt;
  }

  if (params.personalization?.usePhotoFace && params.personalization?.faceDescription) {
    body.faceDescription = params.personalization.faceDescription;
  }

  const { data, error } = await supabase.functions.invoke('ai-text', { body });

  if (error) throw new Error(`Story generation failed: ${error.message}`);

  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    return parsed as StoryGenerationResponse;
  } catch {
    throw new Error('Failed to parse AI response');
  }
}

export async function generateStoryImage(params: {
  prompt: string;
  theme: string;
  character: string;
  characterSheet?: CharacterSheet;
}): Promise<string> {
  let fullPrompt: string;

  if (params.characterSheet) {
    fullPrompt = `${params.characterSheet.consistencyPrompt}, CURRENTLY: ${params.prompt}, ${params.characterSheet.style}, ${SAFETY_POSITIVE}`;
  } else {
    fullPrompt = `${params.prompt}, ${SAFETY_POSITIVE}, ${params.theme} theme, featuring ${params.character}`;
  }

  const { data, error } = await supabase.functions.invoke('ai-image', {
    body: {
      prompt: fullPrompt,
      negativePrompt: SAFETY_NEGATIVE,
    },
  });

  if (error) throw new Error(`Image generation failed: ${error.message}`);

  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    return parsed.imageUrl as string;
  } catch {
    throw new Error('Failed to parse image response');
  }
}

export async function generateCoverImage(params: {
  title: string;
  theme: string;
  character: string;
  characterSheet?: CharacterSheet;
}): Promise<string> {
  const prompt = `Children's storybook cover illustration, title "${params.title}", ${params.theme} theme, ${params.character} as main character, ${SAFETY_POSITIVE}, vibrant colors, detailed, professional quality`;

  return generateStoryImage({
    prompt,
    theme: params.theme,
    character: params.character,
    characterSheet: params.characterSheet,
  });
}
