'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'

export default function OrderStatusPage({ params }: { params: { orderId: string } }) {
  const [status, setStatus] = useState<OrderStatus | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

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

        setStatus(data.status)
        setEmail(data.email)

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

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-20">
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        {errorMsg ? (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h1 className="font-display font-bold text-xl text-slate-900">Terjadi Kesalahan</h1>
            <p className="text-slate-500 text-sm">{errorMsg}</p>
          </>
        ) : status === 'paid' ? (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h1 className="font-display font-bold text-xl text-slate-900">Pembayaran Berhasil!</h1>
            <p className="text-slate-500 text-sm">
              Kode lisensi sudah kami kirim ke email{' '}
              <span className="font-semibold text-slate-700">{email}</span>. Cek inbox kamu (termasuk
              folder spam/promosi).
            </p>
          </>
        ) : status === 'pending' || status === null ? (
          <>
            <Clock className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
            <h1 className="font-display font-bold text-xl text-slate-900">Menunggu Pembayaran</h1>
            <p className="text-slate-500 text-sm">
              Halaman ini akan otomatis diperbarui setelah pembayaran kamu kami terima.
            </p>
          </>
        ) : (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h1 className="font-display font-bold text-xl text-slate-900">Pembayaran Tidak Berhasil</h1>
            <p className="text-slate-500 text-sm">
              Status: {status}. Silakan coba lagi atau hubungi kami jika butuh bantuan.
            </p>
          </>
        )}

        <Link href="/" className="inline-block pt-2">
          <Button variant="secondary">Kembali ke Beranda</Button>
        </Link>
      </Card>
    </main>
  )
}
