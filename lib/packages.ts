// Satu-satunya sumber harga & kuota perangkat per paket.
// Harga TIDAK PERNAH dipercaya dari input client - selalu lookup dari sini di server.

export const PACKAGES = {
  BSC: { tierCode: 'BSC', name: 'Basic', price: 160000, maxDevices: 1 },
  PRO: { tierCode: 'PRO', name: 'Pro', price: 180000, maxDevices: 3 },
  PRM: { tierCode: 'PRM', name: 'Premium', price: 999000, maxDevices: 3 },
} as const;

export type PackageTier = keyof typeof PACKAGES;
export type OrderTier = PackageTier | ResellerPackageId;

export function isValidTier(tier: string): tier is OrderTier {
  const upper = tier.toUpperCase();
  return (
    upper === 'BSC' ||
    upper === 'PRO' ||
    upper === 'PRM' ||
    upper === 'RS50' ||
    upper === 'RS100' ||
    upper === 'RS500' ||
    upper === 'RS1000'
  );
}

export function getPackageDetails(tier: string) {
  const upperTier = tier.toUpperCase();
  if (upperTier === 'BSC' || upperTier === 'PRO' || upperTier === 'PRM') {
    const pkg = PACKAGES[upperTier as PackageTier];
    return {
      id: upperTier,
      name: pkg.name,
      price: pkg.price,
      maxDevices: pkg.maxDevices,
      isReseller: false,
      qty: 1,
    };
  }
  const resellerPkg = RESELLER_PACKAGES.find((p) => p.id === upperTier);
  if (resellerPkg) {
    return {
      id: resellerPkg.id,
      name: `Reseller ${resellerPkg.qty} Lisensi PRO`,
      price: resellerPkg.modalPrice,
      maxDevices: 3, // Lisensi PRO
      isReseller: true,
      qty: resellerPkg.qty,
    };
  }
  return null;
}

// ─── Reseller Packages ───────────────────────────────────────────────────────
// Tier PRO (3 perangkat) dalam bundel besar untuk reseller.
// Harga jual end-user reseller diasumsikan Rp 180.000 / lisensi PRO.
// Reseller profit = (180.000 × qty) - harga_modal

export type ResellerPackageId = 'RS50' | 'RS100' | 'RS500' | 'RS1000'

export type ResellerPackage = {
  id: ResellerPackageId
  qty: number          // Jumlah lisensi PRO (3HP) dalam bundel
  modalPrice: number   // Harga beli reseller (total)
  pricePerLicense: number // Modal per lisensi
  suggestedSellPrice: number // Harga jual disarankan per lisensi
  profitPerLicense: number   // Keuntungan per lisensi
  totalProfit: number        // Total keuntungan jika semua terjual
  discountPercent: number    // Diskon dari harga normal
  badge: string | null
  highlighted: boolean
}

// Harga normal 1 lisensi PRO = Rp 180.000
const NORMAL_PRO_PRICE = 180000

export const RESELLER_PACKAGES: ResellerPackage[] = [
  {
    id: 'RS50',
    qty: 50,
    modalPrice: 6_000_000,       // Rp 120.000/lisensi  (diskon 33%)
    pricePerLicense: 120_000,
    suggestedSellPrice: 160_000, // jual Rp 160.000
    profitPerLicense: 40_000,
    totalProfit: 2_000_000,      // 40.000 × 50
    discountPercent: 33,
    badge: null,
    highlighted: false,
  },
  {
    id: 'RS100',
    qty: 100,
    modalPrice: 10_000_000,      // Rp 100.000/lisensi (diskon 44%)
    pricePerLicense: 100_000,
    suggestedSellPrice: 160_000,
    profitPerLicense: 60_000,
    totalProfit: 6_000_000,      // 60.000 × 100
    discountPercent: 44,
    badge: '🔥 Terlaris',
    highlighted: true,
  },
  {
    id: 'RS500',
    qty: 500,
    modalPrice: 37_500_000,      // Rp 75.000/lisensi (diskon 58%)
    pricePerLicense: 75_000,
    suggestedSellPrice: 150_000,
    profitPerLicense: 75_000,
    totalProfit: 37_500_000,     // 75.000 × 500
    discountPercent: 58,
    badge: '💎 Best Value',
    highlighted: false,
  },
  {
    id: 'RS1000',
    qty: 1000,
    modalPrice: 60_000_000,      // Rp 60.000/lisensi (diskon 67%)
    pricePerLicense: 60_000,
    suggestedSellPrice: 150_000,
    profitPerLicense: 90_000,
    totalProfit: 90_000_000,     // 90.000 × 1000
    discountPercent: 67,
    badge: '🚀 Master Reseller',
    highlighted: false,
  },
]
