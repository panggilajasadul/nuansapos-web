'use client';

import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, 
  Cpu, 
  Printer, 
  Copy, 
  Check, 
  LogOut, 
  Search, 
  FileText, 
  RefreshCw, 
  ShieldAlert, 
  ShieldCheck,
  Building,
  User
} from 'lucide-react';
import { logoutAction } from './actions';

const SECRET = 'NuansaP0s@2024#Batch24$Offline!';
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

const TIER_META = {
  BSC: { name: 'basic', label: 'BASIC SUITE', max: '1 Perangkat' },
  PRO: { name: 'pro', label: 'PRO SUITE', max: '3 Perangkat' },
  PRM: { name: 'premium', label: 'PREMIUM SUITE', max: '3 Perangkat' }
} as const;

type TierCode = keyof typeof TIER_META;

// Helper to encode Uint8Array into Crockford-like Base32
function encodeBase32(bytes: Uint8Array, length = 15): string {
  let sb = '';
  let bits = 0;
  let buffer = 0;
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    buffer = (buffer << 8) | (byte & 0xFF);
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      const index = (buffer >>> bits) & 0x1F;
      sb += ALPHABET[index];
      if (sb.length === length) return sb;
    }
  }
  while (sb.length < length) {
    sb += ALPHABET[0];
  }
  return sb;
}

