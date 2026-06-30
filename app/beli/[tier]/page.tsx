import { notFound } from 'next/navigation'
import Script from 'next/script'
import { PACKAGES, isValidTier } from '@/lib/packages'
import { PRICING_PLANS } from '@/lib/constants'
import { formatRupiah } from '@/lib/utils'
import { CheckoutForm } from './CheckoutForm'

export default function CheckoutPage({ params }: { params: { tier: string } }) {
  const tier = params.tier.toUpperCase()
  if (!isValidTier(tier)) {
    notFound()
  }

  const pkg = PACKAGES[tier]
  const plan = PRICING_PLANS.find((p) => p.id === tier)

  const snapSrc =
    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'

  return (
    <main className="min-h-screen bg-slate-50 py-12 md:py-20">
      <Script
        src={snapSrc}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10 space-y-2">
          <h1 className="font-display font-bold text-3xl text-slate-900">
            Beli Lisensi {pkg.name}
          </h1>
          <p className="text-slate-500">
            {formatRupiah(pkg.price)} — sekali bayar, pakai selamanya di hingga {pkg.maxDevices} perangkat
          </p>
        </div>

        {plan && (
          <ul className="grid sm:grid-cols-2 gap-2 mb-10 max-w-xl mx-auto">
            {plan.features.map((feature) => (
              <li key={feature} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <CheckoutForm tier={tier} />
      </div>
    </main>
  )
}
