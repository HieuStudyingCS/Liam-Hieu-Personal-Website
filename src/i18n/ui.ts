export const languages = { en: 'English', vi: 'Tiếng Việt' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

const en = {
  'nav.home': 'Home',
  'nav.portfolio': 'Portfolio',
  'nav.publications': 'Publications',
  'nav.blog': 'Blog',
  'nav.news': 'News',
  'nav.menu': 'Menu',
  'skip': 'Skip to content',
  'search.button': 'Search',
  'search.placeholder': 'Search posts…',
  'search.empty': 'No matching posts.',
  'search.hint': 'Type to search titles, tags and text.',
  'theme.toggle': 'Toggle dark mode',
  'lang.switch': 'Đọc bằng tiếng Việt',
  'lang.unavailable': 'Vietnamese version not available yet — go to the Vietnamese blog',

  'home.explore': 'Explore',
  'home.news': 'Latest news',
  'home.posts': 'Recent posts',
  'home.pubs': 'Selected publications',
  'home.allNews': 'All news',
  'home.allPosts': 'All posts',
  'home.allPubs': 'All publications',
  'card.portfolio': 'Background, education, projects and the tools I use.',
  'card.publications': 'Papers, preprints and their code.',
  'card.blog': 'My blogs.',
  'btn.email': 'Email',
  'btn.cv': 'CV',

  'portfolio.title': 'Portfolio',
  'portfolio.about': 'About',
  'portfolio.interests': 'Research interests',
  'portfolio.education': 'Education',
  'portfolio.experience': 'Experience',
  'portfolio.activities': 'Activities & Leadership',
  'portfolio.awards': 'Awards',
  'portfolio.projects': 'Projects',
  'portfolio.stack': 'Tech stack',
  'portfolio.pubs': 'Publications',
  'present': 'Present',
  'proj.all': 'All',
  'proj.research': 'Research',
  'proj.competition': 'Competition',
  'proj.self-study': 'Self-study',
  'proj.personal': 'Personal',
  'proj.other': 'Other',

  'pubs.title': 'Publications',
  'pubs.lead': 'Papers and preprints. Links to code and slides where available.',
  'pubs.all': 'All',
  'status.published': 'Published',
  'status.accepted': 'Accepted',
  'status.preprint': 'Preprint',
  'status.under-review': 'Under review',

  'blog.title': 'Blog',
  'blog.lead': 'Notes on black-box optimization, Bayesian optimization and evolution strategies.',
  'blog.minRead': 'min read',
  'blog.views': 'views',
  'blog.toc': 'Contents',
  'blog.updated': 'Updated',
  'blog.allTags': 'All',
  'blog.related': 'Related posts',
  'blog.cite': 'Cite this post',
  'blog.copy': 'Copy',
  'blog.copied': 'Copied',
  'blog.series': 'Series',
  'blog.prev': 'Previous',
  'blog.next': 'Next',
  'blog.otherLang': 'Also show posts in Vietnamese',
  'blog.translationAvailable': 'Đọc bản tiếng Việt',
  'blog.taggedWith': 'Posts tagged',
  'blog.empty': 'No posts yet.',
  'blog.comments': 'Comments',
  'blog.backToTop': 'Back to top',
  'blog.allPosts': 'All posts',

  'news.title': 'News',
  'news.lead': 'Milestones, papers, awards and what I am learning.',
  'news.all': 'All',
  'news.type.paper': 'Paper',
  'news.type.award': 'Award',
  'news.type.education': 'Education',
  'news.type.talk': 'Talk',
  'news.type.project': 'Project',
  'news.type.life': 'Life',

  'footer.rss': 'RSS',
  'footer.built': 'Built with Astro',
  '404.title': 'Page not found',
  '404.text': 'The page you are looking for does not exist or has moved.',
  '404.home': 'Back to home',
};

type Dict = Record<keyof typeof en, string>;

const vi: Dict = {
  'nav.home': 'Trang chủ',
  'nav.portfolio': 'Portfolio',
  'nav.publications': 'Publications',
  'nav.blog': 'Blog',
  'nav.news': 'Tin tức',
  'nav.menu': 'Menu',
  'skip': 'Chuyển đến nội dung',
  'search.button': 'Tìm kiếm',
  'search.placeholder': 'Tìm bài viết…',
  'search.empty': 'Không tìm thấy bài phù hợp.',
  'search.hint': 'Gõ để tìm theo tiêu đề, tag và nội dung.',
  'theme.toggle': 'Bật/tắt chế độ tối',
  'lang.switch': 'Read in English',
  'lang.unavailable': 'Chưa có bản tiếng Anh — chuyển đến blog tiếng Anh',

  'home.explore': 'Khám phá',
  'home.news': 'Tin mới',
  'home.posts': 'Bài viết mới',
  'home.pubs': 'Publications tiêu biểu',
  'home.allNews': 'Tất cả tin',
  'home.allPosts': 'Tất cả bài viết',
  'home.allPubs': 'Tất cả publications',
  'card.portfolio': 'Học vấn, dự án và công cụ mình sử dụng.',
  'card.publications': 'Bài báo, preprint và mã nguồn.',
  'card.blog': 'Các bài viết cá nhân.',
  'btn.email': 'Email',
  'btn.cv': 'CV',

  'portfolio.title': 'Portfolio',
  'portfolio.about': 'Giới thiệu',
  'portfolio.interests': 'Hướng nghiên cứu',
  'portfolio.education': 'Học vấn',
  'portfolio.experience': 'Kinh nghiệm',
  'portfolio.activities': 'Hoạt động ngoại khoá & Lãnh đạo',
  'portfolio.awards': 'Giải thưởng',
  'portfolio.projects': 'Dự án',
  'portfolio.stack': 'Công nghệ',
  'portfolio.pubs': 'Publications',
  'present': 'Hiện tại',
  'proj.all': 'Tất cả',
  'proj.research': 'Nghiên cứu',
  'proj.competition': 'Cuộc thi',
  'proj.self-study': 'Tự học',
  'proj.personal': 'Cá nhân',
  'proj.other': 'Khác',

  'pubs.title': 'Publications',
  'pubs.lead': 'Bài báo và preprint, kèm mã nguồn và slide nếu có.',
  'pubs.all': 'Tất cả',
  'status.published': 'Đã xuất bản',
  'status.accepted': 'Được nhận',
  'status.preprint': 'Preprint',
  'status.under-review': 'Đang phản biện',

  'blog.title': 'Blog',
  'blog.lead': 'Ghi chép về black-box optimization, Bayesian optimization và evolution strategies.',
  'blog.minRead': 'phút đọc',
  'blog.views': 'lượt xem',
  'blog.toc': 'Mục lục',
  'blog.updated': 'Cập nhật',
  'blog.allTags': 'Tất cả',
  'blog.related': 'Bài liên quan',
  'blog.cite': 'Trích dẫn bài này',
  'blog.copy': 'Sao chép',
  'blog.copied': 'Đã chép',
  'blog.series': 'Chuỗi bài',
  'blog.prev': 'Bài trước',
  'blog.next': 'Bài sau',
  'blog.otherLang': 'Hiện cả bài tiếng Anh',
  'blog.translationAvailable': 'Read in English',
  'blog.taggedWith': 'Bài viết với tag',
  'blog.empty': 'Chưa có bài viết.',
  'blog.comments': 'Bình luận',
  'blog.backToTop': 'Lên đầu trang',
  'blog.allPosts': 'Tất cả bài viết',

  'news.title': 'Tin tức',
  'news.lead': 'Các mốc học tập, bài báo, giải thưởng và những gì mình đang học.',
  'news.all': 'Tất cả',
  'news.type.paper': 'Bài báo',
  'news.type.award': 'Giải thưởng',
  'news.type.education': 'Học tập',
  'news.type.talk': 'Báo cáo',
  'news.type.project': 'Dự án',
  'news.type.life': 'Cuộc sống',

  'footer.rss': 'RSS',
  'footer.built': 'Xây dựng bằng Astro',
  '404.title': 'Không tìm thấy trang',
  '404.text': 'Trang bạn tìm không tồn tại hoặc đã được chuyển đi.',
  '404.home': 'Về trang chủ',
};

export const ui: Record<Lang, Dict> = { en, vi };
export type UIKey = keyof Dict;

export function useTranslations(lang: Lang) {
  return (key: UIKey): string => ui[lang][key] ?? ui.en[key];
}

export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'vi' : 'en');

