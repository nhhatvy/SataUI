'use client'

import { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs'
import { getChildBySlug, getChildData } from '@/shared/mock-data/parent-data'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { ArrowLeft, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react'

export default function ChildProfilePage() {
  const router = useRouter()
  const params = useParams()
  const slug = params?.childSlug as string
  const { setActiveChildId } = useActiveChildStore()

  const child = useMemo(() => getChildBySlug(slug), [slug])
  const data = useMemo(() => (child ? getChildData(child.id) : null), [child])

  if (!child) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-10 text-center">
        <p className="text-base font-bold text-slate-900">Không tìm thấy hồ sơ học viên</p>
        <button
          onClick={() => router.push('/parent/children')}
          className="mt-4 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl cursor-pointer"
        >
          Quay lại danh sách
        </button>
      </main>
    )
  }

  const summary = data?.attendanceSummary
  const courses = data?.courses ?? []
  // Mã học viên mô phỏng (read-only) theo định dạng SRS Mục 8.6.
  const studentCode = `CS1-26-${child.initials}${child.id.toUpperCase()}`

  const openStudentMode = () => {
    setActiveChildId(child.id)
    router.push('/student')
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/parent/children')}
            className="size-10 grid place-items-center rounded-xl bg-slate-100 hover:bg-slate-200 border-none cursor-pointer text-slate-700"
          >
            <ArrowLeft className="size-4.5" />
          </button>
          <div className="flex items-center gap-3">
            <span
              className="grid size-11 place-items-center rounded-xl text-base font-black text-white"
              style={{ backgroundColor: child.avatarColor }}
            >
              {child.initials}
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">{child.name}</h1>
              <p className="text-sm text-slate-500 font-medium">{child.className} · {child.grade}</p>
            </div>
          </div>
        </div>
        <button
          onClick={openStudentMode}
          className="hidden sm:flex items-center gap-1.5 px-4 h-10 rounded-xl bg-primary text-white text-sm font-black hover:opacity-90 transition-opacity cursor-pointer"
        >
          Cổng học sinh <ArrowRight className="size-4" />
        </button>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="enroll">Enrollment & lớp</TabsTrigger>
          <TabsTrigger value="progress">Tiến độ</TabsTrigger>
        </TabsList>

        {/* TAB: Thông tin */}
        <TabsContent value="info" className="pt-4">
          <Card className="border-border/60 rounded-2xl shadow-none">
            <CardContent className="p-5 grid gap-4 sm:grid-cols-2">
              <Field label="Họ và tên" value={child.name} />
              <Field label="Mã học viên" value={studentCode} readOnly />
              <Field label="Lớp hiện tại" value={child.className} />
              <Field label="Khối lớp" value={child.grade} />
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Đồng ý sử dụng hình ảnh</p>
                {child.imageConsent ? (
                  <Badge className="bg-success/10 text-success border-none text-sm font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" /> Đã đồng ý
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500/10 text-amber-600 border-none text-sm font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
                    <ShieldAlert className="size-3.5" /> Chưa đồng ý — ảnh chung sẽ được làm mờ
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-400 sm:col-span-2 leading-relaxed">
                Một số thông tin (mã học viên, lớp, kết quả) là dữ liệu hệ thống, phụ huynh không chỉnh sửa trực tiếp.
                Liên hệ trung tâm nếu cần thay đổi.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Enrollment & lớp */}
        <TabsContent value="enroll" className="pt-4">
          <div className="space-y-3">
            {courses.length === 0 ? (
              <Card className="border-border/60 rounded-2xl shadow-none">
                <CardContent className="p-6 text-center text-sm font-semibold text-slate-400">
                  Chưa có khóa học đăng ký.
                </CardContent>
              </Card>
            ) : (
              courses.map((co) => (
                <Card key={co.id} className="border-border/60 rounded-2xl shadow-none">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-bold text-slate-900">{co.title}</h3>
                      <Badge className="bg-primary/10 text-primary border-none text-xs font-bold px-2 py-0.5 rounded-md">
                        {co.subject}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                      Đã hoàn thành {co.completed}/{co.lessons} buổi
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-slate-500">Tiến độ</span>
                        <span className="text-primary">{co.progress}%</span>
                      </div>
                      <Progress value={co.progress} className="h-2 bg-slate-100" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* TAB: Tiến độ (theo SRS Mục 17.5) */}
        <TabsContent value="progress" className="pt-4">
          <Card className="border-border/60 rounded-2xl shadow-none">
            <CardContent className="p-5">
              {summary ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Stat label="Tổng buổi" value={summary.total} />
                  <Stat label="Đã hoàn thành" value={summary.completed} tone="success" />
                  <Stat label="Còn lại" value={Math.max(summary.total - summary.completed, 0)} />
                  <Stat label="Vắng" value={summary.absent} tone="danger" />
                  <Stat label="Cần học bù" value={Math.max(summary.absent - summary.makeup, 0)} tone="warning" />
                  <Stat label="Đã học bù" value={summary.makeup} tone="primary" />
                </div>
              ) : (
                <p className="text-center text-sm font-semibold text-slate-400">Chưa có dữ liệu tiến độ.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <button
        onClick={openStudentMode}
        className="sm:hidden mt-6 w-full flex items-center justify-center gap-1.5 px-4 h-11 rounded-xl bg-primary text-white text-sm font-black cursor-pointer"
      >
        Mở Cổng học sinh của {child.shortName} <ArrowRight className="size-4" />
      </button>
    </main>
  )
}

function Field({ label, value, readOnly }: { label: string; value: string; readOnly?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-slate-900">
        {value}
        {readOnly && <span className="ml-2 text-xs font-medium text-slate-400">(không sửa)</span>}
      </p>
    </div>
  )
}

function Stat({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: number
  tone?: 'default' | 'success' | 'danger' | 'warning' | 'primary'
}) {
  const toneClass =
    tone === 'success'
      ? 'text-success'
      : tone === 'danger'
        ? 'text-destructive'
        : tone === 'warning'
          ? 'text-amber-600'
          : tone === 'primary'
            ? 'text-primary'
            : 'text-slate-900'
  return (
    <div className="p-4 bg-slate-50/60 border border-border/50 rounded-2xl text-center">
      <p className={`text-2xl font-bold ${toneClass}`}>{value}</p>
      <p className="text-sm text-slate-500 font-medium mt-0.5">{label}</p>
    </div>
  )
}
