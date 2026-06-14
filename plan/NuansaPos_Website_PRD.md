# PRD — Website Promosi NuansaPos
**Dokumen:** Product Requirements Document  
**Produk:** Landing Page / Marketing Website NuansaPos  
**Versi:** 1.0.0  
**Status:** Specification-Ready  
**Tech Stack:** Next.js 14 + Tailwind CSS + Framer Motion  

---

## Daftar Isi

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Core Features](#3-core-features)
4. [Requirements](#4-requirements)
5. [UI/UX Design System](#5-uiux-design-system)
6. [User Flow](#6-user-flow)
7. [Architecture](#7-architecture)
8. [Sequence Diagram](#8-sequence-diagram)
9. [Database Schema](#9-database-schema)
10. [Tech Stack](#10-tech-stack)

---

## 1. Overview

### 1.1 Apa Ini?

Website marketing **NuansaPos** adalah satu-satunya titik kontak digital pertama antara calon pengguna dan aplikasi. Website ini bukan sekadar halaman info — ini adalah **alat konversi** yang mengubah pengunjung jadi pengguna aktif.

### 1.2 Tujuan Utama Website

| Tujuan | Metrik Sukses |
|---|---|
| Menjelaskan value proposition NuansaPos dalam 5 detik pertama | Bounce rate < 40% |
| Membuat calon pengguna tertarik download / coba gratis | CTA click-through rate > 8% |
| Membangun kepercayaan (trust) untuk bisnis UMKM | Time on page > 2 menit |
| Menjawab semua pertanyaan sebelum mereka perlu tanya | Support inquiry < 20% dari pengunjung |

### 1.3 Target Audience

| Segmen | Karakteristik | Pain Point Utama |
|---|---|---|
| **Primary** — Pemilik UMKM Indonesia | 25–45 tahun, akrab smartphone, bisnis 1–20 karyawan | Masih pakai Excel/tulis tangan, takut data hilang |
| **Secondary** — Manager / Supervisor toko | 22–35 tahun, tech-savvy, pengaruhi keputusan beli | Mau efisiensi kerja tim, bukan manual lagi |
| **Tertiary** — Kasir / Staff Operasional | Akan pakai apps sehari-hari, bukan decision maker | Mau apps yang mudah, tidak perlu training panjang |

### 1.4 Posisi Produk

> **"Satu aplikasi POS untuk semua jenis bisnis UMKM Indonesia — bekerja 100% offline, data di tangan Anda sendiri."**

NuansaPos bukan pesaing Moka atau iReap semata — positioning-nya adalah:
- **Vs. Moka/Pawoon:** Offline-first, tidak bergantung internet, harga lebih terjangkau
- **Vs. Excel/Buku:** Otomatis, real-time, ada laporan langsung
- **Vs. Aplikasi import:** Dibuat untuk konteks bisnis UMKM Indonesia

---

## 2. Problem Statement

### 2.1 Masalah yang Dihadapi Calon Pengguna

Kebanyakan website POS yang ada sekarang:

1. **Terlalu generik** — tidak bicara ke bisnis spesifik (laundry, bengkel, apotek punya kebutuhan berbeda)
2. **Terlalu teknis** — penuh jargon yang tidak dipahami pemilik warung
3. **Tidak membangun kepercayaan** — UMKM Indonesia butuh social proof lokal, bukan logo perusahaan asing
4. **Tidak menjawab ketakutan terbesar:** "Gimana kalau internet mati?" / "Data saya aman nggak?"

### 2.2 Masalah yang Harus Diselesaikan Website Ini

| Kekhawatiran Calon Pengguna | Bagaimana Website Menjawab |
|---|---|
| "Saya tidak paham teknologi" | Demonstrasi visual yang intuitif, video pendek |
| "Harganya pasti mahal" | Pricing transparan di fold pertama, ada plan GRATIS |
| "Kalau internet mati gimana?" | Hero section langsung jawab: "100% Offline" |
| "Data saya aman nggak?" | Section khusus privasi: data tidak pernah ke server |
| "Cocok nggak buat bisnis saya?" | Pilih tipe bisnis → tampil fitur yang relevan |
| "Susah belajarnya?" | "Siap pakai dalam 5 menit" + video onboarding |

---

## 3. Core Features

Website terdiri dari **8 section utama** yang masing-masing punya satu job tunggal:

### 3.1 Navbar
- Logo NuansaPos (kiri)
- Link navigasi: Fitur, Harga, Bisnis, Tentang (kanan)
- CTA button: **"Download Gratis"** (highlight gold/amber)
- Sticky saat scroll, background blur glassmorphism

### 3.2 Hero Section
- Headline utama yang jawab pain point dalam 1 kalimat
- Sub-headline: value prop pendek
- 2 CTA: Primary "Download Gratis" + Secondary "Lihat Demo"
- **Signature element:** Mockup HP Android floating dengan animasi parallax — menampilkan UI POS NuansaPos yang bergerak (animasi loop: scan barcode → item masuk cart → checkout → struk)
- Trust badges: "100% Offline" · "Data di HP Anda" · "Gratis Selamanya untuk UMKM Kecil"

### 3.3 Social Proof Bar
- Angka-angka yang bergerak saat scroll masuk viewport (count-up animation)
- "10.000+ Pengguna Aktif" · "9 Jenis Bisnis" · "Rating 4.8/5" · "100% Offline"

### 3.4 Problem → Solution Section
- Sebelah kiri: masalah UMKM (pakai ikon pain, warna redup)
- Sebelah kanan: solusi NuansaPos (warna vibrant, animated checkmark)
- Transisi visual yang dramatis

### 3.5 Fitur per Tipe Bisnis (Interactive)
- Tab / pill selector: Retail · Grosir · Restaurant · Cafe · Laundry · Bengkel · Apotek · Distributor · Toko Bangunan
- Pilih tab → konten berubah (fitur spesifik + mockup UI berubah)
- Animasi fade + slide saat ganti tab

### 3.6 Feature Highlights (Bento Grid)
- Grid kartu premium untuk fitur universal:
  - ⚡ Offline First
  - 📊 Laporan Real-time
  - 🖨️ Cetak Struk Bluetooth
  - 🔒 Data Privasi Terjaga
  - 📱 Siap 5 Menit
  - 💰 Mulai Gratis

### 3.7 Pricing Section
- 3 plan: FREE · PREMIUM · PRO
- Toggle bulanan/tahunan (animasi smooth)
- Highlight plan PREMIUM (paling populer)
- CTA per plan

### 3.8 Testimonial
- Carousel / grid testimonial dari pengguna nyata (per tipe bisnis)
- Photo, nama, tipe bisnis, kota

### 3.9 FAQ Accordion
- 8–10 pertanyaan paling umum
- Animasi buka/tutup smooth

### 3.10 Final CTA Section
- Background gradient premium
- Headline emosional
- CTA besar: Download Gratis
- Link ke Google Play Store

### 3.11 Footer
- Logo + tagline
- Link: Fitur, Harga, Blog, Privacy Policy, Syarat & Ketentuan
- Social media
- Copyright

---

## 4. Requirements

### 4.1 Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Website bisa diakses di desktop, tablet, dan mobile (responsive) |
| FR-02 | Tab bisnis interaktif: pilih tipe bisnis → konten berubah tanpa reload |
| FR-03 | Animasi count-up pada social proof angka saat masuk viewport |
| FR-04 | Toggle pricing bulanan/tahunan dengan kalkulasi otomatis |
| FR-05 | FAQ accordion buka/tutup dengan animasi |
| FR-06 | Tombol Download mengarah ke Google Play Store |
| FR-07 | Form kontak / WhatsApp CTA untuk demo request |
| FR-08 | Video demo bisa diplay inline (bukan redirect YouTube) |
| FR-09 | Smooth scroll saat klik navigasi |
| FR-10 | Sticky navbar dengan blur efek saat scroll |

### 4.2 Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | **Performance** | Lighthouse score ≥ 90 semua kategori |
| NFR-02 | **Loading Speed** | LCP (Largest Contentful Paint) < 2.5 detik |
| NFR-03 | **Mobile First** | Perfect rendering di viewport 375px+ |
| NFR-04 | **SEO** | Meta title, description, OG tags, sitemap.xml |
| NFR-05 | **Accessibility** | WCAG AA — alt text, keyboard nav, contrast ratio |
| NFR-06 | **Animation Performance** | 60 FPS, respects `prefers-reduced-motion` |
| NFR-07 | **Browser Support** | Chrome, Firefox, Safari, Edge (2 versi terakhir) |
| NFR-08 | **Analytics** | Google Analytics + event tracking CTA clicks |

---

## 5. UI/UX Design System

### 5.1 Design Philosophy

> **"Premium yang membumi."**  
> Terasa seperti apps kelas dunia, tapi bicara bahasa UMKM Indonesia. Tidak dingin seperti SaaS B2B barat. Tidak murahan seperti ads marketplace. Di antara keduanya — **percaya diri, hangat, dan cepat.**

### 5.2 Color Palette

```
─────────────────────────────────────────────────────────
PALETTE NUANSAPOS WEBSITE
─────────────────────────────────────────────────────────

Background Deep     #0A1628   ← Navy gelap — base utama
Background Card     #111D35   ← Sedikit lebih terang untuk card
Background Subtle   #162040   ← Hover state, bordered card

Brand Blue          #2563EB   ← Accent utama — CTA, link, highlight
Brand Blue Light    #3B82F6   ← Hover state blue
Brand Blue Glow     #2563EB33 ← Glow effect (33 = 20% opacity)

Gold Accent         #F59E0B   ← Premium badge, "Terpopuler", highlight angka
Gold Light          #FCD34D   ← Text di atas gold background

Text Primary        #F8FAFC   ← Putih hampir murni
Text Secondary      #94A3B8   ← Abu-abu slate untuk deskripsi
Text Muted          #475569   ← Sangat redup, caption

Success Green       #10B981   ← Checkmark, "Tersedia", badge GRATIS
Warning Amber       #F59E0B   ← Warning, highlight
Error Red           #EF4444   ← Pain point, masalah

Border              #1E3A5F   ← Border card yang subtle
Border Bright       #2563EB44 ← Border yang lebih visible (glow card)
─────────────────────────────────────────────────────────
```

**Tailwind Config Extension:**
```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      navy: {
        900: '#0A1628',
        800: '#111D35',
        700: '#162040',
        600: '#1E3A5F',
      },
      brand: {
        DEFAULT: '#2563EB',
        light: '#3B82F6',
        glow: 'rgba(37,99,235,0.2)',
      },
      gold: {
        DEFAULT: '#F59E0B',
        light: '#FCD34D',
      }
    }
  }
}
```

### 5.3 Typography

```
DISPLAY FONT:   Plus Jakarta Sans (Google Fonts)
                — Karakter kuat, modern, ada "Indonesian feel"
                — Digunakan untuk headline H1, H2, tagline besar

BODY FONT:      Inter (Google Fonts)
                — Clean, sangat readable di layar kecil
                — Digunakan untuk paragraf, list, label

MONO FONT:      JetBrains Mono
                — Untuk code snippet, badge teknis

─────────────────────────────────────────────────────────
TYPE SCALE
─────────────────────────────────────────────────────────
display-2xl:  72px / 80px   font-black   — Hero headline
display-xl:   56px / 64px   font-extrabold
display-lg:   40px / 48px   font-bold    — Section title
display-md:   32px / 40px   font-bold
body-xl:      20px / 32px   font-normal  — Sub-headline
body-lg:      18px / 28px   font-normal  — Body copy
body-md:      16px / 24px   font-normal
body-sm:      14px / 20px   font-normal  — Caption, label
─────────────────────────────────────────────────────────
```

### 5.4 Animation System

```
PRINSIP ANIMASI:
- Purposeful: setiap animasi punya alasan (bukan dekorasi)
- Subtle: tidak mengganggu membaca konten
- Snappy: durasi pendek, tidak terasa lambat
- Consistent: easing yang sama di seluruh website

─────────────────────────────────────────────────────────
EASING TOKENS
─────────────────────────────────────────────────────────
ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1)   ← Bounce premium
ease-smooth:   cubic-bezier(0.25, 0.1, 0.25, 1)    ← Slide halus
ease-out:      cubic-bezier(0, 0, 0.2, 1)           ← Fade out

─────────────────────────────────────────────────────────
DURASI TOKENS
─────────────────────────────────────────────────────────
instant:    0ms     — Toggle visibility
fast:       150ms   — Hover state
normal:     250ms   — Tab switch, accordion
slow:       400ms   — Page element enter
dramatic:   600ms   — Hero element, modal

─────────────────────────────────────────────────────────
ANIMASI SPESIFIK
─────────────────────────────────────────────────────────

[Hero Phone Mockup]
  - Float up-down: translateY(-12px → 0) infinite 3s ease-in-out
  - Subtle rotate: rotate(-2deg → 2deg) infinite 6s ease-in-out
  - Glow pulse: box-shadow blue glow 0 → 40px infinite 2s

[Section Enter (Scroll-triggered)]
  - Start: opacity 0, translateY 32px
  - End:   opacity 1, translateY 0
  - Trigger: 80% dari bottom viewport
  - Stagger: 80ms antar child element

[Count-up Numbers]
  - Trigger: saat elemen masuk viewport
  - Duration: 1800ms dengan ease-out
  - Format: pakai Intl.NumberFormat untuk angka ribuan

[Tab Switch (Bisnis Selector)]
  - Content out: opacity 0, translateX -16px, 150ms
  - Content in:  opacity 1, translateX 0, 250ms, delay 50ms
  - Active pill: background slide dengan layoutId (Framer Motion)

[Card Hover]
  - Border color: transparent → brand blue, 150ms
  - Box shadow: none → glow blue 0 0 24px, 200ms
  - Transform: scale 1 → 1.02, 150ms ease-spring

[CTA Button Hover]
  - Background: brand → brand-light, 150ms
  - Shadow: none → 0 8px 32px brand-glow, 200ms
  - Transform: translateY 0 → -2px, 150ms ease-spring

[Accordion Open]
  - Height: 0 → auto (measured), 300ms ease-smooth
  - Opacity: 0 → 1, 250ms delay 50ms
  - Chevron: rotate 0 → 180deg, 250ms
```

### 5.5 Component Library

```
─────────────────────────────────────────────────────────
BUTTONS
─────────────────────────────────────────────────────────

Primary CTA:
  bg-brand hover:bg-brand-light
  text-white font-semibold
  px-8 py-4 rounded-xl
  shadow-lg shadow-brand/25
  transition-all duration-150
  hover:-translate-y-0.5

Secondary CTA:
  bg-transparent border border-white/20
  hover:border-white/40 hover:bg-white/5
  text-white font-medium
  px-8 py-4 rounded-xl

Ghost Link:
  text-brand hover:text-brand-light
  underline-offset-4 hover:underline

─────────────────────────────────────────────────────────
CARDS
─────────────────────────────────────────────────────────

Feature Card:
  bg-navy-800 border border-navy-600
  hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10
  rounded-2xl p-6
  transition-all duration-200

Pricing Card:
  bg-navy-800 border border-navy-600
  rounded-3xl p-8
  [Popular] → border-brand shadow-xl shadow-brand/20

Testimonial Card:
  bg-navy-800/50 backdrop-blur-sm
  border border-white/5
  rounded-2xl p-6

─────────────────────────────────────────────────────────
BADGE / CHIP
─────────────────────────────────────────────────────────

Success:   bg-emerald-500/10 text-emerald-400 border-emerald-500/20
Gold:      bg-amber-500/10 text-amber-400 border-amber-500/20
Blue:      bg-brand/10 text-brand-light border-brand/20
Neutral:   bg-white/5 text-slate-400 border-white/10
```

### 5.6 Layout Grid

```
Desktop (≥1280px): max-w-7xl mx-auto px-6 — 12 column grid
Tablet  (≥768px):  max-w-4xl  mx-auto px-6
Mobile  (≥375px):  px-4 — single column

Section spacing:  py-24 (desktop) → py-16 (mobile)
Card gap:         gap-6 (desktop) → gap-4 (mobile)
```

### 5.7 Visual Signature — "Glow Cards"

Elemen paling memorable: **kartu dengan efek glow biru** di tepinya saat hover. Dikombinasikan dengan background navy gelap, terasa seperti layar premium di malam hari. Ini juga visual yang relate dengan pemilik UMKM yang pakai HP malam hari saat tutup toko.

```css
/* Glow Card Effect */
.glow-card {
  position: relative;
}
.glow-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, #2563EB44, transparent 50%, #F59E0B22);
  opacity: 0;
  transition: opacity 0.3s;
}
.glow-card:hover::before {
  opacity: 1;
}
```

---

## 6. User Flow

### 6.1 Flow Pengunjung Baru (Awareness → Download)

```
[Pengunjung tiba dari Google / Instagram / WA]
              ↓
[Hero Section — 0-5 detik]
  Baca headline: "Kasir Android untuk UMKM Indonesia"
  Lihat HP mockup beranimasi
  Baca trust badges: "100% Offline" · "Gratis"
              ↓ [2 keputusan]
    ┌─────────────────┬──────────────────────┐
    ↓                 ↓                      ↓
[Langsung klik    [Scroll ke bawah]    [Tutup tab]
 Download]         ↓                   (bounce)
    ↓          [Social Proof Bar]
[Google Play]   Angka count-up: 10.000+ pengguna
                    ↓
            [Problem → Solution]
            "Masih pakai Excel?" → NuansaPos
                    ↓
            [Pilih Tipe Bisnis]
            Klik tab sesuai bisnis saya
            → Lihat fitur yang relevan
            → Lihat mockup UI bisnis saya
                    ↓
            [Feature Bento Grid]
            Highlight fitur offline, laporan, print
                    ↓
            [Pricing]
            Lihat ada plan GRATIS
                    ↓
            [Testimonial]
            Baca review dari bisnis sejenis
                    ↓
            [FAQ]
            Cari jawaban pertanyaan terakhir
                    ↓
            [Final CTA]
            Klik "Download Gratis"
                    ↓
            [Google Play Store]
```

### 6.2 Flow Pengunjung Returning (Consideration → Decision)

```
[Kunjungan kedua — sudah tahu NuansaPos]
              ↓
[Langsung ke Pricing section]
  Bandingkan FREE vs PREMIUM vs PRO
  Toggle tahunan untuk harga lebih hemat
              ↓
[Klik "Mulai Gratis" atau "Hubungi Kami"]
              ↓
        ┌─────────────────┐
        ↓                 ↓
[Download App]    [WhatsApp Demo Request]
[Play Store]      → Chat ke nomor bisnis
                  → Jadwal demo
```

### 6.3 Flow Mobile Pengunjung

```
[Buka dari HP — touch-first]
              ↓
[Hero Section]
  Scroll → phone mockup parallax smooth
  Trust badges fit 2-per-row
              ↓
[Tab bisnis → swipe horizontal]
  Scroll horizontal pill selector
              ↓
[Bento grid → 1 column di mobile]
              ↓
[Pricing cards → scroll horizontal atau stack]
              ↓
[Download button → langsung ke Play Store app]
```

### 6.4 Interaction States setiap CTA

```
Tombol "Download Gratis" (Primary CTA):
  Default  → bg-brand, shadow-brand/25
  Hover    → bg-brand-light, translateY(-2px), shadow lebih besar
  Active   → scale(0.98), haptic-like visual press
  Klik     → Google Play Store (new tab)

Tombol "Lihat Demo" (Secondary CTA):
  Default  → border-white/20, transparent bg
  Hover    → border-white/40, bg-white/5
  Klik     → Scroll ke section video demo, atau buka modal video

Tab Bisnis:
  Default  → text-slate-400, no background
  Hover    → text-white, bg-white/5
  Active   → text-white, bg-brand, pill pill-shaped background slides
```

---

## 7. Architecture

### 7.1 Tech Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                       │
│                                                           │
│  Next.js 14 App Router (React Server Components)         │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Static     │  │  Interactive  │  │   Animation    │  │
│  │  Sections   │  │  Components   │  │   Engine       │  │
│  │  (RSC)      │  │  (Client)     │  │  Framer Motion │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
│         │                │                   │            │
│  ┌──────▼────────────────▼───────────────────▼─────────┐ │
│  │              Tailwind CSS (styling)                   │ │
│  └───────────────────────────────────────────────────── ┘ │
└─────────────────────────────────────────────────────────┘
         │                                        │
         ↓                                        ↓
┌─────────────────┐                   ┌──────────────────────┐
│  Vercel Edge    │                   │  External Services   │
│  Network (CDN)  │                   │  - Google Analytics  │
│  - Static pages │                   │  - Google Fonts      │
│  - Edge cache   │                   │  - Google Play Store │
│  - Image optim  │                   │  - WhatsApp API      │
└─────────────────┘                   └──────────────────────┘
```

### 7.2 Folder Structure

```
nuansapos-website/
├── app/
│   ├── layout.tsx              ← Root layout, font load, metadata
│   ├── page.tsx                ← Homepage (semua section)
│   ├── globals.css             ← Tailwind base + custom animations
│   └── sitemap.ts              ← Auto-generated sitemap
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          ← Sticky navbar + blur glassmorphism
│   │   └── Footer.tsx
│   │
│   ├── sections/
│   │   ├── Hero.tsx            ← Hero + phone mockup + CTA
│   │   ├── SocialProof.tsx     ← Count-up numbers bar
│   │   ├── ProblemSolution.tsx ← Before/After split view
│   │   ├── BusinessTabs.tsx    ← Tab interaktif per bisnis
│   │   ├── FeatureBento.tsx    ← Bento grid fitur
│   │   ├── Pricing.tsx         ← Pricing cards + toggle
│   │   ├── Testimonials.tsx    ← Carousel testimonial
│   │   ├── FAQ.tsx             ← Accordion FAQ
│   │   └── FinalCTA.tsx        ← Download CTA terakhir
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── PhoneMockup.tsx     ← Animated phone component
│       ├── CountUp.tsx         ← Number animation
│       └── SectionWrapper.tsx  ← Scroll-triggered fade in
│
├── lib/
│   ├── analytics.ts            ← GA event tracking helpers
│   └── constants.ts            ← Data: bisnis, fitur, pricing, FAQ
│
├── public/
│   ├── images/
│   │   ├── mockup-pos.png
│   │   ├── mockup-dashboard.png
│   │   └── [mockup per bisnis]
│   └── videos/
│       └── demo-nuansapos.mp4
│
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

### 7.3 Rendering Strategy

| Section | Strategi | Alasan |
|---|---|---|
| Navbar, Hero, Social Proof | **SSG (Static)** | Tidak berubah, harus load pertama kali cepat |
| Business Tabs | **Client Component** | Interaktif (tab switch state) |
| Feature Bento, Pricing | **SSG** | Static content |
| Testimonial Carousel | **Client Component** | Autoplay, swipe gesture |
| FAQ Accordion | **Client Component** | Open/close state |
| Analytics tracking | **Client only** | Browser API |

### 7.4 Performance Architecture

```
Image Optimization:
  - next/image untuk semua gambar (auto WebP + lazy load)
  - Mockup phone: preload sebagai priority image (LCP element)
  - srcSet otomatis per viewport

Font Loading:
  - Plus Jakarta Sans: font-display swap
  - Inter: font-display swap
  - Subset: hanya karakter Latin + Indonesia

Animation:
  - Framer Motion lazy import (tidak di bundle utama)
  - prefers-reduced-motion: semua animasi OFF jika user set reduced motion
  - IntersectionObserver untuk trigger animasi scroll

Bundle Splitting:
  - React.lazy() untuk komponen heavy (carousel, video player)
  - Suspense boundary dengan skeleton loader
```

---

## 8. Sequence Diagram

### 8.1 First Page Load

```
Browser          Next.js Server      Vercel CDN       Google Fonts
   │                   │                  │                  │
   │ GET /             │                  │                  │
   │──────────────────────────────────────>│                  │
   │                   │                  │ Cache hit?        │
   │                   │                  │ YES: serve static │
   │<──────────────────────────────────────│                  │
   │                                       │                  │
   │ Parse HTML, start loading resources   │                  │
   │──────────────────────────────────────────────────────────>│
   │ GET fonts (Plus Jakarta Sans, Inter)                      │
   │<──────────────────────────────────────────────────────────│
   │                                                            │
   │ Load JS bundles (main, layout, hero)  │                  │
   │──────────────────────────────────────>│                  │
   │<──────────────────────────────────────│                  │
   │                                       │                  │
   │ React hydration (Hero, Navbar)        │                  │
   │ [Page interactive - LCP event]        │                  │
   │                                       │                  │
   │ Lazy load: Framer Motion bundle       │                  │
   │──────────────────────────────────────>│                  │
   │<──────────────────────────────────────│                  │
   │                                       │                  │
   │ Start hero animations                 │                  │
   │ PhoneMockup float animation starts    │                  │
```

### 8.2 User Klik Tab Bisnis (Business Tab Interaction)

```
User            BusinessTabs.tsx      constants.ts     Analytics
  │                    │                   │               │
  │ Klik tab "Apotek"  │                   │               │
  │───────────────────>│                   │               │
  │                    │ setActiveTab('apotek')            │
  │                    │ (React state update)              │
  │                    │                   │               │
  │                    │ GET data bisnis   │               │
  │                    │───────────────────>               │
  │                    │ { features, mockup, description } │
  │                    │<───────────────────               │
  │                    │                   │               │
  │                    │ Animate out current content       │
  │                    │ (opacity 0, translateX -16px)     │
  │                    │                   │               │
  │                    │ Animate in new content            │
  │                    │ (opacity 1, translateX 0)         │
  │                    │                   │               │
  │ [UI berubah ke     │                   │               │
  │  konten Apotek]    │                   │               │
  │                    │ trackEvent('tab_click', 'apotek') │
  │                    │───────────────────────────────────>
  │                    │                   │               │
```

### 8.3 User Klik "Download Gratis" (CTA Click)

```
User          Button.tsx        Analytics.ts      Google Play
  │               │                  │               │
  │ Klik button   │                  │               │
  │──────────────>│                  │               │
  │               │ onClick handler  │               │
  │               │ trackEvent('cta_download', {     │
  │               │   location: 'hero',              │
  │               │   plan: 'free'                   │
  │               │ })               │               │
  │               │─────────────────>│               │
  │               │                  │ GA event send │
  │               │                  │──────────────>│
  │               │                  │               │
  │               │ window.open(PLAY_STORE_URL, '_blank')
  │               │────────────────────────────────────>
  │               │                  │               │
  │ [Google Play  │                  │               │
  │  terbuka di   │                  │               │
  │  tab baru]    │                  │               │
```

### 8.4 Scroll Trigger Animation

```
Browser ScrollEvent    IntersectionObserver    Framer Motion
       │                        │                    │
       │ User scroll down       │                    │
       │───────────────────────>│                    │
       │                        │ Check: element     │
       │                        │ in viewport 80%?   │
       │                        │ YES                │
       │                        │───────────────────>│
       │                        │                    │ Trigger animate()
       │                        │                    │ opacity: 0 → 1
       │                        │                    │ y: 32 → 0
       │                        │                    │ duration: 400ms
       │ [Element fade in]      │                    │
       │<───────────────────────────────────────────-│
       │                        │                    │
       │ [Stagger: child +80ms] │                    │
       │                        │                    │
       │ Disconnect observer    │                    │
       │ (animate hanya 1x)     │                    │
```

### 8.5 Count-Up Animation

```
SocialProof.tsx    CountUp.tsx    IntersectionObserver
       │               │                  │
       │ Mount         │                  │
       │──────────────>│                  │
       │               │ Register observer│
       │               │─────────────────>│
       │               │                  │
[User scroll ke Social Proof]
       │               │                  │
       │               │ Callback: visible│
       │               │<─────────────────│
       │               │                  │
       │               │ startCount(target=10000, duration=1800ms)
       │               │ requestAnimationFrame loop:
       │               │   t=0ms:    0
       │               │   t=300ms:  1240
       │               │   t=900ms:  5800
       │               │   t=1500ms: 9100
       │               │   t=1800ms: 10000 ← DONE
       │ [Angka naik   │
       │  smooth]      │
```

---

## 9. Database Schema

> Website ini adalah **static marketing site** — tidak ada database untuk konten utama. Data tersimpan di file constants. Namun ada 2 kebutuhan penyimpanan kecil:

### 9.1 Analytics Events (Google Analytics — tidak perlu DB custom)

```
Event tracking menggunakan GA4 standard schema:
- event_name: string
- event_params: object
- user_id: anonymous (tidak ada PII)
```

### 9.2 Contact / Demo Request Form (Opsional — jika diimplementasikan)

Jika ada form "Request Demo" atau "Hubungi Kami":

**Opsi A — Google Forms embed** (paling simple, zero setup)

**Opsi B — Supabase (jika mau control penuh):**

```sql
-- Tabel: demo_requests
CREATE TABLE demo_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,        -- Nomor WhatsApp
  business_type TEXT NOT NULL,      -- retail, grosir, restaurant, dll
  city        TEXT,
  message     TEXT,
  source      TEXT,                 -- hero, pricing, faq, dll
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  contacted   BOOLEAN DEFAULT FALSE -- Toggle saat tim sudah hubungi
);

-- Index untuk query by business_type
CREATE INDEX idx_demo_requests_business ON demo_requests(business_type);
CREATE INDEX idx_demo_requests_created ON demo_requests(created_at DESC);
```

**Opsi C — Langsung WhatsApp** (paling UMKM-friendly, zero friction):
```
Klik CTA → window.open(`https://wa.me/62XXXXXXXXXX?text=Halo, saya tertarik dengan NuansaPos untuk bisnis ${businessType} saya`)
```

> **Rekomendasi:** Opsi C untuk fase awal. Tambah Supabase form setelah traffic > 1.000/bulan.

### 9.3 Static Data Structure (constants.ts)

```typescript
// lib/constants.ts

export const BUSINESS_TYPES = [
  {
    id: 'retail',
    label: 'Retail',
    icon: '🛍️',
    tagline: 'Kasir cepat, stok akurat',
    features: [
      'Scan barcode instan < 500ms',
      'Multi-variant produk (ukuran, warna, rasa)',
      'Loyalty poin member otomatis',
      'Laporan penjualan harian',
    ],
    mockupImage: '/images/mockup-retail.png',
    color: '#2563EB',
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    icon: '🍽️',
    tagline: 'Order meja, dapur real-time',
    features: [
      'Grid meja dengan status real-time',
      'Kitchen Display System (KDS)',
      'Split bill per orang atau per item',
      'Modifier menu (level pedas, topping)',
    ],
    mockupImage: '/images/mockup-restaurant.png',
    color: '#E63946',
  },
  // ... 7 bisnis lainnya
];

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    priceYearly: 0,
    description: 'Untuk usaha yang baru mulai',
    limit: '500 produk · 5.000 transaksi',
    features: ['POS dasar', 'Laporan penjualan', '1 user', 'Backup manual'],
    cta: 'Mulai Gratis',
    highlighted: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99000,
    priceYearly: 79000,
    description: 'Untuk toko yang berkembang',
    limit: 'Produk & transaksi tidak terbatas',
    features: [
      'Semua fitur Gratis',
      'Multi-user (5 akun)',
      'Export Excel & PDF',
      'Backup otomatis',
      'Promo & voucher',
      'Priority support',
    ],
    cta: 'Coba 14 Hari Gratis',
    highlighted: true,
    badge: 'Paling Populer',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199000,
    priceYearly: 159000,
    description: 'Untuk bisnis yang lebih kompleks',
    limit: 'Tidak terbatas + semua modul',
    features: [
      'Semua fitur Premium',
      'User tidak terbatas',
      'Modul akuntansi double-entry',
      'Rekonsiliasi bank',
      'Omnichannel marketplace',
      'API access (coming soon)',
    ],
    cta: 'Mulai Pro',
    highlighted: false,
  },
];

export const SOCIAL_PROOF_STATS = [
  { value: 10000, suffix: '+', label: 'Pengguna Aktif' },
  { value: 9, suffix: '', label: 'Jenis Bisnis' },
  { value: 4.8, suffix: '/5', label: 'Rating Play Store', decimal: 1 },
  { value: 100, suffix: '%', label: 'Offline' },
];

export const FAQ_ITEMS = [
  {
    question: 'Apakah NuansaPos bisa dipakai tanpa internet?',
    answer: 'Ya, 100%. Semua fitur utama bekerja penuh tanpa koneksi internet. Data tersimpan di HP Anda, bukan di server kami.',
  },
  {
    question: 'Data bisnis saya aman?',
    answer: 'Sangat aman. Data tidak pernah dikirim ke server kami. Semua tersimpan di HP Anda dan bisa di-backup ke penyimpanan lokal kapan saja.',
  },
  {
    question: 'Berapa lama untuk mulai menggunakan?',
    answer: 'Rata-rata pengguna baru siap transaksi pertama dalam 5 menit. Onboarding dipandu langkah demi langkah, ada data contoh bisa langsung dicoba.',
  },
  // ... 7 FAQ lainnya
];
```

---

## 10. Tech Stack

### 10.1 Stack Lengkap

| Layer | Teknologi | Versi | Alasan |
|---|---|---|---|
| **Framework** | Next.js | 14 (App Router) | SSG/SSR fleksibel, image optimization built-in, Vercel native |
| **UI Library** | React | 18 | Server Components untuk performa |
| **Styling** | Tailwind CSS | 3.4 | Utility-first, tidak ada CSS konflik, bundle kecil |
| **Animation** | Framer Motion | 11 | Deklaratif, performant, gestured support |
| **Language** | TypeScript | 5 | Type safety, auto-complete IDE |
| **Fonts** | next/font (Google) | — | Zero layout shift, self-hosted otomatis |
| **Icons** | Lucide React | latest | Consistent, tree-shakeable |
| **Analytics** | Google Analytics 4 | — | Event tracking CTA clicks |
| **Deployment** | Vercel | — | CDN global, preview per branch, zero config |
| **Image Format** | WebP (via next/image) | — | 30% lebih kecil dari PNG/JPG |

### 10.2 Dependencies (package.json)

```json
{
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
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

### 10.3 Tailwind Config Lengkap

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
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
        },
        brand: {
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          dark: '#1D4ED8',
          glow: 'rgba(37, 99, 235, 0.2)',
        },
        gold: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', fontWeight: '900' }],
        'display-xl':  ['3.5rem', { lineHeight: '1.15', fontWeight: '800' }],
        'display-lg':  ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-md':  ['2rem',   { lineHeight: '1.25', fontWeight: '700' }],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'count-up': 'count-up 1.8s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(37, 99, 235, 0.6)' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(32px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37, 99, 235, 0.3), transparent)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
      },
      boxShadow: {
        'glow-blue': '0 0 40px rgba(37, 99, 235, 0.4)',
        'glow-gold': '0 0 40px rgba(245, 158, 11, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

export default config
```

### 10.4 SEO & Metadata Config

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'NuansaPos — Aplikasi POS Android untuk UMKM Indonesia',
  description: 'Aplikasi kasir Android offline-first untuk 9 jenis bisnis UMKM. Retail, Restaurant, Apotek, Bengkel, Laundry, dan lebih. Mulai gratis, siap pakai 5 menit.',
  keywords: ['aplikasi kasir android', 'pos umkm indonesia', 'aplikasi toko offline', 'kasir restaurant android'],
  openGraph: {
    title: 'NuansaPos — Kasir Android untuk Semua Bisnis UMKM',
    description: '100% Offline. 9 Jenis Bisnis. Gratis untuk usaha kecil.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NuansaPos — POS Android UMKM Indonesia',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://nuansapos.id' },
}
```

### 10.5 Deployment & CI/CD

```
GitHub Repository
      │
      │ Push to main branch
      ↓
Vercel (Auto Deploy)
  - Build: next build
  - Output: static + edge functions
  - CDN: global edge network
  - SSL: otomatis
  - Preview: setiap PR dapat preview URL

Environment Variables:
  NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
  NEXT_PUBLIC_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=...
  NEXT_PUBLIC_WHATSAPP_NUMBER=62XXXXXXXXXX
```

---

## Appendix: Halaman yang Dibutuhkan

| URL | Halaman | Priority |
|---|---|---|
| `/` | Homepage (semua section) | P0 — harus ada |
| `/fitur` | Detail semua fitur | P1 |
| `/harga` | Pricing detail + FAQ | P1 |
| `/bisnis/[type]` | Landing per tipe bisnis | P1 |
| `/blog` | Artikel tips UMKM (SEO) | P2 |
| `/tentang` | Tentang NuansaPos | P2 |
| `/privacy-policy` | Kebijakan privasi | P0 — wajib Play Store |
| `/terms` | Syarat & ketentuan | P0 — wajib Play Store |

---

*PRD ini mencakup semua yang dibutuhkan developer + desainer untuk membangun website NuansaPos dari nol. Semua keputusan desain, arsitektur, dan teknis sudah ditentukan — tinggal eksekusi.*
