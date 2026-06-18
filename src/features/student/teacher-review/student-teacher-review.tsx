'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { getStudentData } from '@/shared/mock-data/student-data'
import { Star, Send, AlertCircle, Lock, Sparkles } from 'lucide-react'
import { cn } from '@/shared/utils/utils'

type ReviewField = {
  id: string
  type: 'emoji' | 'star' | 'range' | 'text'
  question: string
  required: boolean
  minLabel?: string
  maxLabel?: string
  options?: { value: string; emoji: string; label: string }[]
}

const SCHEMA: ReviewField[] = [
  {
    id: 'q_fun',
    type: 'emoji',
    question: 'Thầy/Cô dạy có vui và thân thiện không?',
    required: true,
    options: [
      { value: 'sad', emoji: '😞', label: 'Buồn' },
      { value: 'neutral', emoji: '😐', label: 'Bình thường' },
      { value: 'happy', emoji: '🙂', label: 'Vui' },
      { value: 'excited', emoji: '😄', label: 'Rất vui' },
    ],
  },
  { id: 'q_understand', type: 'star', question: 'Em có dễ hiểu bài giảng và hướng dẫn không?', required: true },
  { id: 'q_interest', type: 'star', question: 'Lớp học có nhiều hoạt động thú vị không?', required: true },
  { id: 'q_satisfaction', type: 'range', question: 'Em yêu quý Thầy/Cô mức nào? (1–10)', required: true, minLabel: 'Hơi chán', maxLabel: 'Rất yêu quý' },
  { id: 'q_message', type: 'text', question: 'Lời nhắn gửi tới Thầy/Cô (không bắt buộc):', required: false },
]

const STAR_LABEL = ['', 'Rất khó', 'Khó', 'Bình thường', 'Tốt', 'Tuyệt vời!']
const PALETTE = [
  { bg: 'bg-amber-50 border-amber-200', num: 'bg-amber-400' },
  { bg: 'bg-sky-50 border-sky-200', num: 'bg-sky-400' },
  { bg: 'bg-emerald-50 border-emerald-200', num: 'bg-emerald-400' },
  { bg: 'bg-pink-50 border-pink-200', num: 'bg-pink-400' },
  { bg: 'bg-violet-50 border-violet-200', num: 'bg-violet-400' },
]

