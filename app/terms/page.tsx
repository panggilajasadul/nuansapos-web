import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan — NuansaPos',
  description: 'Syarat dan ketentuan penggunaan aplikasi dan layanan NuansaPos.',
  alternates: { canonical: 'https://nuansapos.id/terms' },
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <h1 className="font-display font-black text-3xl md:text-4xl text-white">
            Syarat &amp; Ketentuan
          </h1>
          <p className="text-slate-400 text-sm">Terakhir diperbarui: Juni 2026</p>

          <div className="space-y-6 text-slate-300 text-sm md:text-base leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-display font-bold text-xl text-white">1. Penerimaan Ketentuan</h2>
              <p>
                Dengan mengunduh dan menggunakan aplikasi {SITE_CONFIG.name}, Anda menyetujui
                syarat dan ketentuan yang berlaku ini.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-xl text-white">2. Penggunaan Layanan</h2>
              <p>
                {SITE_CONFIG.name} disediakan untuk membantu operasional kasir dan manajemen
                bisnis UMKM. Plan Gratis berlaku untuk batas 500 produk dan 5.000 transaksi.
                Plan Premium dan Pro memberikan kapasitas dan fitur tambahan sesuai dengan
                deskripsi masing-masing plan.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-xl text-white">3. Tanggung Jawab Pengguna</h2>
              <p>
                Pengguna bertanggung jawab atas keamanan perangkat, PIN akun, dan backup data
                secara berkala. {SITE_CONFIG.name} tidak bertanggung jawab atas kehilangan data
                akibat kerusakan perangkat tanpa backup.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-xl text-white">4. Perubahan Layanan</h2>
              <p>
                Kami dapat memperbarui fitur, harga, atau ketentuan ini dari waktu ke waktu.
                Perubahan akan diinformasikan melalui aplikasi atau situs resmi kami.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold text-xl text-white">5. Hubungi Kami</h2>
              <p>
                Untuk pertanyaan terkait syarat dan ketentuan, silakan hubungi kami melalui{' '}
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
