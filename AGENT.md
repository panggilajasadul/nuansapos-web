# AGENT.md — Instruksi Claude AI Agent
## Proyek: Website Promosi NuansaPos

> **Baca file ini sebelum mengerjakan apapun.**  
> File ini adalah sumber kebenaran tunggal untuk semua keputusan agen saat membangun website NuansaPos.

---

## 🎯 MISI AGEN

Kamu adalah **Senior Full-Stack Developer + UI Engineer** yang ditugaskan membangun website marketing NuansaPos dari nol. Website ini harus:

1. **Mengkonversi pengunjung** menjadi pengguna yang download aplikasi
2. **Membangun kepercayaan** pemilik UMKM Indonesia terhadap NuansaPos
3. **Terasa premium** — seperti website startup kelas dunia, bukan template murahan
4. **Bekerja sempurna** di mobile (mayoritas audience pakai HP)

---

## 📁 FILE YANG HARUS DIBACA SEBELUM MULAI

Baca semua file ini secara berurutan sebelum menulis satu baris kode pun:

```
1. AGENT.md          ← Kamu sedang baca ini (instruksi & konteks)
2. SKILLS.md         ← Cara kerja teknis, pattern, dan konvensi kode
3. PERSONALITY.md    ← Cara berkomunikasi, membuat keputusan, dan tone
4. PRD_Website.md    ← Spesifikasi produk lengkap (requirements, design, flow)
5. PRD1_Foundation.md   ← Data aplikasi NuansaPos (bisnis, fitur, produk)
6. PRD2_PricingFinance.md ← Data pricing, fitur lanjutan
7. PRD3_BusinessModules.md ← Fitur per tipe bisnis (restaurant, apotek, dll)
```

---

## 🗺️ PETA PROYEK

### Stack yang Digunakan

```
Framework:   Next.js 14 (App Router)
Language:    TypeScript
Styling:     Tailwind CSS v3
Animation:   Framer Motion v11
Icons:       Lucide React
Fonts:       Plus Jakarta Sans (display) + Inter (body)
Deploy:      Vercel
```

### Struktur Folder yang Harus Dibuat

```
nuansapos-website/
├── app/
│   ├── layout.tsx              ← Root layout + font + metadata SEO
│   ├── page.tsx                ← Homepage assembly (semua section)
│   ├── globals.css             ← Tailwind directives + custom keyframes
│   └── sitemap.ts
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          ← Sticky + glassmorphism blur
│   │   └── Footer.tsx
│   │
│   ├── sections/               ← Satu file per section homepage
│   │   ├── Hero.tsx
│   │   ├── SocialProof.tsx
│   │   ├── ProblemSolution.tsx
│   │   ├── BusinessTabs.tsx
│   │   ├── FeatureBento.tsx
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   └── FinalCTA.tsx
│   │
│   └── ui/                     ← Reusable components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── PhoneMockup.tsx
│       ├── CountUp.tsx
│       └── SectionWrapper.tsx
│
├── lib/
│   ├── constants.ts            ← SEMUA data: bisnis, pricing, FAQ, stats
│   └── utils.ts                ← Helper functions (cn, formatRupiah, dll)
│
├── public/
│   └── images/                 ← Placeholder untuk mockup screenshots
│
├── tailwind.config.ts          ← Extended config dengan custom colors, fonts
├── next.config.ts
└── package.json
```

---

## 📋 URUTAN PENGERJAAN (WAJIB DIIKUTI)

Kerjakan dalam urutan ini. Jangan lompat step.

### FASE 1 — Setup & Foundation

```
[ ] 1.1  Inisialisasi Next.js 14 dengan TypeScript
[ ] 1.2  Install semua dependencies (lihat package.json di SKILLS.md)
[ ] 1.3  Setup tailwind.config.ts lengkap (warna, font, animasi custom)
[ ] 1.4  Setup globals.css (Tailwind directives + custom keyframes)
[ ] 1.5  Buat lib/constants.ts dengan SEMUA data statis
[ ] 1.6  Buat lib/utils.ts (cn helper, formatRupiah)
[ ] 1.7  Setup app/layout.tsx (font load, metadata SEO)
```

### FASE 2 — Layout Shell

```
[ ] 2.1  Buat Navbar.tsx (sticky, glassmorphism, CTA button)
[ ] 2.2  Buat Footer.tsx
[ ] 2.3  Buat SectionWrapper.tsx (scroll-triggered fade-in reusable)
[ ] 2.4  Buat ui/Button.tsx (Primary, Secondary, Ghost variants)
[ ] 2.5  Buat ui/Badge.tsx
[ ] 2.6  Assembly di app/page.tsx (import semua section, placeholder dulu)
```

### FASE 3 — Section Utama (urutan prioritas)

```
[ ] 3.1  Hero.tsx          ← PALING KRITIS. Phone mockup, CTA, badges
[ ] 3.2  SocialProof.tsx   ← Count-up animation
[ ] 3.3  BusinessTabs.tsx  ← Tab interaktif per bisnis (Client Component)
[ ] 3.4  FeatureBento.tsx  ← Bento grid
[ ] 3.5  Pricing.tsx       ← Toggle bulanan/tahunan
[ ] 3.6  ProblemSolution.tsx
[ ] 3.7  Testimonials.tsx
[ ] 3.8  FAQ.tsx           ← Accordion
[ ] 3.9  FinalCTA.tsx
```

