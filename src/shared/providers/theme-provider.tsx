'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

// Quản lý chế độ Sáng/Tối/Hệ thống cho TOÀN dự án (next-themes -> class "dark" trên <html>).
// Màu nhấn (--primary theo role) do AppearanceController + lib/appearance xử lý riêng.
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
