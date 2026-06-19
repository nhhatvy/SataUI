'use client'

import { children as allChildren } from '@/shared/mock-data/parent-data'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { cn } from '@/shared/utils/utils'

// Thanh chọn con cho các trang cổng Phụ huynh xem dữ liệu theo từng con
// (lịch học, hình ảnh lớp, học bạ). Không đổi mode (vẫn ở cổng Phụ huynh).
export function ParentChildSelector({ className }: { className?: string }) {
  const { activeChildId, setActiveChildId } = useActiveChildStore()

  if (allChildren.length <= 1) return null

  return (
    <div className={cn('mb-5 flex flex-wrap items-center gap-2.5', className)}>
      <span className="text-sm font-bold text-muted-foreground">Đang xem con:</span>
      <div className="flex gap-2 flex-wrap">
        {allChildren.map((c) => {
          const active = c.id === activeChildId
          return (
            <button
              key={c.id}
              onClick={() => setActiveChildId(c.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-bold transition-all cursor-pointer',
                active
                  ? 'bg-parent text-white border-parent shadow-2xs'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted'
              )}
            >
              <span
                className="grid size-5 place-items-center rounded-md text-xs font-bold text-white"
                style={{ backgroundColor: active ? 'rgba(255,255,255,0.25)' : c.avatarColor }}
              >
                {c.initials}
              </span>
              {c.shortName}
            </button>
          )
        })}
      </div>
    </div>
  )
}
