'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { Loader2 } from 'lucide-react'

// Mode Học sinh yêu cầu đã chọn 1 con (activeChildId). Nếu chưa chọn → quay về Mode Phụ huynh.
export default function StudentModeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { activeChildId } = useActiveChildStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !activeChildId) {
      router.replace('/parent')
    }
  }, [activeChildId, router, mounted])

  if (!mounted || !activeChildId) {
    return (
      <div className="flex h-full w-full items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
