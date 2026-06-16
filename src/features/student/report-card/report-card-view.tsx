'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Badge } from '@/shared/components/ui/badge'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { getChildData } from '@/shared/mock-data/parent-data'
import { getReportCardList, type ReportCardEntry } from '@/shared/mock-data/student-data'
import { Printer, Download, Lock, CheckCircle2, GraduationCap } from 'lucide-react'
import { cn } from '@/shared/utils/utils'

// Học bạ điện tử dạng văn bản chính thức, trình bày bằng bảng cho dễ đọc.
// Chỉ bản đã phát hành mới xem được. Dùng chung cổng Phụ huynh & Học sinh.
export function ReportCardView() {
  const { child } = useActiveChildStore()
  const childData = getChildData(child.id)
  const reports = useMemo(() => getReportCardList(child.id), [child.id])
  const published = useMemo(() => reports.filter((r) => r.status === 'published'), [reports])

  const [selectedId, setSelectedId] = useState<string | null>(published[0]?.id ?? null)
  useEffect(() => {
    setSelectedId(published[0]?.id ?? null)
  }, [child.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const active = published.find((r) => r.id === selectedId) ?? null

  if (published.length === 0) {
    return (
      <div className="rounded-3xl border border-border/60 bg-slate-50/60 p-12 text-center">
        <span className="grid size-16 place-items-center bg-slate-100 text-slate-400 rounded-full mx-auto mb-4">
          <Lock className="size-8" />
        </span>
        <h2 className="text-lg font-bold text-slate-900">Học bạ chưa được phát hành</h2>
        <p className="text-sm text-slate-500 font-medium mt-1 max-w-sm mx-auto">
          Học bạ của {child.shortName} sẽ hiển thị tại đây sau khi được trung tâm phát hành chính thức.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Selector bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-slate-500 mr-1">Chọn học bạ:</span>
        {reports.map((r) => {
          const isPublished = r.status === 'published'
          const selected = r.id === selectedId
          return (
            <button
              key={r.id}
              onClick={() => isPublished && setSelectedId(r.id)}
              disabled={!isPublished}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-bold transition-all',
                selected
                  ? 'border-primary bg-primary/5 text-primary'
                  : isPublished
                    ? 'border-border bg-white text-slate-600 hover:border-slate-300 cursor-pointer'
                    : 'border-border bg-slate-50 text-slate-400 cursor-not-allowed'
              )}
            >
              {r.period}
              {!isPublished && (
                <span className="text-[10px] font-bold text-slate-400">
                  ({r.status === 'draft' ? 'nháp' : 'chờ duyệt'})
                </span>
              )}
            </button>
          )
        })}
      </div>

      {active && <ReportPaper report={active} child={child} childData={childData} />}
    </div>
  )
}

function ratingFromValue(v: number) {
  if (v >= 85) return { label: 'Xuất sắc', bar: 'bg-success', text: 'text-success' }
  if (v >= 70) return { label: 'Tốt', bar: 'bg-blue-500', text: 'text-blue-600' }
  if (v >= 50) return { label: 'Khá', bar: 'bg-amber-500', text: 'text-amber-600' }
  return { label: 'Cần cải thiện', bar: 'bg-destructive', text: 'text-destructive' }
}

function ReportPaper({ report, child, childData }: { report: ReportCardEntry; child: any; childData: any }) {
  const att = childData?.attendanceSummary ?? { completed: 0, total: 0, present: 0, excused: 0, late: 0, unexcused: 0, makeup: 0, rate: 0 }
  const assignments = (childData?.assignments ?? []) as any[]
  const skills = (childData?.skillRadar ?? []) as any[]
  const teacher = child.id === 'minh' ? 'Thầy Hoàng Minh' : 'Cô Lan Anh'
  const course = child.id === 'minh' ? 'Lắp ráp Robotics cơ bản' : 'Lập trình Scratch'

  return (
    <div className="animate-in fade-in duration-300">
      {/* Actions */}
      <div className="mb-3 flex justify-end gap-2 print:hidden">
        <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-border hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl cursor-pointer shadow-2xs">
          <Printer className="size-4" /> In học bạ
        </button>
        <button onClick={() => alert('Đang tải học bạ PDF...')} className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white hover:opacity-90 text-sm font-black rounded-xl cursor-pointer border-none shadow-sm shadow-primary/20">
          <Download className="size-4" /> Tải PDF
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-border/60 overflow-hidden shadow-sm print:border-none print:shadow-none">
        {/* Document header */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-white p-6 flex items-start gap-4">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/20 text-primary shrink-0">
            <GraduationCap className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <Badge className="bg-primary text-white text-xs font-black px-2.5 py-0.5 rounded-md border-none uppercase tracking-wide">Học bạ chính thức</Badge>
            <h2 className="text-xl font-black text-white mt-2 leading-tight">{report.title}</h2>
            <p className="text-sm text-slate-300 font-semibold mt-1">
              Kỳ: {report.period} · Ngày công bố: {report.date} · Đơn vị: {report.author}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-7">
          {/* 1. Thông tin chung — bảng */}
          <Section title="Thông tin chung">
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm border-collapse">
                <tbody className="divide-y divide-border/60">
                  <Row2 a="Học viên" av={child.name} b="Lớp" bv={`${child.className} (${child.grade})`} />
                  <Row2 a="Khóa học" av={course} b="Giáo viên phụ trách" bv={teacher} />
                  <Row2 a="Mã học viên" av={`CS1-26-${child.initials}${child.id.toUpperCase()}`} b="Ngày phát hành" bv={report.date} />
                </tbody>
              </table>
            </div>
          </Section>

          {/* 2. Chuyên cần — bảng */}
          <Section title="Chuyên cần">
            <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
              <div className="overflow-x-auto rounded-xl border border-border/60">
                <table className="w-full text-sm border-collapse">
                  <tbody className="divide-y divide-border/60">
                    <RowKV k="Tổng số buổi chương trình" v={`${att.total} buổi`} bold />
                    <RowKV k="Số buổi đã học" v={`${att.completed} buổi`} />
                    <RowKV k="Có mặt" v={`${att.present} buổi`} vClass="text-success" />
                    <RowKV k="Vắng có phép" v={`${att.excused} buổi`} vClass="text-amber-600" />
                    <RowKV k="Vắng không phép" v={`${att.unexcused ?? 0} buổi`} vClass="text-destructive" />
                    <RowKV k="Đi muộn" v={`${att.late} buổi`} />
                    <RowKV k="Đã học bù" v={`${att.makeup} buổi`} vClass="text-indigo-600" />
                  </tbody>
                </table>
              </div>
              <div className="rounded-xl border border-success/30 bg-success/5 p-5 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tỷ lệ chuyên cần</p>
                <p className="text-4xl font-black text-success mt-1">{att.rate}%</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{att.present}/{att.total} buổi có mặt đúng giờ</p>
              </div>
            </div>
          </Section>

          {/* 3. Kết quả bài tập — bảng */}
          <Section title="Kết quả bài tập & kiểm tra">
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-500 font-bold uppercase tracking-wider text-xs">
                    <th className="px-4 py-2.5">Nội dung</th>
                    <th className="px-4 py-2.5">Trạng thái</th>
                    <th className="px-4 py-2.5 text-right">Điểm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-semibold text-slate-700">
                  {assignments.length === 0 ? (
                    <tr><td colSpan={3} className="px-4 py-4 text-center text-slate-400">Chưa có dữ liệu.</td></tr>
                  ) : (
                    assignments.map((a, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 font-bold text-slate-900">{a.title}</td>
                        <td className="px-4 py-3">
                          <Badge className={cn('text-xs font-bold px-2 py-0.5 rounded-md border-none',
                            a.status === 'graded' ? 'bg-success/15 text-success' : a.status === 'submitted' ? 'bg-blue-500/15 text-blue-600' : 'bg-slate-100 text-slate-500')}>
                            {a.status === 'graded' ? 'Đã chấm' : a.status === 'submitted' ? 'Đã nộp' : 'Chưa nộp'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-black text-slate-900">{a.status === 'graded' ? `${a.score}/10` : '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Section>

          {/* 4. Đánh giá năng lực — bảng + thanh */}
          <Section title="Đánh giá năng lực kỹ năng">
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-500 font-bold uppercase tracking-wider text-xs">
                    <th className="px-4 py-2.5">Kỹ năng</th>
                    <th className="px-4 py-2.5 w-1/2">Mức độ đạt được</th>
                    <th className="px-4 py-2.5 text-right">Xếp loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {skills.map((s, i) => {
                    const r = ratingFromValue(s.value)
                    return (
                      <tr key={i}>
                        <td className="px-4 py-3 font-bold text-slate-700">{s.skill}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                              <div className={cn('h-full rounded-full', r.bar)} style={{ width: `${s.value}%` }} />
                            </div>
                            <span className="text-sm font-bold text-slate-500 w-10 text-right">{s.value}%</span>
                          </div>
                        </td>
                        <td className={cn('px-4 py-3 text-right font-black whitespace-nowrap', r.text)}>{r.label}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
              <Legend cls="bg-success" t="Xuất sắc (≥85%)" />
              <Legend cls="bg-blue-500" t="Tốt (≥70%)" />
              <Legend cls="bg-amber-500" t="Khá (≥50%)" />
              <Legend cls="bg-destructive" t="Cần cải thiện" />
            </div>
          </Section>

          {/* 5. Nhận xét */}
          <Section title="Nhận xét tổng kết">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-slate-50/60 p-4">
                <p className="text-sm font-bold text-primary uppercase tracking-wide mb-1">Giữa khóa</p>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  {child.id === 'minh' ? 'Tiếp thu nhanh, hăng hái xây dựng bài. Cần rèn thêm tập trung khi viết câu lệnh phức tạp.' : 'Chăm ngoan, tư duy mỹ thuật lập trình nổi bật, nắm rõ kiến thức sự kiện và vòng lặp.'}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-slate-50/60 p-4">
                <p className="text-sm font-bold text-primary uppercase tracking-wide mb-1">Cuối khóa</p>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  {child.id === 'minh' ? 'Hoàn thành xuất sắc mô hình robot tránh vật cản tự động.' : 'Hoàn thành tốt game hứng quả, sáng tạo đồ họa nhân vật.'}
                </p>
              </div>
            </div>
          </Section>

          {/* 6. Kết luận */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-success/5 border border-success/20 rounded-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-black text-success uppercase">
              <CheckCircle2 className="size-5" /> Trạng thái: Hoàn thành xuất sắc
            </span>
            <span className="text-sm font-semibold text-slate-500">Xác nhận bởi: {report.author}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-l-4 border-primary pl-2.5">{title}</h3>
      {children}
    </section>
  )
}

function Row2({ a, av, b, bv }: { a: string; av: string; b: string; bv: string }) {
  return (
    <tr>
      <td className="px-4 py-3 bg-slate-50/60 font-bold text-slate-500 w-1/4 align-top">{a}</td>
      <td className="px-4 py-3 font-bold text-slate-900 w-1/4 align-top">{av}</td>
      <td className="px-4 py-3 bg-slate-50/60 font-bold text-slate-500 w-1/4 align-top">{b}</td>
      <td className="px-4 py-3 font-bold text-slate-900 w-1/4 align-top">{bv}</td>
    </tr>
  )
}

function RowKV({ k, v, vClass, bold }: { k: string; v: string; vClass?: string; bold?: boolean }) {
  return (
    <tr className={bold ? 'bg-slate-50/40' : ''}>
      <td className="px-4 py-2.5 font-semibold text-slate-600">{k}</td>
      <td className={cn('px-4 py-2.5 text-right font-bold', vClass || 'text-slate-900')}>{v}</td>
    </tr>
  )
}

function Legend({ cls, t }: { cls: string; t: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn('size-2.5 rounded-full', cls)} /> {t}
    </span>
  )
}
