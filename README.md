# SataUI

Cổng thông tin Phụ huynh & Học sinh cho trung tâm Robotics **SataRobo** — xây dựng bằng Next.js (App Router) + React + TypeScript + TailwindCSS. Dữ liệu hiện là mock cục bộ (frontend-only).

## Tính năng chính

- **2 chế độ trong 1 tài khoản**: Cổng Phụ huynh và Cổng Học sinh (chuyển bằng Profile Switcher, không lộ `studentId` trên URL).
- **Phụ huynh**: tổng quan các con, lịch học, nhận xét theo buổi, hình ảnh lớp, học bạ, học phí & công nợ, yêu cầu học bù (liên cơ sở), khảo sát trung tâm, hồ sơ.
- **Học sinh**: dashboard, lịch & buổi học, làm bài tập/kiểm tra trắc nghiệm trên web (chấm điểm + bảng xếp hạng lớp), đánh giá giáo viên.
- **Responsive** mobile → desktop: sidebar (desktop) / bottom nav + drawer (mobile), bố cục co giãn.

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production
```

## Cấu trúc

```
src/
├── app/            # routes (App Router): (public), (app)/parent, (app)/student
├── features/       # UI theo tính năng (parent/*, student/*)
├── shared/         # layouts, components, stores (zustand), mock-data, design-system
└── lib/            # nav-config, utils
```

> Stack định hướng khi nối backend: Prisma / Supabase / Auth.js.
