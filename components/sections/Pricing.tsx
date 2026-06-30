'use client'

import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PRICING_PLANS, SITE_CONFIG } from '@/lib/constants'
import { formatRupiah, cn } from '@/lib/utils'

export function Pricing() {
  return (
    <SectionWrapper id="harga" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900">
            Mulai Gratis, Upgrade Kapan Saja
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Tidak ada biaya bulanan tersembunyi. Lisensi berbayar sekali bayar, pakai selamanya.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'relative rounded-3xl p-8 border bg-white flex flex-col',
                plan.highlighted
                  ? 'border-brand shadow-xl shadow-brand/10'
                  : 'border-slate-200/80',
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="gold">{plan.badge}</Badge>
                </div>
              )}

              <div className="space-y-2 mb-6">
                <h3 className="font-display font-bold text-xl text-slate-900">{plan.name}</h3>
                <p className="text-slate-500 text-sm">{plan.description}</p>
              </div>

              <div className="mb-2">
                {plan.price === 0 ? (
                  <span className="font-display font-extrabold text-4xl text-emerald-600">
                    GRATIS
                  </span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-extrabold text-3xl text-slate-900">
                      {formatRupiah(plan.price)}
                    </span>
                    <span className="text-slate-500 text-sm">/lifetime</span>
                  </div>
                )}
              </div>
              <p className="text-slate-400 text-xs mb-6">{plan.limit}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-slate-700 text-sm">
                    <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-slate-400 text-sm">
                    <X size={16} className="shrink-0 mt-0.5 text-slate-300" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.id === 'free' ? (
                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => window.open(SITE_CONFIG.playStoreUrl, '_blank')}
                >
                  {plan.cta}
                </Button>
              ) : (
                <Link href={`/beli/${plan.id}`} className="w-full">
                  <Button variant={plan.highlighted ? 'primary' : 'secondary'} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
