// Satu-satunya sumber harga & kuota perangkat per paket.
// Harga TIDAK PERNAH dipercaya dari input client - selalu lookup dari sini di server.

export const PACKAGES = {
  BSC: { tierCode: 'BSC', name: 'Basic', price: 299000, maxDevices: 1 },
  PRO: { tierCode: 'PRO', name: 'Pro', price: 599000, maxDevices: 3 },
  PRM: { tierCode: 'PRM', name: 'Premium', price: 999000, maxDevices: 3 },
} as const;

export type PackageTier = keyof typeof PACKAGES;

export function isValidTier(tier: string): tier is PackageTier {
  return tier === 'BSC' || tier === 'PRO' || tier === 'PRM';
}
