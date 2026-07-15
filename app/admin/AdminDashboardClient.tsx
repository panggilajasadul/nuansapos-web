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
  User,
  Menu,
  X,
  Database,
  Trash2,
  Lock,
  Users,
  TrendingUp,
  Percent,
  Calendar,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import {
  logoutAction,
  saveLicenseAction,
  listLicensesAction,
  resetActivationsAction,
  deleteLicenseAction,
  listOrdersAction,
  generateResellerLicensesAction
} from './actions';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import apkQrImage from '@/assets/nuasapos-apk.png';
import { formatRupiah } from '@/lib/utils';

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
  const [activeTab, setActiveTab] = useState<'generator' | 'decoder' | 'manager' | 'orders' | 'reseller-gen' | 'reseller-track'>('generator');
  
  // Generator State
  const [menuOpen, setMenuOpen] = useState(false);
  const [activationMode, setActivationMode] = useState<'online' | 'offline'>('online');
  const [isGeneratingOnline, setIsGeneratingOnline] = useState(false);
  const [deviceId, setDeviceId] = useState('a1b2c3d4e5f6a7b8');
  const [tier, setTier] = useState<TierCode>('PRO');
  const [businessName, setBusinessName] = useState('Nuansa POS | Aplikasi Kasir');
  const [customerName, setCustomerName] = useState('Hamid Wijaya');
  const [isDownloading, setIsDownloading] = useState(false);
  const [marginY, setMarginY] = useState(6);
  const [marginX, setMarginX] = useState(6);
  const [licenseKey, setLicenseKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [receiptDate, setReceiptDate] = useState('');

  // Reseller Generator State
  const [resellerQty, setResellerQty] = useState<number>(50);
  const [resellerBusinessName, setResellerBusinessName] = useState('Mitra Reseller');
  const [resellerCustomerName, setResellerCustomerName] = useState('Abdul Hamid');
  const [isGeneratingReseller, setIsGeneratingReseller] = useState(false);
  const [generatedResellerLicenses, setGeneratedResellerLicenses] = useState<string[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [resellerSearch, setResellerSearch] = useState('');
  const [copiedResellerIndex, setCopiedResellerIndex] = useState<number | null>(null);

  // Reseller Tracker State
  const [resellerTrackSearch, setResellerTrackSearch] = useState('');
  const [selectedResellerGroup, setSelectedResellerGroup] = useState<any | null>(null);

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

  // Manager State (Supabase List)
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isLicensesLoading, setIsLicensesLoading] = useState(false);
  const [licensesError, setLicensesError] = useState<string | null>(null);
  const [licensesSearch, setLicensesSearch] = useState('');

  // Orders State (Supabase List)
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [ordersSearch, setOrdersSearch] = useState('');

  // Set real-time receipt date on load and key updates
  useEffect(() => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setReceiptDate(formatted);
  }, [licenseKey]);

  // Load licenses list when manager or reseller-track tab is open
  useEffect(() => {
    if (activeTab === 'manager' || activeTab === 'reseller-track') {
      fetchLicenses();
    }
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchLicenses = async () => {
    setIsLicensesLoading(true);
    setLicensesError(null);
    try {
      const res = await listLicensesAction();
      if (res.success) {
        setLicenses(res.data);
      } else {
        setLicensesError(res.error);
      }
    } catch (err: any) {
      setLicensesError(err.message || 'Gagal terhubung ke database.');
    } finally {
      setIsLicensesLoading(false);
    }
  };

  const fetchOrders = async () => {
    setIsOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await listOrdersAction();
      if (res.success) {
        setOrders(res.data);
      } else {
        setOrdersError(res.error);
      }
    } catch (err: any) {
      setOrdersError(err.message || 'Gagal terhubung ke database.');
    } finally {
      setIsOrdersLoading(false);
    }
  };

  // Generate License Key dynamically for Offline mode only
  useEffect(() => {
    if (activationMode !== 'offline') return;
    
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
  }, [deviceId, tier, activationMode]);

  // Generate and save License Key for Online mode
  const handleGenerateOnline = async () => {
    setIsGeneratingOnline(true);
    try {
      // Generate a token (using cryptographically secure random values if available, or Math.random as fallback)
      let token = '';
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const array = new Uint8Array(15);
        window.crypto.getRandomValues(array);
        for (let i = 0; i < 15; i++) {
          token += ALPHABET[array[i] % ALPHABET.length];
        }
      } else {
        // Fallback for insecure/HTTP contexts
        for (let i = 0; i < 15; i++) {
          const rand = Math.floor(Math.random() * ALPHABET.length);
          token += ALPHABET[rand];
        }
      }

      const generatedKey = `NUANSA-${tier}-${token.substring(0, 5)}-${token.substring(5, 10)}-${token.substring(10, 15)}`;
      const maxDevices = tier === 'BSC' ? 1 : 3;

      // Save to Supabase
      const res = await saveLicenseAction({
        licenseKey: generatedKey,
        tier,
        maxDevices,
        businessName: businessName.trim(),
        customerName: customerName.trim(),
      });

      if (!res.success) {
        alert('Gagal membuat lisensi online: ' + res.error);
        return;
      }

      setLicenseKey(generatedKey);
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setIsGeneratingOnline(false);
    }
  };

  const handleResetActivations = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin me-reset semua perangkat terdaftar untuk lisensi ini?')) return;
    try {
      const res = await resetActivationsAction(id);
      if (res.success) {
        alert('Aktivasi perangkat berhasil di-reset!');
        fetchLicenses();
      } else {
        alert('Gagal me-reset: ' + res.error);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteLicense = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus / mencabut lisensi ini? Semua HP yang telah mengaktifkannya tidak akan bisa memvalidasi ulang.')) return;
    try {
      const res = await deleteLicenseAction(id);
      if (res.success) {
        alert('Lisensi berhasil dicabut!');
        fetchLicenses();
      } else {
        alert('Gagal menghapus: ' + res.error);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };


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

  // Reseller Generator Logic
  const handleGenerateReseller = async () => {
    if (resellerQty < 1) {
      alert('Jumlah lisensi minimal 1.');
      return;
    }
    setIsGeneratingReseller(true);
    try {
      const res = await generateResellerLicensesAction({
        qty: resellerQty,
        businessName: resellerBusinessName.trim(),
        customerName: resellerCustomerName.trim(),
      });

      if (res.success) {
        setGeneratedResellerLicenses(res.data);
        alert(`Berhasil membuat ${resellerQty} lisensi reseller!`);
      } else {
        alert('Gagal generate lisensi: ' + res.error);
      }
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setIsGeneratingReseller(false);
    }
  };

  const handleCopyAllReseller = () => {
    navigator.clipboard.writeText(generatedResellerLicenses.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadResellerExcel = () => {
    const data = generatedResellerLicenses.map((lic, index) => ({
      'No': index + 1,
      'Kode Lisensi': lic,
      'Tipe Paket': 'NuansaPos PRO',
      'Maksimal HP': 3,
      'Pemilik Reseller': resellerCustomerName,
      'Tanggal Pembuatan': new Date().toLocaleDateString('id-ID'),
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet['!cols'] = [
      { wch: 6 },   // No
      { wch: 35 },  // Kode Lisensi
      { wch: 18 },  // Tipe Paket
      { wch: 15 },  // Maksimal HP
      { wch: 25 },  // Pemilik Reseller
      { wch: 20 }   // Tanggal Pembuatan
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lisensi Reseller');
    XLSX.writeFile(workbook, `lisensi-reseller-${resellerCustomerName.replace(/\s+/g, '_')}-${resellerQty}.xlsx`);
  };

  const handleDownloadResellerCSV = () => {
    const csvHeader = "No,Kode Lisensi,Tipe Paket,Maksimal HP,Pemilik Reseller,Tanggal Pembuatan\n";
    const csvRows = generatedResellerLicenses.map((lic, index) => {
      return `${index + 1},${lic},NuansaPos PRO,3,${resellerCustomerName.replace(/,/g, '')},${new Date().toLocaleDateString('id-ID')}`;
    }).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `lisensi-reseller-${resellerCustomerName.replace(/\s+/g, '_')}-${resellerQty}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadResellerPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Daftar Lisensi Reseller NuansaPos", 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Mitra Reseller: ${resellerCustomerName}`, 14, 28);
    doc.text(`Nama Kemitraan: ${resellerBusinessName}`, 14, 34);
    doc.text(`Tanggal Generate: ${new Date().toLocaleDateString('id-ID')}`, 14, 40);
    doc.text(`Jumlah Lisensi: ${resellerQty} Lisensi PRO (3 HP)`, 14, 46);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 52, 196, 52);
    
    let y = 60;
    doc.setFontSize(9);
    generatedResellerLicenses.forEach((lic, index) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${index + 1}.`, 14, y);
      doc.setFont("courier", "bold");
      doc.text(lic, 25, y);
      doc.setFont("helvetica", "normal");
      doc.text("NuansaPos PRO (3 HP)", 90, y);
      y += 7;
    });
    
    doc.save(`lisensi-reseller-${resellerCustomerName.replace(/\s+/g, '_')}-${resellerQty}.pdf`);
  };

  const handleSendResellerWhatsApp = () => {
    let cleanPhone = whatsappNumber.trim().replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      alert('Masukkan nomor WhatsApp yang valid.');
      return;
    }
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    
    const maxTextLicenses = generatedResellerLicenses.slice(0, 100);
    let licenseText = maxTextLicenses.map((lic, index) => `${index + 1}. ${lic}`).join('\n');
    
    if (generatedResellerLicenses.length > 100) {
      licenseText += `\n... Dan ${generatedResellerLicenses.length - 100} lisensi lainnya (silakan unduh file Excel/PDF).`;
    }

    const message = `Halo ${resellerCustomerName}!\n\nBerikut adalah daftar ${generatedResellerLicenses.length} lisensi NuansaPos PRO untuk bisnis Anda (${resellerBusinessName}):\n\n${licenseText}\n\nTerima kasih atas kerja samanya!`;
    const encodedText = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  // Process licenses into reseller groups
  const getResellersList = () => {
    const resellerMap: Record<string, {
      customerName: string;
      businessName: string;
      totalLicenses: number;
      activeLicenses: number;
      createdDates: Date[];
      licenses: any[];
    }> = {};

    licenses.forEach((lic) => {
      const custName = (lic.customerName || '').trim();
      const busName = (lic.businessName || '').trim();
      
      if (!custName && !busName) return;

      const groupKey = `${custName.toLowerCase()}|||${busName.toLowerCase()}`;
      
      if (!resellerMap[groupKey]) {
        resellerMap[groupKey] = {
          customerName: custName || 'Tanpa Nama',
          businessName: busName || 'Tanpa Nama Bisnis',
          totalLicenses: 0,
          activeLicenses: 0,
          createdDates: [],
          licenses: [],
        };
      }

      resellerMap[groupKey].totalLicenses += 1;
      if (lic.activatedDevicesCount > 0) {
        resellerMap[groupKey].activeLicenses += 1;
      }
      if (lic.createdAt) {
        resellerMap[groupKey].createdDates.push(new Date(lic.createdAt));
      }
      resellerMap[groupKey].licenses.push(lic);
    });

    return Object.values(resellerMap)
      .map(group => {
        const sortedDates = group.createdDates.sort((a, b) => a.getTime() - b.getTime());
        const joinDate = sortedDates.length > 0 ? sortedDates[0] : new Date();
        return {
          ...group,
          joinDate,
        };
      })
      .filter(group => {
        const isResellerName = 
          group.businessName.toLowerCase().includes('reseller') || 
          group.customerName.toLowerCase().includes('reseller') || 
          group.businessName.toLowerCase().includes('mitra');
        return group.totalLicenses >= 2 || isResellerName;
      })
      .sort((a, b) => b.totalLicenses - a.totalLicenses);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-body">
      {/* Navigation Header (Hidden on Print) */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 py-4 px-6 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-brand to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg">
              N
            </div>
            <div>
              <h1 className="font-display font-bold text-base tracking-wide text-slate-900 leading-tight">
                NuansaPos
              </h1>
              <span className="text-[10px] font-mono text-brand font-semibold">Dashboard Administrator</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Tab Buttons */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'generator'
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                Generator Lisensi
              </button>
              <button
                onClick={() => setActiveTab('decoder')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'decoder'
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-650 hover:text-slate-900'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                Decoder Lisensi
              </button>
              <button
                onClick={() => setActiveTab('manager')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'manager'
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Daftar Lisensi (Online)
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'orders'
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Pesanan
              </button>
              <button
                onClick={() => setActiveTab('reseller-gen')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'reseller-gen'
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                Reseller Gen
              </button>
              <button
                onClick={() => setActiveTab('reseller-track')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'reseller-track'
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Tracking Reseller
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-red-600 transition-colors bg-white border border-slate-200 hover:border-red-200 px-3.5 py-2 rounded-xl shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-4 pt-4 border-t border-slate-200/60 space-y-4"
          >
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveTab('generator');
                  setMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all ${
                  activeTab === 'generator'
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Key className="w-4 h-4" />
                Generator Lisensi
              </button>
              <button
                onClick={() => {
                  setActiveTab('decoder');
                  setMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all ${
                  activeTab === 'decoder'
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-655 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Search className="w-4 h-4" />
                Decoder Lisensi
              </button>
              <button
                onClick={() => {
                  setActiveTab('manager');
                  setMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all ${
                  activeTab === 'manager'
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Database className="w-4 h-4" />
                Daftar Lisensi (Online)
              </button>
              <button
                onClick={() => {
                  setActiveTab('orders');
                  setMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all ${
                  activeTab === 'orders'
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                Pesanan
              </button>
              <button
                onClick={() => {
                  setActiveTab('reseller-gen');
                  setMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all ${
                  activeTab === 'reseller-gen'
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Building className="w-4 h-4" />
                Reseller Gen
              </button>
              <button
                onClick={() => {
                  setActiveTab('reseller-track');
                  setMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all ${
                  activeTab === 'reseller-track'
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                Tracking Reseller
              </button>
            </div>

            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100/70 border border-red-200/50 py-3 rounded-xl"
            >
              <LogOut className="w-4 h-4" />
              Keluar Akun
            </button>
          </motion.div>
        )}
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
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60">
                  <Cpu className="w-5 h-5 text-brand" />
                  <h2 className="font-display font-semibold text-lg text-slate-900">Buat Lisensi Baru</h2>
                </div>

                {/* Activation Mode Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">Metode Aktivasi</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                    <button
                      type="button"
                      onClick={() => {
                        setActivationMode('online');
                        setLicenseKey(''); // Reset key
                      }}
                      className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        activationMode === 'online'
                          ? 'bg-white text-brand shadow-sm font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                      Online (Rekomendasi)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActivationMode('offline');
                        setLicenseKey(''); // Reset key
                      }}
                      className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        activationMode === 'offline'
                          ? 'bg-white text-brand shadow-sm font-bold'
                          : 'text-slate-650 hover:text-slate-900'
                      }`}
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      Offline (Manual/Murni)
                    </button>
                  </div>
                </div>

                {/* Device ID Input / Online Info Banner */}
                {activationMode === 'offline' ? (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">
                      ID Perangkat Android (Hex / ANDROID_ID)
                    </label>
                    <input
                      type="text"
                      value={deviceId}
                      onChange={(e) => setDeviceId(e.target.value)}
                      placeholder="Contoh: a1b2c3d4e5f6a7b8"
                      className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-slate-800 font-mono placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/10 transition-all text-sm uppercase"
                    />
                    <p className="text-[10px] text-slate-500">
                      ID Perangkat didapatkan dari menu aktivasi di HP Android pelanggan.
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-brand text-xs font-bold">
                      <Lock className="w-3.5 h-3.5" />
                      Aktivasi Online Terbuka
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      Kunci lisensi akan dibuat acak tanpa memerlukan ID Perangkat sekarang. Saat pelanggan memasukkan kode ini di HP mereka untuk pertama kali, perangkat mereka akan otomatis terdaftar dan dikunci di database.
                    </p>
                  </div>
                )}

                {/* Tier Selection Card Grid */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-700 block">Pilih Paket Lisensi</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.keys(TIER_META) as TierCode[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setTier(key);
                          if (activationMode === 'online') setLicenseKey(''); // Reset key to force generation on changes
                        }}
                        className={`border rounded-2xl p-4 flex flex-col items-center justify-center gap-1 transition-all text-center ${
                          tier === key
                            ? 'border-brand bg-brand/5 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <span className={`font-display text-sm font-bold block ${
                          tier === key ? 'text-brand' : 'text-slate-800'
                        }`}>
                          {key}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {TIER_META[key].max}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Struk Metadata Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-505" />
                      Nama Toko / Bisnis
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Contoh: Laundry Jaya"
                      className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-slate-800 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-550" />
                      Nama Pelanggan
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-slate-800 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                {/* Margin Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Margin Atas/Bawah: <span className="text-brand font-bold">{marginY}</span>mm
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={marginY}
                      onChange={(e) => setMarginY(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Margin Kiri/Kanan: <span className="text-brand font-bold">{marginX}</span>mm
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={marginX}
                      onChange={(e) => setMarginX(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                  </div>
                </div>

                {/* Live Output */}
                <div className="bg-brand/5 border border-brand/20 rounded-2xl p-4 space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-xl pointer-events-none" />
                  <span className="text-[10px] font-bold text-brand uppercase tracking-widest block">
                    Kunci Lisensi Terbuat
                  </span>
                  <div className="text-center font-mono text-sm md:text-base font-bold text-slate-900 tracking-wider py-2 bg-white border border-slate-200 rounded-xl select-all select-none">
                    {licenseKey || (activationMode === 'online' ? 'KLIK GENERATE DI BAWAH' : 'MEMBUTUHKAN DEVICE ID')}
                  </div>
                </div>

                {/* Form Buttons */}
                {activationMode === 'online' && !licenseKey ? (
                  <button
                    onClick={handleGenerateOnline}
                    disabled={isGeneratingOnline}
                    className="w-full bg-brand hover:bg-brand-dark text-white rounded-xl py-3.5 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-brand/20 disabled:opacity-50"
                  >
                    {isGeneratingOnline ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        <span>Generate & Simpan Lisensi Online</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row gap-3">
                      <button
                        onClick={handleCopy}
                        disabled={!licenseKey}
                        className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 rounded-xl py-3.5 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Disalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-500" />
                            <span>Salin Kunci</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleDownload}
                        disabled={!licenseKey || isDownloading}
                        className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 rounded-xl py-3.5 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                      >
                        {isDownloading ? (
                          <div className="w-4 h-4 border-2 border-slate-400 border-t-brand rounded-full animate-spin" />
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-500" />
                            <span>Simpan Gambar</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handlePrint}
                        disabled={!licenseKey}
                        className="flex-1 bg-brand hover:bg-brand-dark text-white rounded-xl py-3.5 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-brand/20 disabled:opacity-50"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Cetak Resi</span>
                      </button>
                    </div>
                    {activationMode === 'online' && licenseKey && (
                      <button
                        onClick={() => setLicenseKey('')}
                        className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl py-2 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Generate Lisensi Baru Lagi</span>
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Receipt Preview Column (Right) */}
            <div className="lg:col-span-5 flex flex-col items-center print:block print:w-full">
              <h3 className="text-xs font-semibold text-slate-600 mb-4 flex items-center gap-1.5 print:hidden">
                <FileText className="w-4 h-4 text-brand" />
                Live Preview Cetakan Struk (100mm x 150mm)
              </h3>

              {/* Physical Struk Wrapper */}
              <div 
                id="receipt-paper"
                className="bg-white text-black font-mono w-[380px] max-w-full h-[570px] print:w-[100mm] print:h-[150mm] print:max-w-full print:shadow-none print:bg-white shadow-2xl relative border border-slate-200 rounded-md print:border-none print:rounded-none flex flex-col justify-between"
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
                    backgroundImage: `linear-gradient(-45deg, #F8FAFC 5px, transparent 0), linear-gradient(45deg, #F8FAFC 5px, transparent 0)`,
                    backgroundSize: '10px 10px'
                  }}
                />

                <div className="flex flex-col gap-1 w-full">
                  <div className="text-center pt-4 pb-2">
                    <div className="text-sm font-bold tracking-wider uppercase">
                      {businessName.toUpperCase() || 'NUANSAPOS'}
                    </div>
                    <div className="text-[9px] text-slate-700">Bukti Lisensi Aplikasi Offline</div>
                    <div className="text-[8px] text-slate-600 mt-1">{receiptDate}</div>
                  </div>

                  <div className="border-t border-dashed border-black my-1.5" />

                  <div className="space-y-0.5 text-[10px]">
                    <div className="flex justify-between">
                      <span>Pelanggan:</span>
                      <span>{customerName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ID Perangkat:</span>
                      <span className="font-bold">
                        {activationMode === 'online' ? 'ONLINE (OTOMATIS)' : (deviceId || '-')}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-black my-1.5" />

                  <div className="space-y-0.5 text-[10px]">
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
                  <div className="bg-slate-100 border border-slate-300 py-1.5 px-2 text-center my-1.5 rounded">
                    <span className="text-[8px] text-slate-600 uppercase tracking-wide block mb-0.5">
                      KODE AKTIVASI LISENSI
                    </span>
                    <span className="text-xs font-bold font-mono tracking-wide block break-all text-black">
                      {licenseKey || 'NUANSA-PRO-XXXXX-XXXXX-XXXXX'}
                    </span>
                  </div>

                  {/* QR Code Container (2-Column Table for html2canvas & print stability) */}
                  {licenseKey && (
                    <table className="w-full mt-3 mb-2 text-left" style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td className="align-middle pr-1.5" style={{ width: '62%', verticalAlign: 'middle' }}>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] font-bold tracking-wider uppercase">
                                QR DOWNLOAD APLIKASI
                              </span>
                              <span className="text-[7px] leading-tight text-slate-700">
                                Pindai untuk unduh file APK NuansaPOS.
                              </span>
                              <div className="text-[7px] leading-tight mt-0.5">
                                <span className="block font-bold">Gagal pindai? Unduh manual:</span>
                                <span className="font-mono break-all block mt-0.5 select-all text-slate-700 leading-normal">
                                  https://drive.google.com/drive/folders/17lz4xdSkDQVvDkdp7ukHRVN8g-S7WaDu?usp=drive_link
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle text-right" style={{ width: '38%', verticalAlign: 'middle', textAlign: 'right' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={apkQrImage.src}
                              alt="Download APK QR Code"
                              className="w-24 h-24 border border-black/30 p-1 bg-white object-contain inline-block"
                              style={{ width: '96px', height: '96px', minWidth: '96px', minHeight: '96px' }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  <div className="border-t border-dashed border-black my-1.5" />
                </div>

                <div className="text-center text-[8px] text-slate-700 pt-1">
                  <div>Terima kasih atas pembelian lisensi resmi.</div>
                  <div className="font-bold mt-1">NUANSAPOS MANAGEMENT</div>
                  <div className="mt-0.5">Simpan resi ini sebagai bukti resmi kepemilikan.</div>
                </div>

                {/* Jagged Edge Simulation Bottom (Hidden on Print) */}
                <div className="absolute bottom-0 inset-x-0 h-2.5 bg-repeat-x pointer-events-none print:hidden"
                  style={{
                    backgroundImage: `linear-gradient(-45deg, transparent 5px, #F8FAFC 0), linear-gradient(45deg, transparent 5px, #F8FAFC 0)`,
                    backgroundSize: '10px 10px'
                  }}
                />
            </div>
          </div>

          {/* Dokumentasi/Panduan Ketentuan Sistem Lisensi (Full Width) */}
            <div className="lg:col-span-12 print:hidden mt-4">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60">
                  <ShieldCheck className="w-5 h-5 text-brand" />
                  <div>
                    <h3 className="font-display font-semibold text-base text-slate-900">
                      Panduan & Syarat Ketentuan Sistem Lisensi NuansaPos
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Informasi penting bagi administrator mengenai cara kerja, pembatasan perangkat, dan keamanan data.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-700 text-xs">
                  {/* Poin 1 */}
                  <div className="space-y-2 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <span className="text-brand font-bold text-[11px] uppercase block tracking-wider">
                      1. Deteksi ID Otomatis
                    </span>
                    <p className="leading-relaxed text-[11px] text-slate-655">
                      ID Perangkat Android (<code className="font-mono text-brand bg-brand/5 px-1 rounded text-[10px]">ANDROID_ID</code>) akan terdeteksi secara otomatis 100% di latar belakang saat pelanggan mengklik tombol <strong>&quot;Aktifkan&quot;</strong> di HP mereka.
                    </p>
                    <p className="leading-relaxed text-[11px] text-slate-655">
                      ID tersebut langsung dikirimkan bersama lisensi ke server API Next.js untuk dicatat ke database Supabase. <strong>Pelanggan tidak perlu menyalin atau mengetik ID perangkat mereka sendiri.</strong>
                    </p>
                  </div>

                  {/* Poin 2 */}
                  <div className="space-y-2 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <span className="text-brand font-bold text-[11px] uppercase block tracking-wider">
                      2. Batasan Kuota &amp; Sharing
                    </span>
                    <p className="leading-relaxed text-[11px] text-slate-655">
                      Lisensi dibatasi secara ketat berdasarkan tier paket yang dibeli pelanggan:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[10px] text-slate-500">
                      <li><strong>BASIC (BSC)</strong>: Maksimal <strong>1 HP</strong>. HP berikutnya akan langsung ditolak oleh server.</li>
                      <li><strong>PRO &amp; PREMIUM (PRO/PRM)</strong>: Maksimal <strong>3 HP</strong>. HP ke-4 akan otomatis diblokir.</li>
                      <li><strong>Reinstall</strong>: Jika pelanggan menginstal ulang aplikasi pada HP yang sama, kuota perangkat tidak akan bertambah/berkurang karena ID perangkat sudah terdaftar sebelumnya.</li>
                    </ul>
                  </div>

                  {/* Poin 3 */}
                  <div className="space-y-2 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <span className="text-brand font-bold text-[11px] uppercase block tracking-wider">
                      3. Keamanan Online vs Offline
                    </span>
                    <p className="leading-relaxed text-[11px] text-slate-655">
                      <strong>Online (Supabase)</strong> jauh lebih aman secara keseluruhan karena logika pembatasan diatur di sisi server kita (cloud) dan tidak bisa diretas dari HP pembeli.
                    </p>
                    <p className="leading-relaxed text-[11px] text-slate-655">
                      <strong>Offline (Cadangan)</strong> tetap disediakan sebagai backup darurat jika pembeli menggunakan HP kasir jadul yang sama sekali tidak memiliki koneksi internet.
                    </p>
                  </div>
                </div>

                {/* Perbandingan Detail Table */}
                <div className="border border-slate-200/60 rounded-2xl overflow-hidden bg-white text-xs">
                  <div className="bg-slate-50 py-2.5 px-4 font-bold text-slate-800 border-b border-slate-200/60 flex items-center gap-1.5">
                    Tabel Perbandingan Metode Lisensi
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-50/30 border-b border-slate-200/60 text-slate-500">
                          <th className="py-2 px-4 font-semibold">Fitur / Parameter</th>
                          <th className="py-2 px-4 font-semibold text-brand">Metode Online (Supabase)</th>
                          <th className="py-2 px-4 font-semibold text-slate-600">Metode Manual (Offline)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-800">Keamanan dari Pembajakan</td>
                          <td className="py-2.5 px-4 text-slate-600"><strong>Sangat Aman (Sempurna)</strong>. Kontrol kuota ada di database server kita yang tidak bisa diakses/diubah oleh pelanggan.</td>
                          <td className="py-2.5 px-4 text-slate-600"><strong>Cukup Aman</strong>, tetapi jika pembajak berhasil membongkar file APK dan menemukan Kunci Rahasia, mereka bisa membuat generator kunci palsu sendiri.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-800">Kemudahan Penggunaan (UX)</td>
                          <td className="py-2.5 px-4 text-slate-600"><strong>Sangat Praktis</strong>. Pembeli cukup memasukkan lisensi, semuanya beres otomatis.</td>
                          <td className="py-2.5 px-4 text-slate-600"><strong>Merepotkan</strong>. Pembeli harus mencari ID perangkat, mengirimkannya ke admin, lalu admin men-generate kunci khusus untuk HP tersebut.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-800">Ketergantungan Internet</td>
                          <td className="py-2.5 px-4 text-slate-600">Butuh internet <strong>hanya 1x saat aktivasi pertama</strong>. Setelah aktif, aplikasi berjalan 100% offline selamanya.</td>
                          <td className="py-2.5 px-4 text-slate-600"><strong>100% Offline</strong> sejak awal, tidak butuh koneksi internet sama sekali.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-800">Kontrol Admin</td>
                          <td className="py-2.5 px-4 text-slate-600"><strong>Penuh</strong>. Kakak bisa membatalkan lisensi atau me-reset kuota (jika pembeli ganti HP baru) langsung dari Web Dashboard.</td>
                          <td className="py-2.5 px-4 text-slate-600"><strong>Tidak ada</strong>. Sekali kunci offline diberikan, lisensi tersebut aktif selamanya di HP tersebut dan tidak bisa dicabut/diubah dari jauh.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
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
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60">
                <Search className="w-5 h-5 text-brand" />
                <h2 className="font-display font-semibold text-lg text-slate-900">Dekode & Verifikasi Lisensi</h2>
              </div>

              <div className="space-y-4">
                {/* License Key Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Masukkan Kunci Lisensi (Full)
                  </label>
                  <input
                    type="text"
                    value={decodeKey}
                    onChange={(e) => setDecodeKey(e.target.value)}
                    placeholder="Contoh: NUANSA-PRO-XXXXX-XXXXX-XXXXX"
                    className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-brand text-sm uppercase"
                  />
                </div>

                {/* Device ID Input for signature check */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    ID Perangkat Terkait (Opsional, untuk Cek Validasi Kunci)
                  </label>
                  <input
                    type="text"
                    value={decodeDeviceId}
                    onChange={(e) => setDecodeDeviceId(e.target.value)}
                    placeholder="Contoh: a1b2c3d4e5f6a7b8"
                    className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-brand text-sm uppercase"
                  />
                </div>

                {/* Action button */}
                <button
                  onClick={handleDecode}
                  className="w-full bg-brand hover:bg-brand-dark text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-brand/20"
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
                        ? 'border-emerald-200 bg-emerald-50/50' 
                        : decodeResult.formatOk 
                          ? 'border-amber-200 bg-amber-50/50' 
                          : 'border-red-200 bg-red-50/50'
                    }`}>
                      <div className="flex items-center gap-3">
                        {decodeResult.valid ? (
                          <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <ShieldAlert className={`w-6 h-6 flex-shrink-0 ${
                            decodeResult.formatOk ? 'text-amber-600' : 'text-red-650'
                          }`} />
                        )}
                        <span className="font-semibold text-sm text-slate-900">
                          Status Hasil Analisis
                        </span>
                      </div>

                      <div className="space-y-2 text-xs font-body text-slate-700">
                        {decodeResult.tier && (
                          <div className="flex justify-between border-b border-slate-200/60 py-1">
                            <span className="text-slate-500">Deteksi Paket:</span>
                            <span className="font-bold text-slate-900">{decodeResult.tier}</span>
                          </div>
                        )}
                        {decodeResult.deviceId && (
                          <div className="flex justify-between border-b border-slate-200/60 py-1">
                            <span className="text-slate-400">ID Perangkat:</span>
                            <span className="font-mono text-slate-900">{decodeResult.deviceId}</span>
                          </div>
                        )}
                        <p className="mt-2 text-xs leading-relaxed leading-normal text-slate-600">
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

        {/* TAB 3: DAFTAR LISENSI ONLINE */}
        {activeTab === 'manager' && (
          <div className="lg:col-span-12 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-brand" />
                  <div>
                    <h2 className="font-display font-semibold text-lg text-slate-900">Kelola Lisensi Online</h2>
                    <p className="text-[11px] text-slate-500">Mencatat, membatasi, dan mengelola perangkat terdaftar.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari lisensi, toko, pelanggan..."
                      value={licensesSearch}
                      onChange={(e) => setLicensesSearch(e.target.value)}
                      className="bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand w-64 text-slate-800"
                    />
                  </div>
                  <button
                    onClick={fetchLicenses}
                    className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors"
                    title="Segarkan data"
                  >
                    <RefreshCw className={`w-4 h-4 text-slate-650 ${isLicensesLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {licensesError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-650" />
                  <div>
                    <p className="font-bold text-sm">Gagal memuat lisensi</p>
                    <p className="text-xs leading-relaxed text-slate-705">{licensesError}</p>
                  </div>
                </div>
              )}

              {isLicensesLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-brand rounded-full animate-spin" />
                  <span className="text-xs">Memuat data dari database Supabase...</span>
                </div>
              ) : (
                <>
                  {/* Filtered licenses list */}
                  {(() => {
                    const filtered = licenses.filter((lic) => {
                      const search = licensesSearch.toLowerCase();
                      return (
                        lic.licenseKey.toLowerCase().includes(search) ||
                        lic.businessName.toLowerCase().includes(search) ||
                        lic.customerName.toLowerCase().includes(search) ||
                        lic.tier.toLowerCase().includes(search)
                      );
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-12 space-y-2 text-slate-400">
                          <Database className="w-12 h-12 mx-auto text-slate-350 stroke-1" />
                          <p className="text-sm font-semibold">Tidak ada lisensi ditemukan</p>
                          <p className="text-xs max-w-xs mx-auto">
                            {licensesSearch 
                              ? 'Silakan coba masukkan kata kunci pencarian yang lain.' 
                              : 'Silakan masuk ke tab Generator untuk mencetak dan mendaftarkan lisensi pertama Anda.'}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map((lic) => (
                          <div 
                            key={lic.id} 
                            className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              {/* Header Card */}
                              <div className="flex items-start justify-between">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                                  lic.tier === 'BSC' 
                                    ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                                    : lic.tier === 'PRO' 
                                      ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                                }`}>
                                  {lic.tier === 'BSC' ? 'Basic' : lic.tier === 'PRO' ? 'Pro Suite' : 'Premium'}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {new Date(lic.createdAt).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>

                              {/* License Key Code */}
                              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 font-mono text-xs text-slate-800">
                                <span className="font-bold select-all tracking-wide">{lic.licenseKey}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(lic.licenseKey);
                                    alert('Kunci lisensi berhasil disalin!');
                                  }}
                                  className="text-slate-400 hover:text-slate-650 p-1"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Metadata */}
                              <div className="grid grid-cols-2 gap-2 text-xs leading-normal">
                                <div>
                                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Nama Toko</span>
                                  <span className="text-slate-800 font-semibold">{lic.businessName || '-'}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Pelanggan</span>
                                  <span className="text-slate-800 font-semibold">{lic.customerName || '-'}</span>
                                </div>
                              </div>

                              {/* Activation Tracker */}
                              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                <div className="flex justify-between text-xs font-semibold text-slate-700">
                                  <span>Perangkat Aktif:</span>
                                  <span>{lic.activatedDevicesCount} / {lic.maxDevices} HP</span>
                                </div>
                                {/* Bar */}
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all ${
                                      lic.activatedDevicesCount >= lic.maxDevices 
                                        ? 'bg-amber-500' 
                                        : 'bg-brand'
                                    }`}
                                    style={{ width: `${Math.min(100, (lic.activatedDevicesCount / lic.maxDevices) * 100)}%` }}
                                  />
                                </div>

                                {/* Active Device ID List */}
                                {lic.devices.length > 0 && (
                                  <div className="bg-slate-50/70 rounded-xl p-2.5 mt-2 space-y-1 text-[10px] font-mono text-slate-600 border border-slate-100">
                                    <span className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Daftar ID Perangkat:</span>
                                    {lic.devices.map((dev: any) => (
                                      <div key={dev.deviceId} className="flex justify-between border-b border-slate-100/50 last:border-0 py-0.5">
                                        <span className="font-semibold text-slate-700">{dev.deviceId}</span>
                                        <span className="text-[8px] text-slate-400">
                                          {new Date(dev.activatedAt).toLocaleDateString('id-ID', {
                                            month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="flex gap-2 pt-4 border-t border-slate-100/80">
                              <button
                                onClick={() => handleResetActivations(lic.id)}
                                disabled={lic.activatedDevicesCount === 0}
                                className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-750 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                                Reset Perangkat
                              </button>
                              <button
                                onClick={() => handleDeleteLicense(lic.id)}
                                className="p-2 border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl transition-colors"
                                title="Cabut/Hapus Lisensi"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </>
              )}
            </motion.div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="lg:col-span-12 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-brand" />
                  <div>
                    <h2 className="font-display font-semibold text-lg text-slate-900">Pesanan Pembelian</h2>
                    <p className="text-[11px] text-slate-500">Riwayat transaksi lisensi via Midtrans dari landing page.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama, email, no order..."
                      value={ordersSearch}
                      onChange={(e) => setOrdersSearch(e.target.value)}
                      className="bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand w-64 text-slate-800"
                    />
                  </div>
                  <button
                    onClick={fetchOrders}
                    className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors"
                    title="Segarkan data"
                  >
                    <RefreshCw className={`w-4 h-4 text-slate-650 ${isOrdersLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {ordersError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-650" />
                  <div>
                    <p className="font-bold text-sm">Gagal memuat pesanan</p>
                    <p className="text-xs leading-relaxed text-slate-705">{ordersError}</p>
                  </div>
                </div>
              )}

              {isOrdersLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-brand rounded-full animate-spin" />
                  <span className="text-xs">Memuat data dari database Supabase...</span>
                </div>
              ) : (
                (() => {
                  const filtered = orders.filter((order) => {
                    const search = ordersSearch.toLowerCase();
                    return (
                      order.midtransOrderId.toLowerCase().includes(search) ||
                      order.customerName.toLowerCase().includes(search) ||
                      order.customerEmail.toLowerCase().includes(search) ||
                      order.customerWhatsapp.toLowerCase().includes(search)
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-12 space-y-2 text-slate-400">
                        <FileText className="w-12 h-12 mx-auto text-slate-350 stroke-1" />
                        <p className="text-sm font-semibold">Belum ada pesanan</p>
                        <p className="text-xs max-w-xs mx-auto">
                          {ordersSearch
                            ? 'Silakan coba masukkan kata kunci pencarian yang lain.'
                            : 'Pesanan akan muncul di sini setelah ada pelanggan yang membeli dari landing page.'}
                        </p>
                      </div>
                    );
                  }

                  const statusBadge = (status: string) => {
                    const map: Record<string, string> = {
                      paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                      pending: 'bg-amber-50 text-amber-700 border-amber-100',
                      failed: 'bg-red-50 text-red-700 border-red-100',
                      cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
                      expired: 'bg-slate-100 text-slate-600 border-slate-200',
                    };
                    return map[status] || map.pending;
                  };

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filtered.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:shadow-md transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border ${statusBadge(order.paymentStatus)}`}>
                              {order.paymentStatus}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                year: 'numeric', month: 'short', day: 'numeric',
                              })}
                            </span>
                          </div>

                          <div className="font-mono text-[11px] text-slate-500">{order.midtransOrderId}</div>

                          <div className="grid grid-cols-2 gap-2 text-xs leading-normal">
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Pelanggan</span>
                              <span className="text-slate-800 font-semibold">{order.customerName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Paket</span>
                              <span className="text-slate-800 font-semibold">
                                {order.tier === 'BSC' ? 'Basic' : order.tier === 'PRO' ? 'Pro' : 'Premium'} — {formatRupiah(order.price)}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Email</span>
                              <span className="text-slate-700">{order.customerEmail}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">WhatsApp</span>
                              <span className="text-slate-700">{order.customerWhatsapp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
              )}
            </motion.div>
          </div>
        )}

        {/* TAB 5: GENERATOR LISENSI RESELLER (BULK) */}
        {activeTab === 'reseller-gen' && (
          <div className="lg:col-span-12 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60">
                <Building className="w-5 h-5 text-brand" />
                <div>
                  <h2 className="font-display font-semibold text-lg text-slate-900">Generator Lisensi Reseller (Bulk)</h2>
                  <p className="text-[11px] text-slate-500">Menerbitkan lisensi PRO massal secara instan untuk mitra reseller.</p>
                </div>
              </div>

              {/* Form Input */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">Nama Reseller / Pelanggan</label>
                  <input
                    type="text"
                    value={resellerCustomerName}
                    onChange={(e) => setResellerCustomerName(e.target.value)}
                    placeholder="Contoh: Abdul Hamid"
                    className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">Nama Bisnis / Kemitraan</label>
                  <input
                    type="text"
                    value={resellerBusinessName}
                    onChange={(e) => setResellerBusinessName(e.target.value)}
                    placeholder="Contoh: Mitra Reseller Kalimantan"
                    className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">Jumlah Lisensi PRO</label>
                  <select
                    value={resellerQty}
                    onChange={(e) => setResellerQty(parseInt(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-brand"
                  >
                    <option value={50}>50 Lisensi (Paket 6 Juta)</option>
                    <option value={100}>100 Lisensi (Paket 11 Juta)</option>
                    <option value={500}>500 Lisensi (Paket 40 Juta)</option>
                    <option value={1000}>1000 Lisensi (Paket 60 Juta)</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateReseller}
                disabled={isGeneratingReseller}
                className="w-full bg-brand hover:bg-brand-dark text-white rounded-xl py-3.5 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-brand/20 disabled:opacity-50"
              >
                {isGeneratingReseller ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Generate & Daftarkan Lisensi Reseller</span>
                  </>
                )}
              </button>

              {/* Action & Result Section */}
              {generatedResellerLicenses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 pt-4 border-t border-slate-200/60"
                >
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-emerald-800">
                        Berhasil Menerbitkan {generatedResellerLicenses.length} Lisensi!
                      </h4>
                      <p className="text-xs text-emerald-600 leading-relaxed mt-0.5">
                        Semua lisensi aktif (PRO, 3 HP) telah terdaftar di database Supabase atas nama {resellerCustomerName}.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleCopyAllReseller}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedAll ? 'Tersalin!' : 'Salin Semua'}
                      </button>
                      <button
                        onClick={handleDownloadResellerExcel}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        Excel
                      </button>
                      <button
                        onClick={handleDownloadResellerCSV}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        CSV
                      </button>
                      <button
                        onClick={handleDownloadResellerPDF}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5 text-red-650" />
                        PDF
                      </button>
                    </div>
                  </div>

                  {/* Form Kirim WhatsApp */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Kirim Kode Lisensi ke WhatsApp Reseller</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          placeholder="Masukkan No WA (contoh: 08123456789 atau 628123456789)"
                          className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-brand"
                        />
                      </div>
                      <button
                        onClick={handleSendResellerWhatsApp}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5"
                      >
                        <span>Kirim via WhatsApp</span>
                      </button>
                    </div>
                    {generatedResellerLicenses.length > 100 && (
                      <p className="text-[10px] text-amber-600 leading-relaxed font-semibold">
                        ⚠️ Perhatian: Jumlah lisensi sangat banyak ({generatedResellerLicenses.length} lisensi). WhatsApp membatasi panjang teks pesan. Sangat disarankan untuk mengunduh Excel/PDF di atas dan mengirimkannya sebagai file lampiran.
                      </p>
                    )}
                  </div>

                  {/* List / Searchable Table of licenses */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Daftar Lisensi Yang Baru Dibuat</h4>
                      <input
                        type="text"
                        placeholder="Cari kode..."
                        value={resellerSearch}
                        onChange={(e) => setResellerSearch(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-brand w-48 text-slate-850"
                      />
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white max-h-[400px] overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <th className="py-2.5 px-4 w-12">No</th>
                            <th className="py-2.5 px-4">Kode Lisensi</th>
                            <th className="py-2.5 px-4">Tipe</th>
                            <th className="py-2.5 px-4 w-16 text-center">Salin</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {generatedResellerLicenses
                            .filter(lic => lic.toLowerCase().includes(resellerSearch.toLowerCase()))
                            .map((lic, index) => (
                              <tr key={lic} className="hover:bg-slate-50">
                                <td className="py-2 px-4 text-slate-500">{index + 1}</td>
                                <td className="py-2 px-4 font-bold text-slate-800 select-all">{lic}</td>
                                <td className="py-2 px-4 text-slate-600 font-sans">PRO (3 HP)</td>
                                <td className="py-2 px-4 text-center">
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(lic);
                                      setCopiedResellerIndex(index);
                                      setTimeout(() => setCopiedResellerIndex(null), 2000);
                                    }}
                                    className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors"
                                  >
                                    {copiedResellerIndex === index ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600 inline" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 inline" />
                                    )}
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}

        {/* TAB 6: TRACKING MITRA RESELLER */}
        {activeTab === 'reseller-track' && (
          <div className="lg:col-span-12 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-brand" />
                  <div>
                    <h2 className="font-display font-semibold text-lg text-slate-900">Tracking Kemitraan Reseller</h2>
                    <p className="text-[11px] text-slate-500">Monitoring data lisensi aktif, kuota penjualan, dan detail pemanfaatan kunci oleh mitra reseller.</p>
                  </div>
                </div>
                <button
                  onClick={fetchLicenses}
                  disabled={isLicensesLoading}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl border border-slate-200/50 flex items-center justify-center transition-all disabled:opacity-50"
                  title="Segarkan data"
                >
                  <RefreshCw className={`w-4 h-4 ${isLicensesLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Statistics Cards */}
              {(() => {
                const list = getResellersList();
                const totalResellers = list.length;
                const totalLicenses = list.reduce((sum, r) => sum + r.totalLicenses, 0);
                const totalActive = list.reduce((sum, r) => sum + r.activeLicenses, 0);
                const avgActivePct = totalLicenses > 0 ? Math.round((totalActive / totalLicenses) * 100) : 0;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Total Reseller</span>
                        <span className="font-display font-bold text-sm md:text-base text-slate-900 block mt-0.5">{totalResellers} Mitra</span>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center text-brand">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Total Lisensi Beli</span>
                        <span className="font-display font-bold text-sm md:text-base text-slate-900 block mt-0.5">{totalLicenses} Keys</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Lisensi Terpakai</span>
                        <span className="font-display font-bold text-sm md:text-base text-emerald-600 block mt-0.5">{totalActive} Active</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-650">
                        <Percent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Rasio Aktivasi</span>
                        <span className="font-display font-bold text-sm md:text-base text-purple-600 block mt-0.5">{avgActivePct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Search Control */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Daftar Mitra Reseller</h4>
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Cari reseller atau nama bisnis..."
                    value={resellerTrackSearch}
                    onChange={(e) => setResellerTrackSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 pl-10 text-xs focus:outline-none focus:border-brand text-slate-850"
                  />
                </div>
              </div>

              {/* Reseller Main Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="py-3 px-4 w-12 text-center">No</th>
                      <th className="py-3 px-4">Nama Reseller</th>
                      <th className="py-3 px-4">Nama Bisnis / Kelompok</th>
                      <th className="py-3 px-4 text-center">Total Beli</th>
                      <th className="py-3 px-4 text-center">Terpakai (Aktif)</th>
                      <th className="py-3 px-4 text-center">Sisa Stok</th>
                      <th className="py-3 px-4">Persentase Aktif</th>
                      <th className="py-3 px-4 text-center">Tanggal Join</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const filteredResellers = getResellersList().filter(
                        (r) =>
                          r.customerName.toLowerCase().includes(resellerTrackSearch.toLowerCase()) ||
                          r.businessName.toLowerCase().includes(resellerTrackSearch.toLowerCase())
                      );

                      if (filteredResellers.length === 0) {
                        return (
                          <tr>
                            <td colSpan={9} className="py-8 text-center text-slate-400">
                              Tidak ada data reseller ditemukan.
                            </td>
                          </tr>
                        );
                      }

                      return filteredResellers.map((reseller, index) => {
                        const unused = reseller.totalLicenses - reseller.activeLicenses;
                        const pct = reseller.totalLicenses > 0 
                          ? Math.round((reseller.activeLicenses / reseller.totalLicenses) * 100)
                          : 0;

                        return (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-slate-500 text-center">{index + 1}</td>
                            <td className="py-3 px-4 font-bold text-slate-800">{reseller.customerName}</td>
                            <td className="py-3 px-4 text-slate-600 font-semibold">{reseller.businessName}</td>
                            <td className="py-3 px-4 text-center font-bold text-slate-800">{reseller.totalLicenses}</td>
                            <td className="py-3 px-4 text-center text-emerald-600 font-bold">{reseller.activeLicenses}</td>
                            <td className="py-3 px-4 text-center text-amber-600 font-bold">{unused}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-brand h-full rounded-full" 
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="font-bold text-[10px] text-slate-600">{pct}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center font-sans text-slate-500">
                              {reseller.joinDate.toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => setSelectedResellerGroup(reseller)}
                                className="bg-brand/5 hover:bg-brand text-brand hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm"
                              >
                                Detail Keys
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

      {/* DETAIL MODAL FOR RESELLER KEYS */}
      <AnimatePresence>
        {selectedResellerGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100"
            >
              {/* Header */}
              <div className="bg-slate-50 px-6 py-5 border-b border-slate-200/60 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Lisensi: {selectedResellerGroup.customerName}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    Kelompok/Usaha: <span className="text-brand">{selectedResellerGroup.businessName}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedResellerGroup(null)}
                  className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subheader / Summary Stats */}
              <div className="bg-white px-6 py-4 border-b border-slate-100 flex flex-wrap gap-6 items-center shrink-0 text-xs">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Total Lisensi</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedResellerGroup.totalLicenses} Keys</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Lisensi Aktif</span>
                  <span className="font-bold text-emerald-600 text-sm">{selectedResellerGroup.activeLicenses} Active</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Tersedia (Sisa)</span>
                  <span className="font-bold text-amber-600 text-sm">
                    {selectedResellerGroup.totalLicenses - selectedResellerGroup.activeLicenses} Keys
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Persentase Penggunaan</span>
                  <span className="font-bold text-purple-600 text-sm">
                    {selectedResellerGroup.totalLicenses > 0 
                      ? Math.round((selectedResellerGroup.activeLicenses / selectedResellerGroup.totalLicenses) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>

              {/* Body Table */}
              <div className="flex-1 overflow-y-auto p-6 min-h-[250px]">
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0">
                        <th className="py-2.5 px-4 w-12 text-center">No</th>
                        <th className="py-2.5 px-4">Kode Lisensi</th>
                        <th className="py-2.5 px-4 text-center">Tipe</th>
                        <th className="py-2.5 px-4 text-center">Batas Perangkat</th>
                        <th className="py-2.5 px-4 text-center">Status</th>
                        <th className="py-2.5 px-4">Detail Perangkat Terdaftar</th>
                        <th className="py-2.5 px-4 w-16 text-center">Salin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {selectedResellerGroup.licenses.map((lic: any, idx: number) => {
                        const isActive = lic.activatedDevicesCount > 0;
                        return (
                          <tr key={lic.id} className="hover:bg-slate-50 text-[11px]">
                            <td className="py-2.5 px-4 text-slate-500 text-center">{idx + 1}</td>
                            <td className="py-2.5 px-4 font-bold text-slate-800 select-all">{lic.licenseKey}</td>
                            <td className="py-2.5 px-4 text-center text-slate-600 font-sans">PRO</td>
                            <td className="py-2.5 px-4 text-center text-slate-600 font-sans">{lic.maxDevices} HP</td>
                            <td className="py-2.5 px-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-sans border ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}>
                                {isActive ? 'Aktif' : 'Ready'}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 font-sans text-slate-600">
                              {isActive ? (
                                <div className="space-y-1">
                                  {lic.devices.map((dev: any, dIdx: number) => (
                                    <div key={dIdx} className="flex items-center gap-1.5 text-[10px]">
                                      <span className="font-mono bg-slate-100 text-slate-700 px-1 py-0.5 rounded">
                                        {dev.deviceId}
                                      </span>
                                      <span className="text-slate-400">
                                        ({new Date(dev.activatedAt).toLocaleDateString('id-ID', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })})
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400 italic text-[10px]">Belum diaktivasi pelanggan</span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 text-center font-sans">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(lic.licenseKey);
                                  alert('Kode lisensi disalin!');
                                }}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Excel download for specific reseller */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200/60 flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => {
                    const data = selectedResellerGroup.licenses.map((lic: any, index: number) => ({
                      'No': index + 1,
                      'Kode Lisensi': lic.licenseKey,
                      'Tipe': 'PRO',
                      'Maksimal HP': lic.maxDevices,
                      'Status': lic.activatedDevicesCount > 0 ? 'Aktif' : 'Belum Aktif',
                      'Jumlah HP Terdaftar': lic.activatedDevicesCount,
                      'Daftar Device ID': lic.devices.map((d: any) => d.deviceId).join(', ')
                    }));
                    const worksheet = XLSX.utils.json_to_sheet(data);
                    worksheet['!cols'] = [
                      { wch: 6 },   // No
                      { wch: 35 },  // Kode Lisensi
                      { wch: 10 },  // Tipe
                      { wch: 15 },  // Maksimal HP
                      { wch: 15 },  // Status
                      { wch: 20 },  // Jumlah HP Terdaftar
                      { wch: 35 }   // Daftar Device ID
                    ];
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lisensi Reseller');
                    XLSX.writeFile(workbook, `lisensi-reseller-${selectedResellerGroup.customerName.replace(/\s+/g, '_')}.xlsx`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Unduh Excel (.xlsx)
                </button>
                <button
                  onClick={() => setSelectedResellerGroup(null)}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
