'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FAQ_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <SectionWrapper id="faq" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12 space-y-4">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900">
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Tidak menemukan jawaban? Hubungi kami via WhatsApp.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
              >
                <button
                  className="flex items-center justify-between w-full text-left px-6 py-4 gap-4"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-slate-900 text-sm md:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={cn(
                      'shrink-0 text-slate-500 transition-transform duration-[250ms]',
                      isOpen && 'rotate-180',
                    )}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <p className="px-6 pb-4 text-slate-600 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
