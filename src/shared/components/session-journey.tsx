'use client'

import React from 'react'
import { cn } from '@/shared/utils/utils'
import { getCourseSyllabus } from '@/shared/mock-data/student-data'

type JourneyStatus = 'd' | 'm' | 'a' | 'u' | 'c'

interface SessionJourneyProps {
  childId: string
  variant?: 'line' | 'road' | 'grid'
}

export function SessionJourney({ childId, variant = 'line' }: SessionJourneyProps) {
  const syllabus = getCourseSyllabus(childId)

  const lessons = syllabus?.lessons ?? []
  if (lessons.length === 0) return null

  // Trạng thái buổi suy ra trực tiếp từ điểm danh trong syllabus (nguồn sự thật duy nhất)
  const getSessionStatus = (lesson: any): JourneyStatus => {
    if (lesson.progress === 'upcoming') return 'u'
    if (lesson.progress === 'current') return 'c'
    if (lesson.attendance === 'excused' || lesson.attendance === 'absent') return 'a'
    if (lesson.attendance === 'makeup') return 'm'
    return 'd'
  }

  const DOT_STYLES: Record<JourneyStatus, { bg: string; border: string; ring: string | null }> = {
    d: { bg: 'bg-primary', border: 'border-primary', ring: null },
    m: { bg: 'bg-primary', border: 'border-primary', ring: 'ring-3 ring-success' },
    a: { bg: 'bg-card', border: 'border-destructive', ring: null },
    u: { bg: 'bg-card', border: 'border-border', ring: null },
    c: { bg: 'bg-card', border: 'border-primary', ring: 'ring-3 ring-primary/20' },
  }

  // Draw the timeline
  if (variant === 'line') {
    return (
      <div className="space-y-5 sm:space-y-6 select-none">
        <div className="relative flex items-center justify-between gap-0.5 px-1 sm:px-2 pt-6">
          {/* Connector Line behind dots */}
          <div className="absolute left-3 right-3 sm:left-6 sm:right-6 top-1/2 h-0.5 -translate-y-1/2 bg-border" />

          {lessons.map((lesson, idx) => {
            const status = getSessionStatus(lesson)
            const style = DOT_STYLES[status]
            const isToday = status === 'c'

            return (
              <div key={lesson.index} className="relative z-10 flex flex-col items-center">
                {/* Current marker */}
                {isToday && (
                  <span className="absolute -top-6 sm:-top-7 text-[9px] sm:text-[10px] font-black text-primary uppercase whitespace-nowrap tracking-wider animate-bounce">
                    hôm nay ▾
                  </span>
                )}

                {/* Dot */}
                <div
                  title={`Buổi ${lesson.index}: ${lesson.title} (${lesson.date})`}
                  className={cn(
                    'grid size-4 sm:size-5.5 place-items-center rounded-full border-2 text-primary-foreground transition-all',
                    style.bg,
                    style.border,
                    style.ring
                  )}
                />

                {/* Index label below */}
                {(lesson.index % 2 !== 0 || idx === lessons.length - 1) && (
                  <span className="absolute -bottom-5 sm:-bottom-6 text-[10px] sm:text-[10.5px] font-bold text-muted-foreground">
                    {lesson.index}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="pt-4 flex flex-wrap gap-x-3 gap-y-2 sm:gap-x-5 border-t border-border">
          <LegendItem label="Đã học" bg="bg-primary" border="border-primary" />
          <LegendItem label="Học bù" bg="bg-primary" border="border-primary" ring="ring-2 ring-success" />
          <LegendItem label="Vắng (cần bù)" bg="bg-card" border="border-destructive" />
          <LegendItem label="Sắp tới" bg="bg-card" border="border-border" />
          <LegendItem label="Hôm nay / Đang học" bg="bg-card" border="border-primary" ring="ring-2 ring-primary/20" />
        </div>
      </div>
    )
  }

  // Grid/Matrix Variant
  return (
    <div className="space-y-4 select-none">
      <div className="grid grid-cols-7 sm:grid-cols-8 gap-3 max-w-sm">
        {lessons.map((lesson) => {
          const status = getSessionStatus(lesson)
          const style = DOT_STYLES[status]
          const isDone = status === 'd' || status === 'm'

          return (
            <div
              key={lesson.index}
              title={`Buổi ${lesson.index}: ${lesson.title}`}
              className={cn(
                'grid aspect-square size-9 place-items-center rounded-full border-2 text-xs font-black transition-all cursor-default',
                style.bg,
                style.border,
                style.ring,
                isDone ? 'text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              {lesson.index}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border">
        <LegendItem label="Đã học" bg="bg-primary" border="border-primary" />
        <LegendItem label="Học bù" bg="bg-primary" border="border-primary" ring="ring-2 ring-success" />
        <LegendItem label="Vắng" bg="bg-card" border="border-destructive" />
        <LegendItem label="Chưa diễn ra" bg="bg-card" border="border-border" />
      </div>
    </div>
  )
}

function LegendItem({
  label,
  bg,
  border,
  ring,
}: {
  label: string
  bg: string
  border: string
  ring?: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
      <span className={cn('size-3 rounded-full border', bg, border, ring)} />
      <span>{label}</span>
    </span>
  )
}
