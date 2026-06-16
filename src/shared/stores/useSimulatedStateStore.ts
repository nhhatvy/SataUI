import { create } from 'zustand'

export type LayoutState = 'success' | 'loading' | 'empty' | 'error'

interface SimulatedState {
  layoutState: LayoutState
  setLayoutState: (state: LayoutState) => void
}

export const useSimulatedStateStore = create<SimulatedState>((set) => ({
  layoutState: 'success',
  setLayoutState: (state) => set({ layoutState: state }),
}))
