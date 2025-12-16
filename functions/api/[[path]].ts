/// <reference types="@cloudflare/workers-types" />

interface Env {
  GEMINI_API_KEY: string;
  MODEL_BASE_URL?: string;
  MODEL_NAME?: string;
}

const DEFAULT_BASE_URL = 'https://0rzz.ggff.net/v1beta/models';
const DEFAULT_MODEL = 'gemini-3-pro-image-preview';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

const jsonHeaders = {
  'Content-Type': 'application/json',
  ...corsHeaders,
};

function buildError(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: jsonHeaders,
  });
}

function extractImageFromContent(content: string): string | null {
  const imageUrlPattern = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/;
  const match = content.match(imageUrlPattern);
  if (match && match[1]) {
    return match[1];
  }
  
  const urlPattern = /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp)(?:\?\S*)?)/i;
  const urlMatch = content.match(urlPattern);
  return urlMatch ? urlMatch[0] : null;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
  if (context.request.method !== 'POST') {
    return buildError('Method not allowed', 405);
  }

  try {
    const { prompt } = await context.request.json<{ prompt: string }>();
    if (!prompt) {
      return buildError('Prompt is required');
    }

    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return buildError('API key not configured', 500);
    }

    const modelBaseUrl = context.env.MODEL_BASE_URL || DEFAULT_BASE_URL;
    const modelName = context.env.MODEL_NAME || DEFAULT_MODEL;
    
    const apiUrl = `${modelBaseUrl}/${modelName}:generateContent`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('API Error:', error);
      return buildError('Failed to generate content', response.status);
    }

    const data = await response.json() as any; // 临时使用 any 类型，实际应该定义完整的响应类型
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      return buildError('No content generated', 500);
    }

    const imageUrl = extractImageFromContent(content);
    
    return new Response(
      JSON.stringify({
        content,
        imageUrl,
      }),
      {
        status: 200,
        headers: jsonHeaders,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return buildError('Internal server error', 500);
  }
};

export const onRequestOptions: PagesFunction = () => {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      'Access-Control-Max-Age': '86400',
    },
  });
};
