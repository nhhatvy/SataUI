'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { getCourseSyllabus, getSessionReviews, getAttendanceStats, type SyllabusLesson } from '@/shared/mock-data/student-data'
import { PageHero } from '@/shared/components/page-header'
import { cn } from '@/shared/utils/utils'
import { List, Calendar, Target, ClipboardCheck, BookOpen, ChevronLeft } from 'lucide-react'

type AttStatus = 'present' | 'excused' | 'absent' | 'late' | 'makeup' | 'today' | 'upcoming'
const ATT_META: Record<AttStatus, { label: string; cls: string }> = {
  present: { label: 'Có mặt', cls: 'bg-success/15 text-success border-success/30' },
  excused: { label: 'Vắng có phép', cls: 'bg-amber-500/15 text-amber-600 border-amber-500/30' },
  absent: { label: 'Vắng', cls: 'bg-destructive/15 text-destructive border-destructive/30' },
  late: { label: 'Đi muộn', cls: 'bg-orange-500/15 text-orange-600 border-orange-500/30' },
  makeup: { label: 'Học bù', cls: 'bg-blue-500/15 text-blue-600 border-blue-500/30' },
  today: { label: 'Hôm nay', cls: 'bg-primary/15 text-primary border-primary/30' },
  upcoming: { label: 'Chưa diễn ra', cls: 'bg-muted text-muted-foreground border-border' },
}

