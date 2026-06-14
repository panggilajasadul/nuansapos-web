# SKILLS.md — Panduan Teknis & Konvensi Kode
## Proyek: Website NuansaPos

> Semua pattern, snippet, dan konvensi yang digunakan di seluruh proyek ini.  
> Jika ada konflik antara file ini dengan PRD, file ini yang menang untuk keputusan teknis.

---

## 1. SETUP & KONFIGURASI

### 1.1 package.json

```json
{
  "name": "nuansapos-website",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.383.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

### 1.2 tailwind.config.ts (WAJIB COPY PERSIS)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060D1A',
          900: '#0A1628',
          800: '#111D35',
          700: '#162040',
          600: '#1E3A5F',
          500: '#254D7A',
        },
        brand: {
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          dark: '#1D4ED8',
        },
        gold: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'count-up': 'count-up 1.8s ease-out forwards',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 24px rgba(37,99,235,0.25), 0 0 48px rgba(37,99,235,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(37,99,235,0.5), 0 0 80px rgba(37,99,235,0.2)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% -5%, rgba(37,99,235,0.25) 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow-blue': '0 0 32px rgba(37,99,235,0.35)',
        'glow-gold': '0 0 32px rgba(245,158,11,0.35)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(37,99,235,0.3)',
      },
    },
  },
  plugins: [],
}

export default config
```

### 1.3 globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: #0A1628;
    --foreground: #F8FAFC;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-navy-900 text-slate-100 font-body;
    background-image: radial-gradient(
      ellipse 80% 40% at 50% 0%,
      rgba(37, 99, 235, 0.12) 0%,
      transparent 70%
    );
    min-height: 100vh;
  }

  /* Selection color */
  ::selection {
    @apply bg-brand/30 text-white;
  }

  /* Scrollbar custom */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { @apply bg-navy-900; }
  ::-webkit-scrollbar-thumb { @apply bg-navy-600 rounded-full; }
  ::-webkit-scrollbar-thumb:hover { @apply bg-navy-500; }
}

