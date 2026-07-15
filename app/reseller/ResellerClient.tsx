'use client'

import { useState, useEffect, useRef } from 'react'
import { Calculator, ShieldCheck, TrendingUp, BarChart3, MessageCircle } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1).replace('.0', '')} Miliar`
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace('.0', '')} Juta`
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)} rb`
  return `Rp ${n}`
}

// ─── Animated Counter ────────────────────────────────────────────────────────
export function AnimatedCounter({ target, prefix = '', suffix = '', duration = 1800 }: {
  target: number; prefix?: string; suffix?: string; duration?: number
}) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = Date.now()
        const tick = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCurrent(Math.floor(eased * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  const display = current >= 1_000_000
    ? `${(current / 1_000_000).toFixed(1).replace('.0', '')} Juta`
    : current >= 1_000
      ? `${(current / 1_000).toFixed(0)} rb`
      : String(current)

  return <span ref={ref}>{prefix}{display}{suffix}</span>
}

// ─── Profit Calculator ────────────────────────────────────────────────────────
export function ProfitCalculator() {
  const [qty, setQty] = useState(100)
  const [sellPrice, setSellPrice] = useState(160_000)
  const [modalPerLic, setModalPerLic] = useState(100_000)

  // Determine modal from qty
  useEffect(() => {
    if (qty <= 50)      setModalPerLic(120_000)
    else if (qty <= 100) setModalPerLic(100_000)
    else if (qty <= 500) setModalPerLic(75_000)
    else               setModalPerLic(60_000)
  }, [qty])

  const totalModal = qty * modalPerLic
  const totalRevenue = qty * sellPrice
  const totalProfit = totalRevenue - totalModal
  const breakEven = Math.ceil(totalModal / (sellPrice - modalPerLic))
  const profitPerLic = sellPrice - modalPerLic
  const roi = ((totalProfit / totalModal) * 100).toFixed(0)

  // Daily scenarios
  const days30 = Math.ceil(qty / 30)

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-6">
        <div className="flex items-center gap-2 mb-1">
          <Calculator size={18} className="text-amber-400" />
          <p className="font-bold text-sm uppercase tracking-wider text-amber-400">Kalkulator Profit Reseller</p>
        </div>
        <p className="text-blue-200 text-sm">Geser slider untuk lihat potensi keuntungan Anda</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Qty slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">Jumlah Lisensi Dibeli</label>
            <span className="font-bold text-brand text-sm">{qty} lisensi</span>
          </div>
          <input
            type="range" min={10} max={1000} step={10}
            value={qty} onChange={e => setQty(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>10</span><span>500</span><span>1.000</span>
          </div>
        </div>

        {/* Sell price slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">Harga Jual per Lisensi</label>
            <span className="font-bold text-emerald-600 text-sm">{formatRupiah(sellPrice)}</span>
          </div>
          <input
            type="range" min={100_000} max={250_000} step={5000}
            value={sellPrice} onChange={e => setSellPrice(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Rp 100rb</span><span>Rp 175rb</span><span>Rp 250rb</span>
          </div>
        </div>

        {/* Modal info */}
        <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3 text-sm">
          <ShieldCheck size={16} className="text-blue-600 shrink-0" />
          <span className="text-blue-700">
            Modal Anda: <strong>{formatRupiah(modalPerLic)}/lisensi</strong>
            {qty <= 50 && ' (Paket 50)'}
            {qty > 50 && qty <= 100 && ' (Paket 100 — diskon 44%)'}
            {qty > 100 && qty <= 500 && ' (Paket 500 — diskon 58%)'}
            {qty > 500 && ' (Paket 1000 — diskon 67%)'}
          </span>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Total Modal</p>
            <p className="font-display font-bold text-slate-900 text-lg">{fmt(totalModal)}</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
            <p className="text-xs text-emerald-600 mb-1 font-semibold">💰 Total Profit</p>
            <p className="font-display font-extrabold text-emerald-600 text-xl">{fmt(totalProfit)}</p>
          </div>
        </div>

        {/* ROI bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600 font-medium">Return on Investment</span>
            <span className="font-bold text-emerald-600">+{roi}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(Number(roi), 200) / 2}%` }}
            />
          </div>
        </div>

        {/* Break even */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="bg-amber-400 rounded-xl p-2 shrink-0">
            <TrendingUp size={16} className="text-amber-900" />
          </div>
          <div>
            <p className="text-xs text-amber-700 font-semibold">Break Even (Balik Modal)</p>
            <p className="text-amber-900 font-bold">Setelah jual <span className="text-lg">{breakEven}</span> lisensi dari {qty}</p>
          </div>
        </div>

        {/* Micro-goal */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white text-sm">
          <p className="font-bold mb-1">💡 Mikro-target Harian</p>
          <p className="text-blue-100 text-xs leading-relaxed">
            Jual cukup <strong className="text-white">{days30} lisensi/hari</strong> selama 30 hari
            → Anda sudah menjual semua {qty} lisensi dan mengantongi{' '}
            <strong className="text-amber-300">{fmt(totalProfit)}</strong> bersih.
          </p>
        </div>
      </div>
    </div>
  )
}
