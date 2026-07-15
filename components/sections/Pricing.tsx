'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, TrendingUp, MessageCircle } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PRICING_PLANS, SITE_CONFIG } from '@/lib/constants'
import { RESELLER_PACKAGES, type ResellerPackage } from '@/lib/packages'
import { formatRupiah, cn } from '@/lib/utils'

type Tab = 'regular' | 'reseller'

function formatRupiahShort(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(0)} M`
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)} Jt`
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)} rb`
  return `Rp ${n}`
}

function MiniResellerCard({ pkg }: { pkg: ResellerPackage }) {
  const NORMAL_PRICE = 180_000
  const normalTotal = NORMAL_PRICE * pkg.qty
  const savings = normalTotal - pkg.modalPrice
  const breakEven = Math.ceil(pkg.modalPrice / pkg.profitPerLicense)
  const roi = Math.round(pkg.totalProfit / pkg.modalPrice * 100)

  const whatsappMsg = encodeURIComponent(
    `Halo, saya ingin mendaftar sebagai Reseller NuansaPos 🙏\n\nPaket: *${pkg.qty} Lisensi PRO* (${pkg.id})\nModal: ${formatRupiah(pkg.modalPrice)}\n\nMohon info langkah selanjutnya!`
  )
  const waUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${whatsappMsg}`
  const isLight = !pkg.highlighted

  return (
    <div
      className={cn(
        'relative rounded-3xl border flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        pkg.highlighted
          ? 'bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white border-transparent shadow-xl shadow-brand/20'
          : 'bg-white border-slate-200/80',
      )}
    >
      {/* Badge */}
      {pkg.badge && (
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
          <div className={cn(
            'px-4 py-1 text-xs font-extrabold rounded-b-xl',
            pkg.highlighted ? 'bg-amber-400 text-amber-900' : 'bg-slate-900 text-white',
          )}>
            {pkg.badge}
          </div>
        </div>
      )}

      <div className="p-6 pt-7 flex flex-col flex-1">
        {/* Header: Anchoring */}
        <div className="mb-4">
          <p className={cn('text-xs font-bold uppercase tracking-widest mb-1', isLight ? 'text-slate-400' : 'text-blue-200')}>
            {pkg.qty} Lisensi PRO · 3HP/lic
          </p>
          {/* Strike-through: anchoring effect */}
          <div className="flex items-center flex-wrap gap-2 mb-0.5">
            <span className={cn('text-xs line-through', isLight ? 'text-red-400' : 'text-white/40')}>
              Normal {formatRupiah(normalTotal)}
            </span>
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/25 text-emerald-300')}>
              Hemat {formatRupiahShort(savings)}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={cn('font-display font-extrabold text-2xl', isLight ? 'text-slate-900' : 'text-white')}>
              {formatRupiah(pkg.modalPrice)}
            </span>
          </div>
          <p className={cn('text-xs mt-0.5', isLight ? 'text-slate-400' : 'text-blue-200')}>
            Modal <strong className={isLight ? 'text-slate-700' : 'text-white'}>{formatRupiah(pkg.pricePerLicense)}</strong>/lisensi
          </p>
        </div>

        {/* Profit */}
        <div className={cn('rounded-xl p-3 mb-3 text-center', pkg.highlighted ? 'bg-amber-400/25 border border-amber-300/40' : 'bg-emerald-50 border border-emerald-100')}>
          <p className={cn('text-xs font-bold mb-0.5', pkg.highlighted ? 'text-amber-300' : 'text-emerald-600')}>💰 Total Profit</p>
          <p className={cn('font-display font-extrabold text-2xl', pkg.highlighted ? 'text-amber-300' : 'text-emerald-600')}>
            {formatRupiahShort(pkg.totalProfit)}
          </p>
          <p className={cn('text-xs', pkg.highlighted ? 'text-amber-200/60' : 'text-emerald-500')}>
            jual @ {formatRupiah(pkg.suggestedSellPrice)}
          </p>
        </div>

        {/* Micro-goals */}
        <div className={cn('rounded-xl p-3 mb-4 space-y-1.5 text-xs', isLight ? 'bg-slate-50' : 'bg-white/10')}>
          <p className={isLight ? 'text-slate-600' : 'text-blue-100'}>
            ✅ Balik modal setelah{' '}
            <strong className={isLight ? 'text-slate-900' : 'text-white'}>{breakEven} lisensi</strong>
          </p>
          <p className={isLight ? 'text-slate-600' : 'text-blue-100'}>
            ✅ ROI <strong className={isLight ? 'text-emerald-600' : 'text-amber-300'}>+{roi}%</strong> jika habis terjual
          </p>
          <p className={isLight ? 'text-slate-600' : 'text-blue-100'}>
            ✅ Jual <strong className={isLight ? 'text-slate-900' : 'text-white'}>{Math.ceil(pkg.qty / 4)}/minggu</strong> → habis 1 bulan
          </p>
        </div>

        {/* CTA */}
        <Link href={`/beli/${pkg.id}`} className="mt-auto w-full">
          <button className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95',
            pkg.highlighted ? 'bg-white text-brand hover:bg-blue-50 shadow-lg shadow-white/20' : 'bg-blue-600 text-white hover:bg-blue-700',
          )}>
            Beli Paket {pkg.id}
          </button>
        </Link>
        <p className={cn('text-center text-xs mt-2', isLight ? 'text-slate-400' : 'text-white/40')}>
          Proses Instan · Aktivasi Otomatis
        </p>
      </div>
    </div>
  )
}

export function Pricing() {
  const [activeTab, setActiveTab] = useState<Tab>('regular')

  return (
    <SectionWrapper id="harga" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900">
            Mulai Gratis, Upgrade Kapan Saja
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Tidak ada biaya bulanan tersembunyi. Lisensi berbayar sekali bayar, pakai selamanya.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex gap-1">
            <button
              onClick={() => setActiveTab('regular')}
              className={cn(
                'px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                activeTab === 'regular'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              🛍️ Harga Reguler
            </button>
            <button
              onClick={() => setActiveTab('reseller')}
              className={cn(
                'px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                activeTab === 'reseller'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              🤝 Paket Reseller
            </button>
          </div>
        </div>

        {/* Regular Pricing */}
        {activeTab === 'regular' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-3xl p-8 border bg-white flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
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
        )}

        {/* Reseller Pricing */}
        {activeTab === 'reseller' && (
          <div>
            <div className="text-center mb-8">
              <p className="text-slate-600 max-w-xl mx-auto">
                Beli lisensi PRO (3 perangkat) dengan harga grosir. Semakin banyak beli, semakin besar untung.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-full px-4 py-2 font-medium">
                💡 Harga normal PRO: Rp 180.000 · Modal reseller mulai Rp 60.000/lisensi
              </div>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
              {RESELLER_PACKAGES.map((pkg) => (
                <MiniResellerCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/reseller">
                <button className="inline-flex items-center gap-2 text-brand font-semibold hover:underline text-sm">
                  Lihat halaman reseller lengkap →
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
