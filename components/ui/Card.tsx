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
        'rounded-2xl border border-navy-600 bg-navy-800 p-6',
        'transition-all duration-200',
        glow && 'glow-card hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10',
        className,
      )}
    >
      {children}
    </div>
  )
}
