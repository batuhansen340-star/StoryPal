import OpenAI from 'openai';
import type { AgeGroup, StoryGenerationResponse, PersonalizationData, CharacterSheet } from '../types';

const SAFETY_POSITIVE = 'safe for children, friendly, colorful, whimsical, storybook illustration style';
const SAFETY_NEGATIVE = 'scary, violent, dark, horror, blood, weapon, nsfw, realistic, photograph';

const AGE_CONFIG: Record<AgeGroup, { pages: number; maxWords: number }> = {
  '3-5': { pages: 5, maxWords: 30 },
  '5-7': { pages: 8, maxWords: 50 },
  '7-10': { pages: 10, maxWords: 80 },
};

function getClient(): OpenAI {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
}

export async function generateStoryText(params: {
  theme: string;
  character: string;
  ageGroup: AgeGroup;
  language: string;
  personalization?: PersonalizationData;
  customPrompt?: string;
}): Promise<StoryGenerationResponse> {
  const openai = getClient();
  const config = AGE_CONFIG[params.ageGroup] ?? AGE_CONFIG['3-5'];

  const languageInstruction = params.language !== 'en'
    ? `Write the story text in the language with ISO code "${params.language}". Title must also be in that language.`
    : 'Write everything in English.';

  let characterDesc = `Character: ${params.character}`;
  if (params.personalization?.name) {
    characterDesc = `Character: ${params.personalization.name} (a ${params.personalization.gender ?? 'child'} with ${params.personalization.hairColor} hair and ${params.personalization.skinTone} skin${params.personalization.hasGlasses ? ', wearing glasses' : ''})`;
  }

  const customPart = params.customPrompt
    ? `\nSpecial request from the child: "${params.customPrompt}"`
    : '';

  const systemPrompt = `You are a world-class children's storybook author. Create a magical, age-appropriate story.

RULES:
- The story must be positive, uplifting, and safe for children
- NO scary, violent, or dark content
- ${config.pages} pages exactly
- Each page MAXIMUM ${config.maxWords} words
- Each page needs a vivid imagePrompt for illustration (in English, always)
- imagePrompt must include: "${SAFETY_POSITIVE}"
- imagePrompt must describe the scene vividly for an illustrator
- ${languageInstruction}

Respond ONLY with valid JSON in this exact format:
{
  "title": "Story Title",
  "pages": [
    {
      "text": "Page text here...",
      "imagePrompt": "Detailed illustration description, ${SAFETY_POSITIVE}"
    }
  ]
}`;

  const userPrompt = `Theme: ${params.theme}
${characterDesc}
Age group: ${params.ageGroup} years old${customPart}

Create a ${config.pages}-page story. Each page max ${config.maxWords} words.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('Empty AI response');

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('AI returned invalid JSON');
  }

  if (
    typeof parsed.title !== 'string' ||
    !Array.isArray(parsed.pages) ||
    parsed.pages.length === 0
  ) {
    throw new Error('Invalid story format from AI');
  }

  // Validate each page has text and imagePrompt
  for (const page of parsed.pages) {
    if (typeof page !== 'object' || !page || typeof (page as Record<string, unknown>).text !== 'string') {
      throw new Error('Invalid page format from AI');
    }
  }

  return parsed as unknown as StoryGenerationResponse;
}

export async function generateStoryImage(params: {
  prompt: string;
  theme: string;
  character: string;
  characterSheet?: CharacterSheet;
}): Promise<string> {
  const openai = getClient();

  let fullPrompt: string;
  if (params.characterSheet) {
    fullPrompt = `${params.characterSheet.consistencyPrompt}, CURRENTLY: ${params.prompt}, ${params.characterSheet.style}, ${SAFETY_POSITIVE}`;
  } else {
    fullPrompt = `${params.prompt}, ${SAFETY_POSITIVE}, ${params.theme} theme, featuring ${params.character}`;
  }

  const response = await openai.images.generate({
    model: 'gpt-image-1',
    prompt: fullPrompt,
    n: 1,
    size: '1024x1024',
    quality: 'low',
  });

  const imageData = response.data?.[0];
  if (!imageData) throw new Error('No image generated');

  // gpt-image-1 returns b64_json by default
  if (imageData.b64_json) {
    return `data:image/png;base64,${imageData.b64_json}`;
  }
  if (imageData.url) {
    return imageData.url;
  }

  throw new Error('No image data in response');
}

export async function generateCoverImage(params: {
  title: string;
  theme: string;
  character: string;
  characterSheet?: CharacterSheet;
}): Promise<string> {
  const prompt = `Children's storybook cover illustration, title "${params.title}", ${params.theme} theme, ${params.character} as main character, ${SAFETY_POSITIVE}, vibrant colors, detailed, professional quality book cover`;

  return generateStoryImage({
    prompt,
    theme: params.theme,
    character: params.character,
    characterSheet: params.characterSheet,
  });
}
