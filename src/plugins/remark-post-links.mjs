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
 * Link tới bài còn draft: true vẫn chạy khi `npm run dev`; khi build để deploy, nó hiện thành
 * chữ thường (không có link) để không dẫn tới trang lỗi, và tự thành link khi bài đó được đăng.
 * Link web bình thường (https://...) không bị đụng tới.
 */
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const POST_FILE = /^(?:(.*)\/)?(en|vi)\.mdx?(#.*)?$/;
const IS_BUILD = process.argv.includes('build') || process.env.NODE_ENV === 'production';

function isDraft(file) {
  try {
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(file, 'utf8'));
    return !!fm && /^draft:\s*true\s*$/m.test(fm[1]);
  } catch {
    return false;
  }
}

/** Trả về { url } để đổi link, { unlink: true } để bỏ link, hoặc null nếu không phải link tới bài */
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
    const where = `${basename(here)}/${basename(String(file.path))}`;
    const blogDir = dirname(here);
    const target = ['md', 'mdx'].map((ext) => join(blogDir, folder, `${lang}.${ext}`)).find((p) => existsSync(p));
    if (!target) {
      console.warn(`[post-links] ${where}: không tìm thấy bài "${folder}/${lang}.md" (link: ${url})`);
    } else if (IS_BUILD && isDraft(target)) {
      console.warn(`[post-links] ${where}: bài "${folder}/${lang}.md" còn draft, link tạm hiện thành chữ thường`);
      return { unlink: true };
    }
  }
  return { url: `${lang === 'vi' ? '/vi' : ''}/blog/${folder}${hash}` };
}

function walk(node, file) {
  if (!Array.isArray(node.children)) return;
  const next = [];
  for (const child of node.children) {
    if ((child.type === 'link' || child.type === 'definition') && typeof child.url === 'string') {
      const r = rewrite(child.url, file);
      if (r?.unlink && child.type === 'link') {
        // Bỏ link, giữ lại chữ bên trong
        for (const c of child.children) {
          walk(c, file);
          next.push(c);
        }
        continue;
      }
      if (r?.url) child.url = r.url;
    }
    walk(child, file);
    next.push(child);
  }
  node.children = next;
}

export default function remarkPostLinks() {
  return (tree, file) => walk(tree, file);
}
