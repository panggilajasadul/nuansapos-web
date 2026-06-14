'use client'

import { motion } from 'framer-motion'
import { Download, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PhoneMockup } from '@/components/ui/PhoneMockup'
import { SITE_CONFIG, TRUST_BADGES } from '@/lib/constants'

// Stagger animation untuk child elements
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left: Text content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Eyebrow badge */}
          <motion.div variants={item}>
            <Badge variant="blue">🇮🇩 Dibuat untuk UMKM Indonesia</Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1]"
          >
            Kasir Android untuk{' '}
            <span className="text-gradient">Semua Bisnis</span>{' '}
            UMKM
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={item}
            className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl"
          >
            Satu aplikasi untuk Retail, Restaurant, Apotek, Bengkel, Laundry, dan 5 bisnis lainnya.
            Bekerja{' '}
            <strong className="text-white">100% tanpa internet</strong>.
            Data di HP Anda sendiri.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => window.open(SITE_CONFIG.playStoreUrl, '_blank')}
            >
              <Download size={20} />
              Download Gratis
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => document.getElementById('bisnis')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play size={20} />
              Lihat Demo
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={item} className="flex flex-wrap gap-3 pt-2">
            {TRUST_BADGES.map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-slate-400 text-sm">
                <span className="text-emerald-400" aria-hidden="true">✓</span>
                {badge}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Phone mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex justify-center lg:justify-end"
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  )
}
