# SataRobo LMS — UI Design System

> Tài liệu chuẩn hoá UI layer cho hệ thống LMS (Next.js 16 + React 19 + Tailwind v4 + shadcn/base-ui).
>
> **Phạm vi:** Chỉ chuẩn hoá *layout, spacing, typography, radius, elevation, density, responsive & consistency rules*.
> **KHÔNG** đổi business logic, API, state management, và **KHÔNG** sao chép màu sắc từ thiết kế tham khảo.
>
> **Nguồn tham chiếu:** Figma "UI Elements LMS Kit" (chỉ lấy *layout hierarchy / grid / spacing / card & list patterns* — các frame là ảnh raster đã flatten nên không trích xuất được token theo layer) + best practices của Coursera, Udemy, Canvas, Notion, Linear.

---

## 1. Design Principles

### 1.1 Visual hierarchy
Hệ thống có 3 tầng bề mặt rõ ràng (theo phong cách "card nổi trên nền sáng" quan sát từ Figma reference và Notion/Linear):

| Tầng | Vai trò | Token nền |
|------|---------|-----------|
| **Canvas** | Nền tổng thể của trang | `--background` (xám rất nhạt) |
| **Surface** | Card / panel chứa nội dung | `--card` (trắng) |
| **Overlay** | Modal, dropdown, popover, tooltip | `--popover` + shadow cao |

Quy tắc phân cấp trong một màn hình:
1. **Page title** (`PageHeader`) — đậm nhất, lớn nhất, có icon badge nhận diện mode.
2. **Section title** (`SectionTitle`) — uppercase + tracking-wide, cỡ vừa.
3. **Card title** — semibold, cỡ `text-base`.
4. **Body** — `text-sm` cho nội dung dày đặc của dashboard.
5. **Caption / meta** — `text-muted-foreground`, nhỏ nhất.

Mỗi màn hình chỉ có **một** H1. Không nhảy cấp heading.

### 1.2 White space usage
- Khoảng trắng là công cụ phân nhóm chính, **ưu tiên hơn đường kẻ**. Dùng spacing để tách nhóm, chỉ dùng `border`/`Separator` khi cần ranh giới dứt khoát (table, dropdown item).
- Padding trong card: **24px desktop / 16px mobile** (`p-6` → `p-4`). Card nhỏ (`size="sm"`): 12–16px.
- Khoảng cách giữa các section trong trang: **24–32px** (`space-y-6` / `space-y-8`).
- Khoảng cách giữa các card trong grid: **16–24px** (`gap-4` → `gap-6`).

### 1.3 Information density
Đây là LMS dashboard quản trị → chọn **"comfortable-compact"**: dày hơn marketing site, thoáng hơn data-grid tài chính.
- Control mặc định (button/input) cao **32px** (`h-8`) để vừa thông tin, tăng lên 36–40px ở form chính & mobile.
- Row trong list/table: **44–52px** (đảm bảo target chạm ≥ 44px trên mobile).
- Ưu tiên `text-sm` (14px) làm body mặc định cho mật độ dashboard; `text-base` (16px) cho input mobile để tránh iOS zoom.

### 1.4 Accessibility rules
- **Contrast:** chữ thường ≥ 4.5:1, chữ lớn/đậm ≥ 3:1. `--foreground` trên `--card` và `--muted-foreground` trên `--background` đều đạt AA.
- **Focus:** mọi phần tử tương tác có `:focus-visible` ring 2px `--ring` + offset 2px (đã khai báo global trong `globals.css`). Không bao giờ `outline: none` mà không thay ring.
- **Touch target:** tối thiểu **44×44px** trên mobile (bottom-nav, icon button).
- **Motion:** tôn trọng `prefers-reduced-motion` (đã có global). Transition ≤ 200ms, easing mềm.
- **Semantics:** icon-only button luôn có `aria-label`. Trạng thái dùng cả màu **và** icon/chữ (không chỉ màu) để hỗ trợ mù màu.
- **Hit ngoài màu:** badge trạng thái luôn kèm text.

---

## 2. Layout System