@layer utilities {
  /* Reduced motion: matikan semua animasi */
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Glass card effect */
  .glass {
    @apply backdrop-blur-md bg-white/5 border border-white/10;
  }

  /* Glow border card */
  .glow-card {
    @apply relative transition-all duration-300;
    background: linear-gradient(135deg, rgba(255,255,255,0.03), transparent);
  }
  .glow-card:hover {
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.4), 0 8px 32px rgba(37, 99, 235, 0.15);
    transform: translateY(-2px);
  }

  /* Text gradient */
  .text-gradient {
    @apply bg-gradient-to-r from-white via-blue-200 to-brand-light bg-clip-text text-transparent;
  }
  .text-gradient-gold {
    @apply bg-gradient-to-r from-gold-light to-gold bg-clip-text text-transparent;
  }

  /* Section fade-in default state (diisi oleh Framer Motion) */
  .section-hidden {
    opacity: 0;
    transform: translateY(32px);
  }
}
```

### 1.4 app/layout.tsx

```typescript
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NuansaPos — Aplikasi POS Android untuk UMKM Indonesia',
  description:
    'Aplikasi kasir Android offline-first untuk 9 jenis bisnis UMKM. Retail, Restaurant, Apotek, Bengkel, Laundry, dan lebih. Mulai gratis, siap pakai 5 menit.',
  keywords: [
    'aplikasi kasir android',
    'pos umkm indonesia',
    'aplikasi toko offline',
    'aplikasi pos gratis',
    'kasir restaurant android',
    'nuansapos',
  ],
  openGraph: {
    title: 'NuansaPos — Kasir Android untuk Semua Bisnis UMKM',
    description: '100% Offline. 9 Jenis Bisnis. Gratis untuk usaha kecil.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'id_ID',
    type: 'website',
    siteName: 'NuansaPos',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NuansaPos — POS Android UMKM Indonesia',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://nuansapos.id' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${jakarta.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

---

## 2. UTILITY FUNCTIONS

### 2.1 lib/utils.ts

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Gabungkan Tailwind classes dengan aman (no conflict) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format angka ke Rupiah */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format angka dengan separator */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('id-ID').format(n)
}

/** Cek apakah user prefer reduced motion */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
```

---

## 3. CONSTANTS (lib/constants.ts)

### 3.1 Template Lengkap

```typescript
// lib/constants.ts
// SEMUA data statis website. Jangan hardcode di JSX.

export const SITE_CONFIG = {
  name: 'NuansaPos',
  tagline: 'Kasir Android untuk Semua Bisnis UMKM Indonesia',
  description: '100% Offline. 9 Jenis Bisnis. Siap pakai 5 menit.',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.nuansapos.app',
  whatsappNumber: '6281234567890',
  whatsappMessage: 'Halo, saya tertarik dengan NuansaPos. Boleh minta demo?',
  email: 'halo@nuansapos.id',
}

export const STATS = [
  { value: 10000, suffix: '+', label: 'Pengguna Aktif' },
  { value: 9, suffix: '', label: 'Jenis Bisnis' },
  { value: 4.8, suffix: '/5', label: 'Rating Play Store', isDecimal: true },
  { value: 100, suffix: '%', label: 'Offline' },
]

export type BusinessType = {
  id: string
  label: string
  emoji: string
  tagline: string
  color: string
  features: string[]
  mockupDesc: string // Deskripsi UI yang tampil di mockup
}

export const BUSINESS_TYPES: BusinessType[] = [
  {
    id: 'retail',
    label: 'Retail',
    emoji: '🛍️',
    tagline: 'Kasir cepat, stok selalu akurat',
    color: '#2563EB',
    features: [
      'Scan barcode instan, kurang dari 1 detik',
      'Multi-variant produk: ukuran, warna, rasa',
      'Loyalty poin member otomatis tiap transaksi',
      'Laporan penjualan harian & bulanan',
      'Hold transaksi hingga 5 antrian paralel',
    ],
    mockupDesc: 'POS Screen dengan grid produk + cart',
  },
  {
    id: 'grosir',
    label: 'Grosir',
    emoji: '📦',
    tagline: 'Piutang tertata, reseller happy',
    color: '#2563EB',
    features: [
      'Harga bertingkat otomatis per level reseller',
      'Sales Order → Surat Jalan → Invoice 1 klik',
      'Aging report piutang 30/60/90+ hari',
      'Multi-satuan: pcs, lusin, karton',
      'Deposit reseller & konsinyasi',
    ],
    mockupDesc: 'Invoice screen dengan progress pembayaran',
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    emoji: '🍽️',
    tagline: 'Order meja langsung ke dapur',
    color: '#E63946',
    features: [
      'Grid meja: hijau kosong, merah terisi',
      'Kitchen Display System real-time',
      'Split bill per orang atau per item',
      'Modifier menu: level pedas, topping, suhu',
      'Merge meja & pindah meja dengan mudah',
    ],
    mockupDesc: 'Grid meja dengan status warna-warni',
  },
  {
    id: 'cafe',
    label: 'Cafe',
    emoji: '☕',
    tagline: 'Antrian jelas, barista tidak salah',
    color: '#7C3AED',
    features: [
      'Nomor antrian otomatis: A001, A002...',
      'Happy hour: diskon otomatis jam tertentu',
      'Modifier minuman: size, suhu, level gula',
      'Combo menu: kopi + roti = harga paket',
      'Loyalty stamp: 10 kopi gratis 1',
    ],
    mockupDesc: 'Queue display screen + modifier picker',
  },
  {
    id: 'laundry',
    label: 'Laundry',
    emoji: '👕',
    tagline: 'Pakaian tidak pernah tertukar',
    color: '#4EA8DE',
    features: [
      'Scan QR label untuk update status cucian',
      'Papan WIP: Antri → Cuci → Kering → Siap',
      'Foto kondisi pakaian saat diterima',
      'Paket langganan kg: beli 20kg hemat 20%',
      'Estimasi selesai otomatis berdasarkan antrian',
    ],
    mockupDesc: 'Kanban board status laundry',
  },
  {
    id: 'bengkel',
    label: 'Bengkel',
    emoji: '🔧',
    tagline: 'Histori kendaraan, pelanggan percaya',
    color: '#FF6B35',
    features: [
      'Work Order dari plat nomor → auto-fill data',
      'Checklist pekerjaan per jenis servis',
      'Timer estimasi + alert jika terlambat',
      'Konfirmasi part aktual terpakai',
      'Reminder servis: X km atau X bulan',
    ],
    mockupDesc: 'Work Order screen dengan checklist',
  },
  {
    id: 'apotek',
    label: 'Apotek',
    emoji: '💊',
    tagline: 'FEFO otomatis, regulasi terjaga',
    color: '#00A86B',
    features: [
      'FEFO: obat expired terdekat selalu dipilih',
      'Alert 3 level: menipis, kritis, habis',
      'Resep dokter + modul racikan',
      'Pencatatan narkotika otomatis untuk Dinkes',
      'Obat pengganti langsung tampil jika habis',
    ],
    mockupDesc: 'POS dengan batch FEFO indicator',
  },
  {
    id: 'distributor',
    label: 'Distributor',
    emoji: '🚚',
    tagline: 'Pengiriman terpantau, piutang terkelola',
    color: '#0F52BA',
    features: [
      'Tracking pengiriman: Loaded → Dikirim → Diterima',
      'Target salesman + leaderboard pencapaian',
      'Dashboard piutang aging per reseller',
      'Manajemen armada & assign DO ke kendaraan',
      'Konsinyasi: stok titipan + rekonsiliasi bulanan',
    ],
    mockupDesc: 'Dashboard piutang dengan aging chart',
  },
  {
    id: 'bangunan',
    label: 'Toko Bangunan',
    emoji: '🏗️',
    tagline: 'Multi-satuan, stok material akurat',
    color: '#374151',
    features: [
      'Jual per meter, kg, sak, roll, lembar',
      'Kalkulator material: luas → dus keramik otomatis',
      'Barang inden: DP → PO ke supplier → notif datang',
      'Potongan material: sisa stok otomatis berkurang',
      'Harga level: Umum, Tukang, Kontraktor',
    ],
    mockupDesc: 'Kalkulator material dengan hasil langsung ke cart',
  },
]

export const FEATURE_HIGHLIGHTS = [
  {
    icon: 'Wifi',  // lucide icon name
    title: '100% Offline',
    description: 'Semua fitur bekerja tanpa internet. Data di HP kamu, bukan di server kami.',
    color: 'emerald',
  },
  {
    icon: 'BarChart3',
    title: 'Laporan Real-time',
    description: 'Omzet hari ini, produk terlaris, laba kotor — tersedia tanpa perlu export dulu.',
    color: 'blue',
  },
  {
    icon: 'Printer',
    title: 'Cetak Struk Bluetooth',
    description: 'Terhubung ke printer thermal dalam 3 detik. Cetak struk, invoice, surat jalan.',
    color: 'purple',
  },
  {
    icon: 'Shield',
    title: 'Data Privasi Terjaga',
    description: 'Data bisnis tidak pernah dikirim ke server manapun. PIN tersimpan terenkripsi.',
    color: 'blue',
  },
  {
    icon: 'Zap',
    title: 'Siap 5 Menit',
    description: 'Onboarding 8 langkah, ada data contoh. Transaksi pertama dalam menit.',
    color: 'amber',
  },
  {
    icon: 'Users',
    title: 'Multi-User & Role',
    description: 'Owner, Manager, Kasir — masing-masing punya akses yang tepat.',
    color: 'blue',
  },
]

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Gratis',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Untuk usaha yang baru mulai',
    limit: '500 produk · 5.000 transaksi',
    features: [
      'POS kasir lengkap',
      'Laporan penjualan dasar',
      '1 akun user',
      'Backup manual',
      'Cetak struk thermal',
    ],
    notIncluded: ['Multi-user', 'Export Excel', 'Promo & voucher'],
    cta: 'Download Gratis',
    highlighted: false,
    badge: null,
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 99000,
    yearlyPrice: 79000,
    description: 'Untuk toko yang sedang berkembang',
    limit: 'Produk & transaksi tidak terbatas',
    features: [
      'Semua fitur Gratis',
      'Multi-user hingga 5 akun',
      'Export Excel & PDF',
      'Backup otomatis harian',
      'Promo, diskon & voucher',
      'Laporan laba rugi',
      'Priority support WhatsApp',
    ],
    notIncluded: [],
    cta: 'Coba 14 Hari Gratis',
    highlighted: true,
    badge: 'Paling Populer',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 199000,
    yearlyPrice: 159000,
    description: 'Untuk bisnis yang lebih kompleks',
    limit: 'Semua fitur + semua modul bisnis',
    features: [
      'Semua fitur Premium',
      'User tidak terbatas',
      'Modul akuntansi double-entry',
      'Rekonsiliasi bank (upload CSV)',
      'Import pesanan marketplace',
      'Offline picking Shopee/Tokopedia',
      'Dedicated support',
    ],
    notIncluded: [],
    cta: 'Mulai Pro',
    highlighted: false,
    badge: null,
  },
]

