'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardContent } from '@/shared/components/ui/card'
import { cn } from '@/shared/utils/utils'
import {
  ACCENT_PRESETS,
  ROLE_DEFAULT_ACCENT,
  applyAccent,
  defaultAppearance,
  getActiveRole,
  inkOn,
  isLightAccent,
  isValidHex,
  loadAppearance,
  normalizeHex,
  saveAppearance,
  setActiveRole,
  type AppearanceState,
  type Role,
  type ThemeMode,
} from '@/lib/appearance'
import { Sun, Moon, Monitor, Check, Save, CheckCircle2, AlertTriangle, Palette, UserRound, GraduationCap } from 'lucide-react'

const THEMES: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: 'Sáng', icon: Sun },
  { id: 'dark', label: 'Tối', icon: Moon },
  { id: 'system', label: 'Hệ thống', icon: Monitor },
]

export default function AppearancePage() {
  // Theme (sáng/tối/hệ thống) do next-themes quản lý cho toàn dự án.
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [role, setRole] = useState<Role>('parent')
  const [accents, setAccents] = useState<{ parent: string; student: string }>({ ...ROLE_DEFAULT_ACCENT })
  const [saved, setSaved] = useState<AppearanceState>(defaultAppearance())
  const [justSaved, setJustSaved] = useState(false)

  // Load màu nhấn đã lưu (theme do next-themes tự khôi phục)
  useEffect(() => {
    const s = loadAppearance() ?? defaultAppearance()
    setAccents(s.accents)
    setSaved(s)
    setRole(getActiveRole())
    setMounted(true)
  }, [])

  const accent = accents[role]

  // Áp dụng màu nhấn live khi đổi role/accent
  useEffect(() => {
    if (!mounted) return
    setActiveRole(role)
    applyAccent(accents[role], role)
  }, [mounted, role, accents])

  // Chỉ màu nhấn cần "Lưu" — theme đã lưu ngay khi chọn (next-themes)
  const dirty = useMemo(
    () => accents.parent !== saved.accents.parent || accents.student !== saved.accents.student,
    [accents, saved]
  )

  const setAccent = (hex: string) => setAccents((p) => ({ ...p, [role]: normalizeHex(hex) }))
  const onSave = () => {
    const next: AppearanceState = { accents }
    saveAppearance(next)
    setSaved(next)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  if (!mounted) {
    return <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-8 sm:px-6 lg:px-8" />
  }

  const light = isLightAccent(accent)
  const ink = inkOn(accent)
  const isDefault = accent.toUpperCase() === ROLE_DEFAULT_ACCENT[role].toUpperCase()

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-8 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary"><Palette className="size-5" /></span>
          Giao diện
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Tùy chỉnh màu sắc &amp; chế độ hiển thị — riêng cho từng vai trò.</p>
      </div>

      {/* Role switch */}
      <Card className="border-border/60 rounded-2xl shadow-none mb-5 py-0">
        <CardContent className="p-3.5 flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">Áp dụng cho:</span>
          <div className="inline-flex bg-muted rounded-xl p-1 gap-1">
            {([
              { id: 'parent' as Role, label: 'Phụ huynh', dot: ROLE_DEFAULT_ACCENT.parent, icon: UserRound },
              { id: 'student' as Role, label: 'Học sinh', dot: ROLE_DEFAULT_ACCENT.student, icon: GraduationCap },
            ]).map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all',
                  role === r.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="size-2.5 rounded-full" style={{ backgroundColor: r.dot }} />
                {r.label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-muted-foreground font-medium hidden sm:block">
            Mỗi vai trò lưu màu riêng · Sáng/Tối dùng chung
          </span>
        </CardContent>
      </Card>

      {/* Content grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        {/* Controls */}
        <Card className="border-border/60 rounded-2xl shadow-none py-0 overflow-hidden">
          <CardContent className="p-0 divide-y divide-border/60">
            {/* 1. Theme */}
            <section className="p-5 sm:p-6">
              <SectionTitle num={1} title="Chế độ hiển thị" desc="Chọn nền sáng, tối hoặc theo cài đặt thiết bị." />
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 sm:ml-8">
                {THEMES.map((t) => {
                  const on = theme === t.id
                  const dark = t.id === 'dark'
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn('rounded-xl border-2 p-3 text-left transition-all', on ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted')}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground"><t.icon className="size-4" /> {t.label}</span>
                        {on && <span className="grid size-5 place-items-center rounded-full bg-primary" style={{ color: 'var(--primary-foreground)' }}><Check className="size-3" /></span>}
                      </div>
                      <div className={cn('h-12 rounded-lg p-2 flex flex-col justify-center gap-1.5 border', dark ? 'bg-[#0E0B12] border-white/10' : 'bg-card border-black/10')}>
                        <span className="h-1.5 rounded-full bg-primary/85" style={{ width: '42%' }} />
                        <span className={cn('h-1.5 rounded-full', dark ? 'bg-card/25' : 'bg-slate-200')} style={{ width: '66%' }} />
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* 2. Accent presets */}
            <section className="p-5 sm:p-6">
              <SectionTitle num={2} title="Màu nhấn thương hiệu" desc="Chọn nhanh từ bộ màu gợi ý." />
              <div className="flex flex-wrap gap-5 sm:ml-8">
                {ACCENT_PRESETS.map((p) => {
                  const on = accent.toUpperCase() === p.hex.toUpperCase()
                  const def = ROLE_DEFAULT_ACCENT[role].toUpperCase() === p.hex.toUpperCase()
                  return (
                    <button key={p.id} onClick={() => setAccent(p.hex)} className="flex flex-col items-center gap-2 group">
                      <span
                        className={cn('grid size-11 place-items-center rounded-full transition-all', on ? 'scale-110' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105')}
                        style={{
                          backgroundColor: p.hex,
                          color: inkOn(p.hex),
                          boxShadow: on ? `0 0 0 3px var(--card), 0 0 0 5px ${p.hex}` : undefined,
                        }}
                      >
                        {on && <Check className="size-5" />}
                      </span>
                      <span className={cn('text-xs font-bold uppercase tracking-wide', on ? 'text-primary' : 'text-muted-foreground')}>
                        {p.name}{def ? ' ✓' : ''}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* 3. Custom */}
            <section className="p-5 sm:p-6">
              <SectionTitle num={3} title="Tùy chỉnh màu" desc="Nhập mã HEX hoặc chọn tự do. Chữ trên nút tự đổi để dễ đọc." />
              <div className="space-y-3 sm:ml-8">
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="size-11 rounded-xl border-2 border-border overflow-hidden cursor-pointer shrink-0" style={{ backgroundColor: accent }}>
                    <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="size-full opacity-0 cursor-pointer" aria-label="Chọn màu" />
                  </label>
                  <div className="inline-flex items-center rounded-xl border-2 border-border bg-muted px-3 h-11">
                    <span className="text-muted-foreground font-bold">#</span>
                    <input
                      value={accent.replace('#', '').toUpperCase()}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6)
                        if (isValidHex(v)) setAccent('#' + v)
                        else setAccents((p) => ({ ...p, [role]: '#' + v.padEnd(6, '0') }))
                      }}
                      maxLength={6}
                      className="w-[7rem] bg-transparent font-semibold uppercase tracking-wider outline-none text-foreground"
                    />
                  </div>
                  <span className="inline-flex items-center rounded-lg px-3.5 h-9 text-sm font-bold" style={{ backgroundColor: accent, color: ink }}>
                    Aa Nút
                  </span>
                </div>

                {/* Contrast warning */}
                <div
                  className={cn('flex items-start gap-2 rounded-xl p-3 text-sm font-semibold', light ? 'bg-amber-500/10 text-amber-700' : 'bg-success/10 text-success')}
                >
                  {light ? <AlertTriangle className="size-4.5 shrink-0 mt-0.5" /> : <CheckCircle2 className="size-4.5 shrink-0 mt-0.5" />}
                  <span>
                    {light
                      ? 'Màu sáng — chữ trên nền này tự chuyển sang tối (#241A2E) để đạt tương phản.'
                      : 'Tương phản tốt — chữ trắng dễ đọc trên nền màu này.'}
                  </span>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Live preview */}
        <div className="lg:sticky lg:top-20">
          <Card className="border-border/60 rounded-2xl shadow-none py-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                <span className="text-sm font-bold text-foreground">Xem trước</span>
                <span className="text-xs font-bold uppercase tracking-wide rounded-full px-2.5 py-1 bg-primary/15 text-primary">
                  {role === 'parent' ? 'Phụ huynh' : 'Học sinh'}
                </span>
              </div>
              <div className="p-4">
                {/* mini portal */}
                <div className="flex h-56 rounded-xl border border-border overflow-hidden">
                  <div className="w-14 shrink-0 flex flex-col items-center gap-2.5 py-3" style={{ backgroundColor: 'var(--primary)' }}>
                    <span className="size-6 rounded-lg grid place-items-center text-xs" style={{ background: 'rgba(255,255,255,.92)' }}>🤖</span>
                    <span className="h-1.5 w-8 rounded bg-card/35" />
                    <span className="h-2 w-9 rounded bg-card" />
                    <span className="h-1.5 w-8 rounded bg-card/35" />
                  </div>
                  <div className="flex-1 bg-card p-3.5 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 place-items-center rounded-full text-xs font-bold" style={{ borderWidth: 2, borderStyle: 'solid', borderColor: 'var(--primary)', color: 'var(--primary)' }}>BM</span>
                      <div className="space-y-1">
                        <span className="block h-2 w-20 rounded bg-foreground/80" />
                        <span className="block h-1.5 w-14 rounded bg-muted-foreground/60" />
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">Tiến độ</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-success/15 text-success">Đã bù</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <span className="block h-full rounded-full" style={{ width: '62%', backgroundColor: 'var(--primary)' }} />
                    </div>
                    <button className="mt-auto self-start text-xs font-bold px-3.5 py-2 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                  Mọi nút, thanh tiến độ và điểm nhấn dùng màu này. {isDefault && 'Đang dùng màu mặc định của vai trò.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save bar */}
      <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">
          {dirty ? 'Có thay đổi chưa lưu' : justSaved ? 'Đã lưu thay đổi' : 'Đã đồng bộ'}
        </span>
        <button
          onClick={onSave}
          disabled={!dirty}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          {justSaved ? <CheckCircle2 className="size-4.5" /> : <Save className="size-4.5" />}
          {justSaved ? 'Đã lưu' : 'Lưu thay đổi'}
        </button>
      </div>
    </main>
  )
}

function SectionTitle({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="mb-4">
      <h2 className="flex items-center gap-2.5 text-base font-bold text-foreground">
        <span className="grid size-6 place-items-center rounded-md bg-primary/15 text-primary text-xs font-bold">{num}</span>
        {title}
      </h2>
      <p className="text-sm text-muted-foreground mt-1.5 ml-8">{desc}</p>
    </div>
  )
}