### FASE 4 — Polish & Performance

```
[ ] 4.1  Cek semua animasi berjalan 60 FPS
[ ] 4.2  Cek responsive di 375px, 768px, 1280px
[ ] 4.3  Tambah prefers-reduced-motion di semua animasi
[ ] 4.4  Optimasi gambar dengan next/image
[ ] 4.5  Lighthouse audit → target score ≥ 90
[ ] 4.6  SEO: meta tags, OG image, sitemap
```

---

## ⚙️ KEPUTUSAN ARSITEKTUR YANG SUDAH DITETAPKAN

Jangan tanyakan, langsung implementasikan:

| Keputusan | Yang Dipilih | Alasan |
|---|---|---|
| Rendering strategy section statis | RSC (React Server Component) | Performa, tidak butuh hydration |
| Rendering strategy section interaktif | Client Component ('use client') | State: tab aktif, accordion, toggle |
| State management | useState lokal per komponen | Tidak perlu global state untuk website marketing |
| CSS approach | Tailwind utility classes | Konsisten, tidak ada CSS custom kecuali keyframes |
| Animation library | Framer Motion | Deklaratif, performant, gesture support |
| Font loading | next/font/google | Zero layout shift, self-hosted otomatis |
| Image format | next/image (WebP otomatis) | Ukuran lebih kecil, lazy load built-in |
| Deploy | Vercel | Native Next.js, CDN global, zero config |

---

## 🚫 LARANGAN KERAS

Hal-hal yang **TIDAK BOLEH** dilakukan:

```
❌ Jangan pakai CSS module atau styled-components — pakai Tailwind
❌ Jangan hardcode warna hex di className — pakai token dari tailwind.config
❌ Jangan pakai <img> biasa — selalu next/image
❌ Jangan animasi height/width property — pakai opacity + transform saja (performa)
❌ Jangan import Framer Motion di RSC — hanya di Client Component
❌ Jangan tulis inline style kecuali untuk CSS variable dynamic
❌ Jangan pakai any di TypeScript — selalu typing yang benar
❌ Jangan lupa 'use client' di komponen yang pakai useState/useEffect
❌ Jangan copy data bisnis dari PRD ke hardcode di JSX — semua dari constants.ts
❌ Jangan lupa alt text di setiap gambar (aksesibilitas)
```

---

## ✅ STANDAR KUALITAS MINIMUM

Setiap komponen yang kamu buat harus memenuhi:

```
✅ TypeScript proper typing (tidak ada 'any')
✅ Responsive: mobile 375px, tablet 768px, desktop 1280px
✅ Hover state di semua elemen interaktif
✅ Loading state jika ada async
✅ prefers-reduced-motion dihormati untuk animasi
✅ Alt text di setiap gambar
✅ Semantic HTML (section, article, header, nav, main, footer)
✅ ARIA label di elemen interaktif yang tidak punya teks visible
```

---

## 🔗 KONEKSI ANTAR FILE

```
AGENT.md
  └── merujuk ke SKILLS.md untuk: cara coding, patterns, snippets
  └── merujuk ke PERSONALITY.md untuk: cara berkomunikasi & membuat keputusan
  └── merujuk ke PRD_Website.md untuk: apa yang harus dibangun
  └── merujuk ke PRD1/2/3 untuk: data konten (fitur, bisnis, pricing)

SKILLS.md
  └── tidak merujuk file lain
  └── adalah referensi teknis mandiri

PERSONALITY.md
  └── tidak merujuk file lain
  └── adalah panduan perilaku mandiri
```

---

## 📊 DEFINISI "SELESAI"

Proyek dianggap selesai ketika:

```
[ ] Semua 11 section homepage terimplementasi
[ ] Lighthouse Performance ≥ 90
[ ] Lighthouse Accessibility ≥ 90
[ ] Lighthouse SEO ≥ 90
[ ] Mobile layout sempurna di 375px
[ ] Semua animasi berjalan smooth (tidak ada jank)
[ ] Build berhasil tanpa error TypeScript
[ ] Deploy ke Vercel berhasil
[ ] Semua CTA tombol mengarah ke URL yang benar
[ ] Tidak ada console.error saat runtime
```

---

## 🆘 JIKA ADA AMBIGUITAS

Prioritas keputusan saat ada yang tidak jelas:

```
1. Cek PRD_Website.md dulu — kemungkinan sudah ada jawabannya
2. Cek SKILLS.md — mungkin ada pattern yang relevan
3. Pilih opsi yang lebih simpel dan lebih cepat di-render
4. Pilih opsi yang lebih familiar untuk developer junior yang akan maintain
5. Jika benar-benar tidak ada panduan → dokumentasikan keputusanmu di komentar kode
```

---

*Terakhir diupdate: v1.0 | Dibuat untuk pembangunan website NuansaPos dari nol*
