// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkNotionAside from './src/plugins/remark-notion-aside.mjs';
import remarkPostLinks from './src/plugins/remark-post-links.mjs';
import remarkCitations from './src/plugins/remark-citations.mjs';
import remarkDetailsSummary from './src/plugins/remark-details-summary.mjs';

// Bảng màu tô code chỉ gồm đen, trắng và xám (khớp với giao diện đen trắng)
const mono = (type, fg, bg, muted, strong) => ({
  name: `mono-${type}`,
  type,
  colors: { 'editor.foreground': fg, 'editor.background': bg },
  tokenColors: [
    { settings: { foreground: fg } },
    { scope: ['comment', 'punctuation.definition.comment', 'string.quoted.docstring'], settings: { foreground: muted, fontStyle: 'italic' } },
    { scope: ['keyword.control', 'keyword.other', 'keyword.operator.logical', 'keyword.operator.word', 'storage', 'storage.type', 'storage.modifier', 'constant.language'], settings: { foreground: strong, fontStyle: 'bold' } },
    { scope: ['string', 'string.quoted', 'constant.character.escape'], settings: { foreground: muted } },
    { scope: ['entity.name.function', 'support.function', 'entity.name.class', 'entity.name.type'], settings: { foreground: strong } },
  ],
});

export default defineConfig({
  // Đổi thành tên miền thật khi deploy (ví dụ 'https://lehieu.me')
  site: 'https://example.com',
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en-US', vi: 'vi-VN' } } }),
  ],
  markdown: {
    remarkPlugins: [remarkMath, remarkNotionAside, remarkDetailsSummary, remarkPostLinks, remarkCitations],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: {
        light: mono('light', '#111111', '#f5f5f5', '#6b6b6b', '#000000'),
        dark: mono('dark', '#e5e5e5', '#161616', '#9a9a9a', '#ffffff'),
      },
      wrap: false,
    },
  },
});
