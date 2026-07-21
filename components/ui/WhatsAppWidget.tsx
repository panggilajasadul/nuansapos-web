'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, User } from 'lucide-react'

export function WhatsAppWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [showMessage, setShowMessage] = useState(false)
  const [hasNewNotif, setHasNewNotif] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const isAdmin = pathname?.startsWith('/admin')

  // Trigger typing simulation when the popover opens
  useEffect(() => {
    if (isOpen) {
      setIsTyping(true)
      setShowMessage(false)
      const timer = setTimeout(() => {
        setIsTyping(false)
        setShowMessage(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Show a notification badge after 4 seconds of page load to catch user attention
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasNewNotif(true)
      }
    }, 4000)
    return () => clearTimeout(timer)
  }, [isOpen])

  // Auto-scroll inside chat dialogue
  useEffect(() => {
    if (showMessage && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [showMessage, isTyping])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const waNumber = '6285210582484'
    const encodedText = encodeURIComponent(message.trim())
    const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodedText}`
    
    window.open(waUrl, '_blank')
    setMessage('')
    setIsOpen(false)
  };

  const selectSuggestion = (suggestion: string) => {
    setMessage(suggestion)
  };

  const suggestions = [
    'Halo, saya tertarik bergabung menjadi Reseller NuansaPos 🤝',
    'Halo, mau tanya mengenai Paket PRO/Premium NuansaPos 🚀',
    'Halo Admin, saya ada kendala aktivasi lisensi 🔑',
  ]

  if (isAdmin) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-[99] font-sans print:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 20 }}
            className="mb-4 w-[340px] sm:w-[360px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#075e54] rounded-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">CS NuansaPos</h3>
                  <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                    <span>Biasanya membalas dalam 5 menit</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
                aria-label="Tutup chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 bg-[#efeae2] p-4 min-h-[220px] max-h-[300px] overflow-y-auto space-y-3 flex flex-col justify-end">
              {isTyping && (
                <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm text-xs text-slate-500 max-w-[80%] self-start flex items-center gap-1.5">
                  <span className="font-semibold text-[10px] text-slate-400">CS sedang mengetik</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              {showMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl rounded-tl-none p-3.5 shadow-sm text-xs text-slate-800 max-w-[85%] self-start"
                >
                  <p className="leading-relaxed">
                    Halo! Ada yang bisa kami bantu mengenai aplikasi kasir NuansaPos atau pendaftaran mitra reseller? 🤝
                  </p>
                  <span className="text-[9px] text-slate-400 block text-right mt-1.5">Baru saja</span>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions Chips */}
            <div className="bg-white p-2.5 border-t border-slate-100 flex flex-col gap-1.5 shrink-0">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Pertanyaan Populer:</span>
              <div className="flex flex-col gap-1">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => selectSuggestion(sug)}
                    className="text-left bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/50 p-2 rounded-xl text-[10px] font-medium transition-all"
                  >
                    {sug.length > 55 ? sug.substring(0, 55) + '...' : sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="bg-slate-50 p-3 border-t border-slate-100 flex gap-2 shrink-0">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik pertanyaan Anda ke WA..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#075e54] text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="w-9 h-9 rounded-xl bg-[#075e54] hover:bg-[#128c7e] text-white flex items-center justify-center transition-colors disabled:opacity-50 shrink-0 shadow-md shadow-[#075e54]/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen)
          setHasNewNotif(false)
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl shadow-[#25d366]/30 hover:shadow-[#25d366]/40 transition-all border border-[#25d366]/10 relative group"
        aria-label="Hubungi kami via WhatsApp"
      >
        {/* Pulsing Outer Rings */}
        <span className="absolute inset-0 rounded-full bg-[#25d366] opacity-30 group-hover:animate-ping duration-1000 scale-105" />
        
        {/* Icon */}
        <MessageCircle className="w-7 h-7 relative z-10" />

        {/* Pulsing Notification Badge */}
        {hasNewNotif && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border border-white text-[9px] text-white font-extrabold flex items-center justify-center">
              1
            </span>
          </span>
        )}
      </motion.button>
    </div>
  )
}