// Helper to compute HMAC-SHA256 signature in browser
async function computeHMACSHA256(secret: string, message: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await window.crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    messageData
  );
  
  return new Uint8Array(signature);
}

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<'generator' | 'decoder'>('generator');
  
  // Generator State
  const [deviceId, setDeviceId] = useState('a1b2c3d4e5f6a7b8');
  const [tier, setTier] = useState<TierCode>('PRO');
  const [businessName, setBusinessName] = useState('Nuansa Laundry & POS');
  const [customerName, setCustomerName] = useState('Hamid Wijaya');
  const [isDownloading, setIsDownloading] = useState(false);
  const [marginY, setMarginY] = useState(6);
  const [marginX, setMarginX] = useState(6);
  const [licenseKey, setLicenseKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [receiptDate, setReceiptDate] = useState('');

  // Decoder State
  const [decodeKey, setDecodeKey] = useState('');
  const [decodeDeviceId, setDecodeDeviceId] = useState('');
  const [decodeResult, setDecodeResult] = useState<{
    valid: boolean;
    formatOk: boolean;
    tier?: string;
    deviceId?: string;
    message?: string;
  } | null>(null);

  // Set real-time receipt date on load and key updates
  useEffect(() => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setReceiptDate(formatted);
  }, [licenseKey]);

  // Generate License Key dynamically
  useEffect(() => {
    const generate = async () => {
      if (!deviceId.trim()) {
        setLicenseKey('');
        return;
      }
      const meta = TIER_META[tier];
      const message = `${deviceId.trim()}|${meta.name}|LIFETIME`;
      const signatureBytes = await computeHMACSHA256(SECRET, message);
      const token = encodeBase32(signatureBytes, 15);
      setLicenseKey(`NUANSA-${tier}-${token.substring(0, 5)}-${token.substring(5, 10)}-${token.substring(10, 15)}`);
    };
    generate();
  }, [deviceId, tier]);

  // Decoder Logic
  const handleDecode = async () => {
    const key = decodeKey.trim().toUpperCase();
    if (!key) {
      setDecodeResult(null);
      return;
    }

    const parts = key.split('-');
    if (parts.length !== 5 || parts[0] !== 'NUANSA') {
      setDecodeResult({
        valid: false,
        formatOk: false,
        message: 'Format salah. Gunakan format: NUANSA-TIER-XXXXX-XXXXX-XXXXX'
      });
      return;
    }

    const tierCode = parts[1];
    const isTierValid = tierCode === 'BSC' || tierCode === 'PRO' || tierCode === 'PRM';
    if (!isTierValid) {
      setDecodeResult({
        valid: false,
        formatOk: false,
        message: `Tier Code '${tierCode}' tidak dikenal. Harus BSC, PRO, atau PRM.`
      });
      return;
    }

    const providedToken = parts[2] + parts[3] + parts[4];
    if (providedToken.length !== 15) {
      setDecodeResult({
        valid: false,
        formatOk: false,
        message: 'Token lisensi harus bernilai 15 karakter.'
      });
      return;
    }

    if (!decodeDeviceId.trim()) {
      setDecodeResult({
        valid: false,
        formatOk: true,
        tier: tierCode,
        message: 'Format kode benar. Masukkan ID Perangkat di bawah untuk memverifikasi keaslian signature.'
      });
      return;
    }

    // Validate Signature
    const tierMeta = TIER_META[tierCode as TierCode];
    const message = `${decodeDeviceId.trim()}|${tierMeta.name}|LIFETIME`;
    const signatureBytes = await computeHMACSHA256(SECRET, message);
    const expectedToken = encodeBase32(signatureBytes, 15);

    if (providedToken === expectedToken) {
      setDecodeResult({
        valid: true,
        formatOk: true,
        tier: tierCode,
        deviceId: decodeDeviceId,
        message: `Lisensi VALID! Kunci ini resmi ditandatangani untuk perangkat '${decodeDeviceId}' dengan paket ${tierMeta.label}.`
      });
    } else {
      setDecodeResult({
        valid: false,
        formatOk: true,
        tier: tierCode,
        deviceId: decodeDeviceId,
        message: `Lisensi INVALID! Tanda tangan token tidak cocok dengan ID Perangkat. Lisensi ini telah dimanipulasi atau dibuat untuk HP lain.`
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const element = document.getElementById('receipt-paper');
    if (!element) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `resi-lisensi-${deviceId}-${tier}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Gagal menyimpan gambar:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-body">
      {/* Navigation Header (Hidden on Print) */}
      <header className="bg-navy-900/80 backdrop-blur-md border-b border-white/5 py-4 px-6 flex justify-between items-center z-10 sticky top-0 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-brand to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg">
            N
          </div>
          <div>
            <h1 className="font-display font-bold text-base tracking-wide text-white leading-tight">
              NuansaPos
            </h1>
            <span className="text-[10px] font-mono text-brand-light">Dashboard Administrator</span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-navy-950 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'generator'
                ? 'bg-brand text-white shadow-glow-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Generator Lisensi
          </button>
          <button
            onClick={() => setActiveTab('decoder')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'decoder'
                ? 'bg-brand text-white shadow-glow-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Decoder Lisensi
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors bg-navy-950 border border-white/5 hover:border-red-500/20 px-3.5 py-2 rounded-xl"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 print:p-0 print:m-0 print:block">
        
        {/* TAB 1: GENERATOR LISENSI */}
        {activeTab === 'generator' && (
          <>
            {/* Input Form Column (Left) - Hidden on Print */}
            <div className="lg:col-span-7 space-y-6 print:hidden">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-3xl p-6 space-y-6"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                  <Cpu className="w-5 h-5 text-brand-light" />
                  <h2 className="font-display font-semibold text-lg text-white">Buat Lisensi Baru</h2>
                </div>

                {/* Device ID Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    ID Perangkat Android (Hex / ANDROID_ID)
                  </label>
                  <input
                    type="text"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    placeholder="Contoh: a1b2c3d4e5f6a7b8"
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl py-3 px-4 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all text-sm uppercase"
                  />
                  <p className="text-[10px] text-slate-500">
                    ID Perangkat didapatkan dari menu aktivasi di HP Android pelanggan.
                  </p>
                </div>

                {/* Tier Selection Card Grid */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-300 block">Pilih Paket Lisensi</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.keys(TIER_META) as TierCode[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setTier(key)}
                        className={`border rounded-2xl p-4 flex flex-col items-center justify-center gap-1 transition-all text-center ${
                          tier === key
                            ? 'border-brand bg-brand/10 shadow-glow-blue'
                            : 'border-white/5 bg-navy-950 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-display text-sm font-bold text-white block">
                          {key}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {TIER_META[key].max}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Struk Metadata Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      Nama Toko / Bisnis
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Contoh: Laundry Jaya"
                      className="w-full bg-navy-950 border border-slate-700 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Nama Pelanggan
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full bg-navy-950 border border-slate-700 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                {/* Margin Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Margin Atas/Bawah: <span className="text-brand-light font-bold">{marginY}</span>mm
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={marginY}
                      onChange={(e) => setMarginY(parseInt(e.target.value))}
                      className="w-full h-1 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Margin Kiri/Kanan: <span className="text-brand-light font-bold">{marginX}</span>mm
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={marginX}
                      onChange={(e) => setMarginX(parseInt(e.target.value))}
                      className="w-full h-1 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                  </div>
                </div>

                {/* Live Output */}
                <div className="bg-navy-950/60 border border-brand/20 rounded-2xl p-4 space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-xl pointer-events-none" />
                  <span className="text-[10px] font-bold text-brand-light uppercase tracking-widest block">
                    Kunci Lisensi Terbuat
                  </span>
                  <div className="text-center font-mono text-sm md:text-base font-bold text-white tracking-wider py-2 bg-navy-950/80 border border-white/5 rounded-xl select-all select-none">
                    {licenseKey || 'MEMBUTUHKAN DEVICE ID'}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    onClick={handleCopy}
                    disabled={!licenseKey}
                    className="flex-1 bg-navy-950 hover:bg-navy-900 border border-white/10 hover:border-white/20 text-white rounded-xl py-3.5 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>Salin Kunci</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!licenseKey || isDownloading}
                    className="flex-1 bg-navy-950 hover:bg-navy-900 border border-white/10 hover:border-white/20 text-white rounded-xl py-3.5 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>Simpan Gambar</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handlePrint}
                    disabled={!licenseKey}
                    className="flex-1 bg-brand hover:bg-brand-dark text-white rounded-xl py-3.5 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-glow-blue disabled:opacity-50"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Resi</span>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Receipt Preview Column (Right) */}
            <div className="lg:col-span-5 flex flex-col items-center print:block print:w-full">
              <h3 className="text-xs font-semibold text-slate-400 mb-4 flex items-center gap-1.5 print:hidden">
                <FileText className="w-4 h-4 text-brand-light" />
                Live Preview Cetakan Struk (100mm x 150mm)
              </h3>

              {/* Physical Struk Wrapper */}
              <div 
                id="receipt-paper"
                className="bg-white text-black font-mono w-[380px] h-[570px] print:w-[100mm] print:h-[150mm] print:max-w-full print:shadow-none print:bg-white shadow-2xl relative border border-slate-200 rounded-md print:border-none print:rounded-none flex flex-col justify-between"
                style={{ 
                  fontSize: '11px', 
                  lineHeight: '1.4',
                  paddingTop: `${marginY * 3.8}px`,
                  paddingBottom: `${marginY * 3.8}px`,
                  paddingLeft: `${marginX * 3.8}px`,
                  paddingRight: `${marginX * 3.8}px`
                }}
              >
                {/* Jagged Edge Simulation (Hidden on Print) */}
                <div className="absolute top-0 inset-x-0 h-2.5 bg-repeat-x pointer-events-none print:hidden"
                  style={{
                    backgroundImage: `linear-gradient(-45deg, #0A1628 5px, transparent 0), linear-gradient(45deg, #0A1628 5px, transparent 0)`,
                    backgroundSize: '10px 10px'
                  }}
                />

                <div className="flex flex-col gap-1 w-full">
                  <div className="text-center pt-3 pb-2">
                    <div className="text-sm font-bold tracking-wider uppercase">
                      {businessName.toUpperCase() || 'NUANSAPOS'}
                    </div>
                    <div className="text-[9px] text-slate-700">Bukti Lisensi Aplikasi Offline</div>
                    <div className="text-[8px] text-slate-600 mt-1">{receiptDate}</div>
                  </div>

                  <div className="border-t border-dashed border-black my-2" />

                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span>Pelanggan:</span>
                      <span>{customerName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ID Perangkat:</span>
                      <span className="font-bold">{deviceId || '-'}</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-black my-2" />

                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between font-bold text-xs">
                      <span>Tipe Paket:</span>
                      <span>{TIER_META[tier].label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Durasi:</span>
                      <span>SEUMUR HIDUP (LIFETIME)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maks HP:</span>
                      <span>{TIER_META[tier].max}</span>
                    </div>
                  </div>

                  {/* Struk Key Container */}
                  <div className="bg-slate-100 border border-slate-300 py-3 px-2 text-center my-3 rounded">
                    <span className="text-[8px] text-slate-600 uppercase tracking-wide block mb-1">
                      KODE AKTIVASI LISENSI
                    </span>
                    <span className="text-xs font-bold font-mono tracking-wide block break-all text-black">
                      {licenseKey || 'NUANSA-PRO-XXXXX-XXXXX-XXXXX'}
                    </span>
                  </div>

                  {/* QR Code Container */}
                  {licenseKey && (
                    <div className="flex flex-col items-center justify-center my-3">
                      {/* Render standard web QR Code fallback API image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(licenseKey)}`}
                        alt="Licensing QR Code"
                        className="w-28 h-28 border border-slate-300 p-1 bg-white"
                      />
                      <span className="text-[7px] text-slate-600 mt-1">Pindai QR ini atau masukkan kunci manual</span>
                    </div>
                  )}

                  <div className="border-t border-dashed border-black my-2" />
                </div>

                <div className="text-center text-[8px] text-slate-700 pt-1">
                  <div>Terima kasih atas pembelian lisensi resmi.</div>
                  <div className="font-bold mt-1">NUANSAPOS MANAGEMENT</div>
                  <div className="mt-0.5">Simpan resi ini sebagai bukti resmi kepemilikan.</div>
                </div>

                {/* Jagged Edge Simulation Bottom (Hidden on Print) */}
                <div className="absolute bottom-0 inset-x-0 h-2.5 bg-repeat-x pointer-events-none print:hidden"
                  style={{
                    backgroundImage: `linear-gradient(-45deg, transparent 5px, #0A1628 0), linear-gradient(45deg, transparent 5px, #0A1628 0)`,
                    backgroundSize: '10px 10px'
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* TAB 2: DECODER LISENSI */}
        {activeTab === 'decoder' && (
          <div className="lg:col-span-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 space-y-6 max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <Search className="w-5 h-5 text-brand-light" />
                <h2 className="font-display font-semibold text-lg text-white">Dekode & Verifikasi Lisensi</h2>
              </div>

              <div className="space-y-4">
                {/* License Key Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Masukkan Kunci Lisensi (Full)
                  </label>
                  <input
                    type="text"
                    value={decodeKey}
                    onChange={(e) => setDecodeKey(e.target.value)}
                    placeholder="Contoh: NUANSA-PRO-XXXXX-XXXXX-XXXXX"
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl py-3 px-4 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-brand text-sm uppercase"
                  />
                </div>

                {/* Device ID Input for signature check */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    ID Perangkat Terkait (Opsional, untuk Cek Validasi Kunci)
                  </label>
                  <input
                    type="text"
                    value={decodeDeviceId}
                    onChange={(e) => setDecodeDeviceId(e.target.value)}
                    placeholder="Contoh: a1b2c3d4e5f6a7b8"
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl py-3 px-4 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-brand text-sm uppercase"
                  />
                </div>

                {/* Action button */}
                <button
                  onClick={handleDecode}
                  className="w-full bg-brand hover:bg-brand-dark text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-glow-blue"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                  <span>Dekode & Jalankan Integritas</span>
                </button>
              </div>

              {/* Animate Results */}
              <AnimatePresence mode="wait">
                {decodeResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4"
                  >
                    <div className={`border rounded-2xl p-5 space-y-4 ${
                      decodeResult.valid 
                        ? 'border-emerald-500/20 bg-emerald-500/5' 
                        : decodeResult.formatOk 
                          ? 'border-yellow-500/20 bg-yellow-500/5' 
                          : 'border-red-500/20 bg-red-500/5'
                    }`}>
                      <div className="flex items-center gap-3">
                        {decodeResult.valid ? (
                          <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <ShieldAlert className={`w-6 h-6 flex-shrink-0 ${
                            decodeResult.formatOk ? 'text-yellow-400' : 'text-red-400'
                          }`} />
                        )}
                        <span className="font-semibold text-sm text-white">
                          Status Hasil Analisis
                        </span>
                      </div>

                      <div className="space-y-2 text-xs font-body text-slate-300">
                        {decodeResult.tier && (
                          <div className="flex justify-between border-b border-white/5 py-1">
                            <span className="text-slate-400">Deteksi Paket:</span>
                            <span className="font-bold text-white">{decodeResult.tier}</span>
                          </div>
                        )}
                        {decodeResult.deviceId && (
                          <div className="flex justify-between border-b border-white/5 py-1">
                            <span className="text-slate-400">ID Perangkat:</span>
                            <span className="font-mono text-white">{decodeResult.deviceId}</span>
                          </div>
                        )}
                        <p className="mt-2 text-xs leading-relaxed leading-normal text-slate-300">
                          {decodeResult.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </main>

      {/* Dynamic print-media page margin style override */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: 100mm 150mm;
            margin: 0 !important;
          }
          #receipt-paper {
            margin: ${marginY}mm ${marginX}mm !important;
            width: ${100 - (2 * marginX)}mm !important;
            height: ${150 - (2 * marginY)}mm !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
        }
      `}} />
    </div>
  );
}
