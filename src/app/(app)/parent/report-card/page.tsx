'use client'

import { Award } from 'lucide-react'
import { ParentChildSelector } from '@/shared/components/parent-child-selector'
import { PageHeader, InfoNote } from '@/shared/components/page-header'
import { ReportCardView } from '@/features/student/report-card/report-card-view'

// Cổng Phụ huynh: xem học bạ điện tử của từng con (chọn con ở thanh trên).
export default function ParentReportCardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8">
      <PageHeader
        icon={Award}
        title="Học bạ điện tử"
        subtitle="Kết quả học tập, chuyên cần và đánh giá năng lực của con theo từng kỳ."
      />
      <div className="mb-5">
        <InfoNote>
          Chỉ học bạ <strong>đã được trung tâm phát hành</strong> mới hiển thị nội dung. Bản nháp / chờ duyệt sẽ bị khóa.
        </InfoNote>
      </div>
      <ParentChildSelector />
      <ReportCardView />
    </main>
  )
}
