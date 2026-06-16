'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { getChildData } from '@/shared/mock-data/parent-data'
import { getCourseSyllabus, getClassLeaderboard } from '@/shared/mock-data/student-data'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { useScoreStore } from '@/shared/stores/useScoreStore'
import { StateMockWrapper } from '@/shared/components/state-mock-wrapper'
import { SessionJourney } from '@/shared/components/session-journey'
import { cn } from '@/shared/utils/utils'
import { Pencil, CalendarClock, Trophy, ArrowRight, Play, MapPin, Clock } from 'lucide-react'

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
  const board = useMemo(() => getClassLeaderboard(child.id), [child.id])
  const live = useScoreStore((s) => s.scores[child.id])

  // Hạng & điểm thành tích trong lớp (gộp điểm làm bài trong phiên)
  const myRanking = useMemo(() => {
    const merged = board.students.map((s) => {
      if (!s.isMe || !live || live.completed === 0) return s
      return { ...s, points: s.points + live.points }
    })
    const sorted = merged.sort((a, b) => b.points - a.points)
    const idx = sorted.findIndex((s) => s.isMe)
    const me = sorted[idx]
    return { rank: idx + 1, total: sorted.length, points: me?.points ?? 0 }
  }, [board, live])

  const att = data?.attendanceSummary ?? { present: 0, absent: 0, late: 0, excused: 0, unexcused: 0, makeup: 0, completed: 0, total: 0, rate: 0 }

  // Thống kê buổi theo Mục 17.5
  const breakdown = {
    total: att.total,
    completed: att.completed,
    remaining: Math.max(att.total - att.completed, 0),
    absent: att.absent,
    needMakeup: Math.max(att.absent - att.makeup, 0),
    doneMakeup: att.makeup,
  }

  // Bài tập + kiểm tra cần làm
  const pendingHomework = syllabus.lessons.filter((l) => l.homework && l.homework.state !== 'submitted').length
  const pendingTests = syllabus.tests.filter((t) => t.state !== 'submitted').length
  const todo = pendingHomework + pendingTests

  const nextClass = data?.upcomingSchedule?.[0] ?? null
  const dueHomework = syllabus.lessons.find((l) => l.homework && l.homework.state !== 'submitted')?.homework ?? null

  if (pageLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-40 w-full rounded-2xl lg:col-span-2" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300 space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-bold text-primary uppercase tracking-wider">Cổng học sinh</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl mt-1">
          Chào {child?.shortName ?? 'con'}, sẵn sàng học chưa nào?
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {syllabus.courseName} · Lớp {child.className} · GV {syllabus.teacher}
        </p>
      </div>

      <StateMockWrapper skeletonType="grid" emptyTitle="Chưa có dữ liệu" emptyDescription="Dữ liệu học tập của con sẽ hiển thị khi lớp bắt đầu.">
        {/* Signature: lộ trình buổi học (Mục 17.5) */}
        <Card className="border-border/60 rounded-2xl shadow-none">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Lộ trình buổi học</h2>
              <span className="text-sm font-semibold text-slate-500">{breakdown.completed}/{breakdown.total} buổi</span>
            </div>
            <div className="py-2.5">
              <SessionJourney childId={child.id} variant="line" />
            </div>
          </CardContent>
        </Card>

        {/* Progress breakdown 17.5 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatBox label="Tổng buổi" value={breakdown.total} />
          <StatBox label="Đã hoàn thành" value={breakdown.completed} tone="success" />
          <StatBox label="Còn lại" value={breakdown.remaining} />
          <StatBox label="Vắng" value={breakdown.absent} tone="danger" />
          <StatBox label="Cần học bù" value={breakdown.needMakeup} tone="warning" />
          <StatBox label="Đã học bù" value={breakdown.doneMakeup} tone="primary" />
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <QuickStat icon={Pencil} label="Bài tập chờ làm" value={`${todo} bài`} accent="primary" />
          <QuickStat icon={CalendarClock} label="Buổi học tiếp theo" value={nextClass ? nextClass.day : 'Chưa có'} accent="indigo" />
          <QuickStat icon={Trophy} label="Hạng trong lớp" value={`#${myRanking.rank}/${myRanking.total}`} accent="success" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: next session + homework */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue / homework CTA */}
            <Card className="border-border/60 rounded-2xl shadow-none bg-gradient-to-r from-primary/5 via-transparent to-transparent">
              <CardContent className="p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <Badge className="bg-primary/10 text-primary border-none text-xs font-bold px-2 py-0.5 rounded-md">Bài tập</Badge>
                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {dueHomework ? dueHomework.title : 'Con đã làm hết bài tập!'}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {dueHomework ? `Hạn nộp: ${dueHomework.due}` : 'Giữ vững phong độ học tập nhé.'}
                  </p>
                </div>
                <button
                  onClick={() => router.push('/student/homework')}
                  className="flex items-center gap-1.5 h-11 px-5 rounded-xl bg-primary text-white text-sm font-black hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Play className="size-4 fill-current" /> Vào làm bài
                </button>
              </CardContent>
            </Card>

            {/* Next class */}
            <Card className="border-border/60 rounded-2xl shadow-none">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Lớp học tiếp theo</h3>
                {nextClass ? (
                  <div className="space-y-2">
                    <p className="text-base font-bold text-slate-900">{nextClass.subject}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500 font-medium">
                      <span className="inline-flex items-center gap-1.5"><Clock className="size-4" /> {nextClass.time} ({nextClass.day})</span>
                      <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" /> {nextClass.room}</span>
                      <span className="inline-flex items-center gap-1.5">GV {nextClass.teacher}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Không có lịch học sắp tới.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: thành tích & xếp hạng */}
          <Card className="border-border/60 rounded-2xl shadow-none bg-gradient-to-b from-primary/5 to-transparent">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Thành tích của em</h3>
              <div className="flex items-center gap-3">
                <span className="grid size-14 place-items-center rounded-2xl bg-primary text-white text-xl font-black shrink-0">
                  #{myRanking.rank}
                </span>
                <div>
                  <p className="text-base font-bold text-slate-900">Hạng {myRanking.rank}/{myRanking.total} trong lớp</p>
                  <p className="text-sm text-slate-500 font-medium">{myRanking.points} điểm thành tích</p>
                </div>
              </div>
              <div className="rounded-xl bg-white border border-border/60 p-3 text-sm text-slate-600 font-medium">
                Làm thêm bài tập và bài kiểm tra để tăng điểm và leo hạng nhé!
              </div>
              <button
                onClick={() => router.push('/student/leaderboard')}
                className="w-full h-10 rounded-xl bg-primary text-white text-sm font-black hover:opacity-90 cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Trophy className="size-4" /> Xem bảng xếp hạng
              </button>
            </CardContent>
          </Card>
        </div>
      </StateMockWrapper>
    </main>
  )
}

function StatBox({
  label,
  value,
  tone = 'default',
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
            : 'text-slate-900'
  return (
    <div className="p-3.5 bg-white border border-border/60 rounded-2xl text-center">
      <p className={cn('text-2xl font-bold', toneClass)}>{value}</p>
      <p className="text-xs text-slate-500 font-medium mt-0.5 leading-tight">{label}</p>
    </div>
  )
}

function QuickStat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  accent: 'primary' | 'indigo' | 'success'
}) {
  const accentCls =
    accent === 'primary' ? 'bg-primary/10 text-primary'
      : accent === 'indigo' ? 'bg-indigo-500/10 text-indigo-500'
        : 'bg-success/10 text-success'
  return (
    <Card className="border-border/60 rounded-2xl shadow-none">
      <CardContent className="p-4 flex items-center gap-3">
        <span className={cn('grid size-11 place-items-center rounded-xl shrink-0', accentCls)}>
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-base font-bold text-slate-900 truncate">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
