'use client'

import React, { useMemo } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { getChildData } from '@/shared/mock-data/parent-data'
import { getCourseSyllabus } from '@/shared/mock-data/student-data'
import { cn } from '@/shared/utils/utils'
import { PageHeader } from '@/shared/components/page-header'
import { Clock, MapPin, CalendarDays, CheckCircle2 } from 'lucide-react'

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const EVENT_STYLE: Record<string, { dot: string; label: string }> = {
  normal: { dot: 'bg-primary', label: 'Buổi học' },
  makeup: { dot: 'bg-indigo-500', label: 'Học bù' },
  exam: { dot: 'bg-amber-500', label: 'Kiểm tra' },
  holiday: { dot: 'bg-rose-500', label: 'Nghỉ lễ' },
}

export function ParentSchedule() {
  const { child } = useActiveChildStore()
  const data = getChildData(child.id)
  const syllabus = getCourseSyllabus(child.id)

  const att = data?.attendanceSummary ?? { completed: 0, total: 0, rate: 0 }
  const weekSchedule = data?.weekSchedule ?? []
  const calendarEvents = data?.calendarMonthEvents ?? {}

  // Lưới tháng 06/2026
  const monthGrid = useMemo(() => {
    const year = 2026, month = 6
    const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7 // Mon-first
    const cells: ({ day: number; key: string; event: any } | null)[] = []
    for (let i = 0; i < firstWeekday; i++) cells.push(null)
    for (let d = 1; d <= 30; d++) {
      const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      cells.push({ day: d, key, event: calendarEvents[key] || null })
    }
    return cells
  }, [calendarEvents])

  const upcoming = syllabus.lessons.filter((l) => l.progress !== 'done').slice(0, 6)

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <PageHeader
        icon={CalendarDays}
        title="Lịch học"
        subtitle={`Lịch học và chuyên cần của ${child.name} · ${syllabus.courseName} · Lớp ${child.className}`}
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="Tỷ lệ chuyên cần" value={`${att.rate}%`} tone="success" />
        <Stat label="Buổi đã học" value={`${att.completed}/${att.total}`} tone="primary" />
        <Stat label="Buổi còn lại" value={`${Math.max(att.total - att.completed, 0)}`} tone="default" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        {/* Left: tuần này + toàn bộ buổi */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tuần này */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Lịch học tuần này</h2>
            <Card className="border-border/60 rounded-2xl shadow-none">
              <CardContent className="p-0 divide-y divide-slate-100">
                {weekSchedule.length === 0 ? (
                  <p className="p-6 text-center text-sm text-slate-400 font-semibold">Không có lịch học tuần này.</p>
                ) : (
                  weekSchedule.map((day: any) => (
                    <div key={day.date} className={cn('p-4 flex gap-4', day.isToday && 'bg-primary/[0.03]')}>
                      <div className="w-16 shrink-0 text-center">
                        <p className={cn('text-sm font-bold', day.isToday ? 'text-primary' : 'text-slate-900')}>{day.day}</p>
                        <p className="text-xs text-slate-400 font-medium">{day.date}</p>
                        {day.isToday && <Badge className="bg-primary text-white border-none text-[10px] font-bold px-1.5 py-0 rounded mt-1">Hôm nay</Badge>}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        {(day.items || []).map((it: any) => (
                          <div key={it.id} className="rounded-xl border border-border/50 bg-slate-50/50 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-bold text-slate-900 truncate">{it.subject}</p>
                              <Badge className={cn('border-none text-xs font-bold px-2 py-0.5 rounded-md shrink-0',
                                it.status === 'done' ? 'bg-success/15 text-success' : it.status === 'today' ? 'bg-primary/15 text-primary' : 'bg-slate-100 text-slate-500')}>
                                {it.status === 'done' ? 'Đã học' : it.status === 'today' ? 'Hôm nay' : 'Sắp tới'}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-slate-500 font-medium mt-1">
                              <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {it.time}</span>
                              <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {it.room}</span>
                              <span>GV {it.teacher}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>

          {/* Toàn bộ buổi học */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Các buổi học sắp tới</h2>
            <Card className="border-border/60 rounded-2xl shadow-none">
              <CardContent className="p-0 divide-y divide-slate-100">
                {upcoming.map((l) => (
                  <div key={l.index} className="p-4 flex items-center gap-3">
                    <span className={cn('grid size-9 place-items-center rounded-xl text-sm font-black shrink-0',
                      l.progress === 'current' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500')}>
                      {l.index}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate">Buổi {l.index}: {l.title}</p>
                      <p className="text-sm text-slate-400 font-medium mt-0.5">Dự kiến: {l.date}</p>
                    </div>
                    {l.progress === 'current' && <Badge className="bg-primary/15 text-primary border-none text-xs font-bold px-2 py-0.5 rounded-md">Đang học</Badge>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Right: lịch tháng */}
        <aside className="lg:sticky lg:top-20 space-y-3">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CalendarDays className="size-4 text-slate-400" /> Lịch tháng 06/2026
          </h2>
          <Card className="border-border/60 rounded-2xl shadow-none">
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthGrid.map((cell, i) =>
                  cell === null ? (
                    <div key={`e${i}`} />
                  ) : (
                    <div
                      key={cell.key}
                      title={cell.event ? `${EVENT_STYLE[cell.event.type]?.label}: ${cell.event.label}` : undefined}
                      className={cn(
                        'aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-semibold relative',
                        cell.event ? 'bg-slate-50 text-slate-900' : 'text-slate-500'
                      )}
                    >
                      {cell.day}
                      {cell.event && <span className={cn('absolute bottom-1 size-1.5 rounded-full', EVENT_STYLE[cell.event.type]?.dot)} />}
                    </div>
                  )
                )}
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pt-3 border-t border-border/50">
                {Object.entries(EVENT_STYLE).map(([k, v]) => (
                  <span key={k} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                    <span className={cn('size-2 rounded-full', v.dot)} /> {v.label}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/30 bg-success/5 rounded-2xl shadow-none">
            <CardContent className="p-4 flex items-center gap-2.5 text-sm font-semibold text-success">
              <CheckCircle2 className="size-4.5 shrink-0" />
              Chuyên cần {att.rate}% — {child.shortName} đang theo học đều đặn.
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone: 'success' | 'primary' | 'default' }) {
  const cls = tone === 'success' ? 'text-success' : tone === 'primary' ? 'text-primary' : 'text-slate-900'
  return (
    <Card className="border-border/60 rounded-2xl shadow-none">
      <CardContent className="p-4 text-center">
        <p className={cn('text-2xl font-bold', cls)}>{value}</p>
        <p className="text-sm text-slate-500 font-medium mt-0.5 leading-tight">{label}</p>
      </CardContent>
    </Card>
  )
}
