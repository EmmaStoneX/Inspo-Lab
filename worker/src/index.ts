export interface Env {
  GEMINI_API_KEY: string;
  MODEL_BASE_URL?: string;
  MODEL_NAME?: string;
}


const DEFAULT_BASE_URL = 'https://0rzz.ggff.net/v1beta/models';

const DEFAULT_MODEL = 'gemini-3-pro-image-preview';
const API_PATH = '/api/generate';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

const jsonHeaders = {
  'Content-Type': 'application/json',
  ...corsHeaders,
};

const buildError = (message: string, status = 400) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: jsonHeaders,
  });

const extractImageFromContent = (content: string): string | null => {
  const markdownMatch = content.match(/!\[.*?\]\((.*?)\)/);
  if (markdownMatch?.[1]) {
    return markdownMatch[1];
  }

  const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
  if (urlMatch?.[0]) {
    return urlMatch[0];
  }

  if (content.startsWith('data:image') || (content.length > 100 && !content.includes(' '))) {
    return content.startsWith('data:image') ? content : `data:image/png;base64,${content}`;
  }

  return null;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname !== API_PATH) {
      return new Response('Not Found', { status: 404, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    if (!env.GEMINI_API_KEY) {
      return buildError('Server misconfigured: missing GEMINI_API_KEY', 500);
    }

    let prompt: string | undefined;

    try {
      const body = (await request.json()) as { prompt?: string };
      prompt = body.prompt;
    } catch (error) {
      return buildError('请求体必须是 JSON 格式', 400);
    }

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return buildError('请提供有效的 prompt 字段', 400);
    }

    const baseUrl = (env.MODEL_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
    const model = env.MODEL_NAME || DEFAULT_MODEL;

    const payload = {

      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        // 请求纯文本（通常包含 markdown 图片链接），便于解析
        responseMimeType: 'text/plain',
      },
    };

    try {
      const upstream = await fetch(`${baseUrl}/${model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': env.GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      if (!upstream.ok) {
        const errorText = await upstream.text();
        let message = `上游返回 ${upstream.status}`;
        try {
          const json = JSON.parse(errorText);
          message = json.error?.message || json.message || message;
        } catch (error) {
          message = `${message}: ${errorText.slice(0, 200)}`;
        }
        return buildError(message, upstream.status);
      }

      const data = await upstream.json();

      const content =
        data?.candidates?.[0]?.content?.parts?.map((part: any) => part?.text || '')
          .join('') || '';

      if (!content) {
        return buildError('模型未返回内容', 500);
      }

      const image = extractImageFromContent(content);
      if (!image) {
        return buildError('未能从模型回复中解析图片 URL/数据', 422);
      }

      return new Response(JSON.stringify({ image }), { status: 200, headers: jsonHeaders });
    } catch (error: any) {
      return buildError(`生成失败：${error.message || '未知错误'}`, 500);
    }
  },
};
