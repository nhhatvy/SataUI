'use client'

import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { getCourseSyllabus, getSessionExtras } from '@/shared/mock-data/student-data'
import { StateMockWrapper } from '@/shared/components/state-mock-wrapper'
import { Smile, ThumbsUp, MessageSquareHeart } from 'lucide-react'
import { cn } from '@/shared/utils/utils'

// Nhận xét của giáo viên — CHIA THEO TỪNG BUỔI HỌC.
// Mỗi buổi có nhận xét riêng; chỉ hiển thị các buổi đã học và đã có nhận xét.
export function ParentFeedback() {
  const { child } = useActiveChildStore()
  const syllabus = getCourseSyllabus(child.id)
  const extras = getSessionExtras(child.id)

  const sessionsWithComment = syllabus.lessons.filter(
    (l) => l.progress !== 'upcoming' && extras[l.index]?.comment
  )

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Nhận xét theo buổi học</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Nhận xét của giáo viên dành cho {child.name} sau mỗi buổi học của khóa {syllabus.courseName}.
        </p>
      </div>

      <StateMockWrapper
        skeletonType="list"
        emptyTitle="Chưa có nhận xét"
        emptyDescription="Giáo viên sẽ ghi nhận xét sau mỗi buổi học của con."
      >
        {sessionsWithComment.length === 0 ? (
          <Card className="border-border/60 rounded-2xl shadow-none p-10 text-center">
            <CardContent className="flex flex-col items-center gap-3 p-0">
              <MessageSquareHeart className="size-10 text-slate-300" />
              <p className="text-sm font-bold text-muted-foreground">Chưa có nhận xét nào</p>
              <p className="text-sm text-muted-foreground max-w-xs">Nhận xét sẽ xuất hiện theo từng buổi học khi giáo viên cập nhật.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {sessionsWithComment.map((lesson) => {
              const c = extras[lesson.index]!.comment!
              const positive = c.sentiment === 'positive'
              return (
                <div key={lesson.index} className="relative">
                  {/* Session header chip */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-black shrink-0">
                      {lesson.index}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground leading-tight truncate">
                        Buổi {lesson.index}: {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">Ngày học: {lesson.date}</p>
                    </div>
                  </div>

                  {/* Comment card */}
                  <Card className="border-border/60 rounded-2xl shadow-none overflow-hidden relative ml-3.5">
                    <div className={cn('absolute left-0 top-0 bottom-0 w-1.5', positive ? 'bg-success' : 'bg-primary')} />
                    <CardContent className="p-5 pl-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="grid size-10 place-items-center rounded-xl bg-slate-900 text-sm font-black text-white">
                            {c.initials}
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-foreground leading-tight">{c.teacher}</h3>
                            <p className="text-sm text-muted-foreground font-semibold mt-0.5">{c.role}</p>
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            'rounded-md font-black text-sm px-2.5 py-1 shadow-none flex items-center gap-1 border',
                            positive
                              ? 'bg-success/15 text-success border-success/30'
                              : 'bg-primary/10 text-primary border-primary/20'
                          )}
                        >
                          {positive ? <Smile className="size-3.5" /> : <ThumbsUp className="size-3.5" />}
                          {positive ? 'Tích cực' : 'Cần lưu ý'}
                        </Badge>
                      </div>

                      <p className="mt-3.5 text-sm leading-relaxed text-foreground font-semibold bg-muted p-4 rounded-xl border border-border/40">
                        {c.content}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        )}
      </StateMockWrapper>
    </main>
  )
}
