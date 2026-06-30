-- Jalankan di Supabase SQL Editor (Project -> SQL Editor -> New query)
-- Menambahkan tabel `orders` untuk transaksi pembelian lisensi via Midtrans.
-- Tidak mengubah tabel `licenses` / `license_activations` yang sudah ada.

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  midtrans_order_id TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('BSC', 'PRO', 'PRM')),
  price INTEGER NOT NULL,
  max_devices INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  business_name TEXT,
  business_type TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'expired', 'cancelled')),
  midtrans_transaction_id TEXT,
  license_id UUID REFERENCES licenses(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_midtrans_order_id ON orders(midtrans_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
