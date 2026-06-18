'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Dialog, DialogContent, DialogTitle } from '@/shared/components/ui/dialog'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { getMakeupData, type MissedSession, type MakeupHistory } from '@/shared/mock-data/student-data'
import { cn } from '@/shared/utils/utils'
import { PageHeader } from '@/shared/components/page-header'
import { CalendarClock, MapPin, Clock, Users, CheckCircle2, AlertTriangle, History as HistoryIcon, Building2 } from 'lucide-react'

const statusMeta: Record<MakeupHistory['status'], { label: string; cls: string }> = {
  pending: { label: 'Đang chờ duyệt', cls: 'bg-amber-500/15 text-amber-600 border border-amber-500/30' },
  approved: { label: 'Đã duyệt', cls: 'bg-blue-500/15 text-blue-600 border border-blue-500/30' },
  done: { label: 'Đã học bù', cls: 'bg-success/15 text-success border border-success/30' },
}

export function ParentMakeup() {
  const { child } = useActiveChildStore()
  const data = getMakeupData(child.id)

  const [history, setHistory] = useState<MakeupHistory[]>(data.history)
  const [activeMissed, setActiveMissed] = useState<MissedSession | null>(null)
  const [pickedId, setPickedId] = useState<string>('')
  const [note, setNote] = useState('')
  const [success, setSuccess] = useState(false)

  // re-sync khi đổi con
  const [lastChild, setLastChild] = useState(child.id)
  if (lastChild !== child.id) {
    setLastChild(child.id)
    setHistory(data.history)
    setActiveMissed(null)
  }

  const pendingCount = history.filter((h) => h.status === 'pending').length
  const doneCount = history.filter((h) => h.status === 'done').length

  const openFinder = (m: MissedSession) => {
    setActiveMissed(m)
    setPickedId('')
    setNote('')
    setSuccess(false)
  }

  const submitRequest = () => {
    const sug = data.suggestions.find((s) => s.id === pickedId)
    if (!sug || !activeMissed) return
    setSuccess(true)
    setTimeout(() => {
      setHistory((prev) => [
        { id: `h_new_${prev.length}`, lessonTitle: activeMissed.lessonTitle, targetClass: sug.className, campusName: sug.campusName, date: sug.date, status: 'pending' },
        ...prev,
      ])
      setActiveMissed(null)
    }, 1400)
  }

  const sameCampus = data.suggestions.filter((s) => s.campus === 'same')
  const otherCampus = data.suggestions.filter((s) => s.campus === 'other')

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <PageHeader
        icon={CalendarClock}
        title="Yêu cầu học bù"
        subtitle={`Đăng ký và theo dõi lịch học bù cho ${child.name}. Hệ thống đề xuất lớp phù hợp, ưu tiên cơ sở của con.`}
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <SummaryStat label="Buổi cần học bù" value={data.missed.length} tone="warning" />
        <SummaryStat label="Đang chờ duyệt" value={pendingCount} tone="blue" />
        <SummaryStat label="Đã học bù" value={doneCount} tone="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        {/* Left: missed sessions + history */}
        <div className="lg:col-span-2 space-y-6">
          {/* Buổi cần học bù */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground uppercase tracking-wider">Buổi cần học bù</h2>
            {data.missed.length === 0 ? (
              <Card className="border-success/30 bg-success/5 rounded-2xl shadow-none">
                <CardContent className="p-5 flex items-center gap-3 text-sm font-semibold text-success">
                  <CheckCircle2 className="size-5 shrink-0" />
                  {child.shortName} đã tham gia đầy đủ các buổi học. Không có buổi nào cần học bù.
                </CardContent>
              </Card>
            ) : (
              data.missed.map((m) => (
                <Card key={m.id} className="border-amber-500/30 bg-amber-500/[0.03] rounded-2xl shadow-none">
                  <CardContent className="p-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="grid size-10 place-items-center rounded-xl bg-amber-500/15 text-amber-600 shrink-0">
                        <AlertTriangle className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground">Buổi {m.lessonIndex}: {m.lessonTitle}</p>
                        <p className="text-sm text-muted-foreground font-medium mt-0.5">Vắng ngày {m.missedDate} · {m.reason}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => openFinder(m)}
                      className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-black hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                    >
                      <CalendarClock className="size-4" /> Tìm lịch học bù
                    </button>
                  </CardContent>
                </Card>
              ))
            )}
          </section>

          {/* Lịch sử */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <HistoryIcon className="size-4 text-muted-foreground" /> Lịch sử yêu cầu học bù
            </h2>
            {history.length === 0 ? (
              <Card className="border-border/60 rounded-2xl shadow-none p-6 text-center text-sm text-muted-foreground font-semibold">
                Chưa có yêu cầu học bù nào.
              </Card>
            ) : (
              <Card className="border-border/60 rounded-2xl shadow-none overflow-hidden">
                <CardContent className="p-0 divide-y divide-border">
                  {history.map((h) => (
                    <div key={h.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{h.lessonTitle}</p>
                        <p className="text-sm text-muted-foreground font-medium mt-0.5">
                          Lớp {h.targetClass} · {h.campusName} · {h.date}
                        </p>
                      </div>
                      <Badge className={cn('text-sm font-bold px-2.5 py-1 rounded-md shadow-none shrink-0', statusMeta[h.status].cls)}>
                        {statusMeta[h.status].label}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </section>
        </div>

        {/* Right: policy note */}
        <aside className="lg:sticky lg:top-20">
          <Card className="border-border/60 rounded-2xl shadow-none bg-muted/60">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Building2 className="size-4 text-primary" /> Chính sách học bù
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                <li className="flex gap-2"><span className="text-primary">•</span> Học bù đúng nội dung buổi đã vắng.</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Cho phép học bù <strong>liên cơ sở</strong> (CS1 ↔ CS2).</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Ưu tiên hiển thị lớp tại cơ sở của con trước.</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Yêu cầu cần CRM/Quản lý duyệt trước khi học.</li>
              </ul>
              <div className="text-sm text-muted-foreground font-medium pt-1 border-t border-border/60">
                Cơ sở của {child.shortName}: <strong className="text-foreground">{data.homeCampus}</strong>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Finder modal */}
      <Dialog open={!!activeMissed} onOpenChange={(o: boolean) => !o && setActiveMissed(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
          {activeMissed && (
            <div>
              <div className="p-5 border-b border-border/60 bg-muted/60">
                <DialogTitle className="text-base font-bold text-foreground">Chọn lịch học bù</DialogTitle>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  Buổi {activeMissed.lessonIndex}: {activeMissed.lessonTitle}
                </p>
              </div>

              {success ? (
                <div className="p-8 text-center space-y-3">
                  <span className="grid size-14 place-items-center bg-success/10 text-success rounded-full mx-auto">
                    <CheckCircle2 className="size-8" />
                  </span>
                  <h3 className="text-base font-bold text-foreground">Đã gửi yêu cầu học bù!</h3>
                  <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">
                    Yêu cầu đang chờ CRM/Quản lý duyệt. Bạn sẽ nhận thông báo khi có kết quả.
                  </p>
                </div>
              ) : (
                <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                  <CampusGroup title={`Cơ sở của con (${data.homeCampus})`} items={sameCampus} pickedId={pickedId} onPick={setPickedId} highlight />
                  {otherCampus.length > 0 && (
                    <CampusGroup title="Cơ sở khác (liên cơ sở)" items={otherCampus} pickedId={pickedId} onPick={setPickedId} />
                  )}

                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="Ghi chú gửi phòng đào tạo (tùy chọn)..."
                    className="w-full text-sm rounded-xl border border-border bg-card p-3 outline-none focus:border-primary font-medium text-foreground"
                  />

                  <button
                    onClick={submitRequest}
                    disabled={!pickedId}
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-black hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Gửi yêu cầu học bù
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

function CampusGroup({
  title,
  items,
  pickedId,
  onPick,
  highlight,
}: {
  title: string
  items: ReturnType<typeof getMakeupData>['suggestions']
  pickedId: string
  onPick: (id: string) => void
  highlight?: boolean
}) {
  return (
    <div className="space-y-2">
      <p className={cn('text-sm font-bold flex items-center gap-1.5', highlight ? 'text-primary' : 'text-muted-foreground')}>
        <MapPin className="size-3.5" /> {title}
      </p>
      <div className="space-y-2">
        {items.map((s) => {
          const picked = s.id === pickedId
          return (
            <button
              key={s.id}
              onClick={() => onPick(s.id)}
              className={cn(
                'w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer',
                picked ? 'border-primary bg-primary/5 shadow-2xs' : 'border-border bg-card hover:border-border'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-black text-foreground">Lớp {s.className}</span>
                <Badge className="bg-muted text-muted-foreground border-none text-xs font-bold px-2 py-0.5 rounded-md">
                  <Users className="size-3 mr-1" /> Còn {s.seatsLeft} chỗ
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-muted-foreground font-medium mt-1">
                <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {s.date} · {s.time}</span>
                <span>GV {s.teacher}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SummaryStat({ label, value, tone }: { label: string; value: number; tone: 'warning' | 'blue' | 'success' }) {
  const toneCls = tone === 'warning' ? 'text-amber-600' : tone === 'blue' ? 'text-blue-600' : 'text-success'
  return (
    <Card className="border-border/60 rounded-2xl shadow-none">
      <CardContent className="p-4 text-center">
        <p className={cn('text-2xl font-bold', toneCls)}>{value}</p>
        <p className="text-sm text-muted-foreground font-medium mt-0.5 leading-tight">{label}</p>
      </CardContent>
    </Card>
  )
}
