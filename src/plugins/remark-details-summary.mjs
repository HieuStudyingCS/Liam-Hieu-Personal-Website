/**
 * remark-details-summary
 * Cho phép viết công thức và Markdown trong tiêu đề của khối thu gọn (toggle):
 *
 *   <details>
 *   <summary>Tính chất 1: Hàm $f^*$ là một hàm **lồi**</summary>
 *
 *   Nội dung ...
 *
 *   </details>
 *
 * Markdown coi dòng <summary>...</summary> là HTML thô nên không xử lý $...$ bên trong.
 * Plugin tách phần chữ trong <summary> ra và cho nó đi qua bộ xử lý Markdown + KaTeX như chữ bình thường.
 */
const SUMMARY = /<summary\b([^>]*)>([\s\S]*?)<\/summary>/i;
const NEEDS_MD = /[$*_`[]/;

export default function remarkDetailsSummary() {
  const processor = this;

  const split = (value) => {
    const out = [];
    let rest = value;
    let m;
    while ((m = SUMMARY.exec(rest))) {
      const inner = m[2].trim();
      if (!NEEDS_MD.test(inner)) {
        // Chữ thường: giữ nguyên đoạn này, tìm tiếp phía sau
        out.push({ type: 'html', value: rest.slice(0, m.index + m[0].length) });
        rest = rest.slice(m.index + m[0].length);
        continue;
      }
      const parsed = processor.parse(inner);
      const only = parsed.children.length === 1 && parsed.children[0].type === 'paragraph' ? parsed.children[0] : null;
      out.push({ type: 'html', value: `${rest.slice(0, m.index)}<summary${m[1]}>` });
      out.push(only ? { type: 'paragraph', data: { hName: 'span' }, children: only.children } : { type: 'html', value: inner });
      rest = `</summary>${rest.slice(m.index + m[0].length)}`;
    }
    if (rest) out.push({ type: 'html', value: rest });
    return out;
  };

  const walk = (node) => {
    if (!Array.isArray(node.children)) return;
    const next = [];
    for (const child of node.children) {
      if (child.type === 'html' && SUMMARY.test(child.value)) {
        next.push(...split(child.value));
        continue;
      }
      walk(child);
      next.push(child);
    }
    node.children = next;
  };

  return (tree) => walk(tree);
}
