interface GeminiResponse {
  image?: string;
  error?: string;
  content?: string;
  imageUrl?: string;
}

/**
 * 前端与 Cloudflare Pages Function 通信
 */
export const generateImage = async (prompt: string): Promise<string> => {
  const endpoint = '/api/generate';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const data: GeminiResponse = await response.json();

  if (!response.ok) {
    const message = data?.error || `生成失败：${response.statusText}`;
    throw new Error(message);
  }

  // 支持新的响应格式 { content, imageUrl } 和旧的 { image }
  const imageUrl = data.imageUrl || data.image;
  if (!imageUrl) {
    throw new Error('生成失败：未收到图片链接');
  }

  return imageUrl;
};
