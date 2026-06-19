'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { cn } from '@/shared/utils/utils'
import { PageHeader, InfoNote } from '@/shared/components/page-header'
import { ArrowLeft, Send, CheckCircle2, AlertCircle, Lock, Clock, ChevronRight, ClipboardList } from 'lucide-react'

type SurveyField = {
  id: string
  type: 'rating' | 'choice' | 'checkbox' | 'text' | 'slider'
  question: string
  required: boolean
  options?: string[]
  min?: number
  max?: number
  minLabel?: string
  maxLabel?: string
}
type SurveySchema = {
  id: string
  title: string
  subtitle: string
  category: string
  timeLimit: string
  fields: SurveyField[]
}

const SURVEY_SCHEMAS: SurveySchema[] = [
  {
    id: 's_edu',
    title: 'Chất lượng giảng dạy & Giáo trình',
    subtitle: 'Đánh giá chất lượng bài giảng và phương pháp truyền đạt tại trung tâm.',
    category: 'Đào tạo',
    timeLimit: '3 phút',
    fields: [
      { id: 'edu_1', type: 'rating', question: 'Mức độ hài lòng về chất lượng chuyên môn và sự hỗ trợ của giáo viên đứng lớp?', required: true },
      { id: 'edu_2', type: 'choice', question: 'Sau giờ học, con có thường chủ động chia sẻ về sản phẩm robot/code đã làm không?', required: true, options: ['Rất thường xuyên', 'Thỉnh thoảng', 'Hiếm khi'] },
      { id: 'edu_3', type: 'checkbox', question: 'Kỹ năng phụ huynh mong muốn con tiến bộ nhất? (chọn tối thiểu 1)', required: true, options: ['Tư duy thuật toán & lập trình', 'Lắp ráp cơ khí, mạch robot', 'Thuyết trình sản phẩm', 'Hợp tác làm việc nhóm'] },
      { id: 'edu_4', type: 'text', question: 'Góp ý cụ thể về nội dung chương trình học?', required: false },
    ],
  },
  {
    id: 's_fac',
    title: 'Cơ sở vật chất & Phòng Lab',
    subtitle: 'Khảo sát mức độ hài lòng về thiết bị, linh kiện và không gian học.',
    category: 'Cơ sở vật chất',
    timeLimit: '2 phút',
    fields: [
      { id: 'fac_1', type: 'slider', question: 'Đánh giá độ hiện đại của máy tính và dụng cụ lắp ráp?', required: true, min: 1, max: 10, minLabel: 'Cần cải thiện', maxLabel: 'Rất tốt' },
      { id: 'fac_2', type: 'checkbox', question: 'Khu vực cần cải thiện nhất? (có thể chọn nhiều)', required: false, options: ['Điều hòa phòng Lab', 'Bổ sung bộ kit robot', 'Phòng chờ phụ huynh', 'Bàn ghế phù hợp lứa tuổi'] },
      { id: 'fac_3', type: 'text', question: 'Đóng góp thêm về cơ sở vật chất?', required: false },
    ],
  },
  {
    id: 's_care',
    title: 'Dịch vụ & Chăm sóc học viên',
    subtitle: 'Đánh giá thái độ đón tiếp, hỗ trợ và cập nhật thông tin cho phụ huynh.',
    category: 'Dịch vụ',
    timeLimit: '2 phút',
    fields: [
      { id: 'care_1', type: 'rating', question: 'Mức độ hài lòng về thái độ đón trả con và hỗ trợ của lễ tân?', required: true },
      { id: 'care_2', type: 'choice', question: 'Thông tin (ảnh lớp, nhận xét, điểm danh) gửi về có đầy đủ không?', required: true, options: ['Rất đầy đủ & nhanh', 'Tương đối, hơi chậm', 'Còn hạn chế'] },
      { id: 'care_3', type: 'text', question: 'Đề xuất cải tiến cho trung tâm?', required: false },
    ],
  },
]

