import { NextResponse } from 'next/server';
import crypto from 'crypto';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';
import { verifyNotificationSignature } from '@/lib/midtrans';
import { sendLicenseEmail, sendResellerLicenseEmail } from '@/lib/email';
import { getPackageDetails, type PackageTier } from '@/lib/packages';

const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function generateOnlineLicenseKey(tier: PackageTier): string {
  const bytes = crypto.randomBytes(15);
  let token = '';
  for (let i = 0; i < 15; i++) {
    token += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `NUANSA-${tier}-${token.substring(0, 5)}-${token.substring(5, 10)}-${token.substring(10, 15)}`;
}

export async function POST(request: Request) {
  try {
    const notif = await request.json();
    const { order_id, status_code, gross_amount, transaction_status, fraud_status, transaction_id } = notif;

    if (!order_id || !status_code || !gross_amount || !notif.signature_key) {
      return NextResponse.json({ message: 'Notifikasi tidak lengkap' }, { status: 400 });
    }

    // 1. Verifikasi signature - gerbang keamanan utama sebelum menyentuh database.
    const isValid = verifyNotificationSignature({
      order_id,
      status_code,
      gross_amount,
      signature_key: notif.signature_key,
    });
    if (!isValid) {
      console.warn('Invalid Midtrans webhook signature for order:', order_id);
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    // 2. Cari order terkait.
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('midtrans_order_id', order_id)
      .maybeSingle();

    if (orderError) throw new Error(orderError.message);
    if (!order) {
      // Midtrans mewajibkan respons 200 untuk notifikasi apa pun (termasuk ping test dari
      // dashboard yang pakai order_id fiktif) - balas non-200 bikin endpoint dianggap mati.
      console.warn('Webhook menerima order_id yang tidak dikenal (diabaikan):', order_id);
      return NextResponse.json({ message: 'Order tidak ditemukan, diabaikan' }, { status: 200 });
    }

    // 3. Idempotency - jangan proses ulang order yang sudah paid.
    if (order.payment_status === 'paid') {
      return NextResponse.json({ message: 'Order sudah diproses sebelumnya' }, { status: 200 });
    }

    // 4. Map status Midtrans -> status internal.
    let newStatus: string | null = null;
    if (transaction_status === 'capture') {
      newStatus = fraud_status === 'accept' ? 'paid' : 'pending';
    } else if (transaction_status === 'settlement') {
      newStatus = 'paid';
    } else if (transaction_status === 'pending') {
      newStatus = 'pending';
    } else if (transaction_status === 'deny') {
      newStatus = 'failed';
    } else if (transaction_status === 'cancel') {
      newStatus = 'cancelled';
    } else if (transaction_status === 'expire') {
      newStatus = 'expired';
    }

    if (!newStatus) {
      return NextResponse.json({ message: 'Status transaksi tidak dikenali, diabaikan' }, { status: 200 });
    }

    if (newStatus !== 'paid') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ payment_status: newStatus, midtrans_transaction_id: transaction_id, updated_at: new Date().toISOString() })
        .eq('id', order.id)
        .neq('payment_status', 'paid');
      if (updateError) throw new Error(updateError.message);
      return NextResponse.json({ message: `Order diperbarui ke status ${newStatus}` }, { status: 200 });
    }

    // 5. Pembayaran sukses - generate lisensi online (conditional update mencegah race condition
    //    jika dua notifikasi datang nyaris bersamaan).
    const { data: claimedOrders, error: claimError } = await supabase
      .from('orders')
      .update({ payment_status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', order.id)
      .neq('payment_status', 'paid')
      .select('*');

    if (claimError) throw new Error(claimError.message);
    if (!claimedOrders || claimedOrders.length === 0) {
      // Order lain sudah lebih dulu menandai paid - tidak perlu proses ulang.
      return NextResponse.json({ message: 'Order sudah diproses oleh notifikasi lain' }, { status: 200 });
    }

    const isReseller = order.business_type === 'reseller';

    if (isReseller) {
      // Reseller flow: generate multiple licenses, write Excel file, and attach it to the email
      const resellerPkg = getPackageDetails(order.business_name || '');
      const qty = resellerPkg ? resellerPkg.qty : 100; // default to 100 if package not found

      const licensesToInsert = [];
      const licenseKeys = [];
      for (let i = 0; i < qty; i++) {
        const key = generateOnlineLicenseKey('PRO');
        licenseKeys.push(key);
        licensesToInsert.push({
          license_key: key,
          tier: 'PRO',
          max_devices: 3, // Lisensi PRO
          business_name: `Reseller [${order.midtrans_order_id}] - ${order.customer_name}`,
          customer_name: order.customer_name,
        });
      }

      const { data: newLicenses, error: licenseError } = await supabase
        .from('licenses')
        .insert(licensesToInsert)
        .select('*');

      if (licenseError) throw new Error(licenseError.message);
      if (!newLicenses || newLicenses.length === 0) {
        throw new Error('Gagal menyimpan lisensi reseller ke database');
      }

      // Generate a professional Excel file
      const excelData = newLicenses.map((lic, index) => ({
        'No': index + 1,
        'Kode Lisensi': lic.license_key,
        'Tipe Paket': 'NuansaPos PRO',
        'Maksimal HP': lic.max_devices,
        'Pemilik Reseller': lic.customer_name,
        'Tanggal Rilis': new Date(lic.created_at || Date.now()).toLocaleDateString('id-ID'),
        'Status Aktivasi': 'Belum Aktif (Siap Pakai)'
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      worksheet['!cols'] = [
        { wch: 6 },   // No
        { wch: 35 },  // Kode Lisensi
        { wch: 18 },  // Tipe Paket
        { wch: 15 },  // Maksimal HP
        { wch: 25 },  // Pemilik Reseller
        { wch: 18 },  // Tanggal Rilis
        { wch: 25 }   // Status Aktivasi
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Lisensi Reseller');
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // Finalize reseller order
      const { error: finalizeError } = await supabase
        .from('orders')
        .update({
          paid_at: new Date().toISOString(),
          midtrans_transaction_id: transaction_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (finalizeError) throw new Error(finalizeError.message);

      // Send professional reseller email with attachment
      try {
        await sendResellerLicenseEmail({
          to: order.customer_email,
          customerName: order.customer_name,
          resellerPackageId: order.business_name || 'RS',
          qty,
          licenseKeys,
          excelBuffer,
        });
      } catch (emailError: any) {
        console.error('Gagal mengirim email lisensi reseller untuk order', order_id, emailError);
      }

    } else {
      // Regular customer flow: generate 1 license and send simple email
      const tier = order.tier as PackageTier;
      const licenseKey = generateOnlineLicenseKey(tier);

      const { data: newLicense, error: licenseError } = await supabase
        .from('licenses')
        .insert({
          license_key: licenseKey,
          tier,
          max_devices: order.max_devices,
          business_name: order.business_name || order.customer_name,
          customer_name: order.customer_name,
        })
        .select('*')
        .single();

      if (licenseError) throw new Error(licenseError.message);

      const { error: finalizeError } = await supabase
        .from('orders')
        .update({
          license_id: newLicense.id,
          paid_at: new Date().toISOString(),
          midtrans_transaction_id: transaction_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (finalizeError) throw new Error(finalizeError.message);

      try {
        await sendLicenseEmail({
          to: order.customer_email,
          customerName: order.customer_name,
          licenseKey,
          tier,
          businessName: order.business_name,
        });
      } catch (emailError: any) {
        console.error('Gagal mengirim email lisensi untuk order', order_id, emailError);
      }
    }

    return NextResponse.json({ message: 'Lisensi berhasil diterbitkan' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in payment webhook:', error);
    return NextResponse.json({ message: `Internal error: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}
