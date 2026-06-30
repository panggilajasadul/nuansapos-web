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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
