import { LucideIcon } from 'lucide-react'

export interface SidebarItem {
  type: 'link' | 'submenu'
  label: string
  icon: LucideIcon | any
  href?: string
  id?: string
  badge?: string
  items?: { label: string; href: string }[]
}

export interface Child {
  id: string
  name: string
  shortName: string
  className: string
  grade: string
  avatarColor: string
  initials: string
}

export interface ParentInfo {
  name: string
  fullName: string
  email: string
  initials: string
}

export interface AttendanceStatus {
  present: number
  absent: number
  total: number
  rate: number
}

export interface Notification {
  id: string
  type: 'payment' | 'success' | 'info' | 'warning'
  title: string
  description: string
  time: string
  unread: boolean
}
