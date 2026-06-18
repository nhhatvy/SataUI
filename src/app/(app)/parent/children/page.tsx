'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { children as allChildren, getChildData } from '@/shared/mock-data/parent-data'
import { getAttendanceStats } from '@/shared/mock-data/student-data'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { ArrowRight, ShieldCheck, ShieldAlert, Users } from 'lucide-react'
import { PageHeader } from '@/shared/components/page-header'

export default function ParentChildrenPage() {
  const router = useRouter()
  const { setActiveChildId } = useActiveChildStore()

  const openStudentMode = (id: string) => {
    setActiveChildId(id)
    router.push('/student')
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-8 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <PageHeader
        icon={Users}
        title="Các con"
        subtitle="Chọn một con để xem hồ sơ chi tiết hoặc chuyển sang Cổng học sinh của con."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {allChildren.map((c) => {
          const data = getChildData(c.id)
          const course = data?.courses?.[0]
          const att = getAttendanceStats(c.id)
          const progress = att.progressPct
          return (
            <Card key={c.id} className="border-border/60 rounded-2xl shadow-none overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-12 place-items-center rounded-xl text-base font-black text-white shrink-0"
                    style={{ backgroundColor: c.avatarColor }}
                  >
                    {c.initials}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-foreground truncate">{c.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium truncate">
                      {c.className} · {c.grade}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-primary/10 text-primary border-none text-xs font-bold px-2 py-0.5 rounded-md">
                    {course?.title ?? 'Chưa có khóa học'}
                  </Badge>
                  {c.imageConsent ? (
                    <Badge className="bg-success/10 text-success border-none text-xs font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                      <ShieldCheck className="size-3" /> Đồng ý hình ảnh
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 text-amber-600 border-none text-xs font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                      <ShieldAlert className="size-3" /> Chưa đồng ý hình ảnh
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-muted-foreground">Tiến độ khóa học</span>
                    <span className="text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-muted" />
                  <p className="text-xs text-muted-foreground font-medium pt-1">
                    Đã học {att.completed}/{att.total} buổi · Học bù {att.doneMakeup}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={`/parent/children/${c.slug}`}
                    className="flex-1 text-center py-2 rounded-xl border border-border bg-card hover:bg-muted text-sm font-bold text-foreground transition-colors"
                  >
                    Xem hồ sơ
                  </Link>
                  <button
                    onClick={() => openStudentMode(c.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-black hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Cổng học sinh <ArrowRight className="size-4" />
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
