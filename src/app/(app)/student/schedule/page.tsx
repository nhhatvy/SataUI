import { Suspense } from 'react'
import { ParentSchedule } from '@/features/parent/schedule/parent-schedule'
import { Loader2 } from 'lucide-react'

export default function SchedulePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    }>
      <ParentSchedule />
    </Suspense>
  )
}
