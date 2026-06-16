'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/shared/components/ui/sheet'
import { Logo } from '@/shared/components/logo'
import { parentNav, studentNav } from '@/lib/nav-config'
import { children as allChildren } from '@/shared/mock-data/parent-data'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { cn } from '@/shared/utils/utils'
import { Menu, UserRound, LogOut, Check } from 'lucide-react'

// Menu điều hướng đầy đủ cho mobile (sidebar bị ẩn trên màn nhỏ).
export function MobileMenu() {
  const pathname = usePathname()
  const router = useRouter()
  const { activeChildId, setActiveChildId, child } = useActiveChildStore()
  const { user, logout } = useAuthStore()
  const [open, setOpen] = useState(false)

  const isStudentMode = pathname.startsWith('/student')
  const items = isStudentMode ? studentNav : parentNav

  const isActive = (href: string) => {
    const isRoot = href === '/parent' || href === '/student'
    return isRoot ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
  }

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }
  const goParent = () => {
    setOpen(false)
    router.push('/parent')
  }
  const goChild = (id: string) => {
    setActiveChildId(id)
    setOpen(false)
    router.push('/student')
  }
  const handleLogout = () => {
    setOpen(false)
    logout()
    router.push('/login')
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="lg:hidden grid size-11 place-items-center rounded-xl text-foreground hover:bg-accent transition-colors cursor-pointer"
        aria-label="Mở menu"
      >
        <Menu className="size-5.5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-[18rem] max-w-[85vw] p-0" showCloseButton={false}>
        <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>

        {/* Brand */}
        <div className="flex h-16 items-center px-5 border-b border-border/50 shrink-0">
          <Logo />
        </div>

        <div className="flex-1 overflow-y-auto py-3 scrollbar-thin">
          {/* Nav */}
          <nav className="px-3 space-y-1">
            {items.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <button
                  key={item.href}
                  onClick={() => go(item.href)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 min-h-11 text-sm transition-colors text-left',
                    active ? 'bg-accent-soft text-accent font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'
                  )}
                >
                  <Icon className="size-4.5 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Chuyển chế độ */}
          <div className="mt-4 px-3">
            <p className="px-3 mb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Chuyển chế độ</p>
            <button
              onClick={goParent}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors',
                !isStudentMode ? 'bg-parent/10 text-parent' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <span className="grid size-7 place-items-center rounded-lg bg-parent/10 text-parent shrink-0"><UserRound className="size-4" /></span>
              <span className="flex-1 text-left">Cổng phụ huynh</span>
              {!isStudentMode && <Check className="size-4 text-parent" />}
            </button>
            {allChildren.map((c) => {
              const active = isStudentMode && c.id === activeChildId
              return (
                <button
                  key={c.id}
                  onClick={() => goChild(c.id)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors',
                    active ? 'bg-primary/5 text-primary' : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <span className="grid size-7 place-items-center rounded-lg text-[10px] font-black text-white shrink-0" style={{ backgroundColor: c.avatarColor }}>
                    {c.initials}
                  </span>
                  <span className="flex-1 text-left truncate">{c.shortName}</span>
                  {active && <Check className="size-4 text-primary" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer: account + logout */}
        <div className="border-t border-border/50 p-3 shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <span className="grid size-9 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white uppercase shrink-0">
              {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'G'}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Tài khoản'}</p>
              <p className="text-xs text-slate-400 font-medium truncate">{isStudentMode ? `Học sinh: ${child?.shortName}` : 'Phụ huynh'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="size-4.5" /> Đăng xuất
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