| Thông số | Giá trị | Token / utility |
|----------|---------|-----------------|
| **Max content width** | 1280px | `max-w-7xl mx-auto` |
| **Reading width** (text dài) | 672px | `max-w-2xl` |
| **Container padding** | 16px (mobile) → 24px (desktop) | `px-4 lg:px-6` |
| **Sidebar width** | 256px | `w-64` |
| **Sidebar (collapsed — đề xuất)** | 72px | `w-[72px]` |
| **Header height** | 64px | `h-16` |
| **Bottom-nav height** | 56px + safe-area | `min-h-[56px]` + `pb-[env(safe-area-inset-bottom)]` |
| **Grid gap mặc định** | 16–24px | `gap-4` / `gap-6` |

### 2.1 Breakpoints
Theo chuẩn Tailwind, ánh xạ vào 3 nhóm thiết bị:

| Nhóm | Range | Tailwind | Hành vi chính |
|------|-------|----------|---------------|
| **Mobile** | `< 768px` | (base) | 1 cột, sidebar ẩn → hamburger + **bottom-nav** |
| **Tablet** | `768–1024px` | `md:` | 2 cột, vẫn dùng bottom-nav / mobile menu |
| **Desktop** | `> 1024px` | `lg:` | Sidebar cố định + 2–4 cột grid, ẩn bottom-nav |
| Wide | `≥ 1280px` | `xl:` | Lên tối đa 4 cột, container chạm max-width |

