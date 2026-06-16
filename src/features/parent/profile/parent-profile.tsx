'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Input } from '@/shared/components/ui/input'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { parent as parentInfo, children } from '@/shared/mock-data/parent-data'
import { User, Phone, Mail, MapPin, CheckCircle2, Save, KeyRound, ShieldCheck, ShieldAlert, ChevronRight, UserPlus } from 'lucide-react'

export function ParentProfile() {
  const { child } = useActiveChildStore()
  const { user } = useAuthStore()

  const [name, setName] = useState(user?.name || parentInfo.fullName)
  const [email, setEmail] = useState(user?.email || parentInfo.email)
  const [phone, setPhone] = useState('0987 654 321')
  const [address, setAddress] = useState('Số 10 Nguyễn Trãi, Thanh Xuân, Hà Nội')
  const [secondName, setSecondName] = useState('')
  const [secondPhone, setSecondPhone] = useState('')

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }, 1000)
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Hồ sơ gia đình</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý thông tin liên hệ của phụ huynh và hồ sơ các con liên kết.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        {/* Left: forms */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Parent info */}
            <Card className="border-border/60 rounded-2xl shadow-none overflow-hidden">
              <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Phụ huynh đại diện</h3>
                <span className="text-xs font-semibold uppercase text-primary tracking-wider">Mã hộ: SATAFAM-9812</span>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Họ và tên" icon={User} value={name} onChange={setName} required />
                  <Field label="Số điện thoại" icon={Phone} value={phone} onChange={setPhone} required />
                </div>
                <Field label="Email (đăng nhập & nhận báo cáo)" icon={Mail} value={email} onChange={setEmail} type="email" required />
                <Field label="Địa chỉ liên hệ" icon={MapPin} value={address} onChange={setAddress} />
              </CardContent>
            </Card>

            {/* Second parent */}
            <Card className="border-border/60 rounded-2xl shadow-none">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <UserPlus className="size-4 text-primary" />
                  <h3 className="text-base font-bold text-slate-900">Phụ huynh thứ hai <span className="text-sm font-medium text-slate-400">(tùy chọn)</span></h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Họ và tên" icon={User} value={secondName} onChange={setSecondName} placeholder="Chưa cập nhật" />
                  <Field label="Số điện thoại" icon={Phone} value={secondPhone} onChange={setSecondPhone} placeholder="Chưa cập nhật" />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              {saved ? (
                <span className="text-sm font-bold text-success flex items-center gap-1.5">
                  <CheckCircle2 className="size-5" /> Đã lưu hồ sơ!
                </span>
              ) : (
                <span className="text-sm text-muted-foreground font-medium max-w-sm">
                  Thông tin này dùng để đối soát danh tính khi xin học bù hoặc nhận thông báo.
                </span>
              )}
              <button type="submit" disabled={saving}
                className="ml-auto h-11 flex items-center gap-2 rounded-xl bg-primary text-white text-sm font-bold px-6 hover:opacity-90 disabled:opacity-50 cursor-pointer">
                {saving ? 'Đang lưu...' : <><Save className="size-4" /> Lưu hồ sơ</>}
              </button>
            </div>
          </form>

          {/* Change password */}
          <Card className="border-border/60 rounded-2xl shadow-none">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <KeyRound className="size-4 text-primary" />
                <h3 className="text-base font-bold text-slate-900">Đổi mật khẩu</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <PlainField label="Mật khẩu hiện tại" type="password" />
                <PlainField label="Mật khẩu mới" type="password" />
                <PlainField label="Xác nhận mật khẩu" type="password" />
              </div>
              <button
                type="button"
                onClick={() => alert('Mật khẩu đã được cập nhật (demo).')}
                className="h-10 rounded-xl border border-border bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cập nhật mật khẩu
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Right: linked children */}
        <aside className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Học sinh liên kết ({children.length})</h3>
          {children.map((c) => (
            <Card key={c.id} className={`rounded-2xl shadow-none border ${c.id === child.id ? 'border-primary/40' : 'border-border/60'}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl text-sm font-black text-white" style={{ backgroundColor: c.avatarColor }}>
                    {c.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{c.name}</h4>
                    <p className="text-sm text-slate-500 font-medium">{c.className} · {c.grade}</p>
                  </div>
                  {c.id === child.id && <Badge className="bg-primary text-white border-none text-[10px] font-bold px-1.5 py-0.5 rounded">Đang chọn</Badge>}
                </div>

                {/* Image consent status */}
                {c.imageConsent ? (
                  <div className="flex items-center gap-2 text-sm font-semibold text-success bg-success/5 border border-success/20 rounded-xl px-3 py-2">
                    <ShieldCheck className="size-4 shrink-0" /> Đã đồng ý sử dụng hình ảnh
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                      <ShieldAlert className="size-4 shrink-0" /> Chưa đồng ý hình ảnh
                    </div>
                    <button
                      onClick={() => alert('Đã gửi yêu cầu cập nhật đồng ý hình ảnh tới trung tâm (có ghi log).')}
                      className="text-sm font-bold text-primary hover:underline cursor-pointer"
                    >
                      Yêu cầu cập nhật đồng ý
                    </button>
                  </div>
                )}

                <Link
                  href={`/parent/children/${c.slug}`}
                  className="flex items-center justify-between text-sm font-bold text-slate-700 hover:text-primary"
                >
                  Xem hồ sơ chi tiết <ChevronRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </aside>
      </div>
    </main>
  )
}

function Field({
  label, icon: Icon, value, onChange, type = 'text', required, placeholder,
}: {
  label: string; icon: React.ComponentType<{ className?: string }>; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-500 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input required={required} type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 h-10.5 rounded-xl border-border bg-slate-50/50 font-semibold focus-visible:ring-primary" />
      </div>
    </div>
  )
}

function PlainField({ label, type = 'text' }: { label: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-500 mb-1">{label}</label>
      <Input type={type} className="h-10.5 rounded-xl border-border bg-slate-50/50 font-semibold focus-visible:ring-primary" />
    </div>
  )
}
