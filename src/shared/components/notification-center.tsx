'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useNotificationStore, type NotiCategory, type NotificationItem } from '@/shared/stores/useNotificationStore'
import { PageHeader } from '@/shared/components/page-header'
import { cn } from '@/shared/utils/utils'
import { Bell, CheckCheck, type LucideIcon } from 'lucide-react'

export type NotiCat = { key: NotiCategory; label: string; icon: LucideIcon; cls: string }

// Trung tâm thông báo dùng chung cho cả phụ huynh & học sinh.
// Bố cục desktop: rail danh mục (kèm số chưa đọc) bên trái + danh sách nhóm theo Chưa/Đã đọc bên phải.
export function NotificationCenter({
  title,
  subtitle,
  items,
  categories,
  onOpen,
  showChild = false,
}: {
  title: string
  subtitle?: string
  items: NotificationItem[]
  categories: NotiCat[]
  onOpen: (n: NotificationItem) => void
  showChild?: boolean
}) {
  const { markAsRead } = useNotificationStore()
  const [active, setActive] = useState<'all' | NotiCategory>('all')

  const filtered = items.filter((n) => active === 'all' || n.type === active)
  const unreadTotal = items.filter((n) => n.unread).length
  const unreadOf = (key: NotiCategory) => items.filter((n) => n.type === key && n.unread).length
  const unread = filtered.filter((n) => n.unread)
  const read = filtered.filter((n) => !n.unread)

  const open = (n: NotificationItem) => {
    markAsRead(n.id)
    onOpen(n)
  }
  const markAllShown = () => filtered.forEach((n) => n.unread && markAsRead(n.id))
  const meta = (type: NotiCategory) => categories.find((c) => c.key === type)

  const railBtn = (key: 'all' | NotiCategory, label: string, count: number, Icon?: LucideIcon) => (
    <button
      key={key}
      onClick={() => setActive(key)}
      className={cn(
        'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-bold transition-colors shrink-0 lg:w-full',
        active === key ? 'bg-accent-soft text-accent' : 'text-slate-600 hover:bg-slate-50'
      )}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      <span className="flex-1 text-left whitespace-nowrap">{label}</span>
      {count > 0 && (
        <span className={cn('grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-xs font-black', active === key ? 'bg-accent text-white' : 'bg-primary/10 text-primary')}>
          {count}
        </span>
      )}
    </button>
  )

  const renderItem = (n: NotificationItem) => {
    const m = meta(n.type)
    const Icon = m?.icon ?? Bell
    return (
      <button
        key={n.id}
        onClick={() => open(n)}
        className={cn('flex w-full items-start gap-3 p-3.5 sm:p-4 text-left transition-colors hover:bg-slate-50 cursor-pointer relative', n.unread && 'bg-primary/[0.02]')}
      >
        {n.unread && <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
        <span className={cn('mt-0.5 grid size-9 sm:size-10 shrink-0 place-items-center rounded-xl border', m?.cls ?? 'text-slate-600 bg-slate-50 border-slate-100')}>
          <Icon className="size-4.5 sm:size-5" />
        </span>
        <div className="min-w-0 flex-1">
          {/* Hàng 1: tiêu đề (1 dòng) + tên con (nếu có) */}
          <div className="flex items-center gap-2">
            <span className={cn('text-sm text-slate-900 truncate min-w-0 flex-1', n.unread ? 'font-bold' : 'font-semibold')}>{n.title}</span>
            {showChild && (
              <Badge variant="outline" className="shrink-0 text-xs font-semibold text-primary border-primary/20 bg-primary/5 py-0 px-2">{n.childName}</Badge>
            )}
            {!showChild && n.unread && <span className="size-2 shrink-0 rounded-full bg-primary" />}
          </div>
          {/* Mô tả: tối đa 2 dòng */}
          <p className="text-sm text-slate-500 font-medium leading-snug mt-0.5 line-clamp-2">{n.description}</p>
          {/* Meta: nhãn danh mục · thời gian */}
          <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-400">
            <span className="uppercase tracking-wide truncate">{m?.label}</span>
            <span>·</span>
            <span className="shrink-0">{n.time}</span>
          </div>
        </div>
      </button>
    )
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <PageHeader
        icon={Bell}
        title={title}
        subtitle={subtitle}
        action={
          unreadTotal > 0 ? (
            <button onClick={markAllShown} className="inline-flex items-center gap-1.5 px-3.5 h-10 bg-white border border-border hover:bg-slate-50 text-slate-800 text-sm font-bold rounded-xl shadow-2xs cursor-pointer">
              <CheckCheck className="size-4 text-primary" /> Đọc tất cả
            </button>
          ) : undefined
        }
      />

      <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-5 lg:items-start">
        {/* Category rail */}
        <aside className="mb-4 lg:mb-0 lg:sticky lg:top-20">
          <Card className="border-border/60 rounded-2xl shadow-none py-0">
            <CardContent className="p-2 flex lg:flex-col gap-1 overflow-x-auto scrollbar-thin">
              {railBtn('all', 'Tất cả', unreadTotal)}
              {categories.map((c) => railBtn(c.key, c.label, unreadOf(c.key), c.icon))}
            </CardContent>
          </Card>
        </aside>

        {/* List */}
        <div className="min-w-0">
          {filtered.length === 0 ? (
            <Card className="border-border/60 shadow-none rounded-2xl p-12 text-center">
              <CardContent className="flex flex-col items-center gap-3 p-0">
                <span className="size-14 rounded-full bg-slate-50 grid place-items-center text-slate-400"><Bell className="size-7" /></span>
                <p className="text-sm font-bold text-slate-600">Không có thông báo</p>
                <p className="text-sm text-slate-400">Chưa có cập nhật nào trong mục này.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-5">
              {unread.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Chưa đọc ({unread.length})</h3>
                  <Card className="border-border/60 rounded-2xl shadow-none overflow-hidden py-0">
                    <CardContent className="p-0 divide-y divide-slate-100">{unread.map(renderItem)}</CardContent>
                  </Card>
                </section>
              )}
              {read.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Đã đọc</h3>
                  <Card className="border-border/60 rounded-2xl shadow-none overflow-hidden py-0">
                    <CardContent className="p-0 divide-y divide-slate-100">{read.map(renderItem)}</CardContent>
                  </Card>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
