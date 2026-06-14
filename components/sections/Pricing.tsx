'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PRICING_PLANS, SITE_CONFIG } from '@/lib/constants'
import { formatRupiah, cn } from '@/lib/utils'

export function Pricing() {
  const [yearly, setYearly] = useState(true)

  return (
    <SectionWrapper id="harga" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-4">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
            Mulai Gratis, Upgrade Kapan Saja
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Tidak ada biaya tersembunyi. Pilih plan yang sesuai dengan skala bisnis Anda.
          </p>
        </div>

        {/* Toggle bulanan/tahunan */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={cn('text-sm font-medium', !yearly ? 'text-white' : 'text-slate-400')}>
            Bulanan
          </span>
          <button
            role="switch"
            aria-checked={yearly}
            aria-label="Toggle harga bulanan atau tahunan"
            onClick={() => setYearly(!yearly)}
            className="relative w-14 h-8 rounded-full bg-navy-700 border border-white/10 transition-colors duration-150"
          >
            <span
              className={cn(
                'absolute top-1 left-1 w-6 h-6 rounded-full bg-brand transition-transform duration-[250ms]',
                yearly && 'translate-x-6',
              )}
            />
          </button>
          <span className={cn('text-sm font-medium', yearly ? 'text-white' : 'text-slate-400')}>
            Tahunan
          </span>
          <Badge variant="green">Hemat 20%</Badge>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice

            return (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-3xl p-8 border bg-navy-800 flex flex-col',
                  plan.highlighted
                    ? 'border-brand shadow-xl shadow-brand/20'
                    : 'border-navy-600',
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="gold">{plan.badge}</Badge>
                  </div>
                )}

                <div className="space-y-2 mb-6">
                  <h3 className="font-display font-bold text-xl text-white">{plan.name}</h3>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>

                <div className="mb-2">
                  {price === 0 ? (
                    <span className="font-display font-extrabold text-4xl text-emerald-400">
                      GRATIS
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-extrabold text-4xl text-white">
                        {formatRupiah(price)}
                      </span>
                      <span className="text-slate-400 text-sm">/bulan</span>
                    </div>
                  )}
                </div>
                <p className="text-slate-500 text-xs mb-6">{plan.limit}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-slate-300 text-sm">
                      <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-slate-500 text-sm">
                      <X size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => window.open(SITE_CONFIG.playStoreUrl, '_blank')}
                >
                  {plan.cta}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
