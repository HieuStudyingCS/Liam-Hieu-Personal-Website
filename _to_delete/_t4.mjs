import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkNotionAside from './src/plugins/remark-notion-aside.mjs';
import remarkDetailsSummary from './src/plugins/remark-details-summary.mjs';
import remarkCitations from './src/plugins/remark-citations.mjs';
const { createMarkdownProcessor } = await import(process.cwd() + '/node_modules/@astrojs/markdown-remark/dist/index.js');
const p = await createMarkdownProcessor({ syntaxHighlight: false, remarkPlugins: [remarkMath, remarkNotionAside, remarkDetailsSummary, remarkCitations], rehypePlugins: [rehypeKatex] });
const md = `<details>
    <summary>Tính chất 1: Hàm $f^*$ là một hàm **lồi** [1]</summary>

Ta có thể thấy $f^*$ là một hàm lồi.

</details>

<details><summary>Separable và block-separable là gì?</summary>

Nội dung.

</details>

## References
1. Boyd
`;
const r = await p.render(md);
console.log(r.code.replace(/<span class="katex-html"[\s\S]*?<\/span><\/span><\/span>/g, '[katex-html]').slice(0, 1500));
