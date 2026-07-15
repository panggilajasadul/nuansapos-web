// lib/constants.ts
// SEMUA data statis website. Jangan hardcode di JSX.

export const SITE_CONFIG = {
  name: 'NuansaPos',
  tagline: 'Kasir Android untuk Semua Bisnis UMKM Indonesia',
  description: '100% Offline. 9 Jenis Bisnis. Siap pakai 5 menit.',
  playStoreUrl: 'https://drive.google.com/drive/folders/17lz4xdSkDQVvDkdp7ukHRVN8g-S7WaDu?usp=drive_link',
  whatsappNumber: '6281389709847',
  whatsappMessage: 'Halo, saya tertarik dengan NuansaPos. Boleh minta demo?',
  email: 'nuansapos.noreply@gmail.com',
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

export type FeatureHighlight = {
  icon: string
  title: string
  description: string
  color: string
}

export const FEATURE_HIGHLIGHTS: FeatureHighlight[] = [
  {
    icon: 'Wifi',
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

export type PricingPlan = {
  id: 'free' | 'BSC' | 'PRO' | 'PRM'
  name: string
  price: number
  description: string
  limit: string
  features: string[]
  notIncluded: string[]
  cta: string
  highlighted: boolean
  badge: string | null
}

// Harga lifetime (sekali bayar, seumur hidup - tanpa biaya bulanan).
// Harus selalu sinkron dengan lib/packages.ts (sumber kebenaran harga di server).
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
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
    id: 'BSC',
    name: 'Basic',
    price: 160000,
    description: 'Lisensi lifetime untuk usaha kecil, 1 perangkat',
    limit: 'Produk & transaksi tidak terbatas · 1 perangkat',
    features: [
      'Semua fitur Gratis',
      'Produk & transaksi tidak terbatas',
      'Backup otomatis harian',
      'Cetak struk thermal Bluetooth',
      'Bayar sekali, pakai selamanya',
    ],
    notIncluded: ['Multi-user', 'Export Excel & PDF', 'Promo & voucher'],
    cta: 'Beli Basic — Rp 160rb',
    highlighted: false,
    badge: null,
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 180000,
    description: 'Untuk toko yang sedang berkembang, hingga 3 perangkat',
    limit: 'Produk & transaksi tidak terbatas · 3 perangkat',
    features: [
      'Semua fitur Basic',
      'Hingga 3 perangkat aktif',
      'Multi-user hingga 5 akun',
      'Export Excel & PDF',
      'Promo, diskon & voucher',
      'Laporan laba rugi',
      'Priority support WhatsApp',
    ],
    notIncluded: [],
    cta: 'Beli Pro — Rp 180rb',
    highlighted: true,
    badge: 'Paling Populer 🔥',
  },
  // Paket Premium dinonaktifkan sementara (disembunyikan dari UI)
  // {
  //   id: 'PRM',
  //   name: 'Premium',
  //   price: 999000,
  //   description: 'Untuk bisnis yang lebih kompleks, fitur paling lengkap',
  //   limit: 'Semua fitur + semua modul bisnis · 3 perangkat',
  //   features: [
  //     'Semua fitur Pro',
  //     'Modul akuntansi double-entry',
  //     'Rekonsiliasi bank (upload CSV)',
  //     'Import pesanan marketplace',
  //     'Offline picking Shopee/Tokopedia',
  //     'Dedicated support',
  //   ],
  //   notIncluded: [],
  //   cta: 'Beli Premium — Lifetime',
  //   highlighted: false,
  //   badge: null,
  // },
]

export type Testimonial = {
  name: string
  business: string
  city: string
  type: string
  rating: number
  text: string
  avatar: string
}

export const TESTIMONIALS: Testimonial[] = [
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

export const NAV_LINKS = [
  { href: '#fitur', label: 'Fitur' },
  { href: '#harga', label: 'Harga' },
  { href: '#bisnis', label: 'Bisnis' },
  { href: '#faq', label: 'FAQ' },
]

export const TRUST_BADGES = [
  '100% Offline',
  'Data Privasi Terjaga',
  'Gratis Selamanya',
  'Tanpa Kartu Kredit',
]

export const FOOTER_LINKS = {
  product: [
    { href: '#fitur', label: 'Fitur' },
    { href: '#harga', label: 'Harga' },
    { href: '#bisnis', label: 'Tipe Bisnis' },
    { href: '#faq', label: 'FAQ' },
    { href: '/reseller', label: 'Program Reseller' },
  ],
  legal: [
    { href: '/privacy-policy', label: 'Kebijakan Privasi' },
    { href: '/terms', label: 'Syarat & Ketentuan' },
  ],
  social: [
    { href: 'https://instagram.com', label: 'Instagram', icon: 'Instagram' },
    { href: 'https://facebook.com', label: 'Facebook', icon: 'Facebook' },
    { href: 'https://youtube.com', label: 'YouTube', icon: 'Youtube' },
  ],
}
