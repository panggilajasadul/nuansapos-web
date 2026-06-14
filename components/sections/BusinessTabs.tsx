'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { BUSINESS_TYPES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function BusinessTabs() {
  const [activeId, setActiveId] = useState(BUSINESS_TYPES[0].id)
  const activeBusiness = BUSINESS_TYPES.find((b) => b.id === activeId) ?? BUSINESS_TYPES[0]

  return (
    <SectionWrapper id="bisnis" className="py-16 md:py-24 bg-navy-800/30 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
            Satu Aplikasi, 9 Jenis Bisnis
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Pilih tipe bisnis Anda — lihat fitur yang dirancang khusus untuk kebutuhan Anda.
          </p>
        </div>

        {/* Tab pills - scrollable on mobile */}
        <div
          className="flex gap-2 overflow-x-auto pb-4 mb-8 md:flex-wrap md:justify-center md:overflow-visible scrollbar-hide"
          role="tablist"
          aria-label="Pilih tipe bisnis"
        >
          {BUSINESS_TYPES.map((business) => (
            <button
              key={business.id}
              role="tab"
              aria-selected={activeId === business.id}
              onClick={() => setActiveId(business.id)}
              className={cn(
                'relative shrink-0 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap',
                'transition-colors duration-150',
                activeId === business.id
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5',
              )}
            >
              {activeId === business.id && (
                <motion.span
                  layoutId="active-business-pill"
                  className="absolute inset-0 bg-brand rounded-full -z-10"
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span aria-hidden="true">{business.emoji}</span>
                {business.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBusiness.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="font-display font-bold text-2xl md:text-3xl text-white">
                  {activeBusiness.label}
                </h3>
                <p className="text-brand-light text-lg">{activeBusiness.tagline}</p>
              </div>

              <ul className="space-y-3">
                {activeBusiness.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-slate-300">
                    <span
                      className="flex items-center justify-center shrink-0 w-5 h-5 rounded-full bg-brand/15 text-brand-light mt-0.5"
                      aria-hidden="true"
                    >
                      <Check size={14} />
                    </span>
                    <span className="text-sm md:text-base leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          {/* Mockup preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeBusiness.id}-mockup`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
              className="rounded-2xl border border-navy-600 bg-navy-800 p-8 aspect-[4/3] flex items-center justify-center text-center"
              style={{ borderColor: `${activeBusiness.color}33` }}
            >
              <div className="space-y-3">
                <div className="text-5xl" role="img" aria-label={`Ikon ${activeBusiness.label}`}>
                  {activeBusiness.emoji}
                </div>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                  {activeBusiness.mockupDesc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  )
}
