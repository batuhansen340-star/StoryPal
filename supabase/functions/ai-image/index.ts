import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const REPLICATE_API_TOKEN = Deno.env.get('REPLICATE_API_TOKEN') ?? '';

interface RequestBody {
  prompt: string;
  negativePrompt?: string;
}

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
    const { prompt, negativePrompt } = (await req.json()) as RequestBody;

    const safePrompt = `${prompt}, children's book illustration, watercolor style, warm colors, friendly, cute, safe for children`;
    const safeNegative = `${negativePrompt ?? ''}, scary, violent, dark, horror, blood, weapon, nsfw, realistic photo, ugly, deformed`.trim();

    // Start prediction
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
        input: {
          prompt: safePrompt,
          negative_prompt: safeNegative,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          scheduler: 'K_EULER',
          num_inference_steps: 25,
          guidance_scale: 7.5,
        },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Replicate API error: ${error}`);
    }

    let prediction = await createResponse.json();

    // Poll for completion
    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          },
        },
      );

      prediction = await pollResponse.json();
    }

    if (prediction.status === 'failed') {
      throw new Error(`Image generation failed: ${prediction.error}`);
    }

    const imageUrl = prediction.output?.[0];
    if (!imageUrl) throw new Error('No image URL in response');

    return new Response(JSON.stringify({ imageUrl }), {
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
