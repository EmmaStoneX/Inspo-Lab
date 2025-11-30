
// 获取 API Key 的辅助函数
const getApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const localKey = localStorage.getItem('GEMINI_API_KEY');
    if (localKey) {
      return localKey;
    }
  }
  return process.env.API_KEY || '';
};

/**
 * 使用原生 fetch 调用 Gemini 3 Pro (Banana2) via OpenAI Compatible Interface
 * 强制使用 Chat Completions 接口以适配大多数中转站
 */
export const generateImage = async (
  prompt: string
): Promise<string> => {
  const apiKey = getApiKey();
  // 你的中转站地址，对应 OpenAI 兼容接口
  const baseUrl = 'https://kickoff.netlib.re';
  
  if (!apiKey) {
    throw new Error("API Key 未配置。请在 Cloudflare 环境变量中设置 API_KEY，或在控制台执行 localStorage.setItem('GEMINI_API_KEY', '你的Key') 进行本地测试。");
  }

  // 构造 OpenAI Chat 请求体
  // 注意：由于中转站通常不透传 extraConfig，我们只通过提示词传递意图
  const payload = {
    model: "gemini-3-pro-image-preview",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    // 强制不流式传输，以便一次性拿到结果
    stream: false
  };

  try {
    // 使用 fetch 直接请求代理地址的 v1/chat/completions
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 兼容 OpenAI 格式的中转站认证
        'Authorization': `Bearer ${apiKey}`,
        // 部分中转站可能还需要这个
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
         throw new Error("API Key 无效或权限不足 (401/403)。请检查 Key 是否正确。");
      }
      const errorText = await response.text();
      let errorMsg = `HTTP Error ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.error?.message || errorJson.message || errorMsg;
      } catch (e) {
        errorMsg = errorText.slice(0, 100);
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();

    // 解析 OpenAI Chat 格式的返回结果
    // Gemini 生图在中转站 Chat 接口中，通常图片 URL 会在 content 文本里，或者就是 content 本身
    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message?.content || "";
      
      // 1. 尝试匹配 Markdown 图片语法 ![alt](url)
      const markdownMatch = content.match(/!\[.*?\]\((.*?)\)/);
      if (markdownMatch && markdownMatch[1]) {
        return markdownMatch[1];
      }

      // 2. 尝试匹配纯 URL (http/https 开头，图片格式结尾或由 googleusercontent 托管)
      const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch && urlMatch[0]) {
        return urlMatch[0];
      }
      
      // 3. 如果内容看起来像 Base64
      if (content.startsWith('data:image') || (content.length > 100 && !content.includes(' '))) {
         return content.startsWith('data:image') ? content : `data:image/png;base64,${content}`;
      }

      // 4. 如果没有显式图片，可能生成失败，返回文本信息作为错误
      if (content) {
        throw new Error(`生成未返回图片，模型回复：${content.slice(0, 50)}...`);
      }
    }

    throw new Error("模型未返回有效数据，请检查提示词或额度。");

  } catch (error: any) {
    // 友好化错误提示
    throw new Error(`生成失败: ${error.message}`);
  }
};
