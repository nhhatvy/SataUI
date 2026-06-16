import { create } from 'zustand'

export interface SessionUser {
  id: string
  name: string
  email: string
  role: 'parent'
}

interface AuthState {
  user: SessionUser | null
  login: () => void
  logout: () => void
}

const mockParentUser: SessionUser = {
  id: 'p1',
  name: 'Nguyễn Văn Hải',
  email: 'hai.nv@gmail.com',
  role: 'parent',
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' && localStorage.getItem('satarobo_user')
    ? JSON.parse(localStorage.getItem('satarobo_user')!)
    : null,
  login: () => {
    localStorage.setItem('satarobo_user', JSON.stringify(mockParentUser))
    set({ user: mockParentUser })
  },
  logout: () => {
    localStorage.removeItem('satarobo_user')
    set({ user: null })
  },
}))
