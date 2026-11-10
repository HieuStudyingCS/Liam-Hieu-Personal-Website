import { pathToFileURL } from 'node:url';
import remarkPostLinks from './src/plugins/remark-post-links.mjs';
const { createMarkdownProcessor } = await import(process.cwd() + '/node_modules/@astrojs/markdown-remark/dist/index.js');
const p = await createMarkdownProcessor({ syntaxHighlight: false, remarkPlugins: [remarkPostLinks] });
const md = [
  '[a](./2026-11-08-proximal-gradient-descent/en.md)',
  '[b](../2026-11-08-proximal-gradient-descent/vi.md#ista)',
  '[c](./vi.md)',
  '[d](../khong-ton-tai/en.md)',
  '[e](https://example.com/en.md) [f](#muc) [g](./assets/image.png)',
  '[h][ref]\n\n[ref]: ../2026-11-08-proximal-gradient-descent/en.md',
].join('\n\n');
const r = await p.render(md, { fileURL: pathToFileURL(process.cwd() + '/src/content/blog/2026-11-07-coordinate-descent/en.md') });
console.log(r.code);
