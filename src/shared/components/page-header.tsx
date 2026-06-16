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
          <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight text-slate-900 text-balance">{title}</h1>
          {subtitle && <p className="text-[clamp(0.875rem,2.2vw,1rem)] text-muted-foreground mt-1 max-w-2xl leading-relaxed">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

// Tiêu đề một section trong trang.
export function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">{children}</h2>
      {hint && <p className="text-sm text-slate-400 font-medium mt-0.5">{hint}</p>}
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
      : 'border-primary/20 bg-primary/5 text-slate-600'
  const iconCls = variant === 'tip' ? 'text-amber-600' : 'text-primary'
  return (
    <div className={cn('flex items-start gap-2.5 rounded-xl border p-3.5 text-sm font-medium leading-relaxed', cls)}>
      <Icon className={cn('size-4.5 shrink-0 mt-0.5', iconCls)} />
      <div className="min-w-0">{children}</div>
    </div>
  )
}