export const TESTIMONIALS = [
  {
    name: 'Budi Santoso',
    business: 'Toko Kelontong Berkah',
    city: 'Surabaya',
    type: 'retail',
    rating: 5,
    text: 'Dulu stok selalu kacau, sekarang semua terpantau. Paling suka fitur barcode-nya, cepet banget. Internet mati tetap bisa jalan — ini yang bikin saya pilih NuansaPos.',
    avatar: '/images/avatar-budi.jpg',
  },
  {
    name: 'Siti Rahayu',
    business: 'Laundry Bersih Jaya',
    city: 'Bandung',
    type: 'laundry',
    rating: 5,
    text: 'Pakaian pelanggan tidak pernah tertukar lagi setelah pakai QR label. Pelanggan juga suka bisa cek status cucian. Complain turun drastis.',
    avatar: '/images/avatar-siti.jpg',
  },
  {
    name: 'Ahmad Fauzi',
    business: 'Bengkel Motor Maju',
    city: 'Medan',
    type: 'bengkel',
    rating: 5,
    text: 'Fitur histori kendaraan per plat nomor itu game changer. Pelanggan datang, langsung ketahuan kapan terakhir servis dan ganti apa. Mereka jadi lebih percaya.',
    avatar: '/images/avatar-ahmad.jpg',
  },
  {
    name: 'Dewi Puspita',
    business: 'Apotek Sehat Mandiri',
    city: 'Yogyakarta',
    type: 'apotek',
    rating: 5,
    text: 'FEFO-nya benar-benar otomatis. Obat expired tidak pernah terjual ke pasien. Laporan narkotika juga langsung siap, tidak perlu rekap manual lagi.',
    avatar: '/images/avatar-dewi.jpg',
  },
  {
    name: 'Reza Firmansyah',
    business: 'Warung Makan Bu Reza',
    city: 'Jakarta',
    type: 'restaurant',
    rating: 5,
    text: 'Kitchen Display System-nya membantu banget. Dapur tidak perlu teriak-teriak lagi. Pesanan langsung muncul di layar, urut masuknya.',
    avatar: '/images/avatar-reza.jpg',
  },
]

