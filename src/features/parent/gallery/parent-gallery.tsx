'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/shared/components/ui/dialog'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { getCourseSyllabus, getSessionExtras, type SessionPhoto } from '@/shared/mock-data/student-data'
import { StateMockWrapper } from '@/shared/components/state-mock-wrapper'
import { Camera, X, Download, ShieldAlert } from 'lucide-react'
import { cn } from '@/shared/utils/utils'
import { PageHero } from '@/shared/components/page-header'

type SelectedPhoto = { photo: SessionPhoto; sessionLabel: string; date: string }

// Hình ảnh lớp học — CHIA THEO TỪNG BUỔI HỌC. Mỗi buổi có bộ ảnh riêng.
// Học sinh chưa có cờ đồng ý hình ảnh -> ảnh được làm mờ (NĐ 13/2023).
export function ParentGallery() {
  const { child } = useActiveChildStore()
  const syllabus = getCourseSyllabus(child.id)
  const extras = getSessionExtras(child.id)

  const [selected, setSelected] = useState<SelectedPhoto | null>(null)

  const sessionsWithPhotos = syllabus.lessons.filter(
    (l) => l.progress !== 'upcoming' && (extras[l.index]?.photos?.length ?? 0) > 0
  )
  const totalPhotos = sessionsWithPhotos.reduce((sum, l) => sum + (extras[l.index]?.photos?.length ?? 0), 0)

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <PageHero
        icon={Camera}
        accent="parent"
        title="Hình ảnh lớp theo buổi học"
        subtitle={`${totalPhotos} ảnh từ ${sessionsWithPhotos.length} buổi học của ${child.name} · Lớp ${child.className}.`}
      />

      {/* Cảnh báo quyền hình ảnh */}
      {!child.imageConsent && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
          <ShieldAlert className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-amber-700 leading-relaxed">
            {child.shortName} chưa có cờ đồng ý sử dụng hình ảnh. Khuôn mặt con được làm mờ tự động trong ảnh chung
            theo Nghị định 13/2023. Vui lòng cập nhật đồng ý tại hồ sơ của con để hiển thị ảnh rõ nét.
          </p>
        </div>
      )}

      <StateMockWrapper
        skeletonType="grid"
        emptyTitle="Chưa có hình ảnh"
        emptyDescription="Giáo viên sẽ đăng ảnh lớp sau mỗi buổi học."
      >
        {sessionsWithPhotos.length === 0 ? (
          <Card className="border-border/60 rounded-2xl shadow-none p-10 text-center">
            <CardContent className="flex flex-col items-center gap-3 p-0">
              <Camera className="size-10 text-slate-300" />
              <p className="text-sm font-bold text-muted-foreground">Chưa có ảnh nào</p>
              <p className="text-sm text-muted-foreground max-w-xs">Ảnh lớp sẽ được chia theo từng buổi học khi giáo viên đăng tải.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {sessionsWithPhotos.map((lesson) => {
              const photos = extras[lesson.index]!.photos!
              return (
                <section key={lesson.index}>
                  {/* Session header */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-bold shrink-0">
                      {lesson.index}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground leading-tight truncate">
                        Buổi {lesson.index}: {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        Ngày chụp: {lesson.date} · {photos.length} ảnh
                      </p>
                    </div>
                  </div>

                  {/* Photo grid for this session */}
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {photos.map((photo) => (
                      <Card
                        key={photo.id}
                        onClick={() => setSelected({ photo, sessionLabel: `Buổi ${lesson.index}: ${lesson.title}`, date: lesson.date })}
                        className="border-border/60 overflow-hidden hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer shadow-xs group rounded-2xl py-0 gap-0"
                      >
                        <CardContent className="p-0">
                          <div className="aspect-[4/3] w-full relative select-none overflow-hidden bg-slate-900 rounded-t-2xl">
                            <div
                              className={cn(
                                'absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-300',
                                !child.imageConsent && 'blur-md opacity-60 scale-105'
                              )}
                              style={{ backgroundColor: photo.color }}
                            >
                              <Camera className="size-9 text-white/50 group-hover:scale-110 transition-transform duration-200" />
                            </div>
                            {!child.imageConsent && (
                              <div className="absolute inset-0 flex items-center justify-center p-2 bg-black/40 text-center z-10">
                                <span className="bg-destructive text-white text-xs font-bold rounded-lg px-2 py-1 shadow-md flex items-center gap-1">
                                  🔒 Đã làm mờ
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-3 bg-card border-t border-border/40">
                            <h4 className="text-sm font-bold text-foreground truncate">{photo.caption}</h4>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </StateMockWrapper>

      {/* Lightbox */}
      <Dialog open={!!selected} onOpenChange={(o: boolean) => !o && setSelected(null)}>
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none">
          {selected && (
            <div className="relative">
              <div className="w-full aspect-[4/3] relative select-none overflow-hidden bg-slate-900 rounded-t-2xl">
                <div
                  className={cn(
                    'absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-300',
                    !child.imageConsent && 'blur-xl opacity-60 scale-105'
                  )}
                  style={{ backgroundColor: selected.photo.color }}
                >
                  <Camera className="size-16 text-white/50" />
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-4 top-4 size-8 grid place-items-center rounded-full bg-black/50 text-white hover:bg-black/75 cursor-pointer border-none z-20"
                >
                  <X className="size-4" />
                </button>
                {!child.imageConsent && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40 text-center z-10 space-y-2">
                    <span className="bg-destructive text-white text-sm font-bold rounded-lg px-3 py-1.5 shadow-md flex items-center gap-1.5">
                      🔒 Quyền riêng tư hình ảnh
                    </span>
                    <p className="text-sm text-white/90 max-w-sm leading-relaxed font-bold">
                      Khuôn mặt con được làm mờ tự động do chưa có sự đồng ý sử dụng hình ảnh.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-card border-t border-border/60">
                <DialogTitle className="text-base font-bold text-foreground">
                  {child.imageConsent ? selected.photo.caption : 'Hình ảnh riêng tư'}
                </DialogTitle>
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  {selected.sessionLabel} · Ngày chụp: {selected.date}
                </p>

                {child.imageConsent && (
                  <div className="mt-5 flex justify-end border-t border-border/60 pt-4">
                    <button
                      onClick={() => {
                        alert('Đang tải ảnh chất lượng cao...')
                        setSelected(null)
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold px-4 py-2.5 hover:opacity-90 transition-all cursor-pointer shadow-sm shadow-primary/20 border-none"
                    >
                      <Download className="size-4" /> Tải ảnh
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}