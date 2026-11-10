import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getEntry } from 'astro:content';
import { pick } from '../i18n/ui';
import { getPosts, postUrl } from '../utils/posts';

export async function GET(context: APIContext) {
  const profile = (await getEntry('profile', 'me'))!.data;
  const posts = await getPosts('en');
  return rss({
    title: pick(profile.name, 'en'),
    description: pick(profile.tagline, 'en'),
    site: context.site ?? 'https://example.com',
    customData: '<language>en</language>',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      categories: p.data.tags,
      link: postUrl(p),
    })),
  });
}
