export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Markdown một dòng, an toàn (escape HTML trước):
 * **đậm**, *nghiêng*, `code`, [chữ](url) và [[từ khóa|tooltip]].
 */
export function inlineMd(s: string): string {
  let out = escapeHtml(s);
  out = out.replace(
    /\[\[([^\]|]+)\|([^\]]+)\]\]/g,
    '<span class="tip" tabindex="0" data-tip="$2">$1</span>',
  );
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
    const external = /^https?:\/\//.test(href);
    const attrs = external ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${href}"${attrs}>${label}</a>`;
  });
  return out;
}

/** Nhiều đoạn văn: cách nhau bằng một dòng trống */
export function paragraphs(s: string): string {
  return s
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${inlineMd(p.replace(/\s*\n\s*/g, ' '))}</p>`)
    .join('');
}

/** Nhiều dòng: mỗi dòng trong YAML hiện thành một dòng trên web (hỗ trợ **đậm**, [link](url)) */
export function lines(s: string): string {
  return s
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => inlineMd(l))
    .join('<br />');
}

/** Bỏ dấu tiếng Việt và viết thường — dùng cho slug và tìm kiếm */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function slugify(s: string): string {
  return normalize(s)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Rút gọn markdown thành văn bản thô (cho chỉ mục tìm kiếm và thời gian đọc) */
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]+\$/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/[*_`>|#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