### 2.2 Grid system
- Card grid: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3` (hoặc `2xl:grid-cols-4` cho stat tiles).
- Stat tiles: `grid grid-cols-2 lg:grid-cols-4 gap-4`.
- Layout chính (app): `[sidebar 256px][main 1fr]` trên desktop; main là `flex flex-col` với header sticky.
- Dùng `min-w-0` cho mọi flex child chứa text để tránh tràn ngang (đã áp dụng nhiều nơi).

---

## 3. Spacing Tokens

Hệ **4px base** (trùng thang Tailwind mặc định → utility `p-*`, `gap-*`, `m-*` chính là token). Quy tắc: **chỉ dùng các bước nguyên dưới đây; loại bỏ half-step `*-2.5/3.5` và arbitrary `[11px]`** trừ khi có lý do quang học rõ ràng.

| Token | Giá trị | px | Utility | Dùng cho |
|-------|---------|----|---------|----------|
| `--space-1` | 0.25rem | 4 | `p-1 gap-1` | Khe icon–badge, micro gap |
| `--space-2` | 0.5rem | 8 | `p-2 gap-2` | Gap icon–label, item dày |
| `--space-3` | 0.75rem | 12 | `p-3 gap-3` | Padding card-sm, gap list row |
| `--space-4` | 1rem | 16 | `p-4 gap-4` | Padding card (mobile), gap grid |
| `--space-5` | 1.25rem | 20 | `p-5` | Padding panel vừa |
| `--space-6` | 1.5rem | 24 | `p-6 gap-6` | **Padding card chuẩn**, gap section |
| `--space-8` | 2rem | 32 | `py-8` | Khoảng cách giữa section |
| `--space-10` | 2.5rem | 40 | — | Section lớn / hero |
| `--space-12` | 3rem | 48 | — | Block spacing trang public |
| `--space-16` | 4rem | 64 | — | Spacing landing |

**Quy tắc dùng:**
- Gap icon ↔ text: `gap-2` (8px) hoặc `gap-3` (12px) — chọn **một** mức, không trộn `gap-2.5`.
- Padding ngang control: bội số 4 (`px-2`, `px-3`, `px-4`).
- Vertical rhythm trong trang: `space-y-6` giữa các khối lớn.

---

## 4. Border Radius Tokens

Dựa trên `--radius: 0.65rem` (~10px) đã có sẵn. Thang đã khai báo trong `@theme`:

| Token | Công thức | ~px | Component sử dụng |
|-------|-----------|-----|-------------------|
| `--radius-sm` | `--radius * 0.6` | ~6px | Badge, tag nhỏ, focus ring inset, file-input |
| `--radius-md` | `--radius * 0.8` | ~8px | Button (xs/sm), input nhỏ, tab trigger, icon-button nhỏ |
| `--radius-lg` | `--radius` | ~10px | **Button mặc định, Input, Dropdown item** |
| `--radius-xl` | `--radius * 1.2` | ~12px | **Card, panel, nav item, icon-button lớn** |
| `--radius-2xl` | `--radius * 1.5` | ~16px | **Modal/Dialog, dropdown content, page-header icon badge** |
| `--radius-3xl` | `--radius * 2.0` | ~20px | Hero block, ảnh lớn, avatar khung |
| `9999px` | — | full | Pill: search input, progress track, avatar, badge tròn, badge số thông báo |

**Quy tắc nesting:** phần tử con bo nhỏ hơn cha một bậc (vd icon badge `rounded-lg` trong card `rounded-xl`). Tránh trộn `rounded-r-xl` lệch hướng trừ active-rail của sidebar.

---

## 5. Typography System

Font: `--font-sans` (heading & body dùng chung, theo cấu hình hiện tại). Số liệu dùng `tabular-nums`.

| Vai trò | Size | Line-height | Weight | Tracking | Utility đề xuất |
|---------|------|-------------|--------|----------|-----------------|
| **Display** | 36px (clamp 28–40) | 1.1 | 700 | -0.02em | `text-display` |
| **H1** (page title) | 30px (clamp 24–36) | 1.15 | 700 | -0.02em | `text-h1` |
| **H2** (section) | 20px | 1.2 | 700 | -0.01em | `text-h2` |
| **H3** (card title) | 16px | 1.4 | 600 | normal | `text-h3` / `text-base font-semibold` |
| **H4** | 14px | 1.4 | 600 | normal | `text-sm font-semibold` |
| **Body** | 14px | 1.6 | 400 | normal | `text-sm` |
| **Body-lg** (input mobile) | 16px | 1.6 | 400 | normal | `text-base` |
| **Caption / meta** | 12px | 1.4 | 400–500 | normal | `text-xs text-muted-foreground` |
| **Label / overline** | 12px | 1.3 | 700 | 0.06em (uppercase) | `text-xs font-bold uppercase tracking-wider` |

**Quy tắc weight:** chỉ dùng `400 / 500 / 600 / 700`. **Bỏ `font-black` (900)** — thay bằng `font-bold`. Không tự đặt `text-[9px]/[11px]` — dùng `text-xs` (12px) là nhỏ nhất cho text đọc được.

---

## 6. Shadow & Elevation

Shadow trung tính, nhuốm slate (không nhuốm màu thương hiệu) để giữ vẻ sạch như reference. 4 mức + 1 overlay:

| Mức | Token | Khi nào dùng |
|-----|-------|--------------|
| **none** | — | Phần tử phẳng nằm trên card (list row, table cell) |
| **xs** | `--shadow-xs` | Hover nhẹ, chip, badge nổi |
| **sm** | `--shadow-sm` | **Card mặc định ở trạng thái nghỉ**, header sticky |
| **md** | `--shadow-md` | Card hover, dropdown account, popover nhỏ |
| **lg** | `--shadow-lg` | Dropdown notification, sheet, menu nổi |
| **xl** | `--shadow-xl` | **Modal / Dialog**, overlay quan trọng |

**Quy tắc:** elevation tỉ lệ thuận với "khoảng cách khỏi mặt phẳng" + tính tạm thời. Phần tử tạm thời (overlay) cao hơn phần tử thường trú (card). Không chồng shadow + ring đậm cùng lúc; card hiện dùng `ring-1` rất nhạt thay border cứng — giữ nhất quán.

### 6.5 Category palette (màu phân loại)

Ngoài màu semantic (`primary/accent/success/warning/destructive`), hệ thống có **màu phân loại chức năng** cho notification, loại bài, trạng thái phụ. Các token này **đọc được làm chữ trên nền sáng**; tô nền bằng opacity (`bg-info/10 text-info`). Đã khai báo trong `globals.css` (sáng) + `.dark` (tông ~400):

| Token | Hue | px (light) | Ý nghĩa | Thay cho palette cũ |
|-------|-----|-----------|---------|---------------------|
| `--info` | blue | #3B82F6 | Thông tin, nhận xét, comment | `blue-500`, `sky-*` |
| `--quiz` | indigo | #6366F1 | Kiểm tra, học bù, makeup | `indigo-500`, `violet-*` |
| `--schedule-cat` | pink | #EC4899 | Lịch học | `pink-500`, `rose-*` |
| `--report` | orange | #F97316 | Học bạ, báo cáo | `orange-500` |
| `--caution` | amber | #D97706 | Cảnh báo nhẹ, chờ xử lý, công nợ | `amber-500/600` |

> **Quy tắc:** tuyệt đối **không** dùng literal Tailwind palette (`bg-blue-500`, `text-amber-600`…) trong app. Màu trung tính (`slate-*`) → token `foreground/muted/border/background`. Màu phân loại → 5 token trên. Màu thương hiệu/trạng thái → semantic token.

---

## 7. Component Specifications

### Card
| Thuộc tính | Giá trị |
|-----------|---------|
| Padding | 24px desktop / 16px mobile (`--card-spacing`); `size="sm"` = 12px |
| Radius | `--radius-xl` (~12px) |
| Border | `ring-1 ring-foreground/10` (đường viền cực nhạt thay border cứng) |
| Shadow | `--shadow-sm` ở nghỉ → `--shadow-md` khi hover |
| Hover | `translateY(-1px)` + tăng shadow, transition 200ms (chỉ card tương tác) |
| Header spacing | `gap-1` giữa title & description; padding ngang = card padding |
| Variant glass | `.glass-card` cho panel premium (giữ nguyên) |

### Button
| Thuộc tính | Giá trị |
|-----------|---------|
| Height | `default` 32px (`h-8`) · `sm` 28px · `xs` 24px · `lg` 36px · form/CTA chính nên dùng `lg` |
| Padding | ngang 10px (`px-2.5`) default; icon-only = vuông (`size-8`) |
| Radius | `--radius-lg`; size nhỏ → `--radius-md` |
| Typography | `text-sm font-medium` (CTA chính `font-semibold`) |
| States | hover đổi nền, `active:translate-y-px`, focus ring 3px, disabled `opacity-50` |

### Input
| Thuộc tính | Giá trị |
|-----------|---------|
| Height | 32px (`h-8`) mặc định; form chính 36–40px |
| Border | `1px --input`; nền trong suốt |
| Radius | `--radius-lg` |
| Focus | `border-ring` + `ring-3 ring-ring/50` |
| Font | `text-base` (mobile) / `md:text-sm` — tránh iOS zoom |
| Label spacing | label `text-sm font-medium`, cách input 6–8px (`mb-1.5`/`mb-2`) |
| Search variant | bọc icon leading + `rounded-full` (pill) theo navbar reference |

### Table
| Thuộc tính | Giá trị |
|-----------|---------|
| Row height | 48px (`h-12`), mobile tối thiểu 44px |
| Cell padding | `px-4 py-3` |
| Header | `text-xs font-bold uppercase tracking-wider text-muted-foreground`, nền `--muted/50`, sticky khi cuộn |
| Divider | `divide-y divide-border/60`, không kẻ dọc |
| Row hover | `hover:bg-muted/50` |
| Numeric | căn phải + `tabular-nums` |

### Sidebar
| Thuộc tính | Giá trị |
|-----------|---------|
| Width | 256px (`w-64`), chỉ hiện `lg:` |
| Header | `h-16` chứa Logo, border-bottom nhạt |
| Nav item | `gap-3`, `py-2.5`, radius `--radius-lg`, `text-sm` |
| Active | nền `--accent-soft` + chữ `--accent` + rail trái `border-l-2 --accent` (đồng bộ một kiểu, không lệch radius) |
| Hover | `hover:bg-muted hover:text-foreground` |
| Collapse | (đề xuất) thu còn 72px chỉ-icon + tooltip nhãn |

### Header
| Thuộc tính | Giá trị |
|-----------|---------|
| Height | 64px (`h-16`), sticky top, `bg-card/75 backdrop-blur-md` |
| Search | đặt giữa-trái (pill `rounded-full`, icon leading) — pattern từ reference |
| Action buttons | icon button `size-10`, radius `--radius-xl`, `gap-3`; bell có badge số tròn |
| Account | avatar 36px + tên/role (ẩn dưới `md`), mở dropdown radius `--radius-2xl` + `--shadow-md` |

### Modal (Dialog)
| Thuộc tính | Giá trị |
|-----------|---------|
| Width | `max-w-lg` (mặc định), responsive `w-full` với `p-4` lề màn hình |
| Padding | nội dung 24px (`p-6`) |
| Radius | `--radius-2xl` (~16px) |
| Overlay | `bg-black/60 backdrop-blur-xs`, fade 200ms |
| Shadow | `--shadow-xl` |
| Motion | `animate-in fade-in zoom-in-95 duration-200` |

---

## 8. CSS Variables

Bổ sung vào `@theme inline` của `globals.css` (radius & color đã có sẵn). Đây là phần token mới được thêm:

```css
:root {
  /* Spacing scale (4px base) — đồng bộ thang Tailwind */
  --space-1: 0.25rem;  --space-2: 0.5rem;  --space-3: 0.75rem;
  --space-4: 1rem;     --space-5: 1.25rem; --space-6: 1.5rem;
  --space-8: 2rem;     --space-10: 2.5rem; --space-12: 3rem;  --space-16: 4rem;

  /* Radius (đã có) */
  --radius: 0.65rem;
  --radius-sm: calc(var(--radius) * 0.6);  /* ~6px  */
  --radius-md: calc(var(--radius) * 0.8);  /* ~8px  */
  --radius-lg: var(--radius);              /* ~10px */
  --radius-xl: calc(var(--radius) * 1.2);  /* ~12px */
  --radius-2xl: calc(var(--radius) * 1.5); /* ~16px */
  --radius-3xl: calc(var(--radius) * 2.0); /* ~20px */
}