export function StudentAttendance() {
  const { child } = useActiveChildStore()
  const syllabus = useMemo(() => getCourseSyllabus(child.id), [child.id])
  const reviews = useMemo(() => getSessionReviews(child.id), [child.id])
  const summary = useMemo(() => getAttendanceStats(child.id), [child.id])

  const attOf = (lesson: SyllabusLesson): AttStatus => {
    if (lesson.progress === 'upcoming') return 'upcoming'
    if (lesson.progress === 'current') return 'today'
    return (lesson.attendance as AttStatus) ?? 'present'
  }

  const currentIdx = syllabus.lessons.find((l) => l.progress === 'current')?.index ?? syllabus.lessons[0]?.index ?? null
  const [sel, setSel] = useState<number | null>(currentIdx)
  const [mobileDetail, setMobileDetail] = useState(false)
  const active = syllabus.lessons.find((l) => l.index === sel) ?? syllabus.lessons[0] ?? null

  const selectRow = (index: number) => {
    setSel(index)
    setMobileDetail(true)
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <PageHero
        icon={List}
        accent="student"
        title="Buổi học của em"
        subtitle={`Mục tiêu, điểm danh và bài tập từng buổi · ${syllabus.courseName}`}
        metric={
          <div className="grid w-full grid-cols-4 gap-2 sm:w-auto sm:gap-2.5">
            {[
              { label: 'Đã học', value: `${summary.completed}/${summary.total}` },
              { label: 'Có mặt', value: `${summary.present}` },
              { label: 'Vắng', value: `${summary.absent}` },
              { label: 'Đã học bù', value: `${summary.makeup}` },
            ].map((m) => (
              <div key={m.label} className="min-w-0 rounded-xl bg-white/15 px-2 py-2 text-center backdrop-blur-sm sm:px-3">
                <p className="text-base font-bold leading-none tabular-nums sm:text-lg">{m.value}</p>
                <p className="mt-1 truncate text-xs font-medium leading-tight text-white/75">{m.label}</p>
              </div>
            ))}
          </div>
        }
      />

      <div className="lg:grid lg:grid-cols-[19rem_1fr] lg:gap-5 lg:items-start">
        {/* LIST */}
        <div className={cn('lg:block', mobileDetail && 'hidden')}>
          <Card className="border-border/60 rounded-2xl shadow-none overflow-hidden lg:sticky lg:top-20">
            <CardContent className="p-0">
              <div className="divide-y divide-border max-h-[70vh] overflow-y-auto scrollbar-thin">
                {syllabus.lessons.map((l) => {
                  const att = attOf(l)
                  const selected = l.index === active?.index
                  return (
                    <button
                      key={l.index}
                      onClick={() => selectRow(l.index)}
                      className={cn('w-full text-left p-3.5 flex items-center gap-3 transition-colors relative', selected ? 'bg-primary/5' : 'hover:bg-muted')}
                    >
                      {selected && <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                      <span className={cn('grid size-8 place-items-center rounded-lg text-sm font-bold shrink-0',
                        l.progress === 'done' ? 'bg-success text-primary-foreground' : l.progress === 'current' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                        {l.progress === 'done' ? '✓' : l.index}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn('text-sm leading-snug truncate', selected ? 'font-bold text-foreground' : 'font-semibold text-foreground')}>Buổi {l.index}: {l.title}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">{l.date}</p>
                      </div>
                      <Badge className={cn('text-xs font-bold px-1.5 py-0.5 rounded-md border shadow-none shrink-0', ATT_META[att].cls)}>{ATT_META[att].label}</Badge>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DETAIL */}
        <div className={cn('lg:block', !mobileDetail && 'hidden')}>
          {active && <Detail lesson={active} att={attOf(active)} objectives={reviews[active.index]?.objectives} onBack={() => setMobileDetail(false)} />}
        </div>
      </div>
    </main>
  )
}

function Detail({ lesson, att, objectives, onBack }: { lesson: any; att: AttStatus; objectives?: string[]; onBack: () => void }) {
  const hw = lesson.homework
  return (
    <Card className="border-border/60 rounded-2xl shadow-none overflow-hidden animate-in fade-in duration-200">
      <CardContent className="p-0">
        <div className="p-5 border-b border-border/50 bg-muted/60">
          <button onClick={onBack} className="lg:hidden mb-2 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground cursor-pointer">
            <ChevronLeft className="size-4" /> Danh sách
          </button>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-base font-bold text-foreground leading-snug">Buổi {lesson.index} · {lesson.title}</p>
              <p className="text-sm text-muted-foreground font-medium mt-1 inline-flex items-center gap-1"><Calendar className="size-3.5" /> {lesson.date}</p>
            </div>
            <Badge className={cn('text-sm font-bold px-2.5 py-1 rounded-md border shadow-none shrink-0', ATT_META[att].cls)}>{ATT_META[att].label}</Badge>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Mục tiêu */}
          <section>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Target className="size-4 text-muted-foreground" /> Mục tiêu buổi học</h3>
            {objectives && objectives.length > 0 ? (
              <ul className="space-y-1.5">
                {objectives.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground font-medium"><span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" /> {o}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground font-medium">{lesson.progress === 'upcoming' ? 'Buổi học chưa diễn ra.' : 'Đang cập nhật.'}</p>
            )}
          </section>

          {/* Bài tập */}
          <section>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><BookOpen className="size-4 text-muted-foreground" /> Bài tập của buổi</h3>
            {hw ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/60 p-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{hw.title}</p>
                  <p className="text-xs text-muted-foreground font-medium">Hạn: {hw.due}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={cn('text-xs font-bold px-2 py-0.5 rounded-md border-none', hw.state === 'submitted' ? 'bg-success/15 text-success' : hw.state === 'overdue' ? 'bg-destructive/15 text-destructive' : 'bg-amber-500/15 text-amber-600')}>
                    {hw.state === 'submitted' ? 'Đã làm' : hw.state === 'overdue' ? 'Quá hạn' : 'Chưa làm'}
                  </Badge>
                  <Link href={`/student/homework/${hw.quizId}`} className="h-9 px-3.5 grid place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90">
                    {hw.state === 'submitted' ? 'Làm lại' : 'Làm bài'}
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-medium">Buổi này không có bài tập.</p>
            )}
          </section>

          {/* Điểm danh */}
          <section>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><ClipboardCheck className="size-4 text-muted-foreground" /> Điểm danh</h3>
            <Badge className={cn('text-sm font-bold px-2.5 py-1 rounded-md border shadow-none', ATT_META[att].cls)}>{ATT_META[att].label}</Badge>
          </section>
        </div>
      </CardContent>
    </Card>
  )
}
