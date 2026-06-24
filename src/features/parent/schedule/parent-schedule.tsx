'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { getChildData } from '@/shared/mock-data/parent-data'
import { getCourseSyllabus, getAttendanceStats, TODAY } from '@/shared/mock-data/student-data'
import { cn } from '@/shared/utils/utils'
import { PageHero } from '@/shared/components/page-header'
import { Clock, MapPin, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

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
  const nextClass = data?.upcomingSchedule?.[0]

  // Sự kiện lịch tháng SUY RA từ giáo trình của CON đang chọn (nguồn sự thật duy nhất):
  // đổi con -> đổi lịch; phủ mọi tháng có buổi học, không phụ thuộc dữ liệu tĩnh 1 tháng.
  const calendarEvents = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const toKey = (dmy: string) => {
      const [d, m, y] = dmy.split('/').map(Number)
      return `${y}-${pad(m)}-${pad(d)}`
    }
    const ev: Record<string, { type: string; label: string }> = {}
    syllabus.lessons.forEach((l) => {
      ev[toKey(l.date)] = {
        type: l.attendance === 'makeup' ? 'makeup' : 'normal',
        label: `Buổi ${l.index}: ${l.title}`,
      }
    })
    // Bài kiểm tra của giáo viên -> đánh dấu "Kiểm tra" theo hạn
    syllabus.tests.forEach((t) => {
      ev[toKey(t.due)] = { type: 'exam', label: t.title }
    })
    return ev
  }, [syllabus])

  // Tháng/năm đang xem — phụ huynh đổi qua bộ chọn bên dưới.
  const todayDate = TODAY.getDate()
  const [viewYear, setViewYear] = useState(TODAY.getFullYear())
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth() + 1) // 1-12

  const isCurrentMonth = viewYear === TODAY.getFullYear() && viewMonth === TODAY.getMonth() + 1

  // Danh sách năm cho dropdown; luôn đảm bảo có năm đang xem.
  const years = useMemo(() => {
    const base = Array.from({ length: 5 }, (_, i) => TODAY.getFullYear() - 2 + i)
    return base.includes(viewYear) ? base : [...base, viewYear].sort((a, b) => a - b)
  }, [viewYear])

  // Lùi/tiến 1 tháng — tự nhảy năm khi vượt qua T12 ↔ T1.
  const shiftMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth - 1 + delta, 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth() + 1)
  }
  const goToday = () => {
    setViewYear(TODAY.getFullYear())
    setViewMonth(TODAY.getMonth() + 1)
  }

  const monthGrid = useMemo(() => {
    const firstWeekday = (new Date(viewYear, viewMonth - 1, 1).getDay() + 6) % 7 // Mon-first
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate()
    const cells: ({ day: number; key: string; event: any } | null)[] = []
    for (let i = 0; i < firstWeekday; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      cells.push({ day: d, key, event: calendarEvents[key] || null })
    }
    return cells
  }, [calendarEvents, viewYear, viewMonth])

  const upcoming = syllabus.lessons.filter((l) => l.progress !== 'done').slice(0, 6)

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <PageHero
        icon={CalendarDays}
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

      {/* Desktop: 3 section dồn cột trái (col-span-2) + lịch tháng làm sidebar phải (col 3, sticky).
          Mobile: mọi class lg: bị vô hiệu → xếp dọc theo DOM y như cũ. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        {/* Buổi học tiếp theo */}
        {nextClass && (
          <section className="space-y-3 lg:col-span-2">
            <h2 className="text-base font-bold text-foreground uppercase tracking-wider">Buổi học tiếp theo</h2>
            <Card className="border-primary/20 bg-primary/5 rounded-2xl shadow-none py-0">
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

        {/* Lịch học tuần này */}
        <section className="space-y-3 lg:col-span-2">
          <h2 className="text-base font-bold text-foreground uppercase tracking-wider">Lịch học tuần này</h2>
          <Card className="border-border/60 rounded-2xl shadow-none py-0">
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

        {/* Lịch tháng — sidebar phải, sticky, trải hết chiều cao cột trái.
            row-span khớp số hàng cột trái: có "buổi tiếp theo" → 3, không có → 2. */}
        <aside
          className={cn(
            'space-y-3 lg:col-start-3 lg:row-start-1 lg:sticky lg:top-20',
            nextClass ? 'lg:row-span-3' : 'lg:row-span-2'
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2 min-w-0">
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">Lịch tháng</span>
            </h2>
            {!isCurrentMonth && (
              <button
                type="button"
                onClick={goToday}
                className="shrink-0 rounded-md px-2 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
              >
                Về hôm nay
              </button>
            )}
          </div>

          <Card className="border-border/60 rounded-2xl shadow-none py-0">
            <CardContent className="p-4">
              {/* Bộ chọn tháng / năm */}
              <div className="mb-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  aria-label="Tháng trước"
                  className="grid size-8 shrink-0 place-items-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(Number(e.target.value))}
                  aria-label="Chọn tháng"
                  className="h-8 min-w-0 flex-1 rounded-lg border border-border/60 bg-background px-2 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>Tháng {m}</option>
                  ))}
                </select>
                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(Number(e.target.value))}
                  aria-label="Chọn năm"
                  className="h-8 w-20 shrink-0 rounded-lg border border-border/60 bg-background px-2 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  aria-label="Tháng sau"
                  className="grid size-8 shrink-0 place-items-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Thứ trong tuần */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-bold text-muted-foreground py-1">{d}</div>
                ))}
              </div>
              {/* Lưới ngày */}
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
                        isCurrentMonth && cell.day === todayDate
                          ? 'bg-primary text-primary-foreground'
                          : cell.event
                          ? 'bg-muted text-foreground'
                          : 'text-muted-foreground'
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

        {/* Các buổi học sắp tới */}
        <section className="space-y-3 lg:col-span-2">
          <h2 className="text-base font-bold text-foreground uppercase tracking-wider">Các buổi học sắp tới</h2>
          <Card className="border-border/60 rounded-2xl shadow-none py-0">
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
    </main>
  )
}