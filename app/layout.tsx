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