export const FAQ_ITEMS = [
  {
    question: 'Apakah NuansaPos bisa dipakai tanpa internet?',
    answer:
      'Ya, 100% offline. Semua fitur utama — transaksi, laporan, cetak struk — bekerja penuh tanpa koneksi internet. Data tersimpan di HP Anda, bukan di server kami. Internet hanya dibutuhkan untuk validasi lisensi (grace period 7 hari jika offline).',
  },
  {
    question: 'Data bisnis saya aman? Siapa yang bisa akses?',
    answer:
      'Sangat aman. Data bisnis Anda tidak pernah dikirim ke server kami. Semua tersimpan di HP Anda dan terenkripsi. Hanya Anda yang punya akses. Backup tersimpan di storage lokal HP atau yang Anda pilih sendiri.',
  },
  {
    question: 'Berapa lama untuk mulai menggunakan NuansaPos?',
    answer:
      'Rata-rata pengguna baru siap untuk transaksi pertama dalam 5 menit. Onboarding dipandu 8 langkah singkat. Ada pilihan data contoh yang bisa langsung dicoba sebelum input data asli.',
  },
  {
    question: 'Cocok untuk bisnis apa saja?',
    answer:
      'NuansaPos mendukung 9 jenis bisnis: Retail (toko, minimarket), Grosir, Toko Bangunan, Restaurant, Cafe, Laundry, Bengkel, Apotek, dan Distributor. Setiap bisnis punya modul dan fitur yang berbeda, aktif sesuai pilihan saat setup.',
  },
  {
    question: 'Apakah bisa dipakai oleh beberapa kasir sekaligus?',
    answer:
      'Ya. Plan Premium mendukung hingga 5 user, Plan Pro tidak terbatas. Setiap user punya PIN sendiri dan role yang berbeda: Owner, Manager, Kasir, dengan hak akses yang sudah diatur.',
  },
  {
    question: 'Printer apa yang didukung?',
    answer:
      'NuansaPos mendukung printer thermal Bluetooth (58mm dan 80mm), printer USB via OTG, dan printer jaringan LAN/WiFi. Juga mendukung cetak ke printer A4 untuk invoice dan surat jalan.',
  },
  {
    question: 'Bagaimana kalau HP rusak? Data hilang?',
    answer:
      'Tidak, selama backup rutin dilakukan. NuansaPos punya fitur backup otomatis setiap hari jam 02:00 (saat HP idle dan charging) yang menyimpan file ke folder Downloads. Restore bisa dilakukan di HP baru dalam hitungan menit.',
  },
  {
    question: 'Apakah ada uji coba gratis untuk plan berbayar?',
    answer:
      'Ya. Plan Premium tersedia dengan uji coba 14 hari gratis tanpa perlu kartu kredit. Plan Gratis juga tersedia selamanya untuk usaha dengan volume kecil (500 produk, 5.000 transaksi).',
  },
]

