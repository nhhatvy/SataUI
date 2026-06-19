import React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/shared/utils/utils'

interface ErrorStateProps {
  title?: string
  description?: string
  retryLabel?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Đã có lỗi xảy ra',
  description = 'Không thể tải dữ liệu. Vui lòng kiểm tra lại kết nối mạng của bạn.',
  retryLabel = 'Thử lại',
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center bg-destructive/5 border border-destructive/20 rounded-3xl animate-in fade-in duration-300", className)}>
      <div className="grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive mb-4">
        <AlertCircle className="size-7" />
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-xs leading-relaxed">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-xl bg-destructive px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-all cursor-pointer shadow-md shadow-destructive/15"
        >
          {retryLabel}
        </button>
      )}
    </div>
  )
}
