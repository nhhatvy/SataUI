'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/utils/utils'
import { Logo } from '@/shared/components/logo'
import { parentNav, studentNav } from '@/lib/nav-config'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { LoaderCircle, UserRound } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { child } = useActiveChildStore()

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-card border-r border-border/60 lg:flex items-center justify-center">
        <LoaderCircle className="size-5.5 animate-spin text-primary/60" />
      </aside>
    )
  }

  // Mode dựa vào route, không dựa vào activeChildId.
  const isStudentMode = pathname.startsWith('/student')
  const menuItems = isStudentMode ? studentNav : parentNav

  // Active khi đúng route hoặc là route con (vd /student/homework/abc nằm trong /student/homework).
  const isActiveLink = (href: string) => {
    const isRoot = href === '/parent' || href === '/student'
    return isRoot ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-card border-r border-border/60 lg:flex select-none animate-in fade-in duration-200">
      {/* Brand Logo Header */}
      <div className="flex h-16 items-center px-5 shrink-0 border-b border-border/40">
        <Logo />
      </div>

      {/* Flat navigation theo Mode */}
      <nav className="flex-1 overflow-y-auto space-y-1 px-3 py-4 scrollbar-thin">
        {menuItems.map((item) => {
          const active = isActiveLink(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex w-full items-center gap-3 rounded-r-xl py-2.5 text-sm transition-all duration-150',
                active
                  ? 'bg-accent-soft text-accent font-bold border-l-4 border-accent pl-2'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground font-medium pl-3'
              )}
            >
              <Icon className="size-4.5 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer ModeBadge: nhắc rõ đang ở chế độ nào / dữ liệu của ai */}
      <div className="m-4 rounded-xl p-3.5 shrink-0 border border-accent/20 bg-accent-soft space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-accent">
          {isStudentMode ? (
            <>
              <span
                className="grid size-5 place-items-center rounded-md text-xs font-bold text-white"
                style={{ backgroundColor: child?.avatarColor }}
              >
                {child?.initials}
              </span>
              Cổng Học Sinh
            </>
          ) : (
            <>
              <UserRound className="size-3.5" /> Cổng Phụ Huynh
            </>
          )}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground font-medium">
          {isStudentMode
            ? `Đang xem dữ liệu học tập của ${child?.shortName}. Đổi con ở góc trên phải.`
            : 'Quản lý lịch trình, học phí và tiến độ học tập của các con.'}
        </p>
      </div>
    </aside>
  )
}
