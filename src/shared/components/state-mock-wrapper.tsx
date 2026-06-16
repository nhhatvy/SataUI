'use client'

import React from 'react'
import { useSimulatedStateStore, LayoutState } from '@/shared/stores/useSimulatedStateStore'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { AlertTriangle, FolderOpen, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'

interface StateMockWrapperProps {
  children: React.ReactNode
  skeletonType?: 'list' | 'grid' | 'calendar' | 'table'
  emptyTitle?: string
  emptyDescription?: string
}

export function StateMockWrapper({
  children,
  skeletonType = 'list',
  emptyTitle = 'Chưa có dữ liệu nào',
  emptyDescription = 'Hệ thống hiện tại chưa ghi nhận bản ghi nào cho mục học vụ này.'
}: StateMockWrapperProps) {
  const { layoutState, setLayoutState } = useSimulatedStateStore()

  if (layoutState === 'loading') {
    return (
      <div className="space-y-6 animate-pulse p-4">
        {skeletonType === 'calendar' && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-xl" />
              ))}
            </div>
          </div>
        )}
        {skeletonType === 'table' && (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        )}
        {skeletonType === 'grid' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        )}
        {skeletonType === 'list' && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (layoutState === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="grid size-16 place-items-center rounded-2xl bg-slate-50 border border-border/60 text-muted-foreground mb-4">
          <FolderOpen className="size-8" />
        </div>
        <h3 className="text-base font-bold text-slate-900 text-foreground">{emptyTitle}</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
          {emptyDescription}
        </p>
      </div>
    )
  }

  if (layoutState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-300">
        <Card className="border-destructive/20 bg-destructive/5 max-w-md w-full rounded-2xl">
          <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
            <span className="grid size-12 place-items-center bg-destructive/15 text-destructive rounded-full">
              <AlertTriangle className="size-6" />
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">Lỗi kết nối máy chủ</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Đã xảy ra lỗi khi tải dữ liệu học vụ từ máy chủ SataRobo. Vui lòng làm mới lại hoặc thử lại sau.
            </p>
            <button
              onClick={() => setLayoutState('success')}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-destructive hover:bg-destructive/90 text-white px-4 py-2.5 text-sm font-bold transition-all cursor-pointer shadow-sm shadow-destructive/20"
            >
              <RefreshCw className="size-4" /> Thử lại ngay
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
