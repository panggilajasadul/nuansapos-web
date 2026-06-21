import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function encodeBase32(bytes: Buffer, length = 15): string {
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

function verifyOfflineSignature(key: string, deviceId: string): { valid: boolean; tier?: string } {
  const SECRET = "NuansaP0s@2024#Batch24$Offline!";
  const parts = key.split('-');
  if (parts.length !== 5 || parts[0] !== 'NUANSA') return { valid: false };
  const tierCode = parts[1];
  const tierName = tierCode === 'BSC' ? 'basic' : tierCode === 'PRO' ? 'pro' : tierCode === 'PRM' ? 'premium' : null;
  if (!tierName) return { valid: false };
  const providedToken = parts[2] + parts[3] + parts[4];
  if (providedToken.length !== 15) return { valid: false };
  
  const message = `${deviceId.trim().toUpperCase()}|${tierName}|LIFETIME`;
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(message);
  const signatureBytes = hmac.digest();
  const expectedToken = encodeBase32(signatureBytes, 15);
  
  return { valid: providedToken === expectedToken, tier: tierCode };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { licenseKey, deviceId } = body;

    if (!licenseKey || !deviceId) {
      return NextResponse.json(
        { success: false, message: 'Kunci Lisensi dan ID Perangkat wajib diisi' },
        { status: 400 }
      );
    }

    const cleanKey = licenseKey.trim().toUpperCase();
    const cleanDeviceId = deviceId.trim().toUpperCase();

    // Check if Supabase client is placeholder/not configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Server database Supabase belum dikonfigurasi di file .env.local' 
        },
        { status: 503 }
      );
    }

    // 1. Fetch license details from database
    let { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', cleanKey)
      .maybeSingle();

    if (!license) {
      // Check if it is a valid offline-signed key
      const verification = verifyOfflineSignature(cleanKey, cleanDeviceId);
      if (verification.valid && verification.tier) {
        const tierCode = verification.tier;
        const maxDevices = tierCode === 'BSC' ? 1 : 3;

        // Auto-register the offline generated key in Supabase!
        const { data: newLic, error: insertLicError } = await supabase
          .from('licenses')
          .insert({
            license_key: cleanKey,
            tier: tierCode,
            max_devices: maxDevices,
            business_name: 'Lisensi Offline Ter-sinkron',
            customer_name: 'Pengguna Offline',
          })
          .select('*')
          .single();

        if (insertLicError || !newLic) {
          throw new Error('Gagal meregistrasi kunci offline ke database: ' + (insertLicError?.message || 'Unknown error'));
        }
        license = newLic;
      } else {
        return NextResponse.json(
          { success: false, message: 'Kunci lisensi tidak valid atau tidak terdaftar' },
          { status: 404 }
        );
      }
    }

    // 2. Check if this device is already activated for this license
    const { data: existingActivation, error: activationError } = await supabase
      .from('license_activations')
      .select('*')
      .eq('license_id', license.id)
      .eq('device_id', cleanDeviceId)
      .single();

    if (existingActivation) {
      return NextResponse.json({
        success: true,
        message: 'Perangkat ini sudah terdaftar sebelumnya.',
        tier: license.tier.toUpperCase(),
      });
    }

    // 3. Count current active devices for this license
    const { count, error: countError } = await supabase
      .from('license_activations')
      .select('*', { count: 'exact', head: true })
      .eq('license_id', license.id);

    if (countError) {
      throw new Error(countError.message);
    }

    const currentCount = count || 0;
    if (currentCount >= license.max_devices) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Batas perangkat tercapai! Lisensi ini hanya untuk maksimal ${license.max_devices} perangkat.` 
        },
        { status: 400 }
      );
    }

    // 4. Register the new device
    const { error: insertError } = await supabase
      .from('license_activations')
      .insert({
        license_id: license.id,
        device_id: cleanDeviceId,
      });

    if (insertError) {
      throw new Error(insertError.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Aktivasi berhasil dilakukan secara online!',
      tier: license.tier.toUpperCase(),
    });

  } catch (error: any) {
    console.error('Error in activation API:', error);
    return NextResponse.json(
      { success: false, message: `Terjadi kesalahan internal server: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
