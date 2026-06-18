'use client'

import { useRouter } from 'next/navigation'
import { useNotificationStore, type NotificationItem } from '@/shared/stores/useNotificationStore'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { children as allChildren } from '@/shared/mock-data/parent-data'
import { NotificationCenter, type NotiCat } from '@/shared/components/notification-center'
import { BookOpen, CreditCard, GitPullRequest, ClipboardList, Award, CalendarDays, MessageSquareText } from 'lucide-react'

const CATEGORIES: NotiCat[] = [
  { key: 'study', label: 'Bài tập', icon: BookOpen, cls: 'text-blue-600 bg-blue-50 border-blue-100' },
  { key: 'comment', label: 'Nhận xét', icon: MessageSquareText, cls: 'text-violet-600 bg-violet-50 border-violet-100' },
  { key: 'schedule', label: 'Lịch học', icon: CalendarDays, cls: 'text-pink-600 bg-pink-50 border-pink-100' },
  { key: 'makeup', label: 'Học bù', icon: GitPullRequest, cls: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  { key: 'finance', label: 'Học phí', icon: CreditCard, cls: 'text-amber-600 bg-amber-50 border-amber-100' },
  { key: 'report', label: 'Học bạ', icon: Award, cls: 'text-orange-600 bg-orange-50 border-orange-100' },
  { key: 'survey', label: 'Khảo sát', icon: ClipboardList, cls: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
]

export default function ParentNotificationsPage() {
  const router = useRouter()
  const { notifications } = useNotificationStore()
  const { setActiveChildId } = useActiveChildStore()

  const onOpen = (n: NotificationItem) => {
    if (n.type === 'finance') return router.push('/parent/finance')
    if (n.type === 'survey') return router.push('/parent/surveys')
    if (n.type === 'makeup') return router.push('/parent/makeup')
    if (n.type === 'report') return router.push('/parent/report-card')
    if (n.type === 'comment') return router.push('/parent/comments')
    // study/schedule: chuyển sang profile con tương ứng rồi mở trang học sinh
    const target = allChildren.find((c) => c.name === n.childName || c.shortName === n.childName)
    if (target) setActiveChildId(target.id)
    if (n.type === 'study') router.push('/student/homework')
    else if (n.type === 'schedule') router.push('/student/schedule')
  }

  return (
    <NotificationCenter
      title="Thông báo"
      subtitle="Cập nhật về học tập, lịch học, học phí, học bù và khảo sát của các con."
      items={notifications}
      categories={CATEGORIES}
      onOpen={onOpen}
      showChild
    />
  )
}
