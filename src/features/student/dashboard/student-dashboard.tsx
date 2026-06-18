'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { getChildData } from '@/shared/mock-data/parent-data'
import { getCourseSyllabus, getAttendanceStats } from '@/shared/mock-data/student-data'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { StateMockWrapper } from '@/shared/components/state-mock-wrapper'
import { SessionJourney } from '@/shared/components/session-journey'
import { cn } from '@/shared/utils/utils'
import {
  Pencil, CalendarClock, ArrowRight, Play, MapPin, Clock, ClipboardList,
  CheckCircle2, Sparkles, TrendingUp, Target, Flame, ChevronRight,
} from 'lucide-react'

export function StudentDashboard() {
  const router = useRouter()
  const { child } = useActiveChildStore()
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const data = useMemo(() => getChildData(child.id), [child.id])
  const syllabus = useMemo(() => getCourseSyllabus(child.id), [child.id])
  const att = useMemo(() => getAttendanceStats(child.id), [child.id])
  const breakdown = {
    total: att.total,
    completed: att.completed,
    remaining: att.remaining,
    absent: att.absent,
    needMakeup: att.needMakeup,
    doneMakeup: att.doneMakeup,
  }

  // Việc cần làm: gộp bài tập (theo buổi) + bài kiểm tra của giáo viên
  const todoItems = useMemo(() => {
    const hw = syllabus.lessons
      .filter((l) => l.homework && l.homework.state !== 'submitted')
      .map((l) => ({
        key: `hw-${l.index}`,
        kind: 'hw' as const,
        title: l.homework!.title,
        meta: `Buổi ${l.index} · Hạn ${l.homework!.due}`,
        state: l.homework!.state,
      }))
    const tests = syllabus.tests
      .filter((t) => t.state !== 'submitted')
      .map((t) => ({
        key: `test-${t.id}`,
        kind: 'test' as const,
        title: t.title,
        meta: `${t.questionCount} câu · ${t.durationMinutes} phút · Hạn ${t.due}`,
        state: t.state,
      }))
    // Quá hạn lên trước
    return [...hw, ...tests].sort((a, b) => (a.state === 'overdue' ? -1 : 0) - (b.state === 'overdue' ? -1 : 0))
  }, [syllabus])

  const recentResults = data?.recentResults ?? []
  const weeklyScores = data?.weeklyScores ?? []
  const skills = data?.skillRadar ?? []
  const overall = att.progressPct

  const upcoming = data?.upcomingSchedule ?? []
  const nextClass = upcoming[0] ?? null

  if (pageLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 pb-24 pt-4 sm:px-6 sm:pt-6 lg:px-8 space-y-4 sm:space-y-5">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
        </div>
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          <Skeleton className="h-64 w-full rounded-2xl lg:col-span-2" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-3 pb-24 pt-4 sm:px-6 sm:pt-6 lg:px-8 animate-in fade-in duration-300 space-y-4 sm:space-y-5">
      {/* HERO */}
      <Card className="border-none rounded-3xl shadow-none overflow-hidden bg-gradient-to-br from-primary to-primary/80 py-0">
        <CardContent className="relative p-4 sm:p-6">
          {/* họa tiết nền */}
          <Sparkles className="absolute -right-3 -top-3 size-24 text-primary-foreground/10 rotate-12 pointer-events-none" />
          <div className="relative flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              <span
                className="grid size-12 sm:size-14 shrink-0 place-items-center rounded-2xl text-base sm:text-lg font-black ring-4 ring-primary-foreground/20"
                style={{ backgroundColor: child?.avatarColor, color: '#fff' }}
              >
                {child?.initials}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-primary-foreground/70">Cổng học sinh</p>
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-primary-foreground truncate">
                  Chào {child?.shortName ?? 'con'}! 🚀
                </h1>
                <p className="text-xs sm:text-sm font-medium text-primary-foreground/80 mt-0.5 truncate">
                  {syllabus.courseName} · Lớp {child.className}
                </p>
              </div>
            </div>
            {/* Tiến độ khóa học */}
            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3 rounded-2xl bg-primary-foreground/15 px-4 py-2.5 sm:py-3 backdrop-blur-sm shrink-0">
              <div className="leading-snug">
                <p className="text-[11px] sm:text-xs font-bold text-primary-foreground/80">Tiến độ khóa học</p>
                <p className="text-[11px] sm:text-xs font-medium text-primary-foreground/65">{breakdown.completed}/{breakdown.total} buổi đã học</p>
              </div>
              <ProgressRing value={overall} />
            </div>
          </div>
        </CardContent>
      </Card>

      <StateMockWrapper skeletonType="grid" emptyTitle="Chưa có dữ liệu" emptyDescription="Dữ liệu học tập của con sẽ hiển thị khi lớp bắt đầu.">
        {/* QUICK STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <QuickStat icon={Pencil} label="Cần làm" value={`${todoItems.length} bài`} accent="primary" onClick={() => router.push('/student/homework')} />
          <QuickStat icon={CalendarClock} label="Buổi tiếp theo" value={nextClass ? nextClass.day : 'Chưa có'} accent="indigo" onClick={() => router.push('/student/schedule')} />
          <QuickStat icon={Target} label="Buổi đã học" value={`${att.completed}/${att.total}`} accent="amber" onClick={() => router.push('/student/sessions')} />
          <QuickStat icon={CheckCircle2} label="Chuyên cần" value={`${att.rate}%`} accent="success" onClick={() => router.push('/student/sessions')} />
        </div>

        {/* HÀNH TRÌNH KHÓA HỌC */}
        <Card className="border-border/60 rounded-2xl shadow-none">
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                <Target className="size-4 text-primary" /> Hành trình khóa học
              </h2>
              <span className="text-sm font-semibold text-muted-foreground">{breakdown.completed}/{breakdown.total} buổi</span>
            </div>
            <div className="py-2.5">
              <SessionJourney childId={child.id} variant="line" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-1">
              <StatBox label="Tổng buổi" value={breakdown.total} />
              <StatBox label="Đã học" value={breakdown.completed} tone="success" />
              <StatBox label="Còn lại" value={breakdown.remaining} />
              <StatBox label="Vắng" value={breakdown.absent} tone="danger" />
              <StatBox label="Cần học bù" value={breakdown.needMakeup} tone="warning" />
              <StatBox label="Đã học bù" value={breakdown.doneMakeup} tone="primary" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3 lg:items-start">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* VIỆC CẦN LÀM */}
            <Card className="border-border/60 rounded-2xl shadow-none">
              <CardContent className="p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                    <ClipboardList className="size-4 text-primary" /> Việc cần làm
                  </h2>
                  {todoItems.length > 0 && (
                    <Badge className="bg-primary/10 text-primary border-none text-xs font-black px-2 py-0.5 rounded-md">{todoItems.length}</Badge>
                  )}
                </div>

                {todoItems.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <span className="grid size-12 place-items-center rounded-2xl bg-success/10 text-success"><CheckCircle2 className="size-6" /></span>
                    <p className="text-sm font-bold text-foreground">Tuyệt vời! Con đã làm hết bài.</p>
                    <p className="text-xs text-muted-foreground">Giữ vững phong độ học tập nhé 💪</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {todoItems.map((item) => {
                      const overdue = item.state === 'overdue'
                      const isTest = item.kind === 'test'
                      return (
                        <button
                          key={item.key}
                          onClick={() => router.push('/student/homework')}
                          className="group flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted cursor-pointer"
                        >
                          <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', isTest ? 'bg-indigo-500/10 text-indigo-500' : 'bg-primary/10 text-primary')}>
                            {isTest ? <ClipboardList className="size-5" /> : <Pencil className="size-5" />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <Badge className={cn('border-none text-[10px] font-black px-1.5 py-0 rounded uppercase', isTest ? 'bg-indigo-500/10 text-indigo-500' : 'bg-primary/10 text-primary')}>
                                {isTest ? 'Kiểm tra' : 'Bài tập'}
                              </Badge>
                              <p className="text-sm font-bold text-foreground truncate min-w-0">{item.title}</p>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5 truncate">{item.meta}</p>
                          </div>
                          <Badge className={cn('shrink-0 border-none text-[11px] font-bold px-2 py-0.5 rounded-md', overdue ? 'bg-destructive/15 text-destructive' : 'bg-amber-500/15 text-amber-600')}>
                            {overdue ? 'Quá hạn' : 'Cần làm'}
                          </Badge>
                          <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </button>
                      )
                    })}
                    <button
                      onClick={() => router.push('/student/homework')}
                      className="flex w-full items-center justify-center gap-1.5 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-black hover:opacity-90 transition-opacity cursor-pointer mt-1"
                    >
                      <Play className="size-4 fill-current" /> Vào làm bài ngay
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* KẾT QUẢ HỌC TẬP */}
            <Card className="border-border/60 rounded-2xl shadow-none">
              <CardContent className="p-4 sm:p-5 space-y-4">
                <h2 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                  <TrendingUp className="size-4 text-primary" /> Kết quả của em
                </h2>

                {/* Phong độ 6 tuần */}
                {weeklyScores.length > 0 && (
                  <div className="rounded-xl bg-muted/60 p-3.5">
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phong độ gần đây</p>
                      <span className="inline-flex items-center gap-1 text-xs font-black text-success">
                        <Flame className="size-3.5" /> {weeklyScores[weeklyScores.length - 1]?.score.toFixed(1)} điểm
                      </span>
                    </div>
                    <div className="flex items-end justify-between gap-1.5 sm:gap-2">
                      {weeklyScores.map((w) => (
                        <div key={w.week} className="flex flex-1 flex-col items-center gap-1">
                          <span className="text-[10px] font-black text-muted-foreground tabular-nums">{w.score.toFixed(1)}</span>
                          <div className="w-full rounded-md bg-primary/15 overflow-hidden flex items-end h-12">
                            <div className="w-full rounded-md bg-primary transition-all" style={{ height: `${(w.score / 10) * 100}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground">{w.week}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Điểm gần đây */}
                <div className="space-y-2">
                  {recentResults.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Chưa có kết quả nào.</p>
                  ) : (
                    recentResults.map((r) => (
                      <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-foreground truncate">{r.title}</p>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5">{r.type} · {r.date}</p>
                        </div>
                        <span className={cn('grid place-items-center rounded-xl px-3 py-1.5 text-base font-black tabular-nums shrink-0', scoreCls(r.score / r.maxScore * 10))}>
                          {r.score}<span className="text-xs font-bold opacity-60">/{r.maxScore}</span>
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-4 sm:space-y-5">
            {/* LỚP HỌC TIẾP THEO */}
            <Card className="border-border/60 rounded-2xl shadow-none">
              <CardContent className="p-4 sm:p-5 space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                  <CalendarClock className="size-4 text-primary" /> Lớp học tiếp theo
                </h3>
                {nextClass ? (
                  <>
                    <div className="rounded-xl bg-primary/5 border border-primary/15 p-3.5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-base font-black text-foreground">{nextClass.subject}</p>
                        <Badge className="bg-primary text-primary-foreground border-none text-[10px] font-black px-2 py-0.5 rounded-md shrink-0">{nextClass.day}</Badge>
                      </div>
                      <div className="space-y-1.5 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-2"><Clock className="size-4 shrink-0 text-primary" /> {nextClass.time}</span>
                        <span className="flex items-center gap-2"><MapPin className="size-4 shrink-0 text-primary" /> {nextClass.room}</span>
                        <span className="flex items-center gap-2"><Pencil className="size-4 shrink-0 text-primary" /> GV {nextClass.teacher}</span>
                      </div>
                    </div>
                    {upcoming.length > 1 && (
                      <div className="space-y-1.5 pt-1">
                        {upcoming.slice(1, 3).map((s) => (
                          <div key={s.id} className="flex items-center gap-2 text-sm min-w-0">
                            <span className="size-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                            <span className="font-semibold text-foreground truncate flex-1 min-w-0">{s.subject}</span>
                            <span className="text-xs text-muted-foreground font-medium shrink-0">{s.day}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => router.push('/student/schedule')}
                      className="flex w-full items-center justify-center gap-1.5 h-10 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      Xem lịch học <ArrowRight className="size-4" />
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">Không có lịch học sắp tới.</p>
                )}
              </CardContent>
            </Card>

            {/* KỸ NĂNG CỦA EM */}
            {skills.length > 0 && (
              <Card className="border-border/60 rounded-2xl shadow-none">
                <CardContent className="p-4 sm:p-5 space-y-3.5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                    <Sparkles className="size-4 text-primary" /> Kỹ năng của em
                  </h3>
                  <div className="space-y-3">
                    {skills.map((s) => (
                      <div key={s.skill} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-foreground">{s.skill}</span>
                          <span className="font-black text-primary tabular-nums">{s.value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </StateMockWrapper>
    </main>
  )
}

/* ---------- helpers ---------- */

function scoreCls(score10: number) {
  if (score10 >= 9) return 'bg-success/15 text-success'
  if (score10 >= 7.5) return 'bg-primary/15 text-primary'
  if (score10 >= 5) return 'bg-amber-500/15 text-amber-600'
  return 'bg-destructive/15 text-destructive'
}

function ProgressRing({ value }: { value: number }) {
  const r = 18
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(Math.max(value, 0), 100) / 100) * c
  return (
    <span className="relative grid size-14 shrink-0 place-items-center">
      <svg className="size-14 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-primary-foreground/25" />
        <circle
          cx="22" cy="22" r={r} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset} className="text-primary-foreground transition-all"
        />
      </svg>
      <span className="absolute text-xs font-black text-primary-foreground tabular-nums">{value}%</span>
    </span>
  )
}

function StatBox({
  label, value, tone = 'default',
}: {
  label: string
  value: number
  tone?: 'default' | 'success' | 'danger' | 'warning' | 'primary'
}) {
  const toneClass =
    tone === 'success' ? 'text-success'
      : tone === 'danger' ? 'text-destructive'
        : tone === 'warning' ? 'text-amber-600'
          : tone === 'primary' ? 'text-primary'
            : 'text-foreground'
  return (
    <div className="p-2.5 bg-muted/50 border border-border/60 rounded-xl text-center">
      <p className={cn('text-xl font-black tabular-nums', toneClass)}>{value}</p>
      <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 leading-tight">{label}</p>
    </div>
  )
}

function QuickStat({
  icon: Icon, label, value, accent, onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  accent: 'primary' | 'indigo' | 'success' | 'amber'
  onClick?: () => void
}) {
  const accentCls =
    accent === 'primary' ? 'bg-primary/10 text-primary'
      : accent === 'indigo' ? 'bg-indigo-500/10 text-indigo-500'
        : accent === 'amber' ? 'bg-amber-500/10 text-amber-600'
          : 'bg-success/10 text-success'
  return (
    <button
      onClick={onClick}
      className="group text-left w-full rounded-2xl border border-border/60 bg-card p-3.5 transition-colors hover:border-primary/40 hover:bg-muted cursor-pointer flex items-center gap-3"
    >
      <span className={cn('grid size-10 place-items-center rounded-xl shrink-0', accentCls)}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-semibold truncate">{label}</p>
        <p className="text-base font-black text-foreground truncate">{value}</p>
      </div>
    </button>
  )
}