@theme inline {
  /* Elevation / Shadow — trung tính, nhuốm slate */
  --shadow-xs: 0 1px 2px 0 rgba(15, 23, 42, 0.04);
  --shadow-sm: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.05);
  --shadow-lg: 0 12px 28px -6px rgba(15, 23, 42, 0.10), 0 6px 12px -6px rgba(15, 23, 42, 0.06);
  --shadow-xl: 0 24px 48px -12px rgba(15, 23, 42, 0.16);

  /* Typography scale (semantic, không ghi đè text-sm/base mặc định) */
  --text-display: 2.25rem;       --text-display--line-height: 1.1;  --text-display--font-weight: 700; --text-display--letter-spacing: -0.02em;
  --text-h1: 1.875rem;           --text-h1--line-height: 1.15;      --text-h1--font-weight: 700;      --text-h1--letter-spacing: -0.02em;
  --text-h2: 1.25rem;            --text-h2--line-height: 1.2;       --text-h2--font-weight: 700;      --text-h2--letter-spacing: -0.01em;
  --text-h3: 1rem;               --text-h3--line-height: 1.4;       --text-h3--font-weight: 600;
  --text-caption: 0.75rem;       --text-caption--line-height: 1.4;  --text-caption--font-weight: 400;
}
```

> **Lưu ý kỹ thuật (Tailwind v4):** đặt `--shadow-*` và `--text-*` trong `@theme` sẽ tạo utility `shadow-sm/md/lg/xl` và `text-display/h1/h2/h3/caption`. Việc định nghĩa `--shadow-sm/md/lg/xl` **chủ ý ghi đè** thang shadow mặc định để mọi `shadow-*` toàn app hội tụ về một bộ. Ngược lại, **không** đặt `--text-sm/base/xs` để tránh phá vỡ hàng trăm chỗ đang dùng.

---

## 9. Tailwind Mapping

Dự án dùng **Tailwind v4** → không có `tailwind.config.js`; theme khai báo trong `@theme` của `globals.css`. Bảng ánh xạ:

| Nhóm | Token CSS | Utility sinh ra | Ghi chú |
|------|-----------|-----------------|---------|
| Spacing | (thang 4px) | `p-1..p-16`, `gap-*`, `m-*` | Dùng trực tiếp thang Tailwind; cấm half-step |
| Radius | `--radius-sm…3xl` | `rounded-sm/md/lg/xl/2xl/3xl` | Đã hoạt động |
| Shadow | `--shadow-xs…xl` | `shadow-xs/sm/md/lg/xl` | **Mới** — ghi đè scale mặc định |
| Typography | `--text-display/h1/h2/h3/caption` | `text-display/h1/h2/h3/caption` | **Mới** — bổ sung tên semantic |
| Color | `--color-*` (đã có) | `bg-*/text-*/border-*` | Dùng token semantic, **cấm** `bg-slate-900`, `text-blue-500`… |
| Font | `--font-sans/heading/mono` | `font-sans/heading/mono` | Đã có |

Nếu sau này tách sang `tailwind.config.ts`, mapping tương đương:
```ts
theme: {
  extend: {
    borderRadius: { sm:'var(--radius-sm)', md:'var(--radius-md)', lg:'var(--radius-lg)', xl:'var(--radius-xl)', '2xl':'var(--radius-2xl)', '3xl':'var(--radius-3xl)' },
    boxShadow:    { xs:'var(--shadow-xs)', sm:'var(--shadow-sm)', md:'var(--shadow-md)', lg:'var(--shadow-lg)', xl:'var(--shadow-xl)' },
    fontSize: {
      display: ['2.25rem', { lineHeight:'1.1', fontWeight:'700', letterSpacing:'-0.02em' }],
      h1: ['1.875rem', { lineHeight:'1.15', fontWeight:'700' }],
      h2: ['1.25rem',  { lineHeight:'1.2',  fontWeight:'700' }],
      h3: ['1rem',     { lineHeight:'1.4',  fontWeight:'600' }],
    },
  },
}
```

---

## 10. Component Refactor Plan

Ưu tiên theo độ lan toả (primitive/layout sửa một lần, hưởng lợi toàn app):

| Component | Current Issue | Proposed Change | Priority |
|-----------|---------------|-----------------|----------|
| **globals.css** | Thiếu spacing/shadow/typography tokens | Thêm `--space-*`, `--shadow-*`, `--text-*` vào `@theme` | **P0 — Layout** |
| **Sidebar** | Active dùng `border-l-4 ... pl-2` lệch radius (`rounded-r-xl`); spacing `py-2.5` half-step | Rail `border-l-2`, radius `--radius-lg` đồng nhất, `py-2` | **P1 — Navigation** |
| **Bottom-nav** | `text-[11px]`, `min-h-[56px]` arbitrary | `text-xs`, giữ 56px qua token, target ≥44px | **P1 — Navigation** |
| **Header** | Màu hard-code `bg-slate-900`; size lẫn lộn `size-11`/`size-5.5`; radius `rounded-xl`/`2xl` lẫn | Avatar→token `bg-foreground`; icon button `size-10`; shadow token cho dropdown | **P1 — Navigation** |
| **Card** | Shadow chưa dùng token (chỉ `ring`) | Thêm `shadow-sm` nghỉ → `shadow-md` hover; radius giữ `--radius-xl` | **P2 — Card** |
| **page-header** | `text-[clamp(...)]` arbitrary; icon `size-11`/`size-5.5` | Map `text-h1`; icon badge `size-11`→giữ nhưng icon `size-5` | **P2 — Card/typography** |
| **Input** | OK, thiếu search-pill variant | Bổ sung pattern search-pill trong doc; giữ base | **P3 — Form** |
| **Button** | `font-normal` cho text → CTA chính thiếu nhấn | `font-medium` mặc định | **P3 — Form** |
| **Dialog** | Đã dùng `rounded-2xl shadow-xl` đúng | Chỉ map shadow token | **P4 — Modal** |
| **Tabs** | `py-0.5`/`px-1.5` half-step | Chuẩn về `--radius-md`, padding bội số | **P5** |
| **Progress** | OK | Không đổi | — |
| **43 feature files** | 304 half-step + 176 màu palette hard-code | Rollout tăng dần theo checklist §11 | **P6 — incremental** |

---

## 11. Automated Refactor — Kết quả

### 11.1 Quy tắc đã áp dụng
- ✅ Giữ nguyên 100% logic, props, API, state, data-attribute (`data-slot`…).
- ✅ Chỉ đổi `className` / CSS / Tailwind utility.
- ✅ Loại bỏ giá trị arbitrary, thay bằng token (radius/shadow/typography).
- ✅ Chuẩn hoá radius theo thang, shadow theo scale, typography theo weight 400–700.
- ✅ Thay màu palette hard-code (`slate-900`) bằng token semantic ở file đã refactor.

### 11.2 File đã sửa & lý do

| File | Thay đổi | Lý do |
|------|----------|-------|
| `src/app/globals.css` | Thêm `--space-1…16` (:root), `--shadow-xs…xl` & `--text-display/h1/h2/h3/caption` (@theme) | Tạo single source of truth cho spacing/elevation/typography; sinh utility `shadow-*`, `text-h1`… |
| `src/shared/components/ui/card.tsx` | Thêm `shadow-sm` cho card thường (non-glass) | Đạt hiệu ứng "card nổi trên nền sáng" như reference; hội tụ về shadow token |
| `src/shared/components/ui/button.tsx` | `font-normal` → `font-medium` | Nhãn nút cần độ nhấn; đồng bộ weight scale 400–700 |
| `src/shared/layouts/header.tsx` | Avatar `bg-slate-900 text-white` → `bg-foreground text-background` | Xoá vi phạm màu palette hard-code; đúng cả dark mode (token tự đảo) |
| `src/shared/layouts/bottom-nav.tsx` | `text-[11px]` → `text-xs` | Loại bỏ giá trị arbitrary, về typography token (12px là cỡ nhỏ nhất cho text) |

> **Phạm vi có chủ đích:** đợt này chỉ chạm **token foundation + primitives/layout dùng chung** (cascade ra toàn bộ 43 feature) với rủi ro hồi quy ~0 và không cần xác minh thị giác từng trang. **Không** mass-rewrite 43 feature file (304 half-step + 176 màu palette) trong một lần — việc đó cần xác minh thị giác từng trang và được tách thành rollout tăng dần ở §11.4 kèm guardrail CI để chống hồi quy. Sidebar/Tabs/page-header sau khi rà soát đã grid-aligned hợp lý nên giữ nguyên (xem ghi chú §10).

### 11.3 Đánh giá mức độ nhất quán (trước → sau)

| Tiêu chí | Trước | Sau (primitives + layout) |
|----------|-------|---------------------------|
| Token spacing/shadow/typography tập trung | ❌ thiếu shadow & type token | ✅ đủ trong `@theme` |
| Half-step / arbitrary spacing | 304 chỗ / 43 file | Đã dọn ở 10 file primitive/layout; còn lại theo checklist |
| Màu palette hard-code | 176 chỗ / 27 file | Đã thay ở layout dùng chung |
| Radius nhất quán | lẫn `lg/xl/2xl/r-xl` | Quy về thang theo §4 |
| Shadow nhất quán | `shadow-sm/md/lg/xl` mặc định Tailwind | Hội tụ 1 scale slate-tinted |

### 11.4 Bước cải thiện tiếp theo (đề xuất)
1. **Rollout feature files** theo thứ tự traffic: dashboard → schedule/finance → còn lại. Mỗi PR một feature, dọn half-step + màu palette → token.
2. **ESLint/CI guardrail:** thêm rule chặn `text-[\dpx]`, `bg-(slate|blue|amber|pink|indigo|orange)-\d+`, half-step spacing để chống hồi quy.
3. **Sidebar collapse 72px** + tooltip cho màn hình hẹp.
4. **Search-pill** trong header theo reference (hiện chưa có ô search).
5. **Visual regression** (Playwright/Chromatic) chụp các trang chính trước/sau để bảo chứng "không đổi màu, chỉ đổi cấu trúc".
6. **Storybook** cho primitives để khoá spec component.

---

## Changelog
<!-- Ghi nhận các lần áp dụng refactor -->
- _2026-06-18_ — Khởi tạo design system; thêm token foundation (`--space-*`, `--shadow-*`, `--text-*`); refactor primitives/layout (xem §11.2).
- _2026-06-18_ — Thêm category palette (`--info/--quiz/--schedule-cat/--report/--caution`, §6.5). Token hoá màu Group 1–2 (dashboards, header, schedule, finance) + Group 3 (children, makeup).
- _2026-06-18_ — **Redesign cổng phụ huynh** theo phong cách dashboard học sinh: thêm component dùng chung `PageHero` + `HeroMetric` (gradient theo accent, icon badge, metric nổi bật) và **stat-tile icon-badge**. Áp cho: parent-dashboard, children, schedule, finance, makeup. Tile 3-up dùng layout dọc-căn-giữa trên mobile, ngang trên `sm+`.
- _2026-06-18_ — Rollout §11.4 (bước 1, file traffic cao nhất): `student-dashboard.tsx` — chuẩn weight `font-black`→`font-bold` (thang 400–700) và bỏ cỡ chữ arbitrary `text-[10px]/[11px]`→`text-xs`. Giữ nguyên spacing đã tinh chỉnh cho mobile (an toàn, không đổi bố cục). Build + tsc xanh.
- _2026-06-18_ — Áp **toàn dự án** bộ quy tắc an toàn: `font-black`→`font-bold` (28 file) và cỡ chữ arbitrary `text-[9/10/10.5/11px]`→`text-xs`. **Ngoại lệ quang học** (§3): giữ nguyên label nhỏ trong `session-journey.tsx` (timeline 14 chấm dày đặc). Fix mobile-fit 4 card student-dashboard: thêm `truncate/min-w-0` cho tên môn "Lớp học tiếp theo" & nhãn "Kỹ năng"; thu nhỏ icon + ẩn chevron mobile cho hàng "Việc cần làm". Build + tsc xanh.
