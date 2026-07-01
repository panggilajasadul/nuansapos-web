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
              Kebijakan Privasi
            </h1>
            <p className="text-slate-500 text-sm">Terakhir diperbarui: Juni 2026</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-sm space-y-8 text-slate-600 text-sm md:text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg md:text-xl text-slate-900">
                1. Data yang Kami Kumpulkan
              </h2>
              <p>
                <strong className="text-slate-900">{SITE_CONFIG.name}</strong> dirancang sepenuhnya dengan prinsip <strong className="text-brand">offline-first</strong>.
                Seluruh data transaksi penjualan, data stok barang, data pelanggan, dan laporan keuangan bisnis Anda disimpan secara lokal di dalam penyimpanan internal perangkat (HP) Anda sendiri.
              </p>
              <p>
                Kami <strong className="text-slate-900">tidak pernah</strong> mengirimkan, menyalin, ataupun mengunggah data operasional bisnis Anda ke server kami. Data Anda sepenuhnya adalah milik Anda pribadi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg md:text-xl text-slate-900">
                2. Validasi Lisensi
              </h2>
              <p>
                Koneksi internet hanya digunakan secara berkala untuk memvalidasi status lisensi aplikasi (untuk plan berbayar).
                Proses validasi ini murni mencocokkan nomor lisensi perangkat dan <strong className="text-slate-900">tidak mengirimkan</strong> data transaksi, nominal penjualan, atau data rahasia pelanggan Anda sama sekali.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg md:text-xl text-slate-900">
                3. Backup Data
              </h2>
              <p>
                Fitur cadangan (backup) otomatis menyimpan salinan data terenkripsi ke folder penyimpanan lokal perangkat Anda (folder <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-xs">Downloads</code>).
                Anda memegang kendali penuh atas keamanan, pemindahan, serta penghapusan berkas cadangan data tersebut.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg md:text-xl text-slate-900">
                4. Keamanan Akun & Kredensial
              </h2>
              <p>
                PIN akses masuk serta kredensial akun pengguna disimpan menggunakan enkripsi tingkat tinggi langsung di dalam perangkat lokal Anda. Hanya pengguna fisik yang mengetahui PIN yang tepat yang dapat mengakses aplikasi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg md:text-xl text-slate-900">
                5. Hubungi Kami
              </h2>
              <p>
                Jika Anda memiliki kekhawatiran, pertanyaan, atau tanggapan terkait kebijakan privasi kami, silakan hubungi tim dukungan kami melalui surat elektronik resmi di{' '}
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
