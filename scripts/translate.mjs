// Tạo bản dịch cho một bài: sao chép frontmatter + nội dung sang ngôn ngữ còn lại.
//   npm run translate 2026-11-05-bayesian-optimization-101          (en -> vi)
//   npm run translate 2026-11-05-bayesian-optimization-101 -- --to en (vi -> en)
// Công thức, code và ảnh giữ nguyên; bạn chỉ cần dịch phần chữ.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const i = args.indexOf('--to');
const to = i >= 0 ? args.splice(i, 2)[1] : 'vi';
const from = to === 'vi' ? 'en' : 'vi';
const name = (args[0] ?? '').replace(/[\\/]+$/, '');

if (!name) {
  console.error('Thiếu tên thư mục bài. Ví dụ: npm run translate 2026-11-05-bayesian-optimization-101');
  process.exit(1);
}

const dir = fs.existsSync(name) ? name : path.join('src', 'content', 'blog', path.basename(name));
const src = path.join(dir, `${from}.md`);
const dst = path.join(dir, `${to}.md`);

if (!fs.existsSync(src)) {
  console.error(`Không tìm thấy ${src}`);
  process.exit(1);
}
if (fs.existsSync(dst)) {
  console.error(`Đã có ${dst}, không ghi đè.`);
  process.exit(1);
}

let text = fs.readFileSync(src, 'utf8');
// Bản dịch bắt đầu ở trạng thái nháp
text = text.replace(/^draft:\s*\w+\s*$/m, 'draft: true');
if (!/^draft:/m.test(text)) text = text.replace(/^---\s*\n/, '---\ndraft: true\n');
const note = to === 'vi' ? '<!-- TODO: dịch nội dung bên dưới sang tiếng Việt -->' : '<!-- TODO: translate the content below to English -->';
text = text.replace(/^(---[\s\S]*?\n---\s*\n)/, `$1\n${note}\n\n`);

fs.writeFileSync(dst, text);
console.log(`Đã tạo ${dst} (draft: true). Dịch xong thì đổi draft: false.`);
