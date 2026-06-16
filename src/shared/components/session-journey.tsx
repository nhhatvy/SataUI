'use client'

import React from 'react'
import { cn } from '@/shared/utils/utils'
import { getCourseSyllabus, getMakeupData } from '@/shared/mock-data/student-data'

type JourneyStatus = 'd' | 'm' | 'a' | 'u' | 'c'

interface SessionJourneyProps {
  childId: string
  variant?: 'line' | 'road' | 'grid'
}

export function SessionJourney({ childId, variant = 'line' }: SessionJourneyProps) {
  const syllabus = getCourseSyllabus(childId)
  const makeupData = getMakeupData(childId)

  const lessons = syllabus?.lessons ?? []
  if (lessons.length === 0) return null

  // Map lesson to journey status
  const getSessionStatus = (lesson: any): JourneyStatus => {
    if (lesson.progress === 'upcoming') {
      return 'u'
    }
    if (lesson.progress === 'current') {
      return 'c'
    }
    // Check if missed (absent)
    const isMissed = makeupData?.missed?.some((m: any) => m.lessonIndex === lesson.index)
    if (isMissed) {
      return 'a'
    }
    // Check if made up
    const isMakeup = makeupData?.history?.some(
      (h: any) => h.lessonTitle.toLowerCase().includes(lesson.title.toLowerCase()) || 
                  lesson.title.toLowerCase().includes(h.lessonTitle.toLowerCase())
    )
    if (isMakeup) {
      return 'm'
    }
    return 'd'
  }

  const DOT_STYLES: Record<JourneyStatus, { bg: string; border: string; ring: string | null }> = {
    d: { bg: 'bg-[#FF6A1C]', border: 'border-[#D9560F]', ring: null },
    m: { bg: 'bg-[#FF6A1C]', border: 'border-[#D9560F]', ring: 'ring-3 ring-[#3F9D6E]' },
    a: { bg: 'bg-white', border: 'border-[#E0524B]', ring: null },
    u: { bg: 'bg-white', border: 'border-[#CFCABD]', ring: null },
    c: { bg: 'bg-white', border: 'border-[#FF6A1C]', ring: 'ring-3 ring-[#FF6A1C]/20' },
  }

  // Draw the timeline
  if (variant === 'line') {
    return (
      <div className="space-y-6 select-none">
        <div className="relative flex items-center justify-between px-2 pt-6">
          {/* Connector Line behind dots */}
          <div className="absolute left-6 right-6 top-1/2 h-0.5 -translate-y-1/2 bg-[#EFECE4]" />

          {lessons.map((lesson, idx) => {
            const status = getSessionStatus(lesson)
            const style = DOT_STYLES[status]
            const isToday = status === 'c'

            return (
              <div key={lesson.index} className="relative z-10 flex flex-col items-center">
                {/* Current marker */}
                {isToday && (
                  <span className="absolute -top-7 text-[10px] font-black text-[#FF6A1C] uppercase whitespace-nowrap tracking-wider animate-bounce">
                    hôm nay ▾
                  </span>
                )}

                {/* Dot */}
                <div
                  title={`Buổi ${lesson.index}: ${lesson.title} (${lesson.date})`}
                  className={cn(
                    'grid size-5.5 place-items-center rounded-full border-2 text-white transition-all',
                    style.bg,
                    style.border,
                    style.ring
                  )}
                />

                {/* Index label below */}
                {(lesson.index % 2 !== 0 || idx === lessons.length - 1) && (
                  <span className="absolute -bottom-6 text-[10.5px] font-bold text-slate-500">
                    {lesson.index}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="pt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100">
          <LegendItem label="Đã học" bg="bg-[#FF6A1C]" border="border-[#D9560F]" />
          <LegendItem label="Học bù" bg="bg-[#FF6A1C]" border="border-[#D9560F]" ring="ring-2 ring-[#3F9D6E]" />
          <LegendItem label="Vắng (cần bù)" bg="bg-white" border="border-[#E0524B]" />
          <LegendItem label="Sắp tới" bg="bg-white" border="border-[#CFCABD]" />
          <LegendItem label="Hôm nay / Đang học" bg="bg-white" border="border-[#FF6A1C]" ring="ring-2 ring-[#FF6A1C]/20" />
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
                isDone ? 'text-white' : 'text-slate-500'
              )}
            >
              {lesson.index}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-100">
        <LegendItem label="Đã học" bg="bg-[#FF6A1C]" border="border-[#D9560F]" />
        <LegendItem label="Học bù" bg="bg-[#FF6A1C]" border="border-[#D9560F]" ring="ring-2 ring-[#3F9D6E]" />
        <LegendItem label="Vắng" bg="bg-white" border="border-[#E0524B]" />
        <LegendItem label="Chưa diễn ra" bg="bg-white" border="border-[#CFCABD]" />
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
    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
      <span className={cn('size-3 rounded-full border', bg, border, ring)} />
      <span>{label}</span>
    </span>
  )
}
