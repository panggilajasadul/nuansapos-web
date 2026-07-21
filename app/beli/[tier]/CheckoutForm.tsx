'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BUSINESS_TYPES } from '@/lib/constants'
import type { OrderTier } from '@/lib/packages'


const inputClass =
  'w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand transition-colors'
const labelClass = 'block text-xs font-semibold text-slate-600 mb-1.5'

export function CheckoutForm({ tier }: { tier: OrderTier }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    address: '',
    businessName: '',
    businessType: '',
    honeypot: '',
  })

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/payment/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, ...form }),
      })
      const data = await res.json()

      if (!data.success) {
        setErrorMsg(data.message || 'Gagal membuat transaksi')
        setIsSubmitting(false)
        return
      }

      if (!window.snap) {
        setErrorMsg('Modul pembayaran belum siap, silakan refresh halaman dan coba lagi.')
        setIsSubmitting(false)
        return
      }

      window.snap.pay(data.token, {
        onSuccess: () => router.push(`/beli/status/${data.orderId}`),
        onPending: () => router.push(`/beli/status/${data.orderId}`),
        onError: () => setErrorMsg('Pembayaran gagal, silakan coba lagi.'),
        onClose: () => setIsSubmitting(false),
      })
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan, silakan coba lagi.')
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot - tersembunyi dari manusia, bot biasanya mengisi semua field */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.honeypot}
          onChange={(e) => update('honeypot', e.target.value)}
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nama Lengkap *</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className={inputClass}
              placeholder="Nama kamu"
            />
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className={inputClass}
              placeholder="email@contoh.com"
            />
            <p className="text-[11px] text-slate-500 mt-1 leading-normal font-medium">
              📧 Kunci lisensi & link download file APK aplikasi akan dikirim instan secara otomatis ke email ini setelah pembayaran lunas.
              <span className="block text-amber-600 font-semibold mt-0.5">⚠️ Catatan: Jika tidak masuk ke kotak masuk utama, harap cek folder Spam atau Promosi.</span>
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>No WhatsApp *</label>
            <input
              required
              type="tel"
              value={form.whatsapp}
              onChange={(e) => update('whatsapp', e.target.value)}
              className={inputClass}
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div>
            <label className={labelClass}>Nama Usaha</label>
            <input
              type="text"
              value={form.businessName}
              onChange={(e) => update('businessName', e.target.value)}
              className={inputClass}
              placeholder="Opsional"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Jenis Usaha</label>
            <select
              value={form.businessType}
              onChange={(e) => update('businessType', e.target.value)}
              className={inputClass}
            >
              <option value="">Pilih jenis usaha (opsional)</option>
              {BUSINESS_TYPES.map((biz) => (
                <option key={biz.id} value={biz.id}>
                  {biz.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Alamat *</label>
            <input
              required
              type="text"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              className={inputClass}
              placeholder="Alamat lengkap"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Memproses...' : 'Lanjut ke Pembayaran'}
        </Button>
      </form>
    </Card>
  )
}
