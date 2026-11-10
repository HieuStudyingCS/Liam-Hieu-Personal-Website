/**
 * remark-post-links
 * Cho phép liên kết giữa các bài bằng đường dẫn tới file .md, ví dụ:
 *
 *   [Proximal Gradient Descent](../2026-11-08-proximal-gradient-descent/en.md)
 *   [mục ISTA](../2026-11-08-proximal-gradient-descent/vi.md#ista)
 *   [bản tiếng Việt](./vi.md)
 *
 * Khi build, link được đổi thành URL của trang: /blog/<thư-mục-bài> (en.md)
 * hoặc /vi/blog/<thư-mục-bài> (vi.md), giữ nguyên phần #mục nếu có.
 * Thư mục bài được lấy từ tên thư mục ngay trước en.md / vi.md.
 * Link tới bài không tồn tại sẽ được báo trong terminal.
 * Link web bình thường (https://...) không bị đụng tới.
 */
import { existsSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const POST_FILE = /^(?:(.*)\/)?(en|vi)\.mdx?(#.*)?$/;

function rewrite(url, file) {
  if (!url || /^[a-z][a-z0-9+.-]*:|^\/\/|^#|^\//i.test(url)) return null;
  let decoded;
  try {
    decoded = decodeURI(url);
  } catch {
    decoded = url;
  }
  const m = POST_FILE.exec(decoded.replace(/\\/g, '/'));
  if (!m) return null;
  const [, dir = '', lang, hash = ''] = m;
  const here = file?.path ? dirname(String(file.path)) : null;
  const segments = dir.split('/').filter((s) => s && s !== '.' && s !== '..');
  const folder = segments.at(-1) ?? (here ? basename(here) : null);
  if (!folder) return null;

  if (here) {
    const blogDir = dirname(here);
    const exists = ['md', 'mdx'].some((ext) => existsSync(join(blogDir, folder, `${lang}.${ext}`)));
    if (!exists) {
      console.warn(`[post-links] ${basename(here)}/${basename(String(file.path))}: không tìm thấy bài "${folder}/${lang}.md" (link: ${url})`);
    }
  }
  return `${lang === 'vi' ? '/vi' : ''}/blog/${folder}${hash}`;
}

function walk(node, file) {
  if ((node.type === 'link' || node.type === 'definition') && typeof node.url === 'string') {
    const next = rewrite(node.url, file);
    if (next) node.url = next;
  }
  if (Array.isArray(node.children)) for (const child of node.children) walk(child, file);
}

export default function remarkPostLinks() {
  return (tree, file) => walk(tree, file);
}
