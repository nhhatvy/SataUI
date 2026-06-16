'use client'

import { ParentChildSelector } from '@/shared/components/parent-child-selector'
import { ParentMakeup } from '@/features/parent/makeup/parent-makeup'

// Cổng Phụ huynh: yêu cầu & theo dõi học bù theo từng con.
export default function ParentMakeupPage() {
  return (
    <div>
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
        <ParentChildSelector />
      </div>
      <ParentMakeup />
    </div>
  )
}
