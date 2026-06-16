import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Điểm thành tích tích lũy theo từng con (cộng dồn sau mỗi bài tập/kiểm tra trắc nghiệm).
// Bảng xếp hạng đọc store này để cập nhật điểm/hạng theo thời gian thực trong phiên.

export interface ChildScore {
  points: number // tổng điểm thành tích đã cộng trong phiên (score*10 mỗi bài)
  completed: number // số bài đã làm trong phiên
  scores: number[] // danh sách điểm (thang 10) để tính điểm trung bình
}

interface ScoreState {
  scores: Record<string, ChildScore>
  addResult: (childId: string, score10: number) => void
  getFor: (childId: string) => ChildScore
}

const EMPTY: ChildScore = { points: 0, completed: 0, scores: [] }

export const useScoreStore = create<ScoreState>()(
  persist(
    (set, get) => ({
      scores: {},
      addResult: (childId, score10) =>
        set((state) => {
          const cur = state.scores[childId] ?? { ...EMPTY, scores: [] }
          return {
            scores: {
              ...state.scores,
              [childId]: {
                points: cur.points + Math.round(score10 * 10),
                completed: cur.completed + 1,
                scores: [...cur.scores, score10],
              },
            },
          }
        }),
      getFor: (childId) => get().scores[childId] ?? EMPTY,
    }),
    {
      name: 'student-score-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
