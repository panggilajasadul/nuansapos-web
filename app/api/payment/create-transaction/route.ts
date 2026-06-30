import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { createSnapTransaction } from '@/lib/midtrans';
import { PACKAGES, isValidTier } from '@/lib/packages';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tier,
      name,
      email,
      whatsapp,
      address,
      businessName,
      businessType,
      honeypot,
    } = body;

    // Anti-bot: honeypot field harus kosong (diisi otomatis oleh bot, manusia tidak melihatnya)
    if (honeypot) {
      return NextResponse.json({ success: false, message: 'Permintaan ditolak' }, { status: 400 });
    }

    if (!tier || !isValidTier(tier)) {
      return NextResponse.json({ success: false, message: 'Paket tidak valid' }, { status: 400 });
    }

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim();
    const cleanWhatsapp = String(whatsapp || '').trim();
    const cleanAddress = String(address || '').trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanName || !cleanEmail || !cleanWhatsapp || !cleanAddress) {
      return NextResponse.json(
        { success: false, message: 'Nama, email, no WhatsApp, dan alamat wajib diisi' },
        { status: 400 }
      );
    }
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ success: false, message: 'Format email tidak valid' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, message: 'Server database belum dikonfigurasi' },
        { status: 503 }
      );
    }

    const pkg = PACKAGES[tier];
    const midtransOrderId = `NUANSA-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const { error: insertError } = await supabase.from('orders').insert({
      midtrans_order_id: midtransOrderId,
      tier,
      price: pkg.price,
      max_devices: pkg.maxDevices,
      customer_name: cleanName,
      customer_email: cleanEmail,
      customer_whatsapp: cleanWhatsapp,
      customer_address: cleanAddress,
      business_name: businessName ? String(businessName).trim() : null,
      business_type: businessType ? String(businessType).trim() : null,
      payment_status: 'pending',
    });

    if (insertError) {
      throw new Error(insertError.message);
    }

    const { token, redirect_url } = await createSnapTransaction({
      orderId: midtransOrderId,
      grossAmount: pkg.price,
      customerName: cleanName,
      customerEmail: cleanEmail,
      customerPhone: cleanWhatsapp,
    });

    return NextResponse.json({
      success: true,
      token,
      redirectUrl: redirect_url,
      orderId: midtransOrderId,
    });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, message: `Terjadi kesalahan: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
