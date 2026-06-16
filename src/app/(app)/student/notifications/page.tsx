'use client'

import { useRouter } from 'next/navigation'
import { useNotificationStore, type NotificationItem, type NotiCategory } from '@/shared/stores/useNotificationStore'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { NotificationCenter, type NotiCat } from '@/shared/components/notification-center'
import { BookOpen, CalendarDays, GitPullRequest, ClipboardList } from 'lucide-react'

// Học sinh: không xem tài chính/học bạ; chỉ thông báo của con đang chọn.
const CATEGORIES: NotiCat[] = [
  { key: 'study', label: 'Bài tập', icon: BookOpen, cls: 'text-blue-600 bg-blue-50 border-blue-100' },
  { key: 'schedule', label: 'Lịch học', icon: CalendarDays, cls: 'text-pink-600 bg-pink-50 border-pink-100' },
  { key: 'makeup', label: 'Học bù', icon: GitPullRequest, cls: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  { key: 'survey', label: 'Đánh giá', icon: ClipboardList, cls: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
]
const STUDENT_TYPES: NotiCategory[] = CATEGORIES.map((c) => c.key)

const HREF: Record<string, string> = {
  study: '/student/homework',
  schedule: '/student/schedule',
  makeup: '/student/sessions',
  survey: '/student/evaluate-teacher',
}

export default function StudentNotificationsPage() {
  const router = useRouter()
  const { notifications } = useNotificationStore()
  const { child } = useActiveChildStore()

  const items = notifications.filter(
    (n) => (n.childName === child?.name || n.childName === child?.shortName) && STUDENT_TYPES.includes(n.type)
  )

  const onOpen = (n: NotificationItem) => {
    const href = HREF[n.type]
    if (href) router.push(href)
  }

  return (
    <NotificationCenter
      title={`Thông báo của ${child?.shortName ?? 'em'}`}
      subtitle="Cập nhật về bài tập, lịch học, học bù và đánh giá giáo viên."
      items={items}
      categories={CATEGORIES}
      onOpen={onOpen}
    />
  )
}
