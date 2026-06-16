'use client'

import { ParentChildSelector } from '@/shared/components/parent-child-selector'
import { ParentGallery } from '@/features/parent/gallery/parent-gallery'

// Cổng Phụ huynh: xem hình ảnh lớp học của từng con.
export default function ParentPhotosPage() {
  return (
    <div>
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 lg:px-8">
        <ParentChildSelector />
      </div>
      <ParentGallery />
    </div>
  )
}
