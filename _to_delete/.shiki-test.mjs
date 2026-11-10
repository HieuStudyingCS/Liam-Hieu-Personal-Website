import { codeToHtml } from 'shiki';
const mono = (type, fg, bg, muted, strong) => ({
  name: `mono-${type}`, type,
  colors: { 'editor.foreground': fg, 'editor.background': bg },
  tokenColors: [
    { settings: { foreground: fg } },
    { scope: ['comment', 'punctuation.definition.comment', 'string.quoted.docstring'], settings: { foreground: muted, fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.logical', 'keyword.operator.word', 'constant.language'], settings: { foreground: strong, fontStyle: 'bold' } },
    { scope: ['string', 'string.quoted', 'constant.character.escape'], settings: { foreground: muted } },
    { scope: ['entity.name.function', 'support.function', 'entity.name.class', 'entity.name.type'], settings: { foreground: strong } },
  ],
});
const html = await codeToHtml('import numpy as np\n# comment\ndef f(x):\n    return "s" + 1', {
  lang: 'python',
  themes: { light: mono('light', '#111111', '#f5f5f5', '#6b6b6b', '#000000'), dark: mono('dark', '#e5e5e5', '#161616', '#9a9a9a', '#ffffff') },
});
console.log(html);