export const PROBLEMS = [
  { emoji: '📋', text: 'Stok dicatat manual di buku atau Excel' },
  { emoji: '😰', text: 'Laporan penjualan harus direkap sendiri tiap malam' },
  { emoji: '🌐', text: 'Aplikasi lain mati kalau internet putus' },
  { emoji: '💸', text: 'Harga berlangganan mahal untuk UMKM kecil' },
  { emoji: '😵', text: 'Butuh training panjang sebelum bisa pakai' },
  { emoji: '😟', text: 'Takut data bisnis tersimpan di server orang lain' },
]

export const SOLUTIONS = [
  { emoji: '✅', text: 'Stok otomatis berkurang setiap transaksi' },
  { emoji: '✅', text: 'Laporan tersedia real-time, tinggal lihat' },
  { emoji: '✅', text: '100% offline — internet mati, tetap jalan' },
  { emoji: '✅', text: 'Gratis untuk usaha kecil, terjangkau untuk yang berkembang' },
  { emoji: '✅', text: 'Siap pakai dalam 5 menit, onboarding terpandu' },
  { emoji: '✅', text: 'Data di HP Anda sendiri, tidak ke server manapun' },
]
```

---

## 4. COMPONENT PATTERNS

### 4.1 SectionWrapper.tsx — Scroll-triggered fade in

```typescript
// components/ui/SectionWrapper.tsx
'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  delay?: number
  id?: string
}

export function SectionWrapper({
  children,
  className,
  delay = 0,
  id,
}: SectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn('w-full', className)}
    >
      {children}
    </motion.div>
  )
}
```

### 4.2 Button.tsx

```typescript
// components/ui/Button.tsx
import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
        'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900',
        'disabled:opacity-50 disabled:pointer-events-none',

        // Variants
        variant === 'primary' && [
          'bg-brand text-white',
          'hover:bg-brand-light hover:-translate-y-0.5',
          'shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30',
          'active:scale-[0.98]',
        ],
        variant === 'secondary' && [
          'bg-transparent text-white border border-white/20',
          'hover:border-white/40 hover:bg-white/5',
        ],
        variant === 'ghost' && [
          'text-brand hover:text-brand-light hover:bg-brand/5',
        ],

        // Sizes
        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'md' && 'px-6 py-3 text-base',
        size === 'lg' && 'px-8 py-4 text-lg',

        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

### 4.3 CountUp.tsx — Animasi angka naik

```typescript
// components/ui/CountUp.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { prefersReducedMotion } from '@/lib/utils'

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  isDecimal?: boolean
  decimals?: number
}

export function CountUp({
  end,
  duration = 1800,
  suffix = '',
  isDecimal = false,
  decimals = 1,
}: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    if (prefersReducedMotion()) {
      setCount(end)
      return
    }

    hasAnimated.current = true
    const startTime = performance.now()

    function easeOut(t: number): number {
      return 1 - Math.pow(1 - t, 3)
    }

    function update(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOut(progress)
      setCount(easedProgress * end)
      if (progress < 1) requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }, [isInView, end, duration])

  const display = isDecimal
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString('id-ID')

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}
```