/** Thêm tiền tố ngôn ngữ: localize('/blog', 'vi') -> '/vi/blog' */
export function localize(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
}

/** Bỏ tiền tố ngôn ngữ: '/vi/blog' -> '/blog' */
export function stripLang(pathname: string): string {
  const stripped = pathname.replace(/^\/vi(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

export type I18nText = string | { en: string; vi?: string } | undefined | null;

/** Lấy văn bản theo ngôn ngữ, rơi về tiếng Anh nếu thiếu bản dịch */
export function pick(value: I18nText, lang: Lang): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return (lang === 'vi' ? value.vi : value.en) ?? value.en ?? '';
}

/** "2025-11" -> "Nov 2025" (en) / "11/2025" (vi); "2025" -> "2025" */
export function formatYearMonth(ym: string, lang: Lang): string {
  const [y, m] = ym.split('-');
  if (!m) return y ?? ym;
  if (lang === 'vi') return `${m}/${y}`;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[Number(m) - 1] ?? m} ${y}`;
}

export function formatDate(date: Date, lang: Lang, style: 'long' | 'month' = 'long'): string {
  const opts: Intl.DateTimeFormatOptions =
    style === 'month'
      ? { year: 'numeric', month: 'short', timeZone: 'UTC' }
      : { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
  return new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-US', opts).format(date);
}
