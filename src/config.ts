// Cấu hình chung của site. Các tính năng cần server (bình luận, lượt xem) tắt sẵn
// khi chạy localhost; bật lên ở giai đoạn deploy.

/** Bình luận Giscus (GitHub Discussions). Lấy các giá trị tại https://giscus.app */
export const GISCUS = {
  enabled: false,
  repo: '', // ví dụ 'username/personal-website'
  repoId: '',
  category: 'Announcements',
  categoryId: '',
};

/** Bộ đếm lượt xem (Cloudflare Worker + D1). Bật sau khi deploy API. */
export const VIEWS = {
  enabled: false,
  endpoint: '/api/views',
};