### 4.4 PhoneMockup.tsx — Animated phone

```typescript
// components/ui/PhoneMockup.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface PhoneMockupProps {
  screenSrc?: string
  alt?: string
}

export function PhoneMockup({ screenSrc, alt = 'NuansaPos App' }: PhoneMockupProps) {
  return (
    <motion.div
      animate={{
        y: [0, -14, 0],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="relative mx-auto w-[280px] select-none"
    >
      {/* Glow effect di belakang phone */}
      <motion.div
        animate={{
          boxShadow: [
            '0 0 40px rgba(37,99,235,0.3)',
            '0 0 80px rgba(37,99,235,0.5)',
            '0 0 40px rgba(37,99,235,0.3)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-[40px]"
        aria-hidden="true"
      />

      {/* Phone frame */}
      <div className="relative z-10 rounded-[40px] bg-navy-800 p-3 border border-white/10 shadow-2xl">
        {/* Camera notch */}
        <div className="flex justify-center mb-2">
          <div className="w-16 h-1.5 bg-navy-700 rounded-full" />
        </div>

        {/* Screen */}
        <div className="rounded-[28px] overflow-hidden bg-navy-900 aspect-[9/19]">
          {screenSrc ? (
            <Image
              src={screenSrc}
              alt={alt}
              width={260}
              height={550}
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            /* Placeholder screen jika belum ada screenshot */
            <div className="w-full h-full bg-gradient-to-b from-navy-800 to-navy-900 flex items-center justify-center">
              <div className="text-center space-y-3 p-6">
                <div className="text-4xl">🛒</div>
                <div className="text-white font-display font-bold text-lg">NuansaPos</div>
                <div className="space-y-2">
                  {['Produk A', 'Produk B', 'Produk C'].map((item, i) => (
                    <div key={i} className="bg-navy-700 rounded-lg px-3 py-2 text-xs text-slate-300 flex justify-between">
                      <span>{item}</span>
                      <span className="text-brand">Rp 25.000</span>
                    </div>
                  ))}
                </div>
                <div className="bg-brand rounded-xl py-3 text-white font-semibold text-sm">
                  Bayar • Rp 75.000
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Home button indicator */}
        <div className="flex justify-center mt-2">
          <div className="w-20 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
    </motion.div>
  )
}
```

### 4.5 Badge.tsx

```typescript
// components/ui/Badge.tsx
import { cn } from '@/lib/utils'

type BadgeVariant = 'blue' | 'green' | 'gold' | 'muted'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'blue', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
        variant === 'blue' && 'bg-brand/10 text-blue-300 border-brand/20',
        variant === 'green' && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        variant === 'gold' && 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        variant === 'muted' && 'bg-white/5 text-slate-400 border-white/10',
        className,
      )}
    >
      {children}
    </span>
  )
}
```

---

## 5. SECTION PATTERNS

### 5.1 Navbar.tsx

```typescript
// components/layout/Navbar.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#fitur', label: 'Fitur' },
  { href: '#harga', label: 'Harga' },
  { href: '#bisnis', label: 'Bisnis' },
  { href: '#faq', label: 'FAQ' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-navy-900/80 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/20'
          : 'bg-transparent',
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display font-bold text-xl text-white">
          Nuansa<span className="text-brand">Pos</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button
            size="sm"
            onClick={() => window.open(SITE_CONFIG.playStoreUrl, '_blank')}
          >
            Download Gratis
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy-900/95 backdrop-blur-xl border-t border-white/5 px-6 py-6 space-y-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-slate-300 hover:text-white text-base font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button
            className="w-full mt-4"
            onClick={() => {
              window.open(SITE_CONFIG.playStoreUrl, '_blank')
              setMenuOpen(false)
            }}
          >
            Download Gratis
          </Button>
        </div>
      )}
    </header>
  )
}
```

### 5.2 Hero.tsx — Pattern Dasar

