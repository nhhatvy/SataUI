'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Logo } from '@/shared/components/logo'
import { AlertCircle, CheckCircle2, Loader2, Lock } from 'lucide-react'

function ActivatePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [verifying, setVerifying] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [parentName, setParentName] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    // Simulate token verification against mock data/API
    const timer = setTimeout(() => {
      setVerifying(false)
      if (token && token !== 'expired') {
        setIsTokenValid(true)
        setParentName('Nguyễn Văn Hải')
      } else {
        setIsTokenValid(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [token])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (password.length < 8) {
      setErrorMsg('Mật khẩu phải tối thiểu 8 ký tự.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Xác nhận mật khẩu không khớp.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }, 1500)
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-semibold text-slate-500">Đang xác thực liên kết...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border-border/60">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="mb-4">
            <Logo />
          </div>
          <CardTitle className="text-xl font-black text-slate-900">Kích hoạt tài khoản</CardTitle>
          <CardDescription className="text-center text-sm font-medium text-slate-500 mt-1">
            {isTokenValid
              ? `Xin chào phụ huynh ${parentName}! Vui lòng thiết lập mật khẩu để hoàn tất đăng ký.`
              : 'Liên kết kích hoạt không hợp lệ hoặc đã hết hạn.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-3">
              <CheckCircle2 className="size-14 text-success animate-bounce" />
              <p className="text-base font-bold text-slate-900">Kích hoạt thành công!</p>
              <p className="text-sm text-slate-500 text-center font-normal">
                Đang chuyển hướng về trang đăng nhập...
              </p>
            </div>
          ) : isTokenValid ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-slate-700">Mật khẩu mới</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu từ 8 ký tự"
                    className="pl-10 h-10.5 rounded-xl border-border focus-visible:ring-primary font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-slate-700">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="pl-10 h-10.5 rounded-xl border-border focus-visible:ring-primary font-semibold"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-destructive/5 border border-destructive/20 text-destructive text-sm font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-sm shadow-primary/20"
              >
                {submitting ? 'Đang kích hoạt...' : 'Kích hoạt tài khoản'}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertCircle className="size-6" />
              </div>
              <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                Liên kết kích hoạt này đã được sử dụng hoặc đã hết thời gian hiệu lực 24 giờ.
              </p>
              <button
                onClick={() => alert('Đã gửi lại link kích hoạt qua Email phụ huynh.')}
                className="px-4 py-2.5 bg-white border border-border hover:bg-slate-50 text-slate-800 text-sm font-bold rounded-xl cursor-pointer shadow-2xs"
              >
                Gửi lại Email kích hoạt
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ActivatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-semibold text-slate-500">Đang tải trang kích hoạt...</p>
        </div>
      </div>
    }>
      <ActivatePageContent />
    </Suspense>
  )
}