export function ParentSurvey({ defaultSurveyId }: { defaultSurveyId?: string }) {
  const { child } = useActiveChildStore()

  const [activeId, setActiveId] = useState<string | null>(defaultSurveyId ?? null)
  const [submittedRegistry, setSubmittedRegistry] = useState<Record<string, Record<string, boolean>>>({})
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('parent-surveys-submitted-registry')
    if (saved) {
      try { setSubmittedRegistry(JSON.parse(saved)) } catch (e) { console.error(e) }
    }
  }, [])

  const activeSurvey = useMemo(() => SURVEY_SCHEMAS.find((s) => s.id === activeId) ?? null, [activeId])
  const isLocked = useMemo(() => {
    if (!activeSurvey) return false
    return !!(submittedRegistry[child.id]?.[activeSurvey.id])
  }, [submittedRegistry, child.id, activeSurvey])

  useEffect(() => {
    if (!activeSurvey) return
    const defaults: Record<string, any> = {}
    activeSurvey.fields.forEach((f) => {
      defaults[f.id] = f.type === 'rating' ? 0 : f.type === 'slider' ? 5 : f.type === 'checkbox' ? [] : ''
    })
    setFormData(defaults)
    setError(null)
    setSuccess(false)
  }, [activeId, child.id, activeSurvey])

  const isDone = (id: string) => !!(submittedRegistry[child.id]?.[id])

  const validate = () => {
    if (!activeSurvey) return false
    for (const f of activeSurvey.fields) {
      if (!f.required) continue
      const v = formData[f.id]
      if (f.type === 'rating' && (!v || v === 0)) return setError('Vui lòng chọn mức đánh giá sao.'), false
      if (f.type === 'choice' && !v) return setError('Vui lòng chọn một phương án.'), false
      if (f.type === 'checkbox' && (!v || v.length === 0)) return setError('Vui lòng chọn ít nhất một mục.'), false
      if (f.type === 'text' && (!v || !v.trim())) return setError('Vui lòng điền câu trả lời bắt buộc.'), false
    }
    setError(null)
    return true
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked || !activeSurvey) return
    if (!validate()) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
      const next = { ...submittedRegistry, [child.id]: { ...(submittedRegistry[child.id] || {}), [activeSurvey.id]: true } }
      setSubmittedRegistry(next)
      sessionStorage.setItem('parent-surveys-submitted-registry', JSON.stringify(next))
    }, 1000)
  }

  // ---------- LIST VIEW ----------
  if (!activeSurvey) {
    const openCount = SURVEY_SCHEMAS.filter((s) => !isDone(s.id)).length
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
        <PageHeader
          icon={ClipboardList}
          title="Khảo sát trung tâm"
          subtitle={`Ý kiến của phụ huynh giúp SataRobo nâng cao chất lượng.${openCount > 0 ? ` Còn ${openCount} khảo sát chưa làm.` : ''}`}
        />

        <div className="mb-5">
          <InfoNote>
            Khảo sát đánh giá <strong>trung tâm/cơ sở</strong> (chất lượng giảng dạy, cơ sở vật chất, dịch vụ). Mọi câu trả lời được tổng hợp <strong>ẩn danh</strong>; mỗi khảo sát chỉ gửi một lần cho mỗi con.
          </InfoNote>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SURVEY_SCHEMAS.map((s) => {
            const done = isDone(s.id)
            return (
              <Card key={s.id} className="border-border/60 rounded-2xl shadow-none flex flex-col">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <ClipboardList className="size-5" />
                    </span>
                    {done ? (
                      <Badge className="bg-success/15 text-success border border-success/30 text-xs font-bold px-2 py-0.5 rounded-md">Đã làm</Badge>
                    ) : (
                      <Badge className="bg-amber-500/15 text-amber-600 border border-amber-500/30 text-xs font-bold px-2 py-0.5 rounded-md">Chưa làm</Badge>
                    )}
                  </div>
                  <Badge className="bg-muted text-muted-foreground border-none text-xs font-bold px-2 py-0.5 rounded-md w-fit mb-1.5">{s.category}</Badge>
                  <h3 className="text-base font-bold text-foreground leading-snug">{s.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium mt-1 flex-1">{s.subtitle}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                    <span className="text-sm text-muted-foreground font-medium inline-flex items-center gap-1"><Clock className="size-3.5" /> {s.timeLimit}</span>
                    <button
                      onClick={() => setActiveId(s.id)}
                      className={cn(
                        'inline-flex items-center gap-1 text-sm font-bold cursor-pointer',
                        done ? 'text-muted-foreground' : 'text-primary hover:underline'
                      )}
                    >
                      {done ? 'Xem lại' : 'Làm khảo sát'} <ChevronRight className="size-3.5" />
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

  // ---------- FORM VIEW ----------
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {!defaultSurveyId && (
        <button
          onClick={() => setActiveId(null)}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Tất cả khảo sát
        </button>
      )}

      {success ? (
        <Card className="border-success/20 bg-success/5 rounded-3xl p-8 text-center flex flex-col items-center gap-4">
          <span className="grid size-16 place-items-center bg-success/15 text-success rounded-full"><CheckCircle2 className="size-9" /></span>
          <h2 className="text-xl font-bold text-foreground">Đã gửi khảo sát!</h2>
          <p className="text-sm text-muted-foreground font-semibold max-w-md leading-relaxed">
            Cảm ơn ý kiến của bạn cho khảo sát <strong>{activeSurvey.title}</strong>. SataRobo sẽ tiếp thu để cải thiện.
          </p>
          {!defaultSurveyId && (
            <button onClick={() => setActiveId(null)} className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold hover:opacity-90 cursor-pointer">
              Về danh sách khảo sát
            </button>
          )}
        </Card>
      ) : isLocked ? (
        <Card className="border-border/60 rounded-3xl p-8 text-center flex flex-col items-center gap-4 bg-muted">
          <span className="grid size-16 place-items-center bg-muted text-muted-foreground rounded-full"><Lock className="size-8" /></span>
          <h2 className="text-xl font-bold text-foreground">Bạn đã hoàn thành khảo sát này</h2>
          <p className="text-sm text-muted-foreground font-semibold max-w-md leading-relaxed">
            Mỗi tài khoản chỉ gửi khảo sát <strong>{activeSurvey.title}</strong> một lần cho con <strong>{child.name}</strong>.
          </p>
          {!defaultSurveyId && (
            <button onClick={() => setActiveId(null)} className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold hover:bg-muted cursor-pointer">
              Về danh sách
            </button>
          )}
        </Card>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <Card className="border-border/60 rounded-3xl overflow-hidden shadow-none">
            <div className="bg-slate-950 p-6 text-white">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-sm font-bold px-2.5 py-1 mb-2">{activeSurvey.category}</Badge>
              <h3 className="text-lg font-bold text-white tracking-tight">{activeSurvey.title}</h3>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">{activeSurvey.subtitle}</p>
            </div>
            <CardContent className="p-6 space-y-7 divide-y divide-border/50">
              {activeSurvey.fields.map((f, idx) => (
                <div key={f.id} className={idx > 0 ? 'pt-6 space-y-3' : 'space-y-3'}>
                  <label className="text-sm font-bold text-foreground leading-relaxed flex items-start gap-1.5">
                    <span className="text-primary">{idx + 1}.</span>
                    <span>{f.question}{f.required && <span className="text-destructive"> *</span>}</span>
                  </label>

                  {f.type === 'rating' && (
                    <div className="flex items-center gap-1.5 pl-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setFormData((p) => ({ ...p, [f.id]: star }))}
                          className="text-3xl transition-transform hover:scale-110 cursor-pointer" style={{ minWidth: 44, minHeight: 44 }}>
                          {star <= (formData[f.id] || 0) ? '★' : '☆'}
                        </button>
                      ))}
                      <span className="text-sm font-bold text-muted-foreground ml-2">{formData[f.id] || 0}/5</span>
                    </div>
                  )}

                  {f.type === 'choice' && f.options && (
                    <div className="space-y-2 pl-4">
                      {f.options.map((opt) => (
                        <label key={opt} className="flex items-center gap-3 text-sm text-foreground font-semibold cursor-pointer min-h-10">
                          <input type="radio" name={f.id} checked={formData[f.id] === opt} onChange={() => setFormData((p) => ({ ...p, [f.id]: opt }))} className="size-4.5 accent-primary cursor-pointer" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {f.type === 'checkbox' && f.options && (
                    <div className="space-y-2 pl-4">
                      {f.options.map((opt) => {
                        const checked = ((formData[f.id] as string[]) || []).includes(opt)
                        return (
                          <label key={opt} className="flex items-start gap-3 text-sm text-foreground font-semibold cursor-pointer min-h-10">
                            <input type="checkbox" checked={checked} onChange={() => setFormData((p) => {
                              const cur = (p[f.id] as string[]) || []
                              return { ...p, [f.id]: checked ? cur.filter((o) => o !== opt) : [...cur, opt] }
                            })} className="size-4.5 mt-0.5 accent-primary cursor-pointer" />
                            <span className="leading-tight pt-0.5">{opt}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {f.type === 'text' && (
                    <div className="pl-4">
                      <textarea rows={3} value={formData[f.id] || ''} onChange={(e) => setFormData((p) => ({ ...p, [f.id]: e.target.value }))}
                        placeholder="Nhập ý kiến của bạn..." className="w-full text-sm rounded-xl border border-border bg-card p-3 outline-none focus:border-primary font-medium text-foreground" />
                    </div>
                  )}

                  {f.type === 'slider' && (
                    <div className="pl-4 space-y-2">
                      <div className="flex items-center gap-4">
                        <input type="range" min={f.min || 1} max={f.max || 10} value={formData[f.id] || 5}
                          onChange={(e) => setFormData((p) => ({ ...p, [f.id]: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
                        <span className="size-10 grid place-items-center bg-primary text-primary-foreground rounded-full text-base font-bold shrink-0">{formData[f.id] || 5}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground font-medium px-1">
                        <span>{f.minLabel || 'Thấp'}</span><span>{f.maxLabel || 'Cao'}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {error && (
            <div className="p-3.5 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-2">
              <AlertCircle className="size-4.5 shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer">
            {submitting ? 'Đang gửi...' : <><Send className="size-4" /> Gửi khảo sát</>}
          </button>
        </form>
      )}
    </main>
  )
}
