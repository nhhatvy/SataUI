'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/shared/utils/utils'
import { children as allChildren } from '@/shared/mock-data/parent-data'
import { useNotificationStore, NotiCategory } from '@/shared/stores/useNotificationStore'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { ProfileSwitcher } from '@/shared/layouts/profile-switcher'
import { MobileMenu } from '@/shared/layouts/mobile-menu'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import {
  Bell,
  Settings,
  KeyRound,
  LogOut,
  CheckCheck,
  CreditCard,
  CalendarDays,
  Award,
  ChevronDown,
  BookOpen,
  ClipboardList,
} from 'lucide-react'

const notiIcon = {
  study: BookOpen,
  finance: CreditCard,
  makeup: ChevronDown,
  survey: ClipboardList,
  report: Award,
  schedule: CalendarDays,
}
const notiColor = {
  study: 'text-primary bg-primary/10',
  finance: 'text-amber-500 bg-amber-500/10',
  makeup: 'text-indigo-500 bg-indigo-500/10',
  survey: 'text-success bg-success/10',
  report: 'text-orange-500 bg-orange-500/10',
  schedule: 'text-pink-500 bg-pink-500/10',
}

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { setActiveChildId } = useActiveChildStore()

  const { notifications, markAsRead, markAllRead } = useNotificationStore()
  const [notiFilter] = useState<'all' | NotiCategory>('all')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const unread = isMounted ? notifications.filter((n) => n.unread).length : 0
  const filteredNotifications = isMounted
    ? notifications.filter((n) => notiFilter === 'all' || n.type === notiFilter)
    : []

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'G'

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleNotiClick = (n: any) => {
    markAsRead(n.id)
    if (n.type === 'finance') {
      router.push('/parent/finance')
      return
    }
    if (n.type === 'survey') {
      router.push('/parent/surveys')
      return
    }
    if (n.type === 'makeup') {
      router.push('/parent/makeup')
      return
    }
    if (n.type === 'report') {
      // Học bạ chỉ ở cổng phụ huynh
      router.push('/parent/report-card')
      return
    }
    // Student-scoped: chuyển sang profile con tương ứng trước
    const target = allChildren.find((c) => c.name === n.childName || c.shortName === n.childName)
    if (target) setActiveChildId(target.id)
    if (n.type === 'study') {
      router.push('/student/homework')
    } else if (n.type === 'schedule') {
      router.push('/student/schedule')
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-2.5 sm:gap-3 overflow-hidden border-b border-border bg-card/75 px-3 sm:px-4 backdrop-blur-md lg:px-6 select-none print:hidden">
      {/* Mobile: hamburger mở nav đầy đủ */}
      <MobileMenu />

      {/* Profile Switcher: trung tâm chuyển Mode Phụ huynh / Học sinh */}
      <ProfileSwitcher />

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-3">
        {/* Notification Center */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative grid size-11 place-items-center rounded-xl text-foreground transition-colors hover:bg-accent cursor-pointer focus:outline-none"
            aria-label="Thông báo"
          >
            <Bell className="size-5.5" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 grid size-5.5 place-items-center rounded-full bg-destructive text-sm font-bold text-white">
                {unread}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[calc(100vw-1.5rem)] max-w-[26rem] p-0 rounded-2xl border-border/60 shadow-lg">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">Thông báo mới</p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  markAllRead()
                }}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline cursor-pointer border-none bg-transparent"
              >
                <CheckCheck className="size-4 shrink-0" /> Đọc tất cả
              </button>
            </div>
            <Separator />
            <div className="max-h-80 overflow-y-auto py-1 scrollbar-thin divide-y divide-border/40">
              {filteredNotifications.length === 0 ? (
                <div className="p-6 text-center text-sm font-semibold text-slate-400">
                  Không có thông báo mới
                </div>
              ) : (
                filteredNotifications.map((n) => {
                  const Icon = notiIcon[n.type]
                  return (
                    <button
                      key={n.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNotiClick(n)
                      }}
                      className={cn(
                        'flex w-full items-start gap-3.5 px-4 py-3 text-left transition-colors hover:bg-slate-50 border-none bg-transparent cursor-pointer',
                        n.unread && 'bg-primary/5'
                      )}
                    >
                      <span className={cn('mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl', notiColor[n.type])}>
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="block text-sm font-semibold text-slate-900 truncate">{n.title}</span>
                          <Badge variant="outline" className="text-sm font-medium shrink-0 text-primary border-primary/20 bg-primary/5 py-0 px-2">
                            {n.childName}
                          </Badge>
                        </div>
                        <span className="block text-sm leading-relaxed text-slate-500 font-normal">{n.description}</span>
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 py-1 pl-1 pr-2 transition-colors hover:bg-slate-50 cursor-pointer focus:outline-none select-none rounded-xl">
            <span className="grid size-9 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white uppercase">
              {initials}
            </span>
            <span className="hidden text-left md:block">
              <span className="block text-sm font-semibold leading-tight text-slate-900">{user?.name || 'Tài khoản'}</span>
              <span className="block text-sm text-slate-400 font-medium tracking-wider mt-0.5">Phụ huynh</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 rounded-2xl border-border/60 shadow-md">
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">{user?.name}</span>
              <span className="text-sm text-slate-400 font-normal mt-0.5">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/parent/profile')} className="gap-2.5 py-2 cursor-pointer text-sm font-semibold">
              <Settings className="size-4 text-muted-foreground" /> Hồ sơ liên lạc
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2.5 py-2 cursor-pointer text-sm font-semibold">
              <KeyRound className="size-4 text-muted-foreground" /> Đổi mật khẩu
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2.5 py-2 text-destructive focus:text-destructive cursor-pointer text-sm font-semibold focus:bg-destructive/5"
            >
              <LogOut className="size-4" /> Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
