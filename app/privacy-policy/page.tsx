import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi — NuansaPos',
  description: 'Kebijakan privasi NuansaPos: bagaimana data bisnis Anda disimpan dan dilindungi.',
  alternates: { canonical: 'https://nuansapos.id/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white">
            Kebijakan Privasi
          </h1>
          <p className="text-slate-400 text-sm">Terakhir diperbarui: Juni 2026</p>

          <div className="space-y-6 text-slate-300 text-sm md:text-base leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-display font-bold text-xl text-white">1. Data yang Kami Kumpulkan</h2>
              <p>
                {SITE_CONFIG.name} dirancang dengan prinsip <strong className="text-white">offline-first</strong>.
                Data transaksi, stok, dan laporan bisnis Anda disimpan secara lokal di perangkat Anda
                dan tidak pernah dikirimkan ke server kami.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-xl text-white">2. Validasi Lisensi</h2>
              <p>
                Koneksi internet hanya digunakan secara berkala untuk validasi lisensi aplikasi.
                Proses ini tidak mengirimkan data transaksi atau data pelanggan Anda.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-xl text-white">3. Backup Data</h2>
              <p>
                Fitur backup otomatis menyimpan salinan data ke penyimpanan lokal perangkat Anda
                (folder Downloads). Anda bertanggung jawab penuh atas penyimpanan dan keamanan file backup tersebut.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-xl text-white">4. Keamanan</h2>
              <p>
                PIN dan kredensial akun pengguna disimpan dalam bentuk terenkripsi di perangkat.
                Hanya pengguna dengan akses fisik dan PIN yang benar yang dapat membuka aplikasi.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-xl text-white">5. Hubungi Kami</h2>
              <p>
                Untuk pertanyaan terkait kebijakan privasi, silakan hubungi kami melalui{' '}
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-brand-light hover:underline">
                  {SITE_CONFIG.email}
                </a>.
              </p>
            </section>
          </div>

          <Link href="/" className="inline-block text-brand-light hover:underline text-sm">
            ← Kembali ke Beranda
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
