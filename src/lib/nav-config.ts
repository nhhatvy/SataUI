import {
  Home,
  Users,
  Wallet,
  CalendarPlus,
  ClipboardList,
  Bell,
  Settings,
  Calendar,
  List,
  Pencil,
  Image,
  Award,
  Star,
  CalendarDays,
  MessageSquareText,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

// Menu Mode Phụ huynh (/parent/*) — bám theo blueprint Phần 4.3.
export const parentNav: NavItem[] = [
  { label: 'Tổng quan', href: '/parent', icon: Home },
  { label: 'Các con', href: '/parent/children', icon: Users },
  { label: 'Lịch học', href: '/parent/schedule', icon: CalendarDays },
  { label: 'Nhận xét', href: '/parent/comments', icon: MessageSquareText },
  { label: 'Hình ảnh lớp', href: '/parent/photos', icon: Image },
  { label: 'Học bạ', href: '/parent/report-card', icon: Award },
  { label: 'Học phí & công nợ', href: '/parent/finance', icon: Wallet },
  { label: 'Yêu cầu học bù', href: '/parent/makeup', icon: CalendarPlus },
  { label: 'Khảo sát trung tâm', href: '/parent/surveys', icon: ClipboardList },
  { label: 'Thông báo', href: '/parent/notifications', icon: Bell },
  { label: 'Hồ sơ', href: '/parent/profile', icon: Settings },
]

// Menu Mode Học sinh (/student/*) — chỉ hiển thị khi đã chọn 1 con.
export const studentNav: NavItem[] = [
  { label: 'Tổng quan', href: '/student', icon: Home },
  { label: 'Lịch học', href: '/student/schedule', icon: Calendar },
  { label: 'Bài tập', href: '/student/homework', icon: Pencil },
  { label: 'Buổi học', href: '/student/sessions', icon: List },
  { label: 'Đánh giá giáo viên', href: '/student/evaluate-teacher', icon: Star },
  { label: 'Thông báo', href: '/student/notifications', icon: Bell },
]
// Lưu ý: Hình ảnh lớp, Học bạ, Nhận xét giáo viên CHỈ dành cho phụ huynh (cổng /parent/*).
