// This file is intentionally left empty to prevent Wrangler from deploying a Worker
// We're using Cloudflare Pages Functions instead
export default {
  async fetch(request, env, ctx) {
    return new Response('Not Found', { status: 404 });
  },
};
