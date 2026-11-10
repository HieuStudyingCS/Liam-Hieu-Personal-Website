import type { APIRoute } from 'astro';

// robots.txt: cho phép mọi công cụ tìm kiếm và chỉ đường tới sitemap
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
