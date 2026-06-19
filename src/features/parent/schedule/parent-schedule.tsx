'use client'

import React, { useMemo } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { getChildData } from '@/shared/mock-data/parent-data'
import { getCourseSyllabus, getAttendanceStats, TODAY } from '@/shared/mock-data/student-data'
import { cn } from '@/shared/utils/utils'
import { PageHero } from '@/shared/components/page-header'
import { Clock, MapPin, CalendarDays, CheckCircle2, type LucideIcon } from 'lucide-react'

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const EVENT_STYLE: Record<string, { dot: string; label: string }> = {
  normal: { dot: 'bg-primary', label: 'Buổi học' },
  makeup: { dot: 'bg-quiz', label: 'Học bù' },
  exam: { dot: 'bg-caution', label: 'Kiểm tra' },
  holiday: { dot: 'bg-schedule-cat', label: 'Nghỉ lễ' },
}

export function ParentSchedule() {
  const { child } = useActiveChildStore()
  const data = getChildData(child.id)
  const syllabus = getCourseSyllabus(child.id)

  const att = useMemo(() => getAttendanceStats(child.id), [child.id])
  const weekSchedule = data?.weekSchedule ?? []
  const calendarEvents = data?.calendarMonthEvents ?? {}
  const nextClass = data?.upcomingSchedule?.[0]

  // Lưới tháng theo mốc demo TODAY (tháng 05/2026)
  const year = TODAY.getFullYear()
  const month = TODAY.getMonth() + 1
  const todayDate = TODAY.getDate()
  const monthLabel = `${String(month).padStart(2, '0')}/${year}`
  const monthGrid = useMemo(() => {
    const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7 // Mon-first
    const daysInMonth = new Date(year, month, 0).getDate()
    const cells: ({ day: number; key: string; event: any } | null)[] = []
    for (let i = 0; i < firstWeekday; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      cells.push({ day: d, key, event: calendarEvents[key] || null })
    }
    return cells
  }, [calendarEvents, year, month])

  const upcoming = syllabus.lessons.filter((l) => l.progress !== 'done').slice(0, 6)

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <PageHero
        icon={CalendarDays}
        accent="parent"
        overline="Cổng phụ huynh"
        title="Lịch học"
        subtitle={`${child.name} · ${syllabus.courseName} · Lớp ${child.className}`}
        metric={
          <div className="grid w-full grid-cols-3 gap-2 sm:w-auto sm:gap-2.5">
            {[
              { label: 'Chuyên cần', value: `${att.rate}%` },
              { label: 'Đã học', value: `${att.completed}/${att.total}` },
              { label: 'Còn lại', value: `${att.remaining}` },
            ].map((m) => (
              <div key={m.label} className="min-w-0 rounded-xl bg-white/15 px-2 py-2 text-center backdrop-blur-sm sm:px-3">
                <p className="text-base font-bold leading-none tabular-nums sm:text-lg">{m.value}</p>
                <p className="mt-1 truncate text-xs font-medium leading-tight text-white/75">{m.label}</p>
              </div>
            ))}
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        {/* Left: tuần này + toàn bộ buổi */}
        <div className="lg:col-span-2 space-y-6">
          {/* Buổi học tiếp theo */}
          {nextClass && (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-foreground uppercase tracking-wider">Buổi học tiếp theo</h2>
              <Card className="border-primary/20 bg-primary/5 rounded-2xl shadow-none">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-bold text-foreground truncate min-w-0 flex-1">{nextClass.subject}</p>
                    <Badge className="bg-primary text-primary-foreground border-none text-xs font-bold px-2.5 py-1 rounded-md shrink-0">{nextClass.day}</Badge>
                  </div>
                  <div className="mt-3 grid gap-1.5 text-sm text-muted-foreground font-medium sm:grid-cols-2">
                    <span className="flex items-center gap-2 min-w-0"><Clock className="size-4 shrink-0 text-primary" /> <span className="truncate">{nextClass.time}</span></span>
                    <span className="flex items-center gap-2 min-w-0"><MapPin className="size-4 shrink-0 text-primary" /> <span className="truncate">{nextClass.room} · GV {nextClass.teacher}</span></span>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Tuần này */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground uppercase tracking-wider">Lịch học tuần này</h2>
            <Card className="border-border/60 rounded-2xl shadow-none">
              <CardContent className="p-0 divide-y divide-border">
                {weekSchedule.length === 0 ? (
                  <p className="p-6 text-center text-sm text-muted-foreground font-semibold">Không có lịch học tuần này.</p>
                ) : (
                  weekSchedule.map((day: any) => (
                    <div key={day.date} className={cn('flex gap-3 p-4', day.isToday && 'bg-primary/[0.03]')}>
                      <div className="w-12 shrink-0 text-center">
                        <p className={cn('text-sm font-bold', day.isToday ? 'text-primary' : 'text-foreground')}>{day.day}</p>
                        <p className="text-xs text-muted-foreground font-medium">{day.date}</p>
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        {(day.items || []).map((it: any) => (
                          <div key={it.id} className="flex items-start gap-2 min-w-0">
                            <span className={cn('mt-1.5 size-2 shrink-0 rounded-full',
                              it.status === 'done' ? 'bg-success' : it.status === 'today' ? 'bg-primary' : 'bg-muted-foreground/40')} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate min-w-0">{it.subject}</p>
                                <Badge className={cn('border-none text-xs font-bold px-2 py-0.5 rounded-md shrink-0',
                                  it.status === 'done' ? 'bg-success/15 text-success' : it.status === 'today' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground')}>
                                  {it.status === 'done' ? 'Đã học' : it.status === 'today' ? 'Hôm nay' : 'Sắp tới'}
                                </Badge>
                              </div>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground font-medium">{it.time} · {it.room} · GV {it.teacher}</p>
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
        </div>

        {/* Right: lịch tháng */}
        <aside className="lg:sticky lg:top-20 space-y-3">
          <h2 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <CalendarDays className="size-4 text-muted-foreground" /> Lịch tháng {monthLabel}
          </h2>
          <Card className="border-border/60 rounded-2xl shadow-none">
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-bold text-muted-foreground py-1">{d}</div>
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
                        cell.day === todayDate ? 'bg-primary text-primary-foreground' : cell.event ? 'bg-muted text-foreground' : 'text-muted-foreground'
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
                  <span key={k} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <span className={cn('size-2 rounded-full', v.dot)} /> {v.label}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
        <div>
          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground uppercase tracking-wider">Các buổi học sắp tới</h2>
            <Card className="border-border/60 rounded-2xl shadow-none">
              <CardContent className="p-0 divide-y divide-border">
                {upcoming.map((l) => (
                  <div key={l.index} className="p-4 flex items-center gap-3">
                    <span className={cn('grid size-9 place-items-center rounded-xl text-sm font-bold shrink-0',
                      l.progress === 'current' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                      {l.index}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground truncate">Buổi {l.index}: {l.title}</p>
                      <p className="text-sm text-muted-foreground font-medium mt-0.5">Dự kiến: {l.date}</p>
                    </div>
                    {l.progress === 'current' && <Badge className="bg-primary/15 text-primary border-none text-xs font-bold px-2 py-0.5 rounded-md">Đang học</Badge>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  )
}

function Stat({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone: 'success' | 'primary' | 'default' }) {
  const badgeCls = tone === 'success' ? 'bg-success/10 text-success' : tone === 'primary' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
  const valueCls = tone === 'success' ? 'text-success' : tone === 'primary' ? 'text-primary' : 'text-foreground'
  return (
    <Card className="border-border/60 rounded-2xl shadow-none">
      <CardContent className="flex flex-col items-center gap-1 p-4 text-center sm:flex-row sm:gap-3 sm:text-left">
        <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', badgeCls)}>
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className={cn('text-lg font-bold tabular-nums leading-tight sm:text-xl', valueCls)}>{value}</p>
          <p className="text-xs text-muted-foreground font-medium leading-tight mt-0.5">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
