import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { RESELLER_PACKAGES, type ResellerPackage } from '@/lib/packages'
import { SITE_CONFIG } from '@/lib/constants'
import { formatRupiah } from '@/lib/utils'
import {
  TrendingUp, Users, ShieldCheck, Zap, Star, CheckCircle2,
  ArrowRight, DollarSign, BarChart3, MessageCircle,
  Calculator, Clock, AlertTriangle, ChevronRight,
} from 'lucide-react'
import { AnimatedCounter, ProfitCalculator } from './ResellerClient'

export const metadata: Metadata = {
  title: 'Program Reseller NuansaPos — Keuntungan Hingga Rp 90 Juta',
  description:
    'Daftar reseller NuansaPos gratis. Beli paket lisensi grosir langsung via Midtrans, dapatkan lisensi instan via email & file Excel profesional.',
  alternates: { canonical: 'https://nuansapos.id/reseller' },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1).replace('.0', '')} Miliar`
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace('.0', '')} Juta`
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)} rb`
  return `Rp ${n}`
}

// ─── Reseller Card ────────────────────────────────────────────────────────────
function ResellerCard({ pkg, rank }: { pkg: ResellerPackage; rank: number }) {
  const NORMAL_PRICE = 180_000
  const normalTotal = NORMAL_PRICE * pkg.qty
  const savings = normalTotal - pkg.modalPrice
  const breakEven = Math.ceil(pkg.modalPrice / pkg.profitPerLicense)
  const weeklyTarget = Math.ceil(pkg.qty / 4)

  const cardColors = pkg.highlighted
    ? 'bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white border-transparent shadow-2xl shadow-blue-500/30'
    : rank === 3
      ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white border-transparent shadow-xl shadow-slate-900/30'
      : 'bg-white border-slate-200/80 text-slate-900'

  const isLight = !pkg.highlighted && rank !== 3

  return (
    <div className={`relative rounded-3xl border flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${cardColors}`}>

      {/* Top badge */}
      {pkg.badge && (
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
          <div className={`px-5 py-1.5 text-xs font-extrabold tracking-wide rounded-b-2xl ${
            pkg.highlighted ? 'bg-amber-400 text-amber-900' :
            rank === 3 ? 'bg-amber-400 text-amber-900' :
            'bg-slate-900 text-white'
          }`}>
            {pkg.badge}
          </div>
        </div>
      )}

      <div className="p-7 pt-8 flex flex-col flex-1">
        {/* Header: Anchoring */}
        <div className="mb-5">
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isLight ? 'text-slate-400' : 'text-blue-200'}`}>
            {pkg.qty} Lisensi PRO · 3 perangkat/lic
          </p>
          {/* Strike-through anchor */}
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <span className={`text-sm line-through ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
              Normal {formatRupiah(normalTotal)}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/25 text-emerald-300'
            }`}>
              Hemat {fmt(savings)}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`font-display font-extrabold text-3xl ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {formatRupiah(pkg.modalPrice)}
            </span>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-400' : 'text-blue-200'}`}>
            Modal hanya <strong className={isLight ? 'text-slate-700' : 'text-white'}>{formatRupiah(pkg.pricePerLicense)}</strong>/lisensi
          </p>
        </div>

        {/* Profit highlight — loss aversion framing */}
        <div className={`rounded-2xl p-4 mb-4 ${
          pkg.highlighted ? 'bg-amber-400/25 border border-amber-300/40' :
          rank === 3 ? 'bg-amber-400/20 border border-amber-400/30' :
          'bg-emerald-50 border border-emerald-100'
        }`}>
          <p className={`text-xs font-bold mb-1 ${
            pkg.highlighted || rank === 3 ? 'text-amber-300' : 'text-emerald-600'
          }`}>
            💰 Potensi Profit Bersih
          </p>
          <p className={`font-display font-extrabold text-3xl ${
            pkg.highlighted || rank === 3 ? 'text-amber-300' : 'text-emerald-600'
          }`}>
            {fmt(pkg.totalProfit)}
          </p>
          <p className={`text-xs mt-0.5 ${
            pkg.highlighted || rank === 3 ? 'text-amber-200/70' : 'text-emerald-500'
          }`}>
            Jual @ {formatRupiah(pkg.suggestedSellPrice)} · untung {formatRupiah(pkg.profitPerLicense)}/lic
          </p>
        </div>

        {/* Micro-goals — makes it feel achievable */}
        <div className={`rounded-xl p-3 mb-4 space-y-2 text-xs ${isLight ? 'bg-slate-50' : 'bg-white/10'}`}>
          <div className={`flex items-center gap-2 ${isLight ? 'text-slate-600' : 'text-blue-100'}`}>
            <Clock size={12} className="shrink-0" />
            <span>Jual <strong className={isLight ? 'text-slate-900' : 'text-white'}>{weeklyTarget} lisensi/minggu</strong> → habis dalam 1 bulan</span>
          </div>
          <div className={`flex items-center gap-2 ${isLight ? 'text-slate-600' : 'text-blue-100'}`}>
            <TrendingUp size={12} className="shrink-0" />
            <span>Balik modal setelah jual <strong className={isLight ? 'text-slate-900' : 'text-white'}>{breakEven} lisensi</strong> saja</span>
          </div>
          <div className={`flex items-center gap-2 ${isLight ? 'text-slate-600' : 'text-blue-100'}`}>
            <BarChart3 size={12} className="shrink-0" />
            <span>ROI <strong className={isLight ? 'text-emerald-600' : 'text-amber-300'}>+{Math.round(pkg.totalProfit / pkg.modalPrice * 100)}%</strong> jika semua terjual</span>
          </div>
        </div>

        {/* CTA */}
        <Link href={`/beli/${pkg.id}`} className="mt-auto">
          <button className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95 group ${
            pkg.highlighted
              ? 'bg-white text-brand hover:bg-amber-50 shadow-lg shadow-white/20'
              : rank === 3
                ? 'bg-amber-400 text-amber-900 hover:bg-amber-300 shadow-lg shadow-amber-400/30'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/30'
          }`}>
            Beli Paket {pkg.id}
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
        <p className={`text-center text-xs mt-2 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
          Proses Instan · Aktivasi Otomatis
        </p>
      </div>
    </div>
  )
}

