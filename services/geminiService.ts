/**
 * 前端仅与受信任的 Cloudflare Worker 通信，不再在浏览器中读取或存储 API Key。
 */
export const generateImage = async (
  prompt: string
): Promise<string> => {
  const workerBase = (import.meta.env.VITE_WORKER_URL || '').replace(/\/$/, '');
  const endpoint = `${workerBase}/api/generate`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error || `生成失败：${response.statusText}`;
    throw new Error(message);
  }

  if (!data?.image) {
    throw new Error('生成失败：未收到图片链接');
  }

  return data.image as string;
};
