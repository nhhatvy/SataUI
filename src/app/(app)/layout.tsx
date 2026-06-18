'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { Sidebar } from '@/shared/layouts/sidebar'
import { Header } from '@/shared/layouts/header'
import { BottomNav } from '@/shared/layouts/bottom-nav'
import { DevStateSwitcher } from '@/shared/components/dev-state-switcher'
import { AppearanceController } from '@/shared/components/appearance-controller'
import { Loader2 } from 'lucide-react'

// Shared App Shell cho cả Mode Phụ huynh (/parent/*) và Mode Học sinh (/student/*).
// Guard yêu cầu đăng nhập; guard "phải có học sinh active" nằm ở (app)/student/layout.tsx.
export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !user) {
      router.replace('/login')
    }
  }, [user, router, mounted])

  if (!mounted || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  const isStudentMode = pathname.startsWith('/student')

  return (
    <div 
      data-mode={isStudentMode ? 'student' : 'parent'} 
      className="flex min-h-screen bg-background"
    >
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        {/* min-w-0 + overflow-x-clip: chặn mọi tràn ngang do trang con gây ra (tránh mobile bị zoom-out để lộ khoảng trắng phải) */}
        <div className="flex-1 min-w-0 overflow-x-clip bg-muted/50">{children}</div>
      </div>

      <BottomNav />
      <DevStateSwitcher />
      <AppearanceController />
    </div>
  )
}
