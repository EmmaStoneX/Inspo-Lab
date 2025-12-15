/**
 * 前端仅与受信任的 Cloudflare Worker 通信，不再在浏览器中读取或存储 API Key。
 */
export const generateImage = async (
  prompt: string
): Promise<string> => {
  const workerBase = (import.meta.env.VITE_WORKER_URL || '').replace(/\/$/, '');
  const endpoint = `${workerBase}/api/generate`;

  if (!workerBase) {
    throw new Error('未配置 VITE_WORKER_URL，无法调用后端生成服务');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  let text = '';
  let data: any = null;

  try {
    text = await response.text();
    const contentType = response.headers.get('content-type') || '';

    // 仅当看起来是 JSON 时尝试解析，避免 "Unexpected end of JSON input"
    if (text && contentType.includes('application/json')) {
      data = JSON.parse(text);
    }
  } catch (error) {
    throw new Error('生成失败：后端返回了空响应，请稍后重试');
  }

  if (!response.ok) {
    const message =
      data?.error ||
      data?.message ||
      (response.status === 404
        ? '后端返回 404，请确认 VITE_WORKER_URL 指向已部署的 Worker 域名（不要填 Pages 域名），且 Worker 路由包含 /api/generate。'
        : text || `生成失败：${response.statusText}`);

    throw new Error(message);
  }

  if (!data?.image) {
    throw new Error(text || '生成失败：未收到图片链接');
  }

  return data.image as string;
};
