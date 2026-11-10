# Personal website — hướng dẫn chỉnh sửa

Website học thuật cá nhân xây bằng [Astro](https://astro.build). Tài liệu này trả lời câu hỏi **"muốn sửa X thì mở file nào"**.

> Mẹo VS Code: bấm **Ctrl + P** rồi gõ tên file (ví dụ `profile.yaml`) để mở nhanh, không cần tìm trong cây thư mục. **Ctrl + Shift + F** để tìm một đoạn chữ trong toàn bộ project.

## 1. Chạy website trên máy

Mở terminal trong VS Code (**Ctrl + `**), đảm bảo đang ở thư mục `personal website`:

```bash
npm install      # chỉ chạy lần đầu, hoặc khi package.json thay đổi
npm run dev      # mở http://localhost:4321
```

Lưu file nào thì trang tự tải lại. Dừng bằng **Ctrl + C**.

## 2. Bản đồ: muốn sửa gì thì mở đâu

Gần như mọi thứ bạn cần sửa nằm trong **hai thư mục**: `src/data/` (thông tin các trang) và `src/content/blog/` (bài viết). Không cần đụng vào code giao diện.

| Muốn sửa | Mở file | Ghi chú |
| --- | --- | --- |
| Tên, đơn vị, câu giới thiệu, bio | `src/data/profile.yaml` | |
| Email, GitHub, LinkedIn, Scholar, ORCID, CV | `src/data/profile.yaml` | Dùng cho cả nút ở trang chủ lẫn chân trang |
| Ảnh đại diện | `public/avatar.jpg` | Ghi đè file này bằng ảnh mới, giữ nguyên tên |
| Hướng nghiên cứu, tech stack | `src/data/profile.yaml` | Mục `interests`, `techStack` |
| Học vấn | `src/data/education.yaml` | |
| Kinh nghiệm nghiên cứu / làm việc | `src/data/experience.yaml` | |
| Hoạt động ngoại khoá (Activities & Leadership) | `src/data/activities.yaml` | Ngày dạng `"2025-11"`, web tự xếp mới nhất lên trên |
| Giải thưởng, học bổng (Awards) | `src/data/awards.yaml` | Ngày dạng `"2026-06"`, `link` = chứng nhận |
| Dự án (trang Portfolio) | `src/data/projects.yaml` | |
| Publications | `src/data/publications.yaml` | |
| News (tin tức, thành tựu) | `src/data/news.yaml` | |
| Bài blog | `src/content/blog/<thư-mục-bài>/en.md`, `vi.md` | Xem mục 4 |
| Chữ trên menu, nút ("Blog", "Mục lục", ...) | `src/i18n/ui.ts` | Có 2 khối: `en` và `vi` |
| Màu sắc, font | `src/styles/global.css` | Khối `:root` ở đầu file |
| Dòng bản quyền, thứ tự link chân trang | `src/components/Footer.astro` | |
| Tên miền khi deploy | `astro.config.mjs` | Dòng `site:` |

## 3. Quy tắc viết file YAML (`src/data/*.yaml`)

YAML là dạng "tên: giá trị", thụt lề bằng **dấu cách** (không dùng Tab). Sai thụt lề là lỗi phổ biến nhất.

**Văn bản hai ngôn ngữ** viết như sau (thiếu `vi` thì trang tiếng Việt dùng bản tiếng Anh):

```yaml
text:
  en: Received the QuantVN Scholarship.
  vi: Nhận học bổng QuantVN.
```

Nếu một câu dùng chung cho cả hai ngôn ngữ, viết thẳng: `venue: "NeurIPS 2026"`.

**Định dạng chữ** trong `news.yaml`, `statement`, `bio`: `**đậm**`, `*nghiêng*`, `[chữ hiện ra](https://link)`. Riêng `statement` có thêm tooltip: `[[từ khóa|giải thích khi rê chuột]]`.

**Mỗi mục trong danh sách cần `id` không trùng** (`news`, `publications`, `projects`, `education`, `experience`, `activities`, `awards`). Gợi ý đặt id theo ngày + vài chữ: `2026-06-quantvn-scholarship`.

**Để trống một link thì nút đó tự ẩn**: `scholar: ""`.

**Muốn xuống dòng** (ví dụ `details` trong `education.yaml`): viết `|-` rồi xuống dòng, mỗi dòng thụt vào thêm 2 dấu cách. Mỗi dòng sẽ hiện thành một dòng trên web.

```yaml
details:
  en: |-
    GPA: 8.67/10
    Relevant coursework: Linear Algebra (9.6), Calculus (9.8)
  vi: |-
    GPA: 8.67/10
    Các môn học liên quan: Đại số tuyến tính (9.6), Giải tích (9.8)
```

Chuỗi trong dấu ngoặc kép `"..."` luôn hiện thành một dòng duy nhất, dù bạn có xuống dòng trong file.

Nếu lưu file mà terminal báo lỗi đỏ, đọc dòng có tên file và số dòng — thường là thiếu dấu cách thụt lề, thiếu `id`, hoặc ngày sai định dạng (phải là `YYYY-MM-DD`).

### Ví dụ: thêm một tin vào News

Mở `src/data/news.yaml`, chép một khối có sẵn, sửa lại. Thứ tự trong file không quan trọng — trang tự sắp xếp theo ngày, mới nhất ở trên.

```yaml
- id: 2026-12-paper-accepted
  date: 2026-12-01
  type: paper            # paper | award | education | talk | project | life
  text:
    en: Our paper was accepted at **ABC 2027**.
    vi: Bài báo được nhận tại **ABC 2027**.
```

Chỉ biết tháng thì ghi ngày `01`; trang News chỉ hiện tháng và năm.

### Ví dụ: thêm một publication

```yaml
- id: lth2027abc
  title: "Tên bài báo"
  authors: ["Le Trong Hieu", "Coauthor A"]   # tên khớp authorNames trong profile.yaml sẽ được in đậm
  venue: "ABC Conference 2027"
  venueShort: "ABC 2027"                     # hiện thành huy hiệu
  year: 2027
  status: accepted                           # published | accepted | preprint | under-review
  selected: true                             # true = hiện ở trang chủ
  links:
    arxiv: https://arxiv.org/abs/...
    code: https://github.com/...
  bibtex: |-
    @inproceedings{lth2027abc, ...}
```

### Ví dụ: thêm một dự án

```yaml
- id: cma-es-from-scratch
  title:
    en: CMA-ES from scratch
    vi: Cài đặt CMA-ES từ đầu
  description:
    en: One or two sentences.
    vi: Một hai câu mô tả.
  category: personal       # research | competition | self-study | personal | other (dùng cho bộ lọc)
  year: 2026
  tags: [Python, NumPy]
  image: /projects/cma-es.png   # tuỳ chọn: đặt ảnh ở public/projects/cma-es.png
  links:
    code: https://github.com/HieuStudyingCS/...
```

## 4. Viết và đăng bài blog

```bash
npm run new "Tiêu đề bài viết"                 # tạo bản tiếng Anh (en.md)
npm run new "Tiêu đề bài viết" -- --lang vi    # tạo bản tiếng Việt (vi.md)
npm run translate <tên-thư-mục-bài>             # tạo vi.md từ en.md có sẵn để dịch
```

Lệnh tạo thư mục `src/content/blog/<ngày>-<slug>/` chứa file bài viết với `draft: true`.

- **Ảnh**: đặt ngay trong thư mục bài, chèn bằng `![Chú thích](./ten-anh.png)`.
- **Ảnh bìa / thumbnail**: đặt `cover.png` trong thư mục bài, bỏ dấu `#` ở dòng `cover:` trong phần đầu bài.
- **Toán**: `$x^2$` trong dòng, `$$ ... $$` cho công thức riêng một dòng.
- **Mục lục bên trái** tự lấy từ các tiêu đề `##` và `###`.
- **Chú thích cuối trang**: `câu văn[^1]` rồi ở dưới `[^1]: Nội dung chú thích.`
- **Trích dẫn tài liệu**: cuối bài đặt tiêu đề `## References` (hoặc `## Tài liệu tham khảo`) và ngay dưới là danh sách đánh số `1. ...`, `2. ...`. Trong bài viết `[4]`, `[1, 3]` hoặc `[2–4]` là thành link nhảy xuống đúng tài liệu, rê chuột thấy tên tài liệu. Số không có trong danh sách được giữ nguyên là chữ; khoảng số như [0, 1] nên viết trong công thức `$[0, 1]$`.
- **Link sang bài khác**: trỏ tới file của bài đó, ví dụ `[Proximal Gradient Descent](../2026-11-08-proximal-gradient-descent/en.md)` hoặc `vi.md` cho bản tiếng Việt, có thể thêm `#tên-mục`. Khi chạy, link tự đổi thành địa chỉ trang `/blog/...` hoặc `/vi/blog/...`; link tới bài không tồn tại sẽ được báo trong terminal. Bài đích còn `draft: true` thì link chỉ chạy khi `npm run dev`.
- **Xuất bản**: đổi `draft: false`. Bài nháp chỉ hiện khi chạy `npm run dev`.

Phần đầu bài (frontmatter):

```yaml
---
title: "Tiêu đề"
description: "Một câu tóm tắt, hiện ở danh sách bài"
pubDate: 2026-11-20
updatedDate: 2026-11-22                # tuỳ chọn
tags: [bayesian optimization, gaussian process]
series: "Black-box Optimization 101"   # tuỳ chọn: gom bài thành chuỗi
cover: ./cover.png                     # tuỳ chọn
draft: false
---
```

`en.md` và `vi.md` trong cùng một thư mục là hai bản của cùng một bài; nút **EN / VI** sẽ nối chúng với nhau. Bài chỉ có một bản vẫn đăng bình thường.

## 5. Cấu trúc toàn bộ thư mục

```text
personal website/
├── src/
│   ├── data/                 ← THÔNG TIN CÁC TRANG (sửa thường xuyên)
│   │   ├── profile.yaml      tên, bio, link liên hệ, hướng nghiên cứu, tech stack
│   │   ├── news.yaml         tin tức
│   │   ├── publications.yaml
│   │   ├── projects.yaml
│   │   ├── education.yaml
│   │   ├── experience.yaml   kinh nghiệm nghiên cứu
│   │   ├── activities.yaml   hoạt động ngoại khoá & lãnh đạo
│   │   └── awards.yaml       giải thưởng, học bổng
│   ├── content/blog/         ← BÀI VIẾT (sửa thường xuyên), mỗi bài một thư mục
│   ├── i18n/ui.ts            chữ giao diện tiếng Anh / tiếng Việt
│   ├── styles/global.css     màu, font, bố cục
│   ├── components/           các mảnh giao diện: Header, Footer, mục lục, ô tìm kiếm...
│   ├── views/                nội dung từng trang (Home, Portfolio, Publications, News, Blog)
│   ├── layouts/              khung chung của trang và của bài viết
│   ├── pages/                đường dẫn URL (/, /blog, /vi/...) — thường không cần sửa
│   ├── content.config.ts     quy định các trường hợp lệ trong YAML và bài viết
│   └── config.ts             bật/tắt bình luận, bộ đếm lượt xem (dùng khi deploy)
├── public/                   file dùng nguyên trạng: avatar.jpg, favicon.svg, ảnh dự án
├── scripts/                  lệnh npm run new / npm run translate
├── astro.config.mjs          cấu hình Astro, tên miền (site)
└── package.json              danh sách thư viện và các lệnh npm
```

Không cần (và không nên) sửa: `node_modules/`, `.astro/`, `package-lock.json` — chúng do npm và Astro tự sinh ra.

## 6. Các lệnh khác

| Lệnh | Việc làm |
| --- | --- |
| `npm run build` | Build bản tĩnh vào `dist/`, giống khi deploy; báo lỗi nếu nội dung sai định dạng |
| `npm run preview` | Xem bản đã build tại localhost |
| `npm run check` | Kiểm tra lỗi kiểu dữ liệu |

Trước khi deploy, nên chạy `npm run build` một lần cho chắc.

## 7. Hình tương tác (widget) trong bài viết

Chèn một dòng HTML vào bài `.md`, đặt trên một dòng riêng, có dòng trống trước và sau:

```html
<div data-widget="convex-conjugate"></div>
```

Tên trong `data-widget` là tên file trong `src/widgets/` (bỏ `.js`). Trang chỉ tải code của widget khi bài có dùng nó.

- Phải viết đủ cặp thẻ `<div ...></div>`. Viết kiểu `<div ... />` sẽ nuốt mất phần nội dung phía sau.
- Tên viết sai thì trong bài hiện một khung báo "Không tìm thấy widget".
- Mỗi widget có thể nhận thêm tuỳ chọn qua `data-...`. Các tuỳ chọn được ghi ở đầu file của widget đó. Ví dụ:

```html
<div data-widget="convex-conjugate" data-fn="abs" data-y="0.6"></div>
```

Bài viết tiếng Việt nằm trong `en.md` thì thêm `data-lang="vi"` để chữ trong widget là tiếng Việt (mặc định widget theo ngôn ngữ của trang).

**Widget đang có**

| Tên | Nội dung | Tuỳ chọn |
| --- | --- | --- |
| `convex-conjugate` | Hàm liên hợp t\*(y) = sup(z·y − t(z)) của ½z², \|z\|, eᶻ | `data-fn`, `data-fns`, `data-y`, `data-lang` |
| `lasso-projection` | Một bước Coordinate Descent cho Lasso: hình chiếu của r⁽ʲ⁾ lên xⱼ bị kéo lùi λ/zⱼ, vùng βⱼ = 0 | `data-lambda`, `data-r`, `data-z`, `data-lang` |

**Thêm widget mới**: tạo file `src/widgets/<ten-widget>.js` có dạng

```js
export default function mount(root) {
  // root là thẻ <div data-widget="ten-widget"> trong bài: vẽ mọi thứ vào đây
}
```

Khung viền, nút, thanh trượt, ô số liệu và chú giải dùng chung các class `.w-*` trong `src/styles/global.css`, mục "Widget". Đổi màu các đường ở biến `--w-series-1`, `--w-series-2`, `--w-series-3` (mỗi biến có một giá trị cho nền sáng và một cho nền tối).
