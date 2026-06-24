'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import {
  getCourseSyllabus,
  getSessionReviews,
  getSessionExtras,
  TODAY,
  type SkillRating,
  type SessionReview,
} from '@/shared/mock-data/student-data'
import { cn } from '@/shared/utils/utils'
import { PageHero } from '@/shared/components/page-header'
import { Search, MessageSquareText, ChevronLeft, Calendar, User, Target, Image as ImageIcon, Lightbulb } from 'lucide-react'

function daysAgo(d: string): number {
  const [dd, mm, yyyy] = d.split('/').map(Number)
  return Math.floor((TODAY.getTime() - new Date(yyyy, mm - 1, dd).getTime()) / 86400000)
}

// Bộ tiêu chí đánh giá năng lực chuẩn của SataRobo (mức 1 = tốt nhất → mức cuối = cần cải thiện)
const RUBRIC: { group: string; name: string; levels: string[] }[] = [
  {
    group: 'Kiến thức',
    name: 'Kiến thức cũ',
    levels: [
      'Nhớ rõ kiến thức cũ và biết cách áp dụng, kết hợp kiến thức mới để giải quyết thử thách.',
      'Nhớ được hầu hết kiến thức cũ, đôi khi còn quên một số nội dung và cần giáo viên nhắc lại.',
      'Nhớ được kiến thức cũ nhưng còn bối rối trong việc áp dụng trong hoàn cảnh mới.',
    ],
  },
  {
    group: 'Kiến thức',
    name: 'Kiến thức mới',
    levels: [
      'Tiếp thu kiến thức tốt. Hoàn thành 100% các nhiệm vụ bài học.',
      'Tiếp thu kiến thức khá tốt, hoàn thành dưới 70% thử thách thuộc phần kiến thức mới.',
      'Hoàn thiện dưới 50% các nhiệm vụ kiến thức. Cần cố gắng hơn!',
    ],
  },
  {
    group: 'Kỹ năng',
    name: 'Sáng tạo (Creativity)',
    levels: [
      'Tự tin phát triển ý tưởng cá nhân, dám thử nghiệm các phương án khác nhau để giải quyết vấn đề.',
      'Đưa ra được nhiều ý tưởng sáng tạo nhưng cần giáo viên gợi ý lựa chọn và triển khai.',
      'Hoàn thiện nhiệm vụ theo mẫu của giáo viên.',
    ],
  },
  {
    group: 'Kỹ năng',
    name: 'Tư duy phản biện (Critical Thinking)',
    levels: [
      'Chủ động lập luận, tìm hiểu vấn đề và đưa ra phương án giải quyết.',
      'Tích cực lắng nghe và đặt câu hỏi, trao đổi xây dựng bài học.',
      'Còn rụt rè trong việc đưa ra quan điểm cá nhân.',
    ],
  },
  {
    group: 'Kỹ năng',
    name: 'Kỹ năng mềm',
    levels: [
      'Trình bày ý tưởng tự tin, điều phối công việc nhóm xuất sắc.',
      'Nỗ lực hoàn thành nhiệm vụ được giao, hướng tới đạt mục tiêu chung.',
      'Trình bày được ý tưởng nhưng chưa trôi chảy, cần tích cực hơn trong làm việc nhóm.',
    ],
  },
  {
    group: 'Sản phẩm',
    name: 'Mức độ hoàn thiện',
    levels: [
      'Sử dụng tất cả kiến thức bắt buộc. Tính năng hoạt động tốt, thẩm mỹ cao.',
      'Đạt được 50-70% kiến thức bài học. Tính năng cơ bản hoạt động.',
      'Dự án chưa hoàn thiện hoặc chưa chạy được tốt.',
    ],
  },
  {
    group: 'Sản phẩm',
    name: 'Ý tưởng dự án',
    levels: [
      'Dự án mở rộng chủ đề. Hoàn toàn cá nhân hóa, không sử dụng mẫu.',
      'Có sử dụng một số ý tưởng từ các dự án khác nhưng được thay đổi phù hợp.',
      'Dự án thể hiện 1 phần chủ đề và chủ yếu làm theo mẫu.',
    ],
  },
  {
    group: 'Thái độ học tập',
    name: 'Mức độ tập trung',
    levels: [
      'Rất tập trung, tương tác tốt với toàn bộ nội dung bài học.',
      'Thỉnh thoảng bị mất tập trung tại một số thời điểm.',
    ],
  },
  {
    group: 'Thái độ học tập',
    name: 'Thái độ giao tiếp',
    levels: [
      'Trao đổi, giao tiếp rất chủ động với thầy cô và bạn bè.',
      'Còn rụt rè trong việc giao tiếp với thầy cô và các bạn.',
    ],
  },
]

const RATING_RANK: Record<SkillRating, number> = { excellent: 0, good: 1, fair: 2, needs_improvement: 3 }

// Suy ra mức đánh giá (0 = tốt nhất) cho từng tiêu chí từ rating kỹ năng của buổi học
function selectedLevel(review: SessionReview, criterionIdx: number, numLevels: number): number {
  const skills = review.skills
  const rank = skills.length ? RATING_RANK[skills[criterionIdx % skills.length].rating] : 1
  return Math.min(numLevels - 1, Math.round((rank / 3) * (numLevels - 1)))
}

function levelMeta(lvl: number, numLevels: number): { label: string; cls: string } {
  const ratio = numLevels > 1 ? lvl / (numLevels - 1) : 0
  if (ratio <= 0.01) return { label: 'Tốt', cls: 'bg-success/15 text-success border-success/30' }
  if (ratio >= 0.99) return { label: 'Cần cải thiện', cls: 'bg-amber-500/15 text-amber-600 border-amber-500/30' }
  return { label: 'Khá', cls: 'bg-blue-500/15 text-blue-600 border-blue-500/30' }
}

