'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Halaman penampung untuk Finish/Unfinish/Error Redirect URL Midtrans.
// Midtrans menambahkan order_id sebagai query param saat redirect ke sini -
// kita teruskan ke halaman status yang sudah punya logic polling.
function RedirectHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const orderId = searchParams.get('order_id')
    if (orderId) {
      router.replace(`/beli/status/${orderId}`)
    } else {
      router.replace('/')
    }
  }, [router, searchParams])

  return <div className="text-center text-slate-500 text-sm">Mengarahkan ke halaman status...</div>
}

export default function PaymentRedirectPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <Suspense fallback={<div className="text-center text-slate-500 text-sm">Memuat...</div>}>
        <RedirectHandler />
      </Suspense>
    </main>
  )
}
