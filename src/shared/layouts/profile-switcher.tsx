'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/shared/utils/utils'
import { children as allChildren, getChildData } from '@/shared/mock-data/parent-data'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { ChevronDown, Check, UserRound } from 'lucide-react'

// Trung tâm UX: chuyển giữa Mode Phụ huynh và Mode Học sinh (theo từng con).
// Active profile lưu trong store (sessionStorage) — KHÔNG bao giờ đưa id/slug lên URL.
export function ProfileSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { activeChildId, setActiveChildId, child } = useActiveChildStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mode dựa vào route, không xoá con đang chọn khi quay về cổng phụ huynh.
  const isStudentMode = mounted && pathname.startsWith('/student')

  const goParent = () => {
    router.push('/parent')
  }

  const goChild = (id: string) => {
    setActiveChildId(id)
    router.push('/student')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex min-w-0 max-w-[55vw] items-center gap-2.5 rounded-xl border border-accent/30 bg-accent-soft text-accent px-2.5 py-1.5 text-sm font-bold transition-colors cursor-pointer select-none focus:outline-none sm:max-w-none sm:px-3"
      >
        <span
          className="grid size-6 shrink-0 place-items-center rounded-md text-[10px] font-black text-white"
          style={{
            backgroundColor: isStudentMode ? child?.avatarColor : 'var(--parent)',
          }}
        >
          {isStudentMode ? child?.initials : <UserRound className="size-3.5" />}
        </span>
        {/* Ẩn nhãn chữ trên mobile để header gọn, tránh tràn ngang */}
        <span className="hidden sm:flex flex-col items-start leading-tight min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider opacity-70">
            {isStudentMode ? 'Học sinh' : 'Phụ huynh'}
          </span>
          <span className="text-sm font-bold truncate max-w-[12rem]">
            {isStudentMode ? child?.shortName : user?.name || 'Phụ huynh'}
          </span>
        </span>
        <ChevronDown className="size-3.5 shrink-0 opacity-70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 rounded-2xl border-border/60 shadow-md">
        {/* Parent mode */}
        <DropdownMenuItem
          onClick={goParent}
          className={cn(
            'gap-2.5 py-2.5 cursor-pointer text-sm font-bold',
            !isStudentMode && 'text-parent bg-parent/5'
          )}
        >
          <span className="grid size-7 place-items-center rounded-lg bg-parent/10 text-parent">
            <UserRound className="size-4" />
          </span>
          <span className="flex-1">
            <span className="block">Chế độ Phụ huynh</span>
            <span className="block text-xs font-medium text-muted-foreground">
              {user?.name || 'Tài khoản phụ huynh'}
            </span>
          </span>
          {!isStudentMode && <Check className="size-4 text-parent" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
          Các con
        </DropdownMenuLabel>

        {allChildren.map((c) => {
          const cData = getChildData(c.id)
          const courseName = cData?.courses?.[0]?.title ?? c.className
          const active = c.id === activeChildId
          return (
            <DropdownMenuItem
              key={c.id}
              onClick={() => goChild(c.id)}
              className={cn(
                'gap-2.5 py-2.5 cursor-pointer text-sm font-bold',
                active && 'text-primary bg-primary/5'
              )}
            >
              <span
                className="grid size-7 place-items-center rounded-lg text-[10px] font-black text-white"
                style={{ backgroundColor: c.avatarColor }}
              >
                {c.initials}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block truncate">{c.shortName}</span>
                <span className="block text-xs font-medium text-muted-foreground truncate">
                  {courseName} · {c.className}
                </span>
              </span>
              {active && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
