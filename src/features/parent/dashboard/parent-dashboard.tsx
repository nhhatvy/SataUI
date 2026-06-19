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
import { getCourseSyllabus, getAttendanceStats } from '@/shared/mock-data/student-data'
import { cn } from '@/shared/utils/utils'
import { PageHero, HeroMetric } from '@/shared/components/page-header'
import {
  Users, Wallet, Pencil, CalendarClock, ArrowRight, ChevronRight, Bell, CheckCircle2,
  type LucideIcon,
} from 'lucide-react'

type Tone = 'primary' | 'caution' | 'quiz' | 'success' | 'destructive'

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

  const openChild = (id: string) => {
    setActiveChildId(id)
    router.push('/student')
  }

  const perChild = useMemo(
    () =>
      allChildren.map((c) => {
        const data = getChildData(c.id)
        const syllabus = getCourseSyllabus(c.id)
        const att = getAttendanceStats(c.id)
        const pendingHw =
          syllabus.lessons.filter((l) => l.homework && l.homework.state !== 'submitted').length +
          syllabus.tests.filter((t) => t.state !== 'submitted').length
        const t = data?.tuition
        const debt = t?.status === 'due' ? t.amount : 0
        return {
          child: c,
          courseName: syllabus.courseName,
          progress: att.progressPct,
          done: att.completed,
          total: att.total,
          rate: att.rate,
          needMakeup: att.needMakeup,
          pendingHw,
          debt,
          period: t?.period ?? '',
          dueDate: t?.dueDate ?? '',
          daysLeft: t?.daysLeft ?? 0,
        }
      }),
    []
  )

  // Trung tâm hành động: gom mọi việc phụ huynh cần xử lý, ưu tiên việc gấp lên trước.
  const actions = useMemo(() => {
    const list: {
      id: string; icon: LucideIcon; tone: Tone; urgent: boolean
      title: string; desc: string; cta: string; onClick: () => void
    }[] = []
    perChild.forEach((p) => {
      if (p.debt > 0) {
        list.push({
          id: `fin-${p.child.id}`, icon: Wallet, tone: 'caution', urgent: p.daysLeft <= 3,
          title: `Học phí ${p.period} chưa đóng`,
          desc: `${p.child.shortName} · ${formatCurrency(p.debt)} · hạn ${p.dueDate}${p.daysLeft <= 3 ? ` (còn ${p.daysLeft} ngày)` : ''}`,
          cta: 'Đóng học phí', onClick: () => router.push('/parent/finance'),
        })
      }
      if (p.needMakeup > 0) {
        list.push({
          id: `mk-${p.child.id}`, icon: CalendarClock, tone: 'quiz', urgent: false,
          title: `${p.needMakeup} buổi cần đăng ký học bù`,
          desc: `${p.child.shortName} · buổi vắng chưa được học bù`,
          cta: 'Đăng ký', onClick: () => router.push('/parent/makeup'),
        })
      }
      if (p.pendingHw > 0) {
        list.push({
          id: `hw-${p.child.id}`, icon: Pencil, tone: 'primary', urgent: false,
          title: `${p.pendingHw} bài tập/bài kiểm tra chưa nộp`,
          desc: `${p.child.shortName} · nhắc con hoàn thành đúng hạn`,
          cta: 'Xem', onClick: () => openChild(p.child.id),
        })
      }
    })
    return list.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perChild])

  const sessionsThisWeek = useMemo(
    () => allChildren.reduce((s, c) => s + (getChildData(c.id)?.upcomingSchedule?.length ?? 0), 0),
    []
  )

  const mergedSchedule = useMemo(() => {
    const list: any[] = []
    allChildren.forEach((c) => {
      getChildData(c.id)?.upcomingSchedule?.forEach((s) =>
        list.push({ ...s, childName: c.shortName, childColor: c.avatarColor, childInitials: c.initials })
      )
    })
    return list.slice(0, 5)
  }, [])

  const recentNotis = notifications.slice(0, 4)

  if (pageLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-28 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-52 rounded-2xl" />
          <Skeleton className="h-52 rounded-2xl" />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300 space-y-6">
      {/* Greeting hero */}
      <PageHero
        icon={Users}
        accent="parent"
        overline="Cổng phụ huynh"
        title={`Chào ${user?.name || 'Phụ huynh'} 👋`}
        subtitle={`Đồng hành cùng ${allChildren.length} con tại SataRobo.`}
        metric={
          <HeroMetric
            label={actions.length > 0 ? 'Việc cần xử lý' : 'Buổi tuần này'}
            value={actions.length > 0 ? `${actions.length}` : `${sessionsThisWeek}`}
          />
        }
      />

      {/* CẦN BẠN XỬ LÝ — trung tâm hành động */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
          <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
            <CheckCircle2 className="size-4" />
          </span>
          Cần bạn xử lý
          {actions.length > 0 && (
            <Badge className="bg-primary/10 text-primary border-none text-xs font-bold px-2 py-0.5 rounded-md">{actions.length}</Badge>
          )}
        </h2>

        {actions.length === 0 ? (
          <Card className="border-success/30 bg-success/5 rounded-2xl shadow-none">
            <CardContent className="flex items-center gap-3 p-4 text-sm font-semibold text-success">
              <CheckCircle2 className="size-5 shrink-0" />
              Mọi việc đều ổn — không có khoản nào cần xử lý ngay.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {actions.map((a) => (
              <button
                key={a.id}
                onClick={a.onClick}
                className="group flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card p-3 text-left shadow-sm transition-colors hover:border-primary/40 hover:bg-muted cursor-pointer"
              >
                <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', toneBadge(a.tone))}>
                  <a.icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground truncate">{a.title}</p>
                    {a.urgent && (
                      <Badge className="bg-destructive/10 text-destructive border-none text-xs font-bold px-1.5 py-0 rounded shrink-0">Gấp</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground truncate">{a.desc}</p>
                </div>
                <span className="hidden shrink-0 items-center gap-0.5 text-xs font-bold text-primary sm:inline-flex">
                  {a.cta} <ChevronRight className="size-3.5" />
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 sm:hidden" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* CÁC CON — thông tin gom theo từng con */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground min-w-0 truncate">Các con của bạn</h2>
          <Link href="/parent/children" className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap text-sm font-bold text-primary hover:underline">
            Tất cả <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {perChild.map((p) => (
            <Card key={p.child.id} className="h-full border-border/60 rounded-2xl shadow-none">
              <CardContent className="flex h-full flex-col gap-3 p-4">
                {/* head */}
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: p.child.avatarColor }}
                  >
                    {p.child.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-foreground truncate">{p.child.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium truncate">{p.courseName} · {p.child.className}</p>
                  </div>
                </div>

                {/* progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                    <span className="text-muted-foreground">Tiến độ khóa học</span>
                    <span className="text-primary tabular-nums shrink-0">{p.progress}% · {p.done}/{p.total}</span>
                  </div>
                  <Progress value={p.progress} className="h-1.5 bg-muted" />
                </div>

                {/* mini metrics */}
                <div className="grid grid-cols-3 gap-2">
                  <MiniStat label="Chuyên cần" value={`${p.rate}%`} tone={p.rate >= 90 ? 'success' : 'caution'} />
                  <MiniStat label="Bài chờ" value={`${p.pendingHw}`} tone={p.pendingHw > 0 ? 'primary' : 'success'} />
                  <MiniStat label="Học phí" value={p.debt > 0 ? 'Còn nợ' : 'Đủ'} tone={p.debt > 0 ? 'caution' : 'success'} />
                </div>

                {/* actions */}
                <div className="mt-auto flex items-center gap-2 pt-1">
                  <Link
                    href={`/parent/children/${p.child.slug}`}
                    className="flex-1 min-w-0 truncate rounded-xl border border-border bg-card py-2 text-center text-sm font-bold text-foreground transition-colors hover:bg-muted"
                  >
                    Hồ sơ
                  </Link>
                  <button
                    onClick={() => openChild(p.child.id)}
                    className="flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
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

      {/* Lịch học + thông báo */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Lịch học sắp tới */}
        <div className="space-y-3 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground min-w-0 truncate">Lịch học sắp tới</h2>
            <Link href="/parent/schedule" className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap text-sm font-bold text-primary hover:underline">
              Chi tiết <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <Card className="h-full border-border/60 rounded-2xl shadow-none">
            <CardContent className="p-3 sm:p-4">
              {mergedSchedule.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Không có lịch học nào.</p>
              ) : (
                <div className="divide-y divide-border">
                  {mergedSchedule.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-3 py-3 px-1 first:pt-1 last:pb-1">
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-lg text-sm font-bold text-white"
                        style={{ backgroundColor: s.childColor }}
                        title={s.childName}
                      >
                        {s.childInitials}
                      </span>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground line-clamp-2 sm:truncate flex-1 min-w-0">{s.subject}</p>
                          <Badge className="bg-muted text-muted-foreground border border-border/60 text-xs font-bold px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap tabular-nums">
                            {s.time}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium truncate">{s.childName} · {s.day} · {s.room}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Thông báo */}
        <div className="space-y-3 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground min-w-0 truncate">Thông báo</h2>
            <Link href="/parent/notifications" className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap text-sm font-bold text-primary hover:underline">
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
                        <p className={cn('text-sm text-foreground line-clamp-1', n.unread ? 'font-bold' : 'font-semibold')}>
                          {n.title}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground line-clamp-2">{n.description}</p>
                        <p className="text-xs font-medium text-muted-foreground/80 pt-0.5">{n.childName} · {n.time}</p>
                      </div>
                      {n.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
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

/* ---------- helpers ---------- */

function toneBadge(tone: Tone) {
  return tone === 'caution'
    ? 'bg-caution/10 text-caution'
    : tone === 'quiz'
      ? 'bg-quiz/10 text-quiz'
      : tone === 'success'
        ? 'bg-success/10 text-success'
        : tone === 'destructive'
          ? 'bg-destructive/10 text-destructive'
          : 'bg-primary/10 text-primary'
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: Tone }) {
  const valueCls =
    tone === 'success' ? 'text-success'
      : tone === 'caution' ? 'text-caution'
        : tone === 'destructive' ? 'text-destructive'
          : tone === 'quiz' ? 'text-quiz'
            : 'text-primary'
  return (
    <div className="rounded-lg bg-muted/50 px-2 py-1.5 text-center">
      <p className={cn('text-sm font-bold tabular-nums leading-tight', valueCls)}>{value}</p>
      <p className="mt-0.5 truncate text-xs font-medium leading-tight text-muted-foreground">{label}</p>
    </div>
  )
}
