import { cn } from '@/shared/utils/utils'

export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Đầu robot thân thiện - nhận diện SataRobo */}
          <rect x="4" y="7" width="16" height="13" rx="4" fill="currentColor" />
          <circle cx="9" cy="13" r="1.6" fill="oklch(0.748 0.169 56.8)" />
          <circle cx="15" cy="13" r="1.6" fill="oklch(0.748 0.169 56.8)" />
          <path
            d="M9 16.5h6"
            stroke="oklch(0.748 0.169 56.8)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M12 3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="3" r="1.4" fill="currentColor" />
        </svg>
      </div>
      {showText && (
        <span className="font-heading text-lg font-extrabold tracking-tight text-foreground">
          Sata<span className="text-primary">Robo</span>
        </span>
      )}
    </div>
  )
}
