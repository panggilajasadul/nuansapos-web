'use client'

import { Download, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { SITE_CONFIG } from '@/lib/constants'

export function FinalCTA() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`

  return (
    <SectionWrapper className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand/5 via-blue-50/50 to-slate-100 border border-slate-200/60 shadow-lg px-8 py-16 md:py-20 text-center space-y-6">
          <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-40" aria-hidden="true" />

          <h2 className="relative font-display font-extrabold text-3xl md:text-5xl text-slate-900 leading-tight">
            Siap Tinggalkan Cara Lama?
          </h2>
          <p className="relative text-slate-600 text-lg max-w-xl mx-auto">
            Download NuansaPos sekarang, gratis selamanya untuk usaha kecil.
            Siap pakai dalam 5 menit, tanpa kartu kredit.
          </p>

          <div className="relative flex flex-wrap items-center justify-center gap-4 pt-2">
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
              onClick={() => window.open(whatsappUrl, '_blank')}
            >
              <MessageCircle size={20} />
              Hubungi via WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
