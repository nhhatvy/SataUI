'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/utils/utils'
import { Home, Users, Wallet, Bell, Calendar, Pencil, List, Trophy } from 'lucide-react'

interface TabItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

export function BottomNav() {
  const pathname = usePathname()

  const parentTabs: TabItem[] = [
    { label: 'Tổng quan', icon: Home, href: '/parent' },
    { label: 'Các con', icon: Users, href: '/parent/children' },
    { label: 'Học phí', icon: Wallet, href: '/parent/finance' },
    { label: 'Thông báo', icon: Bell, href: '/parent/notifications' },
  ]

  const studentTabs: TabItem[] = [
    { label: 'Tổng quan', icon: Home, href: '/student' },
    { label: 'Lịch học', icon: Calendar, href: '/student/schedule' },
    { label: 'Buổi học', icon: List, href: '/student/sessions' },
    { label: 'Bài tập', icon: Pencil, href: '/student/homework' },
    { label: 'Xếp hạng', icon: Trophy, href: '/student/leaderboard' },
  ]

  const isStudentView = pathname.startsWith('/student')
  const tabs = isStudentView ? studentTabs : parentTabs

  const isActive = (href: string) => {
    const isRoot = href === '/parent' || href === '/student'
    return isRoot ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/65 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden select-none print:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((tab) => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className="relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 py-2 cursor-pointer"
              aria-label={tab.label}
            >
              <span className="relative">
                <tab.icon className={cn('size-5 transition-colors', active ? 'text-primary' : 'text-muted-foreground')} />
              </span>
              <span className={cn('text-[11px] font-bold leading-tight text-center transition-colors', active ? 'text-primary' : 'text-muted-foreground')}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
