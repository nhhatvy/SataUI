import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { children, Child } from '@/shared/mock-data/parent-data'

interface ActiveChildState {
  activeChildId: string
  child: Child
  setActiveChildId: (id: string) => void
}

export const useActiveChildStore = create<ActiveChildState>()(
  persist(
    (set) => ({
      // Luôn có 1 con được chọn (mặc định con đầu). "Mode" Phụ huynh/Học sinh
      // KHÔNG suy ra từ activeChildId nữa mà dựa vào route (/parent vs /student).
      activeChildId: children[0].id,
      child: children[0],
      setActiveChildId: (id) => {
        const childObj = children.find((c) => c.id === id) || children[0]
        set({ activeChildId: id, child: childObj })
      },
    }),
    {
      name: 'active-child-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
