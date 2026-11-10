/**
 * remark-citations
 * Biến trích dẫn dạng [4], [1, 3], [2–4] trong bài thành link nhảy xuống mục tương ứng
 * của danh sách tài liệu tham khảo, và hiện tên tài liệu khi rê chuột.
 *
 * Điều kiện: bài có một tiêu đề "References" hoặc "Tài liệu tham khảo" (cấp nào cũng được),
 * ngay bên dưới là danh sách đánh số:
 *
 *   ## References
 *   1. [Subgradient Methods](https://...)
 *   2. ...
 *
 * Mục thứ n của danh sách có id "ref-n". Số không có trong danh sách (ví dụ [9] khi chỉ có
 * 4 tài liệu, hay [0, 1]) được giữ nguyên là chữ. Công thức ($...$), code và chữ đã là link
 * không bị đụng tới.
 */
const HEADING = /^(references?|bibliography|tài liệu tham khảo)$/i;
const CITE = /\[(\d+(?:\s*[,–-]\s*\d+)*)\]/g;
const SKIP = new Set(['link', 'linkReference', 'code', 'inlineCode', 'math', 'inlineMath', 'html', 'definition', 'footnoteDefinition']);

const plain = (node) =>
  typeof node.value === 'string' ? node.value : Array.isArray(node.children) ? node.children.map(plain).join('') : '';

/** "1, 3" → [[1], [3]]; "2–4" → [[2, 4]] */
function parseGroups(inner) {
  return inner.split(',').map((part) => part.split(/[–-]/).map((n) => Number(n.trim())));
}

function findReferences(tree) {
  const kids = tree.children ?? [];
  for (let i = 0; i < kids.length; i++) {
    const h = kids[i];
    if (h.type !== 'heading' || !HEADING.test(plain(h).trim())) continue;
    for (let k = i + 1; k < kids.length; k++) {
      const n = kids[k];
      if (n.type === 'heading' && n.depth <= h.depth) break;
      if (n.type === 'list' && n.ordered) return n;
    }
  }
  return null;
}

export default function remarkCitations() {
  return (tree) => {
    const list = findReferences(tree);
    if (!list) return;

    const start = typeof list.start === 'number' ? list.start : 1;
    const refs = new Map(); // số thứ tự → tên tài liệu (hiện khi rê chuột)
    list.children.forEach((item, idx) => {
      const n = start + idx;
      item.data = { ...item.data, hProperties: { ...(item.data?.hProperties ?? {}), id: `ref-${n}` } };
      refs.set(n, plain(item).replace(/\s+/g, ' ').trim());
    });

    const cite = (n) => ({
      type: 'link',
      url: `#ref-${n}`,
      title: refs.get(n),
      data: { hProperties: { className: ['cite'] } },
      children: [{ type: 'text', value: String(n) }],
    });

    const transformText = (value) => {
      const out = [];
      let last = 0;
      for (const m of value.matchAll(CITE)) {
        const groups = parseGroups(m[1]);
        const ok = groups.every((g) => g.length <= 2 && g.every((n) => refs.has(n)));
        if (!ok) continue;
        if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
        out.push({ type: 'text', value: '[' });
        groups.forEach((g, gi) => {
          if (gi > 0) out.push({ type: 'text', value: ', ' });
          out.push(cite(g[0]));
          if (g.length === 2) {
            out.push({ type: 'text', value: '–' });
            out.push(cite(g[1]));
          }
        });
        out.push({ type: 'text', value: ']' });
        last = m.index + m[0].length;
      }
      if (!out.length) return null;
      if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
      return out;
    };

    const walk = (node) => {
      if (node === list || SKIP.has(node.type) || !Array.isArray(node.children)) return;
      const next = [];
      for (const child of node.children) {
        if (child.type === 'text') {
          const parts = transformText(child.value);
          if (parts) {
            next.push(...parts);
            continue;
          }
        } else {
          walk(child);
        }
        next.push(child);
      }
      node.children = next;
    };
    walk(tree);
  };
}
