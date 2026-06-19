import React from 'react'
import { type LucideIcon, Info, Lightbulb } from 'lucide-react'
import { cn } from '@/shared/utils/utils'

// Hệ thống "section" dùng chung cho toàn bộ trang (cổng phụ huynh & học sinh)
// để bố cục, tiêu đề và phần giải thích nhất quán.

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon?: LucideIcon
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <span className="grid size-11 place-items-center rounded-2xl bg-accent-soft text-accent shrink-0">
            <Icon className="size-5.5" />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight text-foreground text-balance">{title}</h1>
          {subtitle && <p className="text-[clamp(0.875rem,2.2vw,1rem)] text-muted-foreground mt-1 max-w-2xl leading-relaxed">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

// Hero header dạng gradient — nâng tầm các trang cho đồng bộ với dashboard học sinh.
// Dùng accent theo mode (parent/student) hoặc brand primary. metric: slot bên phải (ring/số liệu).
export function PageHero({
  icon: Icon,
  overline,
  title,
  subtitle,
  metric,
  accent = 'parent',
}: {
  icon?: LucideIcon
  overline?: string
  title: string
  subtitle?: string
  metric?: React.ReactNode
  accent?: 'parent' | 'student' | 'primary'
}) {
  const grad =
    accent === 'student'
      ? 'from-student to-student/80'
      : accent === 'primary'
        ? 'from-primary to-primary/80'
        : 'from-parent to-parent/80'
  return (
    <div className={cn('relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white sm:p-6', grad)}>
      {Icon && (
        <Icon className="pointer-events-none absolute -right-4 -top-4 size-28 rotate-12 text-white/10" />
      )}
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {Icon && (
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/15 ring-4 ring-white/10 sm:size-14">
              <Icon className="size-6 sm:size-7" />
            </span>
          )}
          <div className="min-w-0">
            {overline && <p className="text-xs font-bold uppercase tracking-wider text-white/70">{overline}</p>}
            <h1 className="text-xl font-bold tracking-tight text-balance sm:text-2xl">{title}</h1>
            {subtitle && <p className="mt-0.5 text-xs font-medium text-white/80 sm:text-sm line-clamp-2">{subtitle}</p>}
          </div>
        </div>
        {metric && <div className="shrink-0">{metric}</div>}
      </div>
    </div>
  )
}

// Pill số liệu nổi bật đặt trong PageHero (nền kính mờ trên gradient).
export function HeroMetric({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/15 px-4 py-2.5 backdrop-blur-sm sm:w-auto sm:justify-start">
      <div className="leading-snug">
        <p className="text-xs font-bold text-white/80">{label}</p>
      </div>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
    </div>
  )
}

// Tiêu đề một section trong trang.
export function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-bold text-foreground uppercase tracking-wider">{children}</h2>
      {hint && <p className="text-sm text-muted-foreground font-medium mt-0.5">{hint}</p>}
    </div>
  )
}

// Khối giải thích ngắn giúp người dùng hiểu rõ chức năng.
export function InfoNote({
  children,
  variant = 'info',
}: {
  children: React.ReactNode
  variant?: 'info' | 'tip'
}) {
  const Icon = variant === 'tip' ? Lightbulb : Info
  const cls =
    variant === 'tip'
      ? 'border-amber-500/25 bg-amber-500/10 text-amber-700'
      : 'border-primary/20 bg-primary/5 text-muted-foreground'
  const iconCls = variant === 'tip' ? 'text-amber-600' : 'text-primary'
  return (
    <div className={cn('flex items-start gap-2.5 rounded-xl border p-3.5 text-sm font-medium leading-relaxed', cls)}>
      <Icon className={cn('size-4.5 shrink-0 mt-0.5', iconCls)} />
      <div className="min-w-0">{children}</div>
    </div>
  )
}
