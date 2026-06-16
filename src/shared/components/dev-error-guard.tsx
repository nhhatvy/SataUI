'use client'

import { useEffect } from 'react'

// Chặn đúng MỘT lỗi vô hại, lặp lại của thư viện @base-ui / input range khi
// giả lập cảm ứng (DevTools mobile): "releasePointerCapture ... No active pointer".
// Lỗi này không ảnh hưởng chức năng nhưng làm tràn terminal/console khi dev.
export function DevErrorGuard() {
  useEffect(() => {
    const isBenign = (msg?: string) =>
      !!msg && msg.includes('releasePointerCapture') && msg.includes('No active pointer')

    const onError = (e: ErrorEvent) => {
      if (isBenign(e.message) || isBenign((e.error as Error)?.message)) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    }
    const onRejection = (e: PromiseRejectionEvent) => {
      const msg = typeof e.reason === 'string' ? e.reason : (e.reason as Error)?.message
      if (isBenign(msg)) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    }

    window.addEventListener('error', onError, true)
    window.addEventListener('unhandledrejection', onRejection, true)
    return () => {
      window.removeEventListener('error', onError, true)
      window.removeEventListener('unhandledrejection', onRejection, true)
    }
  }, [])

  return null
}
