'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Logo } from '@/shared/components/logo'
import { CheckCircle2, Mail, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border-border/60">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="mb-4">
            <Logo />
          </div>
          <CardTitle className="text-xl font-black text-slate-900">Quên mật khẩu?</CardTitle>
          <CardDescription className="text-center text-sm font-medium text-slate-500 mt-1">
            {success
              ? 'Kiểm tra hòm thư của bạn để nhận hướng dẫn khôi phục.'
              : 'Nhập email liên kết với tài khoản của bạn để khôi phục mật khẩu.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <CheckCircle2 className="size-14 text-success animate-bounce" />
              <p className="text-sm font-bold text-slate-800 text-center">
                Chúng tôi đã gửi link đặt lại mật khẩu đến {email}.
              </p>
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm font-bold text-primary hover:underline mt-2"
              >
                <ArrowLeft className="size-4" /> Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-slate-700">Email tài khoản</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="pl-10 h-10.5 rounded-xl border-border focus-visible:ring-primary font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-sm shadow-primary/20"
              >
                {submitting ? 'Đang gửi...' : 'Gửi liên kết khôi phục'}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="size-4" /> Quay lại đăng nhập
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
