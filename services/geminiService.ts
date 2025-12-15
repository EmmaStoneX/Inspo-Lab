/**
 * 前端仅与受信任的 Cloudflare Worker 通信，不再在浏览器中读取或存储 API Key。
 */

const normalizeWorkerUrl = (raw: string): string => {
  const value = (raw || '').trim();
  if (!value) {
    throw new Error('未配置 VITE_WORKER_URL，无法调用后端生成服务');
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch (error) {
    throw new Error('VITE_WORKER_URL 不是合法的 URL，请填写完整的 Worker 域名（例如 https://xxx.workers.dev）');
  }

  const isLocalhost = ['localhost', '127.0.0.1'].includes(parsed.hostname);
  if (!isLocalhost && parsed.protocol !== 'https:') {
    throw new Error('生产环境的 VITE_WORKER_URL 必须是 https://，本地可使用 http://localhost:8787');
  }

  // 如果用户误填了 /api/generate，去掉尾部路径以避免重复
  const sanitizedPath = parsed.pathname.replace(/\/api\/generate\/?$/, '').replace(/\/$/, '');
  const base = `${parsed.origin}${sanitizedPath}`;

  return base || parsed.origin;
};

export const generateImage = async (
  prompt: string
): Promise<string> => {
  const workerBase = normalizeWorkerUrl(import.meta.env.VITE_WORKER_URL);
  const endpoint = `${workerBase}/api/generate`;

  let response: Response;
  let text = '';
  let data: any = null;

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
  } catch (error) {
    throw new Error('请求后端失败，请检查网络或 Worker 域名是否可访问');
  }

  text = await response.text();
  const contentType = response.headers.get('content-type') || '';

  if (text && contentType.includes('application/json')) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      // 如果服务端返回的内容不可解析，直接交给后面的兜底提示
    }
  }

  if (!text.trim()) {
    throw new Error('后端未返回任何内容，请稍后重试或检查 Worker 日志');
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
