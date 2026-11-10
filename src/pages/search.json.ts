import { getPosts, langOf, postUrl } from '../utils/posts';
import { stripMarkdown } from '../utils/text';

// Chỉ mục tìm kiếm tĩnh, sinh lúc build (và mỗi lần tải trong chế độ dev)
export async function GET() {
  const posts = await getPosts();
  const docs = posts.map((p) => ({
    title: p.data.title,
    description: p.data.description,
    tags: p.data.tags,
    lang: langOf(p),
    url: postUrl(p),
    date: p.data.pubDate.toISOString().slice(0, 10),
    text: stripMarkdown(p.body ?? '').slice(0, 6000),
  }));
  return new Response(JSON.stringify(docs), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
