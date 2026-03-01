import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';

interface RequestBody {
  theme: string;
  character: string;
  ageGroup: '3-5' | '5-7' | '7-10';
  language: string;
}

const AGE_CONFIG = {
  '3-5': { pages: 5, maxWords: 30 },
  '5-7': { pages: 8, maxWords: 50 },
  '7-10': { pages: 10, maxWords: 80 },
} as const;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  try {
    const { theme, character, ageGroup, language } = (await req.json()) as RequestBody;
    const config = AGE_CONFIG[ageGroup];

    const systemPrompt = `You are a children's storybook writer. Create stories that are:
- Safe for children, positive, uplifting, and age-appropriate
- No violence, scary elements, or dark themes
- Educational and fun
- Written in ${language}

Respond ONLY with valid JSON in this exact format:
{
  "title": "Story Title",
  "pages": [
    { "text": "Page text here", "imagePrompt": "Detailed illustration description" }
  ]
}`;

    const userPrompt = `Create a children's story for ages ${ageGroup} about the theme "${theme}" with the character "${character}".

Requirements:
- Exactly ${config.pages} pages
- Maximum ${config.maxWords} words per page
- Each imagePrompt should describe a vibrant, colorful children's book illustration
- Include "safe for children, no violence, no scary elements" in every imagePrompt
- Story should have a clear beginning, middle, and happy ending
- Include a moral or lesson`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) throw new Error('No content in AI response');

    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});
