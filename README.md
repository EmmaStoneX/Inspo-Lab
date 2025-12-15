<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Banana2 灵感画室（前后端分离版）

现在的架构将前端（Cloudflare Pages）与后端（Cloudflare Worker）彻底分离，API Key 只存放在 Worker 环境变量中，从源头避免在浏览器侧泄露。

## 架构概览
- **前端**：Vite + React 静态站点，托管在 **Cloudflare Pages**。
- **后端**：Cloudflare **Worker** 提供 `/api/generate` 接口，封装对 Gemini 3 Pro（或 OpenAI 兼容代理）的调用。
- **安全性**：浏览器只访问 Worker，所有敏感密钥都在服务端环境变量中读取。

## 本地运行

### 前置要求
- Node.js（建议 18+）
- Wrangler CLI（`npm install -g wrangler`，或在 `worker` 目录中 `npm install` 自动提供）

### 1. 启动 Worker（后端）
```bash
cd worker
npm install
GEMINI_API_KEY=你的Key MODEL_BASE_URL=https://kickoff.netlib.re npm run dev
```
> `MODEL_BASE_URL` 和 `MODEL_NAME` 可选，默认使用 `gemini-3-pro-image-preview` 与 `https://kickoff.netlib.re`。

### 2. 启动前端
```bash
cd ..
npm install
VITE_WORKER_URL=http://localhost:8787 npm run dev
```
- 浏览器访问 `http://localhost:5173`。
- 前端只需要知道 Worker 地址，无需配置 API Key。

## 部署到 Cloudflare

### 部署 Worker
```bash
cd worker
npm install
wrangler deploy --var GEMINI_API_KEY=你的Key [--var MODEL_BASE_URL=https://kickoff.netlib.re]
```
记下部署得到的 Worker 域名（如 `https://banana2-worker.your-subdomain.workers.dev`）。

### 部署前端到 Pages
1. 在 Cloudflare Pages 里创建站点，构建命令 `npm run build`，输出目录 `dist`。
2. 设置环境变量 `VITE_WORKER_URL` 为上一步 Worker 的完整域名（不带末尾斜杠）。
3. 部署完成后，前端会通过该域名访问 `/api/generate`，无需在 Pages 暴露 API Key。

## 路由说明
- `POST /api/generate`：请求体 `{ "prompt": "..." }`，返回 `{ "image": "<url or data URI>" }`。

## 提示
- 如果你有自己的 OpenAI 兼容代理，可以通过 `MODEL_BASE_URL`、`MODEL_NAME` 两个环境变量切换。
- Worker 已内置 CORS 处理，便于从 Pages 或本地开发环境直接调用。
