/**
 * remark-notion-aside
 * Biến khối callout của Notion (xuất ra Markdown dưới dạng <aside> ... </aside>)
 * thành khung callout có biểu tượng, và vẫn xử lý Markdown + công thức bên trong.
 *
 * Hỗ trợ các dạng:
 *   <aside>
 *   💡 Nội dung có $công thức$ và **chữ đậm**
 *
 *   </aside>
 *
 *   <aside>💡 Nội dung một dòng</aside>
 *
 * Thẻ </aside> thừa (không có thẻ mở) sẽ bị bỏ đi.
 */
const OPEN = /^\s*<aside\b[^>]*>/i;
const CLOSE_ONLY = /^\s*<\/aside>\s*$/i;
const CLOSE_AT_END = /<\/aside>\s*$/i;
const EMOJI = /^\s*(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}])*)\s*/u;
const IMG = /^\s*(<img\b[^>]*>)\s*/i;

export default function remarkNotionAside() {
  const processor = this;

  // Lấy biểu tượng (emoji hoặc ảnh <img>) ở đầu khối, nếu có
  function takeIcon(nodes) {
    const first = nodes[0];
    if (!first) return null;
    if (first.type === 'paragraph' && first.children[0]?.type === 'text') {
      const text = first.children[0];
      const m = text.value.match(EMOJI);
      if (m) {
        text.value = text.value.slice(m[0].length);
        if (text.value === '') first.children.shift();
        if (first.children.length === 0) nodes.shift();
        return { type: 'text', value: m[1] };
      }
    }
    if (first.type === 'paragraph' && first.children[0]?.type === 'html' && IMG.test(first.children[0].value)) {
      const icon = first.children.shift();
      if (first.children.length === 0) nodes.shift();
      return icon;
    }
    if (first.type === 'html' && IMG.test(first.value)) {
      nodes.shift();
      return first;
    }
    return null;
  }

  function makeCallout(inner) {
    const icon = takeIcon(inner);
    const children = [];
    if (icon) {
      children.push({
        type: 'calloutIcon',
        data: { hName: 'span', hProperties: { className: ['callout-icon'], ariaHidden: 'true' } },
        children: [icon],
      });
    }
    children.push({
      type: 'calloutBody',
      data: { hName: 'div', hProperties: { className: ['callout-body'] } },
      children: inner,
    });
    return {
      type: 'callout',
      data: { hName: 'aside', hProperties: { className: ['callout'] } },
      children,
    };
  }

  function walk(parent) {
    const list = parent.children;
    if (!Array.isArray(list)) return;
    for (let i = 0; i < list.length; i++) {
      const node = list[i];

      if (node.type === 'html' && OPEN.test(node.value)) {
        let rest = node.value.replace(OPEN, '');
        const closedHere = CLOSE_AT_END.test(rest);
        if (closedHere) rest = rest.replace(CLOSE_AT_END, '');
        // Phân tích lại phần chữ dính liền sau <aside> như Markdown (gồm cả công thức)
        const inner = rest.trim() ? processor.parse(rest).children : [];

        let end = i; // vị trí node cuối cùng thuộc callout
        if (!closedHere) {
          let j = i + 1;
          while (j < list.length && !(list[j].type === 'html' && CLOSE_ONLY.test(list[j].value))) j++;
          if (j >= list.length) continue; // không tìm thấy </aside>: để nguyên
          inner.push(...list.slice(i + 1, j));
          end = j;
        }
        inner.forEach((child) => walk(child));
        list.splice(i, end - i + 1, makeCallout(inner));
        continue;
      }

      if (node.type === 'html' && CLOSE_ONLY.test(node.value)) {
        list.splice(i, 1); // </aside> thừa
        i--;
        continue;
      }

      walk(node);
    }
  }

  return (tree) => walk(tree);
}
