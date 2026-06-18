'use client'

import { useState } from 'react'
import { cn } from '@/shared/utils/utils'
import { useSimulatedStateStore, type LayoutState } from '@/shared/stores/useSimulatedStateStore'
import { FlaskConical, X } from 'lucide-react'

const STATES: { key: LayoutState; label: string }[] = [
  { key: 'success', label: 'Bình thường' },
  { key: 'loading', label: 'Đang tải' },
  { key: 'empty', label: 'Trống' },
  { key: 'error', label: 'Lỗi' },
]

// Công cụ dev: giả lập trạng thái loading/empty/error cho các trang dùng StateMockWrapper.
// Chỉ hiển thị ở môi trường development.
export function DevStateSwitcher() {
  const { layoutState, setLayoutState } = useSimulatedStateStore()
  const [open, setOpen] = useState(false)

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="dev-state-switcher fixed bottom-20 right-4 z-50 lg:bottom-4 print:hidden">
      {open ? (
        <div className="rounded-2xl border border-border bg-card p-2 shadow-lg space-y-1 w-44">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Dev · Trạng thái</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="size-3.5" />
            </button>
          </div>
          {STATES.map((s) => (
            <button
              key={s.key}
              onClick={() => setLayoutState(s.key)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm font-bold cursor-pointer transition-colors',
                layoutState === s.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {s.label}
              {layoutState === s.key && <span className="text-[10px]">●</span>}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="grid size-11 place-items-center rounded-full bg-slate-900 text-white shadow-lg hover:bg-slate-800 cursor-pointer"
          aria-label="Dev state switcher"
        >
          <FlaskConical className="size-5" />
        </button>
      )}
    </div>
  )
}
