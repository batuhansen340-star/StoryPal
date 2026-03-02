import OpenAI from 'openai';
import type { AgeGroup, StoryGenerationResponse, PersonalizationData, CharacterSheet } from '../types';

const SAFETY_POSITIVE = 'safe for children, friendly, colorful, whimsical, storybook illustration style';
const SAFETY_NEGATIVE = 'scary, violent, dark, horror, blood, weapon, nsfw, realistic, photograph';

const AGE_CONFIG: Record<AgeGroup, { pages: number; maxWords: number }> = {
  '3-5': { pages: 6, maxWords: 50 },
  '5-7': { pages: 10, maxWords: 80 },
  '7-10': { pages: 12, maxWords: 120 },
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
  childName?: string;
  childAge?: number;
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

  const childPart = params.childName
    ? `\nThis story is for a child named "${params.childName}"${params.childAge ? ` who is ${params.childAge} years old` : ''}. Include their name as the main character or a special friend in the story.`
    : '';

  const customPart = params.customPrompt
    ? `\nSpecial request from the child: "${params.customPrompt}"`
    : '';

  const systemPrompt = `You are a world-class children's storybook author — think Julia Donaldson, Mo Willems, and Oliver Jeffers combined. Create a magical, age-appropriate story that children will BEG to hear again.

STORY STRUCTURE:
- Clear three-act structure: Setup (introduce character + world), Conflict (challenge/adventure), Resolution (growth + satisfying ending)
- The character must CHANGE or LEARN something by the end
- Include at least one moment of genuine emotion (wonder, friendship, bravery, kindness)
- End with warmth — the child should feel happy and safe

WRITING CRAFT:
- Use vivid sensory details (what does the place SMELL like? What does a laugh SOUND like?)
- Include dialogue between characters — make each voice distinct
- Use rhythm and repetition where appropriate (children love patterns)
- Sprinkle in gentle humor
- Use onomatopoeia where it fits (whoosh, splish-splash, crackle)
- Each page should end at a natural turning point that makes kids want the next page

CONTENT RULES:
- Positive, uplifting, safe for children — NO scary, violent, or dark content
- Weave in a gentle moral lesson naturally — never preach
- ${config.pages} pages exactly
- Each page: aim for ${Math.round(config.maxWords * 0.8)} to ${config.maxWords} words (use the full allowance for rich storytelling)
- Each page needs a vivid imagePrompt for illustration (in English, always)
- imagePrompt must include: "${SAFETY_POSITIVE}"
- imagePrompt must describe the scene with specific details: character expression, body language, environment, lighting, colors
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
Age group: ${params.ageGroup} years old${childPart}${customPart}

Create a ${config.pages}-page story. Each page max ${config.maxWords} words.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.9,
    max_tokens: 4000,
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