```typescript
// components/sections/Hero.tsx
'use client'

import { motion } from 'framer-motion'
import { Download, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PhoneMockup } from '@/components/ui/PhoneMockup'
import { SITE_CONFIG } from '@/lib/constants'

// Stagger animation untuk child elements
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left: Text content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Eyebrow badge */}
          <motion.div variants={item}>
            <Badge variant="blue">🇮🇩 Dibuat untuk UMKM Indonesia</Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1]"
          >
            Kasir Android untuk{' '}
            <span className="text-gradient">Semua Bisnis</span>{' '}
            UMKM
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={item}
            className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl"
          >
            Satu aplikasi untuk Retail, Restaurant, Apotek, Bengkel, Laundry, dan 5 bisnis lainnya.
            Bekerja{' '}
            <strong className="text-white">100% tanpa internet</strong>.
            Data di HP Anda sendiri.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => window.open(SITE_CONFIG.playStoreUrl, '_blank')}
            >
              <Download size={20} />
              Download Gratis
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play size={20} />
              Lihat Demo
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={item} className="flex flex-wrap gap-3 pt-2">
            {['100% Offline', 'Data Privasi Terjaga', 'Gratis Selamanya', 'Tanpa Kartu Kredit'].map(
              (badge) => (
                <span key={badge} className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <span className="text-emerald-400">✓</span>
                  {badge}
                </span>
              ),
            )}
          </motion.div>
        </motion.div>

        {/* Right: Phone mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex justify-center lg:justify-end"
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  )
}
```

---

## 6. KONVENSI KODE

### 6.1 Naming Convention

```
Components:     PascalCase          → Hero.tsx, BusinessTabs.tsx
Functions:      camelCase           → formatRupiah(), cn()
Constants:      UPPER_SNAKE_CASE    → SITE_CONFIG, BUSINESS_TYPES
Types/Interfaces: PascalCase        → BusinessType, ButtonProps
CSS classes:    kebab-case via Tailwind
File names:     PascalCase (components), camelCase (lib)
```

### 6.2 Import Order (wajib konsisten)

```typescript
// 1. React + Next.js
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// 2. Third-party libraries
import { motion, useInView } from 'framer-motion'
import { Download, ArrowRight } from 'lucide-react'

// 3. Internal components
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

// 4. Internal lib/utils
import { cn, formatRupiah } from '@/lib/utils'
import { SITE_CONFIG, BUSINESS_TYPES } from '@/lib/constants'

// 5. Types
import type { BusinessType } from '@/lib/constants'
```

### 6.3 TypeScript Rules

```typescript
// ❌ Jangan
const Component = ({ data }: any) => ...
function calculate(a: any, b: any) { ... }

// ✅ Harus
interface ComponentProps {
  data: BusinessType[]
  onSelect: (id: string) => void
}
const Component = ({ data, onSelect }: ComponentProps) => ...
```

### 6.4 Tailwind Ordering Convention

Urutan class Tailwind (untuk konsistensi):
```
Layout → Sizing → Spacing → Typography → Color → Border → Effect → Interaction → Responsive
```

```tsx
// Contoh:
<div className="
  flex items-center           // layout
  w-full max-w-sm            // sizing
  px-6 py-4 gap-3            // spacing
  text-sm font-semibold      // typography
  text-white bg-brand        // color
  border border-brand/30     // border
  rounded-xl shadow-lg       // effect
  hover:bg-brand-light       // interaction
  transition-all duration-150
  md:max-w-md                // responsive
">
```

---

## 7. PERFORMANCE CHECKLIST

Sebelum push ke repository, verifikasi:

```
[ ] next/image dipakai untuk SEMUA gambar (bukan <img>)
[ ] Font loading: next/font/google (bukan @import di CSS)
[ ] Framer Motion hanya di-import di 'use client' components
[ ] Animasi hanya pakai opacity, transform, scale (bukan height/width)
[ ] IntersectionObserver disconnect setelah animasi (once: true)
[ ] Event listener di-cleanup di useEffect return
[ ] Tidak ada console.log di production code
[ ] Semua gambar punya alt text
[ ] Semua button punya accessible name
```

---

*SKILLS.md v1.0 — Referensi teknis untuk Claude Agent membangun NuansaPos Website*
