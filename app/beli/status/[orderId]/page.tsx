'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  Mail,
  MessageCircle,
  Loader2,
  CreditCard,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getPackageDetails } from '@/lib/packages'
import { SITE_CONFIG } from '@/lib/constants'
import { formatRupiah } from '@/lib/utils'


type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'

type OrderData = {
  status: OrderStatus
  tier: string
  price: number
  email: string
  customerName: string
  orderId: string
  createdAt: string
  paidAt: string | null
  businessName?: string | null
  businessType?: string | null
}

const STEPS = ['Checkout', 'Pembayaran', 'Selesai'] as const

function stepIndexFor(status: OrderStatus | null) {
  if (status === 'paid') return 2
  if (status === 'pending' || status === null) return 1
  return 1 // failed/expired/cancelled juga berhenti di step pembayaran
}

export default function OrderStatusPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<OrderData | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isResuming, setIsResuming] = useState(false)
  const [resumeError, setResumeError] = useState<string | null>(null)

  const snapSrc =
    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'

  async function handleResumePayment() {
    setIsResuming(true)
    setResumeError(null)
    try {
      const res = await fetch(`/api/payment/resume?orderId=${params.orderId}`)
      const data = await res.json()
      if (!data.success) {
        setResumeError(data.message || 'Gagal mendapatkan token pembayaran')
        return
      }
      if (!window.snap) {
        setResumeError('Komponen pembayaran belum siap, coba lagi dalam beberapa detik.')
        return
      }
      window.snap.pay(data.token, {
        onSuccess: () => window.location.reload(),
        onPending: () => window.location.reload(),
        onError: () => setResumeError('Pembayaran gagal. Silakan coba lagi.'),
        onClose: () => {},
      })
    } catch {
      setResumeError('Gagal terhubung ke server. Periksa koneksi kamu.')
    } finally {
      setIsResuming(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout>

    async function poll() {
      try {
        const res = await fetch(`/api/payment/status/${params.orderId}`)
        const data = await res.json()
        if (cancelled) return

        if (!data.success) {
          setErrorMsg(data.message || 'Order tidak ditemukan')
          return
        }

        setOrder(data)

        if (data.status === 'pending') {
          timeoutId = setTimeout(poll, 4000)
        }
      } catch {
        if (!cancelled) timeoutId = setTimeout(poll, 5000)
      }
    }

    poll()
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [params.orderId])

  const status = order?.status ?? null
  const pkg = order
    ? (order.businessType === 'reseller'
        ? getPackageDetails(order.businessName || '')
        : getPackageDetails(order.tier))
    : null

  function copyOrderId() {
    navigator.clipboard.writeText(params.orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const waText = encodeURIComponent(
    `Halo, saya butuh bantuan untuk pesanan ${params.orderId} di NuansaPos.`
  )

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
      <Script
        src={snapSrc}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <div className="max-w-md w-full space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((label, i) => {
            const current = stepIndexFor(status)
            const done = i < current || (i === current && status === 'paid')
            const active = i === current && status !== 'paid'
            return (
              <div key={label} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                      done
                        ? 'bg-emerald-500 text-white'
                        : active
                          ? 'bg-brand text-white'
                          : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 mb-4 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        <Card className="p-8 text-center space-y-5">
          <AnimatePresence mode="wait">
            {errorMsg ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <XCircle className="w-14 h-14 text-red-500 mx-auto" />
                <h1 className="font-display font-bold text-xl text-slate-900">Terjadi Kesalahan</h1>
                <p className="text-slate-500 text-sm">{errorMsg}</p>
              </motion.div>
            ) : status === 'paid' && order && pkg ? (
              <motion.div
                key="paid"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="space-y-5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                </motion.div>
                <div>
                  <h1 className="font-display font-bold text-2xl text-slate-900">Pembayaran Berhasil!</h1>
                  <p className="text-slate-500 text-sm mt-1">Terima kasih, {order.customerName}.</p>
                </div>

                {/* Order summary */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Order ID</span>
                    <button
                      onClick={copyOrderId}
                      className="flex items-center gap-1.5 font-mono text-xs text-slate-700 hover:text-brand transition-colors"
                    >
                      {params.orderId}
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Paket</span>
                    <span className="font-semibold text-slate-800">{pkg.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Total Dibayar</span>
                    <span className="font-semibold text-slate-800">{formatRupiah(order.price)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    {pkg.isReseller ? (
                      <>
                        <span className="text-slate-400">Jumlah Lisensi</span>
                        <span className="font-semibold text-slate-800">{pkg.qty} Lisensi PRO (3HP)</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-400">Maks. Perangkat</span>
                        <span className="font-semibold text-slate-800">{pkg.maxDevices} HP</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left">
                  <Mail className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pkg.isReseller ? (
                      <>
                        Daftar <strong>{pkg.qty} kode lisensi</strong> dan file Excel laporan resmi sudah kami kirim ke{' '}
                        <span className="font-semibold text-slate-800">{order.email}</span>. Cek inbox kamu (termasuk folder spam/promosi).
                      </>
                    ) : (
                      <>
                        Kode lisensi sudah kami kirim ke{' '}
                        <span className="font-semibold text-slate-800">{order.email}</span>. Cek inbox kamu (termasuk folder spam/promosi) dalam beberapa menit.
                      </>
                    )}
                  </p>
                </div>
              </motion.div>
            ) : status === 'pending' || status === null ? (
              <motion.div
                key="pending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="relative w-16 h-16 mx-auto">
                  <Loader2 className="w-16 h-16 text-amber-500 animate-spin absolute inset-0" strokeWidth={1.5} />
                  <Clock className="w-6 h-6 text-amber-500 absolute inset-0 m-auto" />
                </div>
                <h1 className="font-display font-bold text-xl text-slate-900">Menunggu Pembayaran</h1>
                <p className="text-slate-500 text-sm">
                  Halaman ini akan otomatis diperbarui setelah pembayaran kamu kami terima.
                </p>
                {status === 'pending' && (
                  <div className="space-y-2">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={handleResumePayment}
                      disabled={isResuming}
                    >
                      {isResuming ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      {isResuming ? 'Memuat...' : 'Lanjutkan Pembayaran'}
                    </Button>
                    {resumeError && (
                      <p className="text-xs text-red-500 text-center">{resumeError}</p>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="failed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <XCircle className="w-14 h-14 text-red-500 mx-auto" />
                <h1 className="font-display font-bold text-xl text-slate-900">Pembayaran Tidak Berhasil</h1>
                <p className="text-slate-500 text-sm">
                  Status: <span className="font-semibold">{status}</span>. Silakan coba lagi atau hubungi
                  kami jika butuh bantuan.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="secondary" className="w-full !py-2.5 text-sm">
                <MessageCircle className="w-4 h-4" />
                Hubungi Kami
              </Button>
            </a>
            <Link href="/" className="flex-1">
              <Button variant="primary" className="w-full !py-2.5 text-sm">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  )
}
