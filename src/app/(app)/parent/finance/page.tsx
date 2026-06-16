'use client'

import { ParentChildSelector } from '@/shared/components/parent-child-selector'
import { ParentFinance } from '@/features/parent/finance/parent-finance'

// Cổng Phụ huynh: học phí & công nợ theo từng con (chỉ khoản kế toán đã xác nhận).
export default function ParentFinancePage() {
  return (
    <div>
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
        <ParentChildSelector />
      </div>
      <ParentFinance />
    </div>
  )
}
