'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface PhoneMockupProps {
  screenSrc?: string
  alt?: string
}

export function PhoneMockup({ screenSrc, alt = 'Tampilan aplikasi NuansaPos' }: PhoneMockupProps) {
  return (
    <motion.div
      animate={{
        y: [0, -14, 0],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="relative mx-auto w-[280px] select-none"
    >
      {/* Glow effect di belakang phone */}
      <motion.div
        animate={{
          boxShadow: [
            '0 0 40px rgba(37,99,235,0.3)',
            '0 0 80px rgba(37,99,235,0.5)',
            '0 0 40px rgba(37,99,235,0.3)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-[40px]"
        aria-hidden="true"
      />

      {/* Phone frame */}
      <div className="relative z-10 rounded-[40px] bg-navy-800 p-3 border border-white/10 shadow-2xl">
        {/* Camera notch */}
        <div className="flex justify-center mb-2">
          <div className="w-16 h-1.5 bg-navy-700 rounded-full" />
        </div>

        {/* Screen */}
        <div className="rounded-[22px] overflow-hidden bg-black aspect-[9/19]">
          {screenSrc ? (
            <Image
              src={screenSrc}
              alt={alt}
              width={260}
              height={550}
              className="w-full h-full object-contain"
              priority
            />
          ) : (
            /* Placeholder screen jika belum ada screenshot */
            <div className="w-full h-full bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
              <div className="text-center space-y-3 p-6 w-full">
                <div className="text-4xl" role="img" aria-label="Ikon kasir">🛒</div>
                <div className="text-slate-900 font-display font-bold text-lg">NuansaPos</div>
                <div className="space-y-2">
                  {['Produk A', 'Produk B', 'Produk C'].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200/50 shadow-sm rounded-lg px-3 py-2 text-xs text-slate-700 flex justify-between">
                      <span>{item}</span>
                      <span className="text-brand">Rp 25.000</span>
                    </div>
                  ))}
                </div>
                <div className="bg-brand rounded-xl py-3 text-white font-semibold text-sm">
                  Bayar • Rp 75.000
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Home button indicator */}
        <div className="flex justify-center mt-2">
          <div className="w-20 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
    </motion.div>
  )
}
