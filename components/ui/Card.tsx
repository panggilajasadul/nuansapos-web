import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
}

export function Card({ children, className, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
        'transition-all duration-200',
        glow && 'glow-card hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10',
        className,
      )}
    >
      {children}
    </div>
  )
}
