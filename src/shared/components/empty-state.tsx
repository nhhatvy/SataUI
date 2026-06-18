import React from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/shared/utils/utils'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center bg-card border border-border/60 rounded-3xl animate-in fade-in duration-300", className)}>
      <div className="grid size-14 place-items-center rounded-2xl bg-secondary text-muted-foreground/60 mb-4 animate-bounce duration-1000">
        <Icon className="size-7" />
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-xs leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-md shadow-primary/15"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
