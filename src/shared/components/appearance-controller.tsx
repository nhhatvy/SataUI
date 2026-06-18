'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { loadAppearance, applyAccent, setActiveRole, type Role } from '@/lib/appearance'

// Áp dụng MÀU NHẤN (theo role suy từ route) mỗi khi điều hướng.
// Theme sáng/tối do next-themes (ThemeProvider) xử lý. Màu nhấn chỉ áp dụng nếu người dùng đã lưu cấu hình.
export function AppearanceController() {
  const pathname = usePathname()

  useEffect(() => {
    const role: Role = pathname.startsWith('/student') ? 'student' : 'parent'
    setActiveRole(role)
    const saved = loadAppearance()
    const hex = saved?.accents?.[role]
    if (hex) applyAccent(hex, role)
  }, [pathname])

  return null
}
