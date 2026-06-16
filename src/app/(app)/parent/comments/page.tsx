'use client'

import { ParentChildSelector } from '@/shared/components/parent-child-selector'
import { ParentComments } from '@/features/parent/comments/parent-comments'

// Cổng Phụ huynh: nhận xét chi tiết của giáo viên theo từng buổi học (lọc + tìm kiếm).
export default function ParentCommentsPage() {
  return (
    <div>
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <ParentChildSelector />
      </div>
      <ParentComments />
    </div>
  )
}
