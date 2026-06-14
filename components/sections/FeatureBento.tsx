import { Wifi, BarChart3, Printer, Shield, Zap, Users, type LucideIcon } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Card } from '@/components/ui/Card'
import { FEATURE_HIGHLIGHTS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, LucideIcon> = {
  Wifi,
  BarChart3,
  Printer,
  Shield,
  Zap,
  Users,
}

const COLOR_MAP: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400',
  blue: 'bg-brand/10 text-brand-light',
  purple: 'bg-purple-500/10 text-purple-400',
  amber: 'bg-amber-500/10 text-amber-400',
}

export function FeatureBento() {
  return (
    <SectionWrapper id="fitur" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
            Fitur yang Selalu Diandalkan
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Bukan sekadar fitur tambahan — ini fondasi yang membuat usaha Anda berjalan lancar setiap hari.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {FEATURE_HIGHLIGHTS.map((feature) => {
            const Icon = ICON_MAP[feature.icon]
            return (
              <Card key={feature.title} glow className="space-y-4">
                <div
                  className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-xl',
                    COLOR_MAP[feature.color],
                  )}
                  aria-hidden="true"
                >
                  <Icon size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-lg text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