// ─── Scenario Card (Social Proof / Story) ───────────────────────────────────
function EarningScenario({ emoji, name, paket, action, profit, color }: {
  emoji: string; name: string; paket: string; action: string; profit: string; color: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`text-3xl shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl ${color}`}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-sm">{name}</p>
          <p className="text-slate-500 text-xs mb-2">Reseller Paket {paket}</p>
          <p className="text-slate-600 text-sm leading-relaxed">{action}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl">
            <DollarSign size={12} />
            Profit bersih: <span className="text-emerald-600">{profit}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Loss Aversion Banner ─────────────────────────────────────────────────────
function LossAversionBanner() {
  return (
    <div className="bg-gradient-to-r from-red-900 to-rose-900 rounded-3xl p-6 text-white border border-red-700/50">
      <div className="flex items-start gap-4">
        <div className="bg-red-500/20 rounded-xl p-2.5 shrink-0">
          <AlertTriangle size={22} className="text-red-300" />
        </div>
        <div>
          <p className="font-bold text-lg mb-1">⚠️ Yang Anda Lewatkan Setiap Harinya</p>
          <p className="text-red-200 text-sm leading-relaxed mb-3">
            Rata-rata reseller aktif menjual <strong className="text-white">3–5 lisensi per hari</strong>.
            Dengan profit Rp 60.000–90.000 per lisensi, artinya{' '}
            <strong className="text-amber-300">Rp 180.000–Rp 450.000 hilang setiap hari</strong> karena Anda belum mulai.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { period: '1 Hari', lost: 'Rp 270rb' },
              { period: '1 Minggu', lost: 'Rp 1,9 Jt' },
              { period: '1 Bulan', lost: 'Rp 8,1 Jt' },
            ].map(item => (
              <div key={item.period} className="bg-red-800/50 rounded-xl p-3">
                <p className="text-red-300 text-xs mb-0.5">{item.period} tunda</p>
                <p className="text-white font-bold text-sm">{item.lost} melayang</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ResellerPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-16">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-20 md:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-800/30 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-6">
            {/* Pill */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 rounded-full px-5 py-2 text-sm font-semibold text-amber-300">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                Program Reseller Resmi · Instan & Otomatis via Midtrans
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-center leading-tight mb-6">
              Modal <span className="text-amber-400">Rp 10 Juta.</span><br />
              Balik Modal Setelah <span className="text-emerald-400">17 Lisensi.</span><br />
              Profit Total <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Rp 6 Juta.</span>
            </h1>
            <p className="text-blue-200 text-center text-lg max-w-2xl mx-auto mb-10">
              Beli paket lisensi grosir NuansaPos via Midtrans, terima kode lisensi instan melalui email beserta file Excel rekap profesional. Mulai jual ke UMKM hari ini!
            </p>

            {/* Live profit counter row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
              {[
                { label: 'Reseller aktif', value: 312, suffix: '+', prefix: '' },
                { label: 'Lisensi terjual', value: 8500, suffix: '+', prefix: '' },
                { label: 'Min. profit/lisensi', value: 40000, suffix: '', prefix: 'Rp ' },
                { label: 'Max profit bundel', value: 90000000, suffix: '', prefix: 'Rp ' },
              ].map(s => (
                <div key={s.label} className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl p-4 text-center">
                  <p className="font-display font-extrabold text-2xl text-white">
                    <AnimatedCounter target={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </p>
                  <p className="text-blue-300 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#paket-reseller">
                <button className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-900 font-extrabold px-8 py-4 rounded-2xl transition-all duration-200 shadow-2xl shadow-amber-400/30 active:scale-95 text-base w-full sm:w-auto">
                  Mulai Jadi Reseller Sekarang
                </button>
              </a>
              <a href="#kalkulator-profit">
                <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 backdrop-blur text-base w-full sm:w-auto">
                  <Calculator size={16} />
                  Hitung Profit Saya <ArrowRight size={14} />
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* ── ANCHORING: Normal vs Reseller ── */}
        <section className="bg-white border-b border-slate-200 py-10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm font-medium mb-1">Harga normal vs. Harga Anda sebagai reseller</p>
              <h2 className="font-display font-bold text-2xl text-slate-900">Selisihnya = Keuntungan Anda</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
                <p className="text-xs text-red-500 font-semibold mb-1 uppercase">Harga Normal (End-User)</p>
                <p className="font-display font-extrabold text-3xl text-red-500 line-through">Rp 180.000</p>
                <p className="text-xs text-red-400 mt-1">per lisensi PRO</p>
              </div>
              <div className="bg-slate-900 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
                <p className="text-amber-400 font-bold text-2xl">VS</p>
                <p className="text-white text-xs mt-1">Anda sebagai reseller mendapat</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <p className="text-xs text-emerald-600 font-semibold mb-1 uppercase">Harga Reseller Terendah</p>
                <p className="font-display font-extrabold text-3xl text-emerald-600">Rp 60.000</p>
                <p className="text-xs text-emerald-500 mt-1">per lisensi (bundel 1000)</p>
              </div>
            </div>
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="text-2xl">🎯</div>
              <p className="text-amber-800 text-sm font-medium">
                Dengan modal <strong>Rp 60.000</strong>, jual seharga <strong>Rp 150.000</strong> — Anda untung{' '}
                <strong className="text-emerald-700">Rp 90.000 (150%) PER LISENSI</strong>. Tanpa kadaluarsa, tanpa retur, tanpa kirim fisik.
              </p>
            </div>
          </div>
        </section>

        {/* ── EARNING SCENARIOS (Social Proof) ── */}
        <SectionWrapper className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <p className="text-brand text-sm font-bold uppercase tracking-wider mb-2">Kisah Nyata Reseller Kami</p>
              <h2 className="font-display font-bold text-3xl text-slate-900 mb-3">
                Mereka Sudah Mulai. Anda Kapan?
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Reseller kami berasal dari berbagai latar belakang — penjual HP bekas, mahasiswa, ibu rumah tangga,
                hingga komunitas UMKM aktif.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <EarningScenario
                emoji="📱" name="Hendra, Pontianak"
                paket="100 Lisensi" color="bg-blue-50"
                action='Jual ke kontak WA-nya yang punya toko — warung, laundry, bengkel. "Dalam 3 minggu sudah habis 100 lisensi, tinggal restock."'
                profit="Rp 6.000.000"
              />
              <EarningScenario
                emoji="👩‍💼" name="Rini, Semarang"
                paket="50 Lisensi" color="bg-pink-50"
                action='"Saya pasang di grup Facebook UMKM Semarang. Dalam 2 minggu 40 sudah terjual. Sisanya lewat referral teman."'
                profit="Rp 2.000.000"
              />
              <EarningScenario
                emoji="🏬" name="Agus, Malang"
                paket="500 Lisensi" color="bg-amber-50"
                action='"Saya counter HP. Setiap jual HP baru, saya tawarkan lisensi NuansaPos. Laris banget ke pemilik warung."'
                profit="Rp 37.500.000"
              />
              <EarningScenario
                emoji="🎓" name="Dimas, Mahasiswa Surabaya"
                paket="100 Lisensi" color="bg-emerald-50"
                action='"Modal dari tabungan Rp 10 juta. Jual ke pedagang pasar. 2 bulan semua habis, profit 6 juta — bayar kuliah semester ini!"'
                profit="Rp 6.000.000"
              />
            </div>
          </div>
        </SectionWrapper>

        {/* ── LOSS AVERSION ── */}
        <section className="py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <LossAversionBanner />
          </div>
        </section>

        {/* ── PROFIT CALCULATOR ── */}
        <section id="kalkulator-profit" className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-brand text-sm font-bold uppercase tracking-wider mb-2">Kalkulator Interaktif</p>
              <h2 className="font-display font-bold text-3xl text-slate-900 mb-3">
                Berapa Profit <em>Anda</em> Sebenarnya?
              </h2>
              <p className="text-slate-500">Hitung sendiri dengan jumlah lisensi dan harga jual pilihan Anda.</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <ProfitCalculator />
              {/* Why it works */}
              <div className="space-y-5">
                <h3 className="font-display font-bold text-2xl text-slate-900">Kenapa Model Ini Bekerja?</h3>
                {[
                  {
                    icon: '🎯',
                    title: 'Produk Digital = 0 Risiko Stok Fisik',
                    desc: 'Tidak ada barang kadaluarsa, tidak perlu gudang, tidak ada ongkir. Produk Anda berbentuk kode — bisa dikirim via WhatsApp dalam 1 menit.',
                  },
                  {
                    icon: '📊',
                    title: '64 Juta UMKM = Pasar Tak Terbatas',
                    desc: 'Hampir setiap warung, laundry, bengkel, kafe butuh kasir digital. Anda tidak perlu jauh — mulai dari tetangga dan kontak WA Anda.',
                  },
                  {
                    icon: '🔄',
                    title: 'Repeat Order dari Pelanggan',
                    desc: 'Kalau satu toko buka cabang baru, mereka butuh lisensi lagi. Pelanggan yang puas = sumber repeat order tanpa akuisisi baru.',
                  },
                  {
                    icon: '💬',
                    title: 'Produk Yang "Menjual Sendiri"',
                    desc: 'Cukup tunjukkan demo NuansaPos ke calon pelanggan. Aplikasinya intuitif — mereka bisa langsung lihat manfaatnya tanpa penjelasan panjang.',
                  },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <div className="text-2xl shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <p className="font-bold text-slate-900 mb-1">{item.title}</p>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PAKET RESELLER ── */}
        <section id="paket-reseller" className="py-20 bg-gradient-to-b from-slate-100 to-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-brand text-sm font-bold uppercase tracking-wider mb-2">Pilih Bundel Anda</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mb-4">
                Semakin Banyak Beli,<br />
                <span className="text-emerald-600">Semakin Besar Untung</span>
              </h2>
              {/* Urgency: anchor normal price */}
              <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-6 py-3 shadow-sm">
                <span className="text-slate-500 text-sm">Harga normal end-user:</span>
                <span className="font-bold text-red-500 line-through text-sm">Rp 180.000/lisensi</span>
                <span className="text-slate-400 text-sm">→</span>
                <span className="font-bold text-emerald-600 text-sm">Harga Anda: mulai Rp 60.000/lisensi</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
              {RESELLER_PACKAGES.map((pkg, i) => (
                <ResellerCard key={pkg.id} pkg={pkg} rank={i} />
              ))}
            </div>

            {/* Comparison table */}
            <div className="mt-12 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md max-w-5xl mx-auto">
              <div className="bg-slate-900 text-white px-6 py-4">
                <h3 className="font-bold text-sm">📊 Perbandingan Lengkap — Efisiensi Modal vs. Profit</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-5 text-slate-500 font-semibold">Bundel</th>
                      <th className="text-right py-3 px-4 text-slate-500 font-semibold">Modal</th>
                      <th className="text-right py-3 px-4 text-slate-500 font-semibold">Modal/Lic</th>
                      <th className="text-right py-3 px-4 text-slate-500 font-semibold">Diskon</th>
                      <th className="text-right py-3 px-4 text-slate-500 font-semibold">Balik Modal</th>
                      <th className="text-right py-3 px-4 text-slate-500 font-semibold">ROI</th>
                      <th className="text-right py-3 px-5 text-emerald-600 font-bold">Total Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESELLER_PACKAGES.map((pkg, i) => {
                      const breakEven = Math.ceil(pkg.modalPrice / pkg.profitPerLicense)
                      const roi = Math.round(pkg.totalProfit / pkg.modalPrice * 100)
                      return (
                        <tr key={pkg.id} className={`border-t border-slate-50 hover:bg-slate-50 transition-colors ${pkg.highlighted ? 'bg-blue-50/60' : ''}`}>
                          <td className="py-3.5 px-5 font-medium text-slate-900">
                            {pkg.badge && <span className="mr-1.5">{i === 1 ? '🔥' : i === 2 ? '💎' : i === 3 ? '🚀' : ''}</span>}
                            {pkg.qty} Lisensi
                          </td>
                          <td className="text-right py-3.5 px-4 text-slate-700">{formatRupiah(pkg.modalPrice)}</td>
                          <td className="text-right py-3.5 px-4 text-slate-700">{formatRupiah(pkg.pricePerLicense)}</td>
                          <td className="text-right py-3.5 px-4">
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">{pkg.discountPercent}%</span>
                          </td>
                          <td className="text-right py-3.5 px-4 text-amber-600 font-medium">{breakEven} lisensi</td>
                          <td className="text-right py-3.5 px-4">
                            <span className={`font-bold ${roi >= 100 ? 'text-emerald-600' : 'text-blue-600'}`}>+{roi}%</span>
                          </td>
                          <td className="text-right py-3.5 px-5 text-emerald-600 font-extrabold">{fmt(pkg.totalProfit)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="bg-amber-50 border-t border-amber-100 px-6 py-3 text-xs text-amber-700 font-medium">
                * Asumsi jual @ harga yang disarankan. Anda bebas menentukan harga jual sendiri. Makin murah = makin cepat laku.
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW TO JOIN ── */}
        <SectionWrapper className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-3xl text-slate-900 mb-3">Mulai dalam 4 Langkah</h2>
              <p className="text-slate-500">Tidak rumit. Tidak butuh pengalaman. Proses otomatis dan aman via Midtrans.</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { step: '01', icon: '🛒', title: 'Pilih Paket', desc: 'Pilih paket reseller sesuai modal awal dan pasar Anda.' },
                { step: '02', icon: '💳', title: 'Bayar via Midtrans', desc: 'Selesaikan transaksi secara aman dengan QRIS, Transfer Bank, atau Kartu Kredit.' },
                { step: '03', icon: '📬', title: 'Terima via Email', desc: 'Dapatkan daftar lisensi Anda instan via email beserta rekap file Excel.' },
                { step: '04', icon: '💰', title: 'Jual & Nikmati Profit', desc: 'Bagikan lisensi kepada pembeli Anda dan simpan 100% dari keuntungan penjualan!' },
              ].map((s, i) => (
                <div key={s.step} className="relative text-center">
                  {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] right-0 h-0.5 bg-gradient-to-r from-slate-200 to-transparent" />}
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-blue-700 text-white font-display font-extrabold text-xl mb-4 shadow-lg shadow-brand/30">
                    {s.icon}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mb-1">{s.step}</p>
                  <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-slate-500 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* ── FAQ ── */}
        <section className="bg-slate-900 text-white py-20">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-display font-bold text-3xl text-center mb-10">Yang Sering Ditanyakan</h2>
            <div className="space-y-4">
              {[
                { q: 'Apakah lisensi bisa expired?', a: 'Tidak. Semua lisensi NuansaPos bersifat lifetime — tidak ada masa kadaluarsa. Pelanggan Anda pakai selamanya tanpa perlu perpanjang.' },
                { q: 'Apakah ada target penjualan wajib?', a: 'Tidak ada. Anda bebas jual sesuai kemampuan dan jaringan. Tidak ada tekanan, tidak ada penalti.' },
                { q: 'Berapa lama lisensi dikirim setelah pembayaran?', a: 'Lisensi dikirim secara otomatis dan instan ke email Anda dalam hitungan detik setelah transaksi Midtrans dinyatakan sukses.' },
                { q: 'Bisakah saya tawar harga jual ke pelanggan?', a: 'Ya, Anda 100% bebas menentukan harga jual. Kami hanya memberikan harga beli (modal). Keputusan harga jual ada di tangan Anda sepenuhnya.' },
                { q: 'Bagaimana pelanggan aktivasi lisensi?', a: 'Pelanggan download NuansaPos, buka menu Lisensi, masukkan kode. Selesai dalam 30 detik. Anda cukup kirim kode via WhatsApp.' },
              ].map(item => (
                <div key={item.q} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex gap-3 items-start">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white mb-1">{item.q}</p>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 py-20 text-white text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff opacity=0.05%3E%3Cpath d=M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50 pointer-events-none" />
          <div className="relative max-w-2xl mx-auto px-6">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-4 leading-tight">
              Jangan Biarkan Orang Lain<br />Ambil Profit yang Seharusnya Milik Anda
            </h2>
            <p className="text-orange-100 mb-8 text-lg leading-relaxed">
              Setiap hari ada UMKM di sekitar Anda yang butuh kasir digital.
              Anda bisa jadi orang yang mereka bayar untuk solusi itu.
            </p>
            <a href="#paket-reseller">
              <button className="inline-flex items-center gap-3 bg-white text-orange-600 font-extrabold px-10 py-5 rounded-2xl shadow-2xl hover:bg-orange-50 transition-all duration-200 text-lg active:scale-95">
                Ya, Saya Mau Jadi Reseller!
              </button>
            </a>
            <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-orange-200">
              <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Pembayaran instan via Midtrans</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Pengiriman file Excel otomatis</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Bebas tentukan harga</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Profit langsung masuk kantong</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
