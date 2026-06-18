// Hệ thống tùy chỉnh giao diện (Appearance) — theme + màu nhấn theo role.
// Áp dụng qua CSS variable --primary / --sidebar-primary / --primary-foreground.

export const ACCENT_PRESETS = [
  { id: 'orange', hex: '#FD8F2D', name: 'Cam' },
  { id: 'purple', hex: '#610C8D', name: 'Tím' },
  { id: 'teal', hex: '#1F93A8', name: 'Xanh ngọc' },
  { id: 'green', hex: '#2F9E6A', name: 'Xanh lá' },
  { id: 'indigo', hex: '#4F46E5', name: 'Chàm' },
  { id: 'rose', hex: '#E0526E', name: 'Hồng' },
] as const

export const ROLE_DEFAULT_ACCENT = { parent: '#610C8D', student: '#FD8F2D' } as const
export type Role = 'parent' | 'student'
// Theme (light/dark/system) do next-themes quản lý. Ở đây chỉ lưu MÀU NHẤN theo role.
export type ThemeMode = 'light' | 'dark' | 'system'

export type AppearanceState = {
  accents: { parent: string; student: string }
}

const KEY = 'sata-appearance'
const ROLE_KEY = 'sata-active-role'

export const defaultAppearance = (): AppearanceState => ({
  accents: { ...ROLE_DEFAULT_ACCENT },
})

export const loadAppearance = (): AppearanceState | null => {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null')
  } catch {
    return null
  }
}
export const saveAppearance = (s: AppearanceState) => {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ }
}
export const getActiveRole = (): Role =>
  (typeof window !== 'undefined' && (localStorage.getItem(ROLE_KEY) as Role)) || 'parent'
export const setActiveRole = (role: Role) => {
  try { localStorage.setItem(ROLE_KEY, role) } catch { /* ignore */ }
}

// ---- Contrast guard ----
export function relLuminance(hex: string): number {
  const m = hex.replace('#', '')
  const toLin = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  const r = toLin(parseInt(m.slice(0, 2), 16))
  const g = toLin(parseInt(m.slice(2, 4), 16))
  const b = toLin(parseInt(m.slice(4, 6), 16))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
// Màu sáng (cam…) -> chữ tối; màu tối -> chữ trắng.
export const inkOn = (hex: string) => (relLuminance(hex) > 0.42 ? '#241A2E' : '#FFFFFF')
export const isLightAccent = (hex: string) => relLuminance(hex) > 0.42
export const isValidHex = (h: string) => /^#?[0-9a-fA-F]{6}$/.test(h)
export const normalizeHex = (h: string) => {
  const v = h.startsWith('#') ? h : `#${h}`
  return v.toUpperCase()
}

// Tint nhạt từ HEX (dùng cho nền active sidebar/header — hợp cả light & dark vì là rgba).
export function softTint(hex: string, alpha = 0.12): string {
  const m = hex.replace('#', '')
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// ---- Apply to DOM ----
// Đồng bộ TẤT CẢ biến màu nhấn: primary (nút/CTA) + accent (sidebar active, badge,
// ProfileSwitcher, hover header) -> đổi màu ở settings phản ánh toàn bộ shell.
//
// QUAN TRỌNG: shell có wrapper [data-mode] khai báo lại `--accent: var(--parent|student)`,
// nên ghi đè `--accent` trực tiếp trên <html> sẽ bị shadow. Phải ghi đè BIẾN GỐC
// (--parent/--student + *-soft) để cascade của [data-mode] tự giải ra màu đã chọn.
export function applyAccent(hex: string, role: Role) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const ink = inkOn(hex)
  const tint = softTint(hex)
  // Primary (nút, CTA, thanh tiến độ, bottom-nav active) — không bị [data-mode] khai báo lại
  root.style.setProperty('--primary', hex)
  root.style.setProperty('--sidebar-primary', hex)
  root.style.setProperty('--primary-foreground', ink)
  root.style.setProperty('--ring', hex)
  // Biến GỐC theo role -> [data-mode] đọc qua var(--parent|student) nên đổi được toàn shell
  if (role === 'student') {
    root.style.setProperty('--student', hex)
    root.style.setProperty('--student-soft', tint)
  } else {
    root.style.setProperty('--parent', hex)
    root.style.setProperty('--parent-soft', tint)
  }
  // Fallback cho phần tử (hiếm) nằm ngoài wrapper [data-mode]
  root.style.setProperty('--accent', hex)
  root.style.setProperty('--accent-soft', tint)
  root.style.setProperty('--accent-foreground', ink)
}
