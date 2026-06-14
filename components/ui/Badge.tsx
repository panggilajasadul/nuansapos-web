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
        variant === 'blue' && 'bg-brand/10 text-blue-300 border-brand/20',
        variant === 'green' && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        variant === 'gold' && 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        variant === 'muted' && 'bg-white/5 text-slate-400 border-white/10',
        className,
      )}
    >
      {children}
    </span>
  )
}
