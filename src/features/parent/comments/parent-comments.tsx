'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import {
  getCourseSyllabus,
  getSessionReviews,
  SKILL_RATING_LABEL,
  TODAY,
  type SkillRating,
} from '@/shared/mock-data/student-data'
import { cn } from '@/shared/utils/utils'
import { PageHeader } from '@/shared/components/page-header'
import { Search, Check, MessageSquareText, ChevronLeft, Calendar, User } from 'lucide-react'

function daysAgo(d: string): number {
  const [dd, mm, yyyy] = d.split('/').map(Number)
  return Math.floor((TODAY.getTime() - new Date(yyyy, mm - 1, dd).getTime()) / 86400000)
}

const ratingBar: Record<SkillRating, { pct: number; bar: string; text: string }> = {
  excellent: { pct: 100, bar: 'bg-success', text: 'text-success' },
  good: { pct: 75, bar: 'bg-blue-500', text: 'text-blue-600' },
  fair: { pct: 50, bar: 'bg-amber-500', text: 'text-amber-600' },
  needs_improvement: { pct: 25, bar: 'bg-destructive', text: 'text-destructive' },
}

type TimeRange = 'all' | '7' | '30' | '90'
type ViewedFilter = 'all' | 'viewed' | 'unviewed'

export function ParentComments() {
  const { child } = useActiveChildStore()
  const syllabus = getCourseSyllabus(child.id)
  const reviews = getSessionReviews(child.id)

  const items = useMemo(
    () =>
      syllabus.lessons
        .filter((l) => reviews[l.index])
        .map((l) => ({ index: l.index, title: l.title, date: l.date, course: syllabus.courseName, className: child.className, review: reviews[l.index] })),
    [syllabus, reviews, child.className]
  )

  const teachers = useMemo(() => Array.from(new Set(items.map((i) => i.review.teacher))), [items])

  const [viewedSet, setViewedSet] = useState<Set<number>>(() => new Set(items.filter((i) => i.review.viewed).map((i) => i.index)))
  const [timeRange, setTimeRange] = useState<TimeRange>('all')
  const [teacher, setTeacher] = useState('all')
  const [viewedFilter, setViewedFilter] = useState<ViewedFilter>('all')
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState<number | null>(null)
  const [mobileDetail, setMobileDetail] = useState(false)

  const filtered = items.filter((i) => {
    if (timeRange !== 'all' && daysAgo(i.date) > Number(timeRange)) return false
    if (teacher !== 'all' && i.review.teacher !== teacher) return false
    const isViewed = viewedSet.has(i.index)
    if (viewedFilter === 'viewed' && !isViewed) return false
    if (viewedFilter === 'unviewed' && isViewed) return false
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      const hay = [i.title, i.review.highlights, i.review.progress, i.review.improvements, ...i.review.objectives, ...i.review.suggestions].join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  const activeIndex = filtered.find((i) => i.index === sel)?.index ?? filtered[0]?.index ?? null
  const active = items.find((i) => i.index === activeIndex) ?? null
  const unviewedCount = items.filter((i) => !viewedSet.has(i.index)).length

  const selectRow = (index: number) => {
    setSel(index)
    setViewedSet((prev) => new Set(prev).add(index))
    setMobileDetail(true)
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <PageHeader
        icon={MessageSquareText}
        title="Nhận xét theo buổi học"
        subtitle={`Nhận xét chi tiết của giáo viên dành cho ${child.name}${unviewedCount > 0 ? ` · ${unviewedCount} chưa xem` : ''}`}
      />

      {/* Filter bar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm tên bài học / nội dung nhận xét..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-card text-sm font-medium text-foreground outline-none focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-3 sm:flex gap-2.5">
          <Select value={timeRange} onChange={(v) => setTimeRange(v as TimeRange)} options={[['all', 'Mọi lúc'], ['7', '7 ngày'], ['30', '30 ngày'], ['90', '3 tháng']]} />
          <Select value={teacher} onChange={setTeacher} options={[['all', 'Mọi GV'], ...teachers.map((t) => [t, t] as [string, string])]} />
          <Select value={viewedFilter} onChange={(v) => setViewedFilter(v as ViewedFilter)} options={[['all', 'Tất cả'], ['unviewed', 'Chưa xem'], ['viewed', 'Đã xem']]} />
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyCard title="Chưa có nhận xét" desc="Giáo viên sẽ ghi nhận xét sau mỗi buổi học." />
      ) : (
        <div className="lg:grid lg:grid-cols-[20rem_1fr] lg:gap-5 lg:items-start">
          {/* LIST pane */}
          <div className={cn('lg:block', mobileDetail && 'hidden')}>
            <Card className="border-border/60 rounded-2xl shadow-none overflow-hidden lg:sticky lg:top-20">
              <CardContent className="p-0">
                {filtered.length === 0 ? (
                  <p className="p-6 text-center text-sm text-muted-foreground font-semibold">Không có nhận xét phù hợp bộ lọc.</p>
                ) : (
                  <div className="divide-y divide-border max-h-[70vh] overflow-y-auto scrollbar-thin">
                    {filtered.map((i) => {
                      const selected = i.index === activeIndex
                      const unviewed = !viewedSet.has(i.index)
                      return (
                        <button
                          key={i.index}
                          onClick={() => selectRow(i.index)}
                          className={cn('w-full text-left p-3.5 flex items-start gap-3 transition-colors relative', selected ? 'bg-primary/5' : 'hover:bg-muted')}
                        >
                          {selected && <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                          <span className={cn('grid size-8 place-items-center rounded-lg text-sm font-bold shrink-0', selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                            {i.index}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className={cn('text-sm leading-snug truncate', selected ? 'font-bold text-foreground' : 'font-semibold text-foreground')}>{i.title}</p>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5 truncate">{i.date} · {i.review.teacher}</p>
                          </div>
                          {unviewed && <span className="mt-1 size-2 rounded-full bg-primary shrink-0" title="Chưa xem" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* DETAIL pane */}
          <div className={cn('lg:block', !mobileDetail && 'hidden')}>
            {active ? <Detail item={active} onBack={() => setMobileDetail(false)} /> : <EmptyCard title="Chọn một buổi học" desc="Chọn buổi học bên trái để xem nhận xét chi tiết." />}
          </div>
        </div>
      )}
    </main>
  )
}

function Detail({ item, onBack }: { item: any; onBack: () => void }) {
  const r = item.review
  return (
    <Card className="border-border/60 rounded-2xl shadow-none overflow-hidden animate-in fade-in duration-200">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-5 border-b border-border/50 bg-muted/60">
          <button onClick={onBack} className="lg:hidden mb-2 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground cursor-pointer">
            <ChevronLeft className="size-4" /> Danh sách
          </button>
          <p className="text-base font-bold text-foreground leading-snug">Buổi {item.index} · {item.title}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium mt-1.5">
            <span className="inline-flex items-center gap-1"><Calendar className="size-3.5" /> {item.date}</span>
            <span className="inline-flex items-center gap-1"><User className="size-3.5" /> {r.teacher}</span>
            <span>Lớp: {item.className}</span>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Mục tiêu */}
          <section>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">Mục tiêu buổi học</h3>
            <ul className="space-y-1.5">
              {r.objectives.map((o: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground font-medium">
                  <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" /> {o}
                </li>
              ))}
            </ul>
          </section>

          {/* Kỹ năng */}
          <section>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2.5">Đánh giá kỹ năng</h3>
            <div className="space-y-2.5">
              {r.skills.map((s: any) => {
                const rb = ratingBar[s.rating as SkillRating]
                return (
                  <div key={s.name} className="grid grid-cols-[5.5rem_1fr_auto] sm:grid-cols-[7rem_1fr_5.5rem] items-center gap-2 sm:gap-3">
                    <span className="text-sm font-semibold text-foreground truncate">{s.name}</span>
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                      <div className={cn('h-full rounded-full', rb.bar)} style={{ width: `${rb.pct}%` }} />
                    </div>
                    <span className={cn('text-xs sm:text-sm font-bold text-right whitespace-nowrap', rb.text)}>{SKILL_RATING_LABEL[s.rating as SkillRating]}</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Chi tiết */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Nhận xét chi tiết</h3>
            <DetailBlock label="Điểm nổi bật" tone="success" text={r.highlights} />
            <DetailBlock label="Tiến bộ" tone="blue" text={r.progress} />
            <DetailBlock label="Cần cải thiện" tone="amber" text={r.improvements} />
          </section>

          {/* Đề xuất */}
          <section>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">Đề xuất cho phụ huynh</h3>
            <ul className="space-y-2">
              {r.suggestions.slice(0, 3).map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground font-medium">
                  <span className="mt-0.5 grid size-5 place-items-center rounded-md border border-border bg-card shrink-0">
                    <Check className="size-3.5 text-muted-foreground" />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </CardContent>
    </Card>
  )
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-xl border border-border bg-card px-2.5 text-sm font-bold text-foreground outline-none focus:border-primary cursor-pointer min-w-0"
    >
      {options.map(([v, l]) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
  )
}

function DetailBlock({ label, tone, text }: { label: string; tone: 'success' | 'blue' | 'amber'; text: string }) {
  const cls = tone === 'success' ? 'border-success/30 bg-success/5' : tone === 'blue' ? 'border-blue-500/30 bg-blue-500/5' : 'border-amber-500/30 bg-amber-500/5'
  const labelCls = tone === 'success' ? 'text-success' : tone === 'blue' ? 'text-blue-600' : 'text-amber-600'
  return (
    <div className={cn('rounded-xl border p-3.5', cls)}>
      <p className={cn('text-sm font-bold mb-1', labelCls)}>{label}</p>
      <p className="text-sm text-foreground font-medium leading-relaxed">{text}</p>
    </div>
  )
}

function EmptyCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="border-border/60 rounded-2xl shadow-none p-10 text-center">
      <CardContent className="flex flex-col items-center gap-3 p-0">
        <MessageSquareText className="size-10 text-slate-300" />
        <p className="text-sm font-bold text-muted-foreground">{title}</p>
        <p className="text-sm text-muted-foreground max-w-xs">{desc}</p>
      </CardContent>
    </Card>
  )
}
