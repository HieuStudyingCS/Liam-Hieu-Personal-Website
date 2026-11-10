// Tạo bài viết mới.
//   npm run new "Tiêu đề bài viết"            -> tạo en.md
//   npm run new "Tiêu đề bài viết" -- --lang vi -> tạo vi.md
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const i = args.indexOf('--lang');
const lang = i >= 0 ? args.splice(i, 2)[1] : 'en';
const title = args.join(' ').trim();

if (!title) {
  console.error('Thiếu tiêu đề. Ví dụ: npm run new "Bayesian Optimization 101"');
  process.exit(1);
}
if (!['en', 'vi'].includes(lang)) {
  console.error('--lang chỉ nhận en hoặc vi');
  process.exit(1);
}

const slug = title
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/Đ/g, 'D')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`; // theo giờ máy
const dir = path.join('src', 'content', 'blog', `${date}-${slug}`);
const file = path.join(dir, `${lang}.md`);

if (fs.existsSync(file)) {
  console.error(`Đã có ${file}`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(
  file,
  `---
title: "${title.replace(/"/g, '\\"')}"
description: ""
pubDate: ${date}
tags: []
# series: "Black-box Optimization 101"
# cover: ./cover.png
draft: true
---

## ${lang === 'vi' ? 'Mở đầu' : 'Introduction'}

`,
);
console.log(`Đã tạo ${file}`);
console.log('Viết xong thì đổi draft: false, rồi git push.');
