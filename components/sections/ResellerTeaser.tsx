'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { RESELLER_PACKAGES, type ResellerPackage } from '@/lib/packages'
import { formatRupiah } from '@/lib/utils'
import { TrendingUp, ShieldCheck, Zap, DollarSign, ArrowRight } from 'lucide-react'

export function ResellerTeaser() {
  const [selectedPkgId, setSelectedPkgId] = useState<string>('RS100')
  const activePkg = RESELLER_PACKAGES.find(p => p.id === selectedPkgId) || RESELLER_PACKAGES[1]

  const normalTotal = 180000 * activePkg.qty
  const breakEven = Math.ceil(activePkg.modalPrice / activePkg.profitPerLicense)
  
  return (
    <SectionWrapper className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/50 to-white border-t border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Copywriting */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-brand/10 text-brand text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Peluang Kemitraan Reseller
          </div>
          
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-slate-900 leading-tight">
            Mulai Bisnis Sampingan POS UMKM dengan Margin hingga 67%
          </h2>
          
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            Bantu jutaan UMKM di kota Anda mendigitalisasi kasir mereka menggunakan NuansaPos. Beli lisensi PRO dalam jumlah besar dengan harga grosir, lalu jual kembali dengan harga eceran normal. Keuntungan 100% milik Anda!
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Keuntungan Bersih Fantastis</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Modal awal mulai dari <strong>Rp 60.000/lisensi</strong> (harga normal Rp 180.000). Dapatkan keuntungan bersih hingga <strong>Rp 90 Juta</strong> dari satu paket kemitraan!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Lisensi Lifetime Tanpa Kedaluwarsa</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Kunci lisensi grosir yang Anda beli tersimpan aman di database cloud dan tidak memiliki masa kedaluwarsa. Jual kapan saja Anda mau.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Dashboard Monitoring Mandiri</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Pantau mana saja kode lisensi Anda yang sudah aktif dan perangkat mana yang menggunakannya lewat dashboard admin terintegrasi.
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <Link href="/reseller">
              <button className="bg-brand hover:bg-brand-dark text-white rounded-xl px-6 py-3 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-brand/10">
                Pelajari Program Reseller Lengkap
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side: Interactive Profit Calculator */}
        <div className="lg:col-span-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full filter blur-2xl -z-10" />
            
            <div className="text-center mb-6">
              <h3 className="font-display font-bold text-base text-slate-900">
                🧮 Simulasi Kalkulator Profit Reseller
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Pilih paket reseller untuk melihat potensi keuntungan bersih Anda</p>
            </div>

            {/* Package Selector Pills */}
            <div className="grid grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60 mb-6">
              {RESELLER_PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPkgId(pkg.id)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                    selectedPkgId === pkg.id
                      ? 'bg-white text-brand shadow-sm font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {pkg.qty} Pcs
                  <span className="block text-[8px] text-slate-400 font-medium">({pkg.id})</span>
                </button>
              ))}
            </div>

            {/* Calculations Display */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-center">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Modal Anda</span>
                  <span className="font-display font-extrabold text-base text-slate-800 block mt-1">
                    {formatRupiah(activePkg.modalPrice)}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    ({formatRupiah(activePkg.pricePerLicense)}/key)
                  </span>
                </div>
                
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-center">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Omset Penjualan</span>
                  <span className="font-display font-extrabold text-base text-slate-800 block mt-1">
                    {formatRupiah(activePkg.suggestedSellPrice * activePkg.qty)}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    (Jual @ {formatRupiah(activePkg.suggestedSellPrice)})
                  </span>
                </div>
              </div>

              {/* Glowing Net Profit Card */}
              <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-2xl p-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/[0.02] animate-pulse" />
                <span className="text-[9px] text-emerald-600 block uppercase font-bold tracking-widest relative z-10">
                  💸 Estimasi Keuntungan Bersih
                </span>
                
                {/* Simulated Growth Counter */}
                <motion.span
                  key={selectedPkgId}
                  initial={{ scale: 0.95, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-display font-extrabold text-3xl md:text-4xl text-emerald-600 block my-1 relative z-10 shadow-glow"
                >
                  {formatRupiah(activePkg.totalProfit)}
                </motion.span>
                
                <span className="text-[10px] text-emerald-500 relative z-10">
                  Balik modal setelah menjual <strong>{breakEven} lisensi</strong> saja!
                </span>
              </div>
            </div>

            {/* ROI & Quick Summary */}
            <div className="mt-5 border-t border-slate-100 pt-4 flex justify-between items-center text-xs text-slate-500">
              <span>Return of Investment (ROI):</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg text-[11px]">
                +{Math.round((activePkg.totalProfit / activePkg.modalPrice) * 100)}% ROI
              </span>
            </div>
          </div>
        </div>

      </div>
    </SectionWrapper>
  )
}
