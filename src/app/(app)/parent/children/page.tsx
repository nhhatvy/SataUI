'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Progress } from '@/shared/components/ui/progress'
import { children as allChildren, getChildData } from '@/shared/mock-data/parent-data'
import { getCourseSyllabus, getAttendanceStats } from '@/shared/mock-data/student-data'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { cn } from '@/shared/utils/utils'
import { ArrowRight, ShieldAlert, Users } from 'lucide-react'
import { PageHero, HeroMetric } from '@/shared/components/page-header'

type Tone = 'primary' | 'caution' | 'success' | 'quiz' | 'neutral'

export default function ParentChildrenPage() {
  const router = useRouter()
  const { setActiveChildId } = useActiveChildStore()

  const openStudentMode = (id: string) => {
    setActiveChildId(id)
    router.push('/student')
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <PageHero
        icon={Users}
        accent="parent"
        overline="Cổng phụ huynh"
        title="Các con"
        subtitle="Chọn một con để xem hồ sơ chi tiết hoặc chuyển sang Cổng học sinh của con."
        metric={<HeroMetric label="Đang học" value={`${allChildren.length} con`} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allChildren.map((c) => {
          const data = getChildData(c.id)
          const course = data?.courses?.[0]
          const syllabus = getCourseSyllabus(c.id)
          const att = getAttendanceStats(c.id)
          const progress = att.progressPct
          const pendingHw =
            syllabus.lessons.filter((l) => l.homework && l.homework.state !== 'submitted').length +
            syllabus.tests.filter((t) => t.state !== 'submitted').length
          const debt = data?.tuition?.status === 'due' ? data.tuition.amount : 0
          const nextClass = data?.upcomingSchedule?.[0]
          return (
            <Card key={c.id} className="border-border/60 rounded-2xl shadow-none">
              <CardContent className="flex flex-col gap-3 p-4">
                {/* head */}
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: c.avatarColor }}
                  >
                    {c.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-foreground truncate">{c.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium truncate">
                      {course?.title ?? 'Chưa có khóa học'} · {c.className}
                    </p>
                  </div>
                  {!c.imageConsent && (
                    <span
                      title="Chưa đồng ý cho phép sử dụng hình ảnh"
                      className="grid size-6 shrink-0 place-items-center rounded-md bg-caution/10 text-caution"
                    >
                      <ShieldAlert className="size-3.5" />
                    </span>
                  )}
                </div>

                {/* progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                    <span className="text-muted-foreground">Tiến độ khóa học</span>
                    <span className="text-primary tabular-nums shrink-0">{progress}% · {att.completed}/{att.total}</span>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-muted" />
                </div>

                {/* 4 mini metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <MiniStat label="Chuyên cần" value={`${att.rate}%`} tone={att.rate >= 90 ? 'success' : 'caution'} />
                  <MiniStat label="Bài chờ" value={`${pendingHw}`} tone={pendingHw > 0 ? 'primary' : 'success'} />
                  <MiniStat label="Học phí" value={debt > 0 ? 'Còn nợ' : 'Đủ'} tone={debt > 0 ? 'caution' : 'success'} />
                  <MiniStat label="Buổi tiếp theo" value={nextClass?.day ?? '—'} tone="neutral" />
                </div>

                {/* actions */}
                <div className="mt-1 flex items-center gap-2">
                  <Link
                    href={`/parent/children/${c.slug}`}
                    className="flex-1 min-w-0 truncate rounded-xl border border-border bg-card py-2 text-center text-sm font-bold text-foreground transition-colors hover:bg-muted"
                  >
                    Xem hồ sơ
                  </Link>
                  <button
                    onClick={() => openStudentMode(c.id)}
                    className="flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    <span className="truncate">Cổng học sinh</span>
                    <ArrowRight className="size-4 shrink-0" />
                  </button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: Tone }) {
  const valueCls =
    tone === 'success' ? 'text-success'
      : tone === 'caution' ? 'text-caution'
        : tone === 'primary' ? 'text-primary'
          : tone === 'quiz' ? 'text-quiz'
            : 'text-foreground'
  return (
    <div className="rounded-lg bg-muted/50 px-2 py-1.5 text-center">
      <p className={cn('text-sm font-bold tabular-nums leading-tight', valueCls)}>{value}</p>
      <p className="mt-0.5 truncate text-xs font-medium leading-tight text-muted-foreground">{label}</p>
    </div>
  )
}