type TimeRange = 'all' | '7' | '30' | '90'
type ViewedFilter = 'all' | 'viewed' | 'unviewed'

export function ParentComments() {
  const { child } = useActiveChildStore()
  const syllabus = getCourseSyllabus(child.id)
  const reviews = getSessionReviews(child.id)
  const extras = getSessionExtras(child.id)

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
      <PageHero
        icon={MessageSquareText}
        accent="parent"
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
            {active ? <Detail item={active} photos={extras[active.index]?.photos ?? []} onBack={() => setMobileDetail(false)} /> : <EmptyCard title="Chọn một buổi học" desc="Chọn buổi học bên trái để xem nhận xét chi tiết." />}
          </div>
        </div>
      )}
    </main>
  )
}

function SectionTitle({ n, children }: { n: number; children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-foreground">
      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground text-xs font-bold">{n}</span>
      {children}
    </h3>
  )
}

function Detail({ item, photos, onBack }: { item: any; photos: { id: string; caption: string; color: string }[]; onBack: () => void }) {
  const r: SessionReview = item.review

  // Nhóm liên tiếp các tiêu chí cùng nhóm để hiển thị dải tên nhóm
  return (
    <Card className="border-border/60 rounded-2xl shadow-none overflow-hidden animate-in fade-in duration-200">
      <CardContent className="p-0">
        {/* Header banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-parent to-parent/80 p-5 text-white">
          <button onClick={onBack} className="lg:hidden mb-2 inline-flex items-center gap-1 text-sm font-bold text-white/80 hover:text-white cursor-pointer">
            <ChevronLeft className="size-4" /> Danh sách
          </button>
          <p className="text-xs font-bold uppercase tracking-wider text-white/70">Báo cáo buổi học</p>
          <p className="text-lg font-bold leading-snug mt-0.5">Buổi {item.index} · {item.title}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-white/85 mt-2">
            <span className="inline-flex items-center gap-1"><Calendar className="size-3.5" /> {item.date}</span>
            <span className="inline-flex items-center gap-1"><User className="size-3.5" /> {r.teacher}</span>
            <span>Lớp: {item.className}</span>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Mục tiêu buổi học */}
          <section>
            <h4 className="flex items-center gap-1.5 text-sm font-bold text-foreground uppercase tracking-wider mb-2">
              <Target className="size-4 text-muted-foreground" /> Mục tiêu buổi học
            </h4>
            <ul className="space-y-1.5">
              {r.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground font-medium">
                  <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" /> {o}
                </li>
              ))}
            </ul>
          </section>

          {/* 1. Nhận xét của giáo viên */}
          <section className="space-y-3">
            <SectionTitle n={1}>Nhận xét của giáo viên</SectionTitle>
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 sm:p-5 space-y-3">
              <p className="text-sm font-bold text-primary">Đánh giá tổng quan quá trình học tập</p>
              <ul className="space-y-2 text-sm text-foreground font-medium leading-relaxed">
                <li><span className="font-bold text-success">Điểm nổi bật: </span>{r.highlights}</li>
                <li><span className="font-bold text-blue-600">Tiến bộ: </span>{r.progress}</li>
                <li><span className="font-bold text-amber-600">Cần cải thiện: </span>{r.improvements}</li>
              </ul>
              {r.suggestions.length > 0 && (
                <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
                  <Lightbulb className="size-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground font-medium leading-relaxed">
                    <span className="font-bold text-primary">Đề xuất: </span>{r.suggestions.join(' ')}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* 2. Đánh giá chi tiết năng lực */}
          <section className="space-y-3">
            <SectionTitle n={2}>Đánh giá chi tiết năng lực</SectionTitle>
            <div className="rounded-2xl border border-border/60 overflow-hidden">
              {RUBRIC.map((c, i) => {
                const lvl = selectedLevel(r, i, c.levels.length)
                const meta = levelMeta(lvl, c.levels.length)
                const showGroup = i === 0 || RUBRIC[i - 1].group !== c.group
                return (
                  <div key={c.name}>
                    {showGroup && (
                      <div className="bg-muted/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-600 border-t border-border/60 first:border-t-0">
                        {c.group}
                      </div>
                    )}
                    <div className="flex flex-col gap-2 border-t border-border/40 p-4 sm:flex-row sm:items-start sm:gap-4">
                      <div className="sm:w-44 sm:shrink-0">
                        <p className="text-sm font-bold text-foreground">{c.name}</p>
                        <Badge className={cn('mt-1 text-xs font-bold px-2 py-0.5 rounded-md border shadow-none', meta.cls)}>{meta.label}</Badge>
                      </div>
                      <p className="flex-1 text-sm text-foreground font-medium leading-relaxed">{c.levels[lvl]}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 3. Hình ảnh dự án & lớp học */}
          {photos.length > 0 && (
            <section className="space-y-3">
              <SectionTitle n={3}>Hình ảnh dự án &amp; lớp học</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((p) => (
                  <div key={p.id} className="rounded-xl border border-border/60 overflow-hidden bg-card">
                    <div className="aspect-[4/3] flex items-center justify-center" style={{ background: p.color }}>
                      <ImageIcon className="size-7 text-white/70" />
                    </div>
                    <p className="px-2.5 py-2 text-xs font-semibold text-foreground leading-snug">{p.caption}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
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
