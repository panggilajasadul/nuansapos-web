'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden px-6 text-center select-none">
      {/* Background glowing bubbles */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative SVG grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-md w-full z-10 space-y-8">
        {/* Animated Icon Container */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.1 }}
          className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl shadow-blue-500/20 mx-auto"
        >
          <FileQuestion size={44} strokeWidth={1.5} className="animate-pulse" />
          {/* Small decorative orbiting element */}
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[10px] font-extrabold text-amber-950 border border-slate-950 animate-bounce">
            !
          </div>
        </motion.div>

        {/* Text Area */}
        <div className="space-y-3">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-bold uppercase tracking-widest text-blue-400"
          >
            Error Code 404
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight"
          >
            Halaman Tidak Ditemukan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm leading-relaxed"
          >
            Maaf, halaman yang Anda tuju tidak tersedia atau telah dipindahkan. Silakan kembali ke halaman utama untuk melanjutkan penjelajahan.
          </motion.p>
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 pt-2"
        >
          <Link href="/" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 active:scale-95 transition-all duration-200">
              <Home size={16} />
              Kembali ke Beranda
            </button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-sm active:scale-95 transition-all duration-200"
          >
            <ArrowLeft size={16} />
            Halaman Sebelumnya
          </button>
        </motion.div>
      </div>
    </main>
  )
}
