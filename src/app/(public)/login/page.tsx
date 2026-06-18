'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { Logo } from '@/shared/components/logo'
import { 
  Users, 
  Loader2,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/shared/utils/utils'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      login()
      router.push('/parent')
    }, 800)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900 px-4 py-12">
      {/* Decorative gradient blobs */}
      <div className="absolute -left-40 -top-40 size-96 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute -right-40 -bottom-40 size-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="w-full max-w-md">
        {/* Logo and Tagline */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Chào mừng đến với SataRobo
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Hệ thống quản lý học tập và phát triển tư duy thuật toán cho trẻ em
          </p>
        </div>

        {/* Login Container (Glassmorphic) */}
        <div className="glass-card overflow-hidden bg-slate-950/45 border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl rounded-3xl border">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Đăng nhập cổng phụ huynh</h2>
              <p className="text-sm text-slate-400 mb-6">
                Chỉ phụ huynh có tài khoản truy cập. Con sẽ học tập qua tài khoản hồ sơ liên kết.
              </p>
              
              <div className="flex items-start gap-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4 text-left select-none">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <Users className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-bold text-white mb-1">
                    Tài khoản: Nguyễn Văn Hải
                  </span>
                  <span className="block text-sm leading-relaxed text-slate-400">
                    Phụ huynh của Bảo Minh & Thảo An
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-slate-800/60">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-xl w-full py-3 text-sm font-bold text-primary-foreground transition-all cursor-pointer bg-primary hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    Đăng nhập tài khoản phụ huynh
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
              
            <div className="text-center text-sm text-slate-500">
                Demo Mode: Bấm nút trên để đăng nhập tự động mà không cần mật khẩu.
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
