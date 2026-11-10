import remarkMath from 'remark-math';
import remarkCitations from './src/plugins/remark-citations.mjs';
const { createMarkdownProcessor } = await import(process.cwd() + '/node_modules/@astrojs/markdown-remark/dist/index.js');
const p = await createMarkdownProcessor({ syntaxHighlight: false, remarkPlugins: [remarkMath, remarkCitations] });
const md = `Câu có trích dẫn [4] và [1, 3] và [2–4].

*(Hình ảnh này được lấy từ [4])*

Không đổi: [9], khoảng [0, 1], công thức $x_{[1]}$, code \`a[2]\`, link [[3]](https://x.y).

<details>
<summary>Ẩn</summary>

Bên trong details [2].

</details>

## References
1. [Subgradient Methods](https://web.stanford.edu/a.pdf)
2. [Proximal Gradient Descent (and Acceleration)](https://www.stat.cmu.edu/b.pdf) [1]
3. [Coordinate Descent Algorithms](https://arxiv.org/html/1502.04759v1)
4. [Convex Optimization](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf)
`;
const r = await p.render(md);
console.log(r.code);
