'use client'

import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { ParentChildSelector } from '@/shared/components/parent-child-selector'
import { ParentSchedule } from '@/features/parent/schedule/parent-schedule'

// Cổng Phụ huynh: xem lịch học của từng con.
export default function ParentSchedulePage() {
  return (
    <div>
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 lg:px-8">
        <ParentChildSelector />
      </div>
      <Suspense
        fallback={
          <div className="flex h-64 w-full items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        }
      >
        <ParentSchedule />
      </Suspense>
    </div>
  )
}
