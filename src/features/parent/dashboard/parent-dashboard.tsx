'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { useNotificationStore } from '@/shared/stores/useNotificationStore'
import { children as allChildren, getChildData, formatCurrency } from '@/shared/mock-data/parent-data'
import { getCourseSyllabus } from '@/shared/mock-data/student-data'
import { cn } from '@/shared/utils/utils'
import { Users, CalendarDays, Pencil, Wallet, ArrowRight, Bell, ChevronRight, type LucideIcon } from 'lucide-react'

export function ParentDashboard() {
  const router = useRouter()
  const { setActiveChildId } = useActiveChildStore()
  const { user } = useAuthStore()
  const { notifications } = useNotificationStore()

  const [pageLoading, setPageLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  const perChild = useMemo(
    () =>
      allChildren.map((c) => {
        const data = getChildData(c.id)
        const syllabus = getCourseSyllabus(c.id)
        const done = syllabus.lessons.filter((l) => l.progress !== 'upcoming').length
        const pendingHw =
          syllabus.lessons.filter((l) => l.homework && l.homework.state !== 'submitted').length +
          syllabus.tests.filter((t) => t.state !== 'submitted').length
        const debt = data?.tuition?.status === 'due' ? data.tuition.amount : 0
        return {
          child: c,
          courseName: syllabus.courseName,
          progress: Math.round((done / syllabus.totalSessions) * 100),
          done,
          total: syllabus.totalSessions,
          pendingHw,
          debt,
        }
      }),
    []
  )

  const summary = useMemo(() => {
    const totalDebt = perChild.reduce((s, p) => s + p.debt, 0)
    const totalHw = perChild.reduce((s, p) => s + p.pendingHw, 0)
    const sessionsThisWeek = allChildren.reduce((s, c) => s + (getChildData(c.id)?.upcomingSchedule?.length ?? 0), 0)
    return { kids: allChildren.length, totalDebt, totalHw, sessionsThisWeek }
  }, [perChild])

  const mergedSchedule = useMemo(() => {
    const list: any[] = []
    allChildren.forEach((c) => {
      getChildData(c.id)?.upcomingSchedule?.forEach((s) =>
        list.push({ ...s, childName: c.shortName, childColor: c.avatarColor, childInitials: c.initials })
      )
    })
    return list
  }, [])

  const recentNotis = notifications.slice(0, 4)
  const openChild = (id: string) => {
    setActiveChildId(id)
    router.push('/student')
  }

  if (pageLoading) {
    return (
      <main className="mx-auto w-full max-w-screen-2xl flex-1 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pb-24 pt-6 space-y-6">
        <Skeleton className="h-16 w-2/3 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
        <div
  className="
    grid
    grid-cols-1
    md:grid-cols-2
    xl:grid-cols-3
    2xl:grid-cols-4
    gap-4
    lg:gap-5
  "
>
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      </main>
    )
  }

  return (
    <main
  className="
    mx-auto
    w-full
    max-w-screen-2xl
    flex-1
    px-4
    sm:px-6
    lg:px-8
    xl:px-10
    2xl:px-12
    pt-6
    pb-24
    animate-in
    fade-in
    duration-300
    space-y-6
    lg:space-y-8
  "
>
      {/* Greeting */}
      <header>
        <p className="text-sm font-bold text-parent uppercase tracking-wider">Cổng phụ huynh</p>
        <h1 className="mt-1 break-words text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-foreground">
          Chào {user?.name || 'Phụ huynh'} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          Bạn đang đồng hành cùng {summary.kids} con tại SataRobo. Chọn một con để xem chi tiết.
        </p>
      </header>

      {/* Family stats — 2 cột mobile, 4 cột desktop, value xuống dòng riêng nên không bị cắt */}
      <section
  className="
    grid
    grid-cols-2
    md:grid-cols-4
    gap-3
    lg:gap-4
  "
>
        <StatTile icon={Users} accent="parent" label="Số con đang học" value={`${summary.kids}`} />
        <StatTile icon={CalendarDays} accent="indigo" label="Buổi học tuần này" value={`${summary.sessionsThisWeek}`} />
        <StatTile icon={Pencil} accent="primary" label="Bài tập chờ làm" value={`${summary.totalHw}`} />
        <StatTile icon={Wallet} accent="amber" label="Công nợ còn lại" value={formatCurrency(summary.totalDebt)} />
      </section>

      {/* Child cards */}
      <section>
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Các con của bạn</h2>
        <div
  className="
    grid
    grid-cols-1
    md:grid-cols-2
    xl:grid-cols-3
    2xl:grid-cols-4
    gap-4
    lg:gap-5
  "
>
          {perChild.map((p) => (
            <Card
  key={p.child.id}
  className="
    h-full
    rounded-2xl
    border-border/60
    shadow-none
  "
>
              <CardContent className="flex h-full flex-col p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="grid size-11 sm:size-12 shrink-0 place-items-center rounded-xl text-base font-black text-white"
                    style={{ backgroundColor: p.child.avatarColor }}
                  >
                    {p.child.initials}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-foreground truncate">{p.child.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium truncate">{p.courseName} · {p.child.className}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm font-semibold">
                    <span className="text-muted-foreground min-w-0 truncate">Tiến độ ({p.done}/{p.total} buổi)</span>
                    <span className="text-primary shrink-0 tabular-nums">{p.progress}%</span>
                  </div>
                  <Progress value={p.progress} className="h-2 bg-muted" />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {p.pendingHw > 0 && (
                    <Badge className="bg-primary/10 text-primary border-none text-xs font-bold px-2 py-0.5 rounded-md">{p.pendingHw} bài tập chờ</Badge>
                  )}
                  {p.debt > 0 ? (
                    <Badge className="bg-amber-500/10 text-amber-600 border-none text-xs font-bold px-2 py-0.5 rounded-md">Còn nợ {formatCurrency(p.debt)}</Badge>
                  ) : (
                    <Badge className="bg-success/10 text-success border-none text-xs font-bold px-2 py-0.5 rounded-md">Đã đóng đủ học phí</Badge>
                  )}
                </div>

                <div className="mt-auto flex items-center gap-2 pt-4">
                  <Link
                    href={`/parent/children/${p.child.slug}`}
                    className="flex-1 min-w-0 text-center py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-sm font-bold text-foreground transition-colors truncate"
                  >
                    Hồ sơ
                  </Link>
                  <button
                    onClick={() => openChild(p.child.id)}
                    className="flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-black hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <span className="truncate">Cổng học sinh</span>
                    <ArrowRight className="size-4 shrink-0" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Schedule + notifications */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Merged schedule */}
        <div className="xl:col-span-8 space-y-3 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider min-w-0 truncate">Lịch học sắp tới</h2>
            <Link href="/parent/schedule" className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-0.5 shrink-0 whitespace-nowrap">
              Chi tiết <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <Card className="h-full border-border/60 rounded-2xl shadow-none">
            <CardContent className="p-2 sm:p-4">
              {mergedSchedule.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Không có lịch học nào.</p>
              ) : (
                <div className="divide-y divide-border">
                  {mergedSchedule.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 sm:py-3 sm:px-1 first:pt-1 last:pb-1">
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-lg text-sm font-bold text-white"
                        style={{ backgroundColor: s.childColor }}
                        title={s.childName}
                      >
                        {s.childInitials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate flex-1 min-w-0">{s.subject}</p>
                          <Badge className="bg-muted text-muted-foreground border border-border/60 text-xs font-bold px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap tabular-nums">
                            {s.time}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium truncate mt-0.5">{s.childName} · {s.day} · {s.room}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent notifications */}
        <div className="xl:col-span-4 space-y-3 min-w-0">
          <div className="flex items-center justify-between gap-2 mt-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider min-w-0 truncate">Thông báo</h2>
            <Link href="/parent/notifications" className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-0.5 shrink-0 whitespace-nowrap">
              Tất cả <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <Card className="h-full border-border/60 rounded-2xl shadow-none">
            <CardContent className="p-2">
              {recentNotis.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Không có thông báo.</p>
              ) : (
                <div className="divide-y divide-border">
                  {recentNotis.map((n) => (
                    <Link
                      key={n.id}
                      href="/parent/notifications"
                      className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted"
                    >
                      <span
                        className={cn(
                          'mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl',
                          n.unread ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        )}
                      >
                        <Bell className="size-4" />
                      </span>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className={cn('text-sm text-foreground line-clamp-2', n.unread ? 'font-bold' : 'font-semibold')}>
                          {n.title}
                        </p>
                        <p className="text-sm font-medium text-muted-foreground line-clamp-2">
                          {n.description}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground pt-0.5">
                          {n.childName} · {n.time}
                        </p>
                      </div>

                      {n.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                      <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

function StatTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon
  label: string
  value: string
  accent: 'parent' | 'indigo' | 'primary' | 'amber'
}) {
  const accentCls =
    accent === 'parent'
      ? 'bg-parent/10 text-parent'
      : accent === 'indigo'
        ? 'bg-indigo-500/10 text-indigo-500'
        : accent === 'primary'
          ? 'bg-primary/10 text-primary'
          : 'bg-amber-500/10 text-amber-600'

  return (
    <Card className="h-full border-border/60 rounded-2xl shadow-none">
      <CardContent className="p-4 lg:p-5 min-h-[110px]">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-xs sm:text-sm font-medium leading-tight text-muted-foreground">
            {label}
          </p>

          <span
            className={cn(
              'grid size-8 lg:size-10 shrink-0 place-items-center rounded-xl',
              accentCls
            )}
          >
            <Icon className="size-4 lg:size-5" />
          </span>
        </div>

        <p className="mt-3 text-xl lg:text-2xl font-bold leading-tight tabular-nums break-words text-foreground">
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
