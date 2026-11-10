import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import yaml from 'js-yaml';

const text = z.union([z.string(), z.object({ en: z.string(), vi: z.string().optional() })]);
const yamlParser = (raw: string) => yaml.load(raw) as Record<string, Record<string, unknown>>;

// ---------- Blog: src/content/blog/<thu-muc-bai>/{en,vi}.md ----------
const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/{en,vi}.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().default(''),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      series: z.string().optional(),
      cover: image().optional(),
      draft: z.boolean().default(false),
    }),
});

// ---------- Thông tin cá nhân: src/data/profile.yaml (khóa "me") ----------
const profile = defineCollection({
  loader: file('src/data/profile.yaml', { parser: yamlParser }),
  schema: z.object({
    name: text,
    shortName: z.string().optional(),
    authorNames: z.array(z.string()).default([]),
    role: text,
    affiliation: text,
    affiliationUrl: z.string().optional(),
    tagline: text,
    statement: text,
    bio: text,
    avatar: z.string().optional(),
    email: z.string().optional(),
    github: z.string().optional(),
    scholar: z.string().optional(),
    orcid: z.string().optional(),
    linkedin: z.string().optional(),
    cv: z.string().optional(),
    interests: z.array(z.object({ name: text, tag: z.string().optional() })).default([]),
    techStack: z.array(z.object({ group: text, items: z.array(text) })).default([]),
  }),
});

const education = defineCollection({
  loader: file('src/data/education.yaml', { parser: yamlParser }),
  schema: z.object({
    school: text,
    url: z.string().optional(),
    degree: text,
    start: z.union([z.string(), z.number()]).transform(String),
    end: text.optional(),
    details: text.optional(),
  }),
});

const experience = defineCollection({
  loader: file('src/data/experience.yaml', { parser: yamlParser }),
  schema: z.object({
    role: text,
    org: text,
    url: z.string().optional(),
    start: text,
    end: text.optional(),
    bullets: z.array(text).default([]),
  }),
});

// Tháng dạng "YYYY-MM" (hoặc "YYYY"); web tự hiển thị "Nov 2025" / "11/2025"
const yearMonth = z.union([z.string(), z.number()]).transform(String).pipe(z.string().regex(/^\d{4}(-\d{2})?$/, 'Dùng dạng YYYY-MM, ví dụ 2025-11'));

const activities = defineCollection({
  loader: file('src/data/activities.yaml', { parser: yamlParser }),
  schema: z.object({
    role: text,
    org: text,
    url: z.string().optional(),
    start: yearMonth,
    end: z.union([yearMonth, z.literal('')]).optional(),
    bullets: z.array(text).default([]),
  }),
});

const awards = defineCollection({
  loader: file('src/data/awards.yaml', { parser: yamlParser }),
  schema: z.object({
    title: text,
    issuer: text.optional(),
    date: yearMonth,
    link: z.string().optional(),
    note: text.optional(),
  }),
});

const publications = defineCollection({
  loader: file('src/data/publications.yaml', { parser: yamlParser }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    venueShort: z.string().optional(),
    year: z.number(),
    status: z.enum(['published', 'accepted', 'preprint', 'under-review']).default('published'),
    selected: z.boolean().default(false),
    thumbnail: z.string().optional(),
    note: text.optional(),
    links: z
      .object({
        paper: z.string().optional(),
        arxiv: z.string().optional(),
        pdf: z.string().optional(),
        code: z.string().optional(),
        project: z.string().optional(),
        blog: z.string().optional(),
        slides: z.string().optional(),
        poster: z.string().optional(),
      })
      .default({}),
    bibtex: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: file('src/data/projects.yaml', { parser: yamlParser }),
  schema: z.object({
    title: text,
    description: text,
    category: z.enum(['research', 'competition', 'self-study', 'personal', 'other']).default('personal'),
    year: z.number().optional(),
    period: text.optional(),
    award: text.optional(),
    highlights: z.array(text).default([]),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    links: z
      .object({ code: z.string().optional(), demo: z.string().optional(), paper: z.string().optional() })
      .default({}),
  }),
});

const news = defineCollection({
  loader: file('src/data/news.yaml', { parser: yamlParser }),
  schema: z.object({
    date: z.coerce.date(),
    type: z.enum(['paper', 'award', 'education', 'talk', 'project', 'life']).default('life'),
    text: text,
    link: z.string().optional(),
  }),
});

export const collections = { blog, profile, education, experience, activities, awards, publications, projects, news };
