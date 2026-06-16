'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { Loader2 } from 'lucide-react'

// Root redirect: chưa đăng nhập → /login, đã đăng nhập → /parent (Mode Phụ huynh mặc định).
export default function RootRedirectPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    router.replace(user ? '/parent' : '/login')
  }, [mounted, user, router])

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )
}
