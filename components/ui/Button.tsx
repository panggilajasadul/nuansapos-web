import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
        'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900',
        'disabled:opacity-50 disabled:pointer-events-none',

        // Variants
        variant === 'primary' && [
          'bg-brand text-white',
          'hover:bg-brand-light hover:-translate-y-0.5',
          'shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30',
          'active:scale-[0.98]',
        ],
        variant === 'secondary' && [
          'bg-transparent text-white border border-white/20',
          'hover:border-white/40 hover:bg-white/5',
        ],
        variant === 'ghost' && [
          'text-brand hover:text-brand-light hover:bg-brand/5',
        ],

        // Sizes
        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'md' && 'px-6 py-3 text-base',
        size === 'lg' && 'px-8 py-4 text-lg',

        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
