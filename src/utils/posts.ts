import { getCollection, type CollectionEntry } from 'astro:content';
import { localize, type Lang } from '../i18n/ui';
import { slugify, stripMarkdown } from './text';

export type Post = CollectionEntry<'blog'>;

/** id có dạng "<thu-muc-bai>/<lang>" */
export const langOf = (p: Post): Lang => (p.id.endsWith('/vi') ? 'vi' : 'en');
export const slugOf = (p: Post): string => {
  const parts = p.id.split('/');
  return parts[parts.length - 2] ?? parts[0];
};
export const postUrl = (p: Post): string => localize(`/blog/${slugOf(p)}`, langOf(p));
export const tagSlug = (tag: string): string => slugify(tag);
export const tagUrl = (tag: string, lang: Lang): string => localize(`/blog/tags/${tagSlug(tag)}`, lang);

/** Bài nháp chỉ hiện khi chạy `npm run dev`; bài có ngày tương lai chỉ hiện từ ngày đó */
function isVisible(p: Post): boolean {
  if (import.meta.env.DEV) return true;
  if (p.data.draft) return false;
  return p.data.pubDate.valueOf() <= Date.now();
}

export async function getPosts(lang?: Lang): Promise<Post[]> {
  const all = await getCollection('blog', isVisible);
  return all
    .filter((p) => !lang || langOf(p) === lang)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function readingTime(p: Post): number {
  const words = stripMarkdown(p.body ?? '').split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function findTranslation(p: Post, all: Post[]): Post | undefined {
  return all.find((q) => q.id !== p.id && slugOf(q) === slugOf(p));
}

export function relatedPosts(p: Post, pool: Post[], n = 3): Post[] {
  const tags = new Set(p.data.tags.map(tagSlug));
  return pool
    .filter((q) => q.id !== p.id)
    .map((q) => ({ q, score: q.data.tags.filter((t) => tags.has(tagSlug(t))).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.q.data.pubDate.valueOf() - a.q.data.pubDate.valueOf())
    .slice(0, n)
    .map((x) => x.q);
}

export function seriesNeighbors(p: Post, pool: Post[]): { list: Post[]; prev?: Post; next?: Post } {
  if (!p.data.series) return { list: [] };
  const list = pool
    .filter((q) => q.data.series === p.data.series)
    .sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
  const i = list.findIndex((q) => q.id === p.id);
  return { list, prev: i > 0 ? list[i - 1] : undefined, next: i >= 0 ? list[i + 1] : undefined };
}

export function allTags(posts: Post[]): { tag: string; slug: string; count: number }[] {
  const map = new Map<string, { tag: string; slug: string; count: number }>();
  for (const p of posts) {
    for (const t of p.data.tags) {
      const s = tagSlug(t);
      const cur = map.get(s);
      if (cur) cur.count += 1;
      else map.set(s, { tag: t, slug: s, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
