export const breakpoints = {
  sm: '640px',   // Mobile Landscape / Small Tablet
  md: '768px',   // Portrait Tablet
  lg: '1024px',  // Landscape Tablet / Low-Res Laptop
  xl: '1280px',  // Standard Desktop
  '2xl': '1440px' // High-Res Desktop
}

export type BreakpointKey = keyof typeof breakpoints
