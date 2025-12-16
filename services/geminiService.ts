interface GeminiResponse {
  image?: string;
  error?: string;
  content?: string;
  imageUrl?: string;
}

/**
 * 生成图片
 * @param prompt 图片描述
 * @returns 图片URL
 */
export const generateImage = async (prompt: string): Promise<string> => {
  // 从环境变量获取API基础URL，默认为相对路径
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const endpoint = `${baseUrl}/api/generate`;

  try {
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

    // 支持多种响应格式
    const imageUrl = data.imageUrl || data.image;
    if (!imageUrl) {
      throw new Error('生成失败：未收到图片链接');
    }

    return imageUrl;
  } catch (error) {
    console.error('生成图片时出错:', error);
    throw error instanceof Error 
      ? error 
      : new Error('生成图片时发生未知错误');
  }
};
