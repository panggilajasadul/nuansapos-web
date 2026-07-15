import nodemailer from 'nodemailer';
import { PACKAGES, type PackageTier } from './packages';
import { SITE_CONFIG } from './constants';

// Lazy init - jangan instansiasi di module scope, supaya proses build tidak gagal
// saat BREVO_SMTP_PASSWORD belum diisi (mis. sebelum env var dikonfigurasi di Netlify).
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: Number(process.env.BREVO_SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_LOGIN,
      pass: process.env.BREVO_SMTP_PASSWORD,
    },
  });
}

export async function sendLicenseEmail(params: {
  to: string;
  customerName: string;
  licenseKey: string;
  tier: PackageTier;
  businessName?: string;
}) {
  const pkg = PACKAGES[params.tier];

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; color: #1e293b;">
      <h2 style="color: #0f172a;">Terima kasih, ${escapeHtml(params.customerName)}!</h2>
      <p>Pembayaran lisensi <strong>NuansaPos ${pkg.name}</strong> kamu sudah berhasil. Berikut kode lisensimu:</p>
      <div style="background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
        <span style="font-family: monospace; font-weight: bold; font-size: 16px; letter-spacing: 1px;">${escapeHtml(params.licenseKey)}</span>
      </div>
      <p><strong>Cara aktivasi:</strong></p>
      <ol>
        <li>Download &amp; buka aplikasi NuansaPos di HP Android kamu</li>
        <li>Buka menu Lisensi / Aktivasi</li>
        <li>Tempel (paste) kode lisensi di atas, lalu aktivasi</li>
      </ol>
      <p>Paket <strong>${pkg.name}</strong> ini bisa diaktivasi di maksimal <strong>${pkg.maxDevices} perangkat</strong>.</p>
      <p style="margin-top: 24px;">
        <a href="${SITE_CONFIG.playStoreUrl}" style="background: #2563eb; color: white; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-weight: 600;">
          Download Aplikasi
        </a>
      </p>
      <p style="margin-top: 24px; font-size: 12px; color: #64748b;">
        Ada pertanyaan? Hubungi kami via WhatsApp atau balas email ini ke ${SITE_CONFIG.email}.
      </p>
    </div>
  `;

  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.BREVO_FROM_EMAIL || `NuansaPos <${SITE_CONFIG.email}>`,
    to: params.to,
    subject: `Lisensi NuansaPos ${pkg.name} Kamu Sudah Aktif`,
    html,
  });
}

export async function sendResellerLicenseEmail(params: {
  to: string;
  customerName: string;
  resellerPackageId: string;
  qty: number;
  licenseKeys: string[];
  excelBuffer: Buffer;
}) {
  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 550px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
      <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Selamat bergabung sebagai Reseller NuansaPos! 🤝</h2>
      <p>Halo <strong>${escapeHtml(params.customerName)}</strong>,</p>
      <p>Pembayaran untuk pembelian paket kemitraan reseller <strong>NuansaPos ${escapeHtml(params.resellerPackageId)}</strong> (${params.qty} Lisensi PRO) telah berhasil kami terima.</p>
      
      <p>Sebagai mitra reseller, Anda mendapatkan <strong>${params.qty} Lisensi PRO</strong> seumur hidup (lifetime) yang masing-masing dapat diaktifkan pada 3 perangkat Android.</p>
      
      <p>Kami telah melampirkan file Excel resmi yang berisi daftar lengkap kode lisensi Anda. Silakan simpan file ini dengan baik untuk mempermudah penjualan ke UMKM pelanggan Anda.</p>
      
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #0f172a; font-size: 14px;">Ringkasan Pembelian:</h4>
        <table style="width: 100%; font-size: 13px; color: #475569;">
          <tr>
            <td style="padding: 4px 0;">Paket Reseller:</td>
            <td style="text-align: right; font-weight: bold; color: #0f172a;">NuansaPos ${escapeHtml(params.resellerPackageId)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Jumlah Lisensi:</td>
            <td style="text-align: right; font-weight: bold; color: #0f172a;">${params.qty} Lisensi PRO</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Maksimal Perangkat/Lisensi:</td>
            <td style="text-align: right; font-weight: bold; color: #0f172a;">3 HP / Perangkat</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Status Pembayaran:</td>
            <td style="text-align: right; font-weight: bold; color: #10b981;">LUNAS (Midtrans)</td>
          </tr>
        </table>
      </div>

      <p><strong>Cara Menjual & Mengaktifkan Lisensi Ke Pelanggan:</strong></p>
      <ol style="padding-left: 20px; font-size: 13px; color: #334155;">
        <li style="margin-bottom: 8px;">Berikan salah satu kode lisensi dari file Excel terlampir kepada pelanggan Anda.</li>
        <li style="margin-bottom: 8px;">Minta pelanggan untuk mengunduh aplikasi NuansaPos melalui Google Play Store.</li>
        <li style="margin-bottom: 8px;">Di dalam aplikasi, arahkan pelanggan ke menu <strong>Lisensi / Aktivasi</strong> lalu masukkan kode tersebut.</li>
      </ol>

      <p style="margin-top: 30px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px;">
        File Excel terlampir bernama <code>Lisensi_NuansaPos_${params.resellerPackageId}_${new Date().toISOString().split('T')[0]}.xlsx</code>. 
        Jika ada kendala dalam akses lisensi, silakan balas email ini atau hubungi tim bantuan kami.
      </p>
    </div>
  `;

  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.BREVO_FROM_EMAIL || `NuansaPos <${SITE_CONFIG.email}>`,
    to: params.to,
    subject: `[Mitra Reseller] Pembelian Paket ${params.qty} Lisensi NuansaPos Berhasil`,
    html,
    attachments: [
      {
        filename: `Lisensi_NuansaPos_${params.resellerPackageId}_${new Date().toISOString().split('T')[0]}.xlsx`,
        content: params.excelBuffer,
      }
    ]
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
