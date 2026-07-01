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
      <main className="pt-32 pb-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <div className="space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors duration-150"
            >
              <span>←</span> Kembali ke Beranda
            </Link>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-slate-900 pt-2">
              Syarat &amp; Ketentuan
            </h1>
            <p className="text-slate-500 text-sm">Terakhir diperbarui: Juni 2026</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-sm space-y-8 text-slate-600 text-sm md:text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg md:text-xl text-slate-900">
                1. Penerimaan Ketentuan
              </h2>
              <p>
                Dengan mengunduh dan menggunakan aplikasi <strong className="text-slate-900">{SITE_CONFIG.name}</strong>, Anda secara sadar dan penuh menyetujui syarat dan ketentuan penggunaan yang berlaku ini secara keseluruhan.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg md:text-xl text-slate-900">
                2. Penggunaan Layanan
              </h2>
              <p>
                <strong className="text-slate-900">{SITE_CONFIG.name}</strong> disediakan untuk membantu mempermudah operasional kasir dan manajemen bisnis UMKM di Indonesia.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>
                  <strong className="text-slate-900">Plan Gratis</strong> berlaku selamanya dengan batas kapasitas hingga 500 produk dan 5.000 transaksi.
                </li>
                <li>
                  <strong className="text-slate-900">Plan Premium &amp; Pro</strong> memberikan kapasitas penyimpanan serta fitur-fitur tambahan tanpa batasan sesuai dengan detail masing-masing plan yang dibeli.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg md:text-xl text-slate-900">
                3. Tanggung Jawab Pengguna
              </h2>
              <p>
                Demi keamanan data bisnis Anda, sebagai pengguna Anda bertanggung jawab penuh atas keamanan perangkat fisik Anda, PIN akun, serta pembuatan salinan cadangan data (backup data) secara berkala.
              </p>
              <p>
                <strong className="text-slate-900">{SITE_CONFIG.name}</strong> bekerja secara offline-first dan tidak menyimpan data Anda di server kami. Oleh karena itu, kami tidak bertanggung jawab atas segala bentuk kehilangan data akibat kerusakan perangkat fisik tanpa adanya file backup.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg md:text-xl text-slate-900">
                4. Perubahan Layanan
              </h2>
              <p>
                Kami berhak untuk memperbarui fitur, harga paket lisensi, atau memperbarui syarat ketentuan ini dari waktu ke waktu. Setiap perubahan signifikan akan kami informasikan secara transparan melalui update aplikasi atau situs resmi kami.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg md:text-xl text-slate-900">
                5. Hubungi Kami
              </h2>
              <p>
                Apabila Anda memiliki pertanyaan, kendala, atau membutuhkan klarifikasi lebih lanjut terkait syarat dan ketentuan ini, silakan hubungi tim kami secara langsung melalui email resmi di{' '}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-brand hover:text-brand-dark font-medium underline decoration-brand/30 hover:decoration-brand transition-colors duration-150"
                >
                  {SITE_CONFIG.email}
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
