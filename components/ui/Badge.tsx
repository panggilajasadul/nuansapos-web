import { cn } from '@/lib/utils'

type BadgeVariant = 'blue' | 'green' | 'gold' | 'muted'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'blue', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
        variant === 'blue' && 'bg-brand/10 text-brand border-brand/20',
        variant === 'green' && 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        variant === 'gold' && 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        variant === 'muted' && 'bg-slate-100 text-slate-600 border-slate-200',
        className,
      )}
    >
      {children}
    </span>
  )
}
