import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const REPLICATE_API_TOKEN = Deno.env.get('REPLICATE_API_TOKEN') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const CACHE_BUCKET = 'image-cache';
const CACHE_TTL_DAYS = 30;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

interface RequestBody {
  prompt: string;
  negativePrompt?: string;
}

async function hashPrompt(prompt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(prompt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, negativePrompt } = (await req.json()) as RequestBody;

    const safePrompt = `${prompt}, children's book illustration, watercolor style, warm colors, friendly, cute, safe for children`;
    const safeNegative = `${negativePrompt ?? ''}, scary, violent, dark, horror, blood, weapon, nsfw, realistic photo, ugly, deformed`.trim();

    // Generate cache key from the safe prompt
    const promptHash = await hashPrompt(safePrompt);
    const cacheKey = `${promptHash}.png`;

    // Check cache
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: existingFile } = await supabase.storage
      .from(CACHE_BUCKET)
      .list('', { search: cacheKey, limit: 1 });

    if (existingFile && existingFile.length > 0) {
      const file = existingFile[0];
      const createdAt = new Date(file.created_at);
      const ageMs = Date.now() - createdAt.getTime();
      const ageDays = ageMs / (1000 * 60 * 60 * 24);

      if (ageDays < CACHE_TTL_DAYS) {
        const { data: publicUrl } = supabase.storage
          .from(CACHE_BUCKET)
          .getPublicUrl(cacheKey);

        return new Response(JSON.stringify({ imageUrl: publicUrl.publicUrl }), {
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
            ...corsHeaders,
          },
        });
      }
    }

    // Cache MISS — generate via Replicate
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

    // Upload to Supabase Storage cache
    try {
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();
      const imageBuffer = await imageBlob.arrayBuffer();

      await supabase.storage
        .from(CACHE_BUCKET)
        .upload(cacheKey, imageBuffer, {
          contentType: 'image/png',
          upsert: true,
        });

      const { data: publicUrl } = supabase.storage
        .from(CACHE_BUCKET)
        .getPublicUrl(cacheKey);

      return new Response(JSON.stringify({ imageUrl: publicUrl.publicUrl }), {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'MISS',
          ...corsHeaders,
        },
      });
    } catch {
      // Cache upload failed — still return the direct Replicate URL
      return new Response(JSON.stringify({ imageUrl }), {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'MISS',
          ...corsHeaders,
        },
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});
