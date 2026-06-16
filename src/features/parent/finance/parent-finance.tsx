'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Dialog, DialogContent, DialogTitle } from '@/shared/components/ui/dialog'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { formatCurrency, getChildData } from '@/shared/mock-data/parent-data'
import { getCourseSyllabus } from '@/shared/mock-data/student-data'
import { cn } from '@/shared/utils/utils'
import { PageHeader, InfoNote } from '@/shared/components/page-header'
import { Wallet, CheckCircle2, QrCode, ShieldCheck, CalendarClock, ReceiptText } from 'lucide-react'

export function ParentFinance() {
  const { child } = useActiveChildStore()
  const syllabus = getCourseSyllabus(child.id)

  const [tuition, setTuition] = useState(getChildData(child.id)?.tuition)
  const [transactions, setTransactions] = useState(
    (getChildData(child.id)?.transactions ?? []).filter((t) => t.method !== 'Sales Draft' && t.status !== 'draft')
  )
  const [showQR, setShowQR] = useState(false)
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fresh = getChildData(child.id)
    setTuition(fresh?.tuition)
    setTransactions((fresh?.transactions ?? []).filter((t) => t.method !== 'Sales Draft' && t.status !== 'draft'))
    setShowQR(false)
    setSuccess(false)
  }, [child.id])

  const confirmedTotal = transactions.filter((t) => t.status === 'paid').reduce((s, t) => s + t.amount, 0)
  const debt = tuition?.status === 'due' ? tuition.amount : 0

  const handlePay = () => {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setSuccess(true)
      setTimeout(() => {
        setTuition((prev: any) => ({ ...prev, status: 'paid' }))
        setTransactions((prev) => [
          { id: 't_new', title: `Học phí ${tuition?.period}`, date: 'Hôm nay', amount: tuition?.amount ?? 0, status: 'paid' as const, method: 'VietQR / Chuyển khoản' },
          ...prev,
        ])
        setShowQR(false)
        setSuccess(false)
      }, 1400)
    }, 1100)
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <PageHeader
        icon={Wallet}
        title="Học phí & công nợ"
        subtitle={`Theo dõi học phí và công nợ của ${child.name} · ${syllabus.courseName}`}
      />

      <div className="mb-5">
        <InfoNote>
          Phụ huynh chỉ thấy các khoản <strong>kế toán đã xác nhận thực thu</strong>. Công nợ = giá phải đóng − số đã xác nhận.
          Phiếu thu tách riêng theo từng con/khóa học.
        </InfoNote>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Stat label="Đã thanh toán (đã xác nhận)" value={formatCurrency(confirmedTotal)} tone="success" />
        <Stat label="Công nợ còn lại" value={formatCurrency(debt)} tone={debt > 0 ? 'warning' : 'default'} />
        <Stat label="Kỳ đến hạn" value={debt > 0 ? (tuition?.dueDate ?? '—') : 'Đã đóng đủ'} tone={debt > 0 ? 'danger' : 'success'} small />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        {/* Left: due payment + history */}
        <div className="lg:col-span-2 space-y-6">
          {/* Khoản cần thanh toán */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Khoản cần thanh toán</h2>
            {debt > 0 ? (
              <Card className="border-amber-500/30 bg-amber-500/[0.03] rounded-2xl shadow-none">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider">{tuition?.period}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">Học phí {syllabus.courseName}</h3>
                      <p className="text-3xl font-bold text-primary mt-2">{formatCurrency(tuition?.amount ?? 0)}</p>
                    </div>
                    <Badge className="bg-destructive text-white text-sm font-black px-2.5 py-1 rounded-md shrink-0">Chưa thanh toán</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 p-3 rounded-xl border border-border/40 font-semibold">
                    <CalendarClock className="size-4 text-amber-600 shrink-0" />
                    Hạn đóng: <strong>{tuition?.dueDate}</strong> (còn {tuition?.daysLeft} ngày)
                  </div>
                  <button
                    onClick={() => setShowQR(true)}
                    className="w-full h-11 rounded-xl bg-primary text-sm font-black text-white hover:opacity-90 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <QrCode className="size-4.5" /> Thanh toán qua VietQR
                  </button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-success/30 bg-success/5 rounded-2xl shadow-none">
                <CardContent className="p-5 flex items-center gap-3 text-sm font-semibold text-success">
                  <CheckCircle2 className="size-5 shrink-0" />
                  {child.shortName} đã hoàn thành học phí kỳ {tuition?.period}. Cảm ơn quý phụ huynh!
                </CardContent>
              </Card>
            )}
          </section>

          {/* Lịch sử thanh toán */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ReceiptText className="size-4 text-slate-400" /> Phiếu thu đã xác nhận
            </h2>
            <Card className="border-border/60 rounded-2xl shadow-none overflow-hidden">
              <CardContent className="p-0 divide-y divide-slate-100">
                {transactions.filter((t) => t.status === 'paid').length === 0 ? (
                  <p className="p-6 text-center text-sm text-slate-400 font-semibold">Chưa có phiếu thu nào được xác nhận.</p>
                ) : (
                  transactions
                    .filter((t) => t.status === 'paid')
                    .map((tx) => (
                      <div key={tx.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{tx.title}</p>
                          <p className="text-sm text-slate-500 font-medium mt-0.5">{tx.date} · {tx.method}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-black text-slate-800">{formatCurrency(tx.amount)}</span>
                          <Badge className="bg-success/15 text-success border border-success/30 text-sm font-bold px-2.5 py-1 rounded-md">Đã xác nhận</Badge>
                        </div>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Right: note */}
        <aside className="lg:sticky lg:top-20">
          <Card className="border-border/60 rounded-2xl shadow-none bg-slate-50/60">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <ShieldCheck className="size-4 text-primary" /> Lưu ý về học phí
              </div>
              <ul className="space-y-2 text-sm text-slate-600 font-medium">
                <li className="flex gap-2"><span className="text-primary">•</span> Chỉ hiển thị các khoản <strong>kế toán đã xác nhận thực thu</strong>.</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Phiếu thu tách riêng theo từng con / khóa học.</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Công nợ = giá phải đóng − số đã xác nhận.</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* VietQR modal */}
      <Dialog open={showQR} onOpenChange={(o: boolean) => !o && setShowQR(false)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden rounded-2xl">
          <div className="p-6 text-center">
            <DialogTitle className="text-base font-bold text-slate-900">Thanh toán VietQR</DialogTitle>
            <p className="text-sm text-slate-500 font-medium mt-1">Quét mã bằng ứng dụng ngân hàng</p>
            {success ? (
              <div className="py-12 flex flex-col items-center gap-3">
                <span className="grid size-12 place-items-center bg-success/15 text-success rounded-full"><CheckCircle2 className="size-6" /></span>
                <p className="text-sm font-bold text-slate-900">Đã ghi nhận thanh toán!</p>
                <p className="text-sm text-slate-500 font-medium">Chờ kế toán xác nhận thực thu.</p>
              </div>
            ) : (
              <>
                <div className="my-5 aspect-square max-w-[13rem] mx-auto border border-dashed border-border p-3 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <div className="size-40 bg-slate-200 rounded-lg grid place-items-center text-sm font-bold text-slate-500">[ Mã QR mẫu ]</div>
                </div>
                <div className="text-left text-sm bg-slate-100/60 rounded-xl p-3 space-y-1 border border-border/40 font-semibold mb-4">
                  <div>Nội dung: <span className="text-primary font-extrabold uppercase">SATAROBO {child.id.toUpperCase()} HP</span></div>
                  <div>Số tiền: <span className="font-extrabold">{formatCurrency(tuition?.amount ?? 0)}</span></div>
                </div>
                <button onClick={handlePay} disabled={paying}
                  className="w-full h-11 rounded-xl bg-primary text-sm font-black text-white hover:opacity-90 disabled:opacity-50 cursor-pointer">
                  {paying ? 'Đang xác nhận...' : 'Tôi đã chuyển khoản'}
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function Stat({ label, value, tone, small }: { label: string; value: string; tone: 'success' | 'warning' | 'danger' | 'default'; small?: boolean }) {
  const cls =
    tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-amber-600' : tone === 'danger' ? 'text-destructive' : 'text-slate-900'
  return (
    <Card className="border-border/60 rounded-2xl shadow-none">
      <CardContent className="p-4">
        <p className="text-sm text-slate-500 font-medium leading-tight">{label}</p>
        <p className={cn('font-bold mt-1', small ? 'text-lg' : 'text-xl', cls)}>{value}</p>
      </CardContent>
    </Card>
  )
}