export function StudentTeacherReview() {
  const { child } = useActiveChildStore()
  const studentData = getStudentData(child.id)

  const teachers = useMemo(
    () => (studentData?.courses ?? []).map((c) => ({ name: c?.teacher || '', subject: c?.subject || '' })),
    [studentData?.courses]
  )
  const [selected, setSelected] = useState(teachers[0]?.name || '')
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [registry, setRegistry] = useState<Record<string, Record<string, boolean>>>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('student-teacher-reviews-registry')
    if (saved) { try { setRegistry(JSON.parse(saved)) } catch (e) { console.error(e) } }
  }, [])

  useEffect(() => {
    if (teachers.length > 0 && !teachers.some((t) => t.name === selected)) setSelected(teachers[0].name)
  }, [teachers, selected])

  const isLocked = !!registry[child.id]?.[selected]

  useEffect(() => {
    const def: Record<string, any> = {}
    SCHEMA.forEach((f) => { def[f.id] = f.type === 'emoji' ? null : f.type === 'star' ? 0 : f.type === 'range' ? 5 : '' })
    setFormData(def)
    setError(null)
    setSuccess(false)
  }, [selected, child.id])

  const set = (id: string, v: any) => setFormData((p) => ({ ...p, [id]: v }))
  const answered = SCHEMA.filter((f) => {
    const v = formData[f.id]
    return f.type === 'emoji' ? !!v : f.type === 'star' ? v > 0 : f.type === 'range' ? true : !!(v && v.trim())
  }).length

  const validate = () => {
    for (const f of SCHEMA) {
      if (!f.required) continue
      const v = formData[f.id]
      if (f.type === 'emoji' && !v) return setError('Em hãy chọn khuôn mặt cảm xúc nhé!'), false
      if (f.type === 'star' && !v) return setError('Em hãy chọn số sao cho câu còn thiếu nhé!'), false
    }
    setError(null)
    return true
  }

  const submit = () => {
    setConfirm(false)
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
      const next = { ...registry, [child.id]: { ...(registry[child.id] || {}), [selected]: true } }
      setRegistry(next)
      sessionStorage.setItem('student-teacher-reviews-registry', JSON.stringify(next))
    }, 1000)
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-24 pt-6 sm:px-6 animate-in fade-in duration-300">
      {/* Hero vui mắt */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-orange-400 to-amber-400 p-6 text-white mb-5 shadow-lg shadow-primary/20">
        <Sparkles className="absolute right-5 top-5 size-12 opacity-25" />
        <span className="text-4xl">⭐</span>
        <h1 className="text-2xl font-black mt-2 leading-tight">Đánh giá Thầy/Cô của em</h1>
        <p className="text-sm font-semibold text-white/90 mt-1 max-w-md leading-relaxed">
          Chọn khuôn mặt, số sao và gửi lời nhắn dễ thương cho Thầy/Cô nhé! Câu trả lời được giữ <strong>bí mật (ẩn danh)</strong>.
        </p>
        <span className="inline-flex items-center gap-1.5 mt-3 rounded-full bg-card/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
          Đợt giữa khóa · mở đến 30/06/2026 · mỗi Thầy/Cô 1 lần
        </span>
      </div>

      {/* Chọn giáo viên */}
      <p className="text-sm font-bold text-foreground mb-2">Em muốn đánh giá ai?</p>
      <div className="grid gap-3 sm:grid-cols-2 mb-5">
        {teachers.map((t) => {
          const active = selected === t.name
          const reviewed = !!registry[child.id]?.[t.name]
          return (
            <button
              key={t.name}
              onClick={() => setSelected(t.name)}
              className={cn('flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer', active ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/60 bg-card hover:border-border')}
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-amber-400 text-base font-black text-white shrink-0">
                {t.name.split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground truncate">{t.name}</p>
                <p className="text-sm text-muted-foreground font-medium truncate">{t.subject}</p>
              </div>
              {reviewed ? (
                <Badge className="bg-success/15 text-success border border-success/30 text-xs font-bold px-2 py-0.5 rounded-md shrink-0">Đã gửi</Badge>
              ) : active ? (
                <span className="size-5 grid place-items-center rounded-full bg-primary text-primary-foreground text-xs shrink-0">✓</span>
              ) : null}
            </button>
          )
        })}
      </div>

      {success ? (
        <Card className="border-success/20 bg-success/5 rounded-3xl p-8 text-center flex flex-col items-center gap-3">
          <span className="text-6xl">🎉</span>
          <h2 className="text-xl font-black text-foreground">Tuyệt vời, cảm ơn em!</h2>
          <p className="text-sm text-muted-foreground font-semibold max-w-md leading-relaxed">Lời đánh giá của em dành cho <strong>{selected}</strong> đã được gửi (bí mật) rồi nhé!</p>
        </Card>
      ) : isLocked ? (
        <Card className="border-border/60 rounded-3xl p-8 text-center flex flex-col items-center gap-3 bg-muted">
          <span className="grid size-16 place-items-center bg-muted text-muted-foreground rounded-full"><Lock className="size-8" /></span>
          <h2 className="text-xl font-bold text-foreground">Em đã đánh giá Thầy/Cô này rồi</h2>
          <p className="text-sm text-muted-foreground font-semibold max-w-md leading-relaxed">Mỗi Thầy/Cô chỉ đánh giá 1 lần. Hãy chọn Thầy/Cô khác nhé!</p>
        </Card>
      ) : (
        <>
          {/* Tiến độ */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-2.5 flex-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${(answered / SCHEMA.length) * 100}%` }} />
            </div>
            <span className="text-sm font-bold text-muted-foreground shrink-0">{answered}/{SCHEMA.length}</span>
          </div>

          <div className="space-y-4">
            {SCHEMA.map((f, idx) => {
              const pal = PALETTE[idx % PALETTE.length]
              return (
                <div key={f.id} className={cn('rounded-3xl border-2 p-5', pal.bg)}>
                  <div className="flex items-start gap-2.5 mb-3.5">
                    <span className={cn('grid size-7 place-items-center rounded-full text-white text-sm font-black shrink-0', pal.num)}>{idx + 1}</span>
                    <p className="text-base font-bold text-foreground leading-snug">{f.question}{f.required && <span className="text-destructive"> *</span>}</p>
                  </div>

                  {f.type === 'emoji' && f.options && (
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {f.options.map((o) => {
                        const sel = formData[f.id] === o.value
                        return (
                          <button key={o.value} onClick={() => set(f.id, o.value)}
                            className={cn('flex flex-col items-center justify-center py-3 rounded-2xl border-2 bg-card transition-all cursor-pointer', sel ? 'border-primary ring-2 ring-primary/25 scale-105 shadow-sm' : 'border-transparent hover:scale-105')}>
                            <span className="text-4xl sm:text-5xl">{o.emoji}</span>
                            <span className={cn('text-xs font-bold mt-1', sel ? 'text-primary' : 'text-muted-foreground')}>{o.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {f.type === 'star' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} onClick={() => set(f.id, s)} className="p-1 hover:scale-125 transition-transform cursor-pointer" style={{ minWidth: 44, minHeight: 44 }}>
                            <Star className={cn('size-9', s <= (formData[f.id] || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300')} />
                          </button>
                        ))}
                      </div>
                      {formData[f.id] > 0 && <span className="text-sm font-black text-amber-600 bg-card px-3 py-1.5 rounded-full shadow-2xs">{STAR_LABEL[formData[f.id]]}</span>}
                    </div>
                  )}

                  {f.type === 'range' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">😐</span>
                        <input type="range" min={1} max={10} value={formData[f.id] || 5} onChange={(e) => set(f.id, parseInt(e.target.value))}
                          className="w-full h-3 bg-card rounded-full appearance-none cursor-pointer accent-primary" style={{ minHeight: 44 }} />
                        <span className="text-2xl">😍</span>
                        <span className="size-12 grid place-items-center bg-primary text-primary-foreground rounded-full text-lg font-black shrink-0">{formData[f.id] || 5}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground font-bold uppercase px-9">
                        <span>{f.minLabel}</span><span>{f.maxLabel}</span>
                      </div>
                    </div>
                  )}

                  {f.type === 'text' && (
                    <textarea value={formData[f.id] || ''} onChange={(e) => set(f.id, e.target.value)} rows={3}
                      placeholder="Ví dụ: Con thích nhất buổi lắp robot tránh vật cản, mong Thầy cho chơi đua robot ạ!"
                      className="w-full p-3.5 rounded-2xl border-2 border-white bg-card focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm font-medium" />
                  )}
                </div>
              )
            })}
          </div>

          {error && (
            <div className="mt-4 p-3.5 rounded-2xl bg-destructive/5 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-2">
              <AlertCircle className="size-4.5 shrink-0" /> {error}
            </div>
          )}

          <button onClick={() => { if (validate()) setConfirm(true) }}
            className="mt-5 w-full h-14 rounded-full bg-gradient-to-r from-primary to-amber-400 text-primary-foreground text-base font-black hover:opacity-95 active:scale-[0.99] cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
            <Send className="size-5" /> Gửi đánh giá cho {selected}
          </button>
        </>
      )}

      {/* Confirm modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border p-6 w-full max-w-sm rounded-3xl shadow-xl text-center space-y-4">
            <span className="text-5xl block">💖</span>
            <h3 className="text-base font-bold text-foreground">Gửi đánh giá nhé?</h3>
            <p className="text-sm text-muted-foreground font-semibold leading-relaxed">Sau khi gửi em sẽ không sửa lại được. Em chắc chưa nào?</p>
            <div className="flex justify-center gap-3 pt-1">
              <button onClick={() => setConfirm(false)} className="h-11 rounded-full border border-border bg-card px-5 text-sm font-bold text-foreground hover:bg-muted cursor-pointer min-w-[110px]">Để sau</button>
              <button onClick={submit} disabled={submitting} className="h-11 rounded-full bg-primary px-6 text-sm font-black text-primary-foreground hover:opacity-90 cursor-pointer border-none min-w-[110px]">{submitting ? 'Đang gửi...' : 'Gửi ngay!'}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
