'use server';

import { cookies } from 'next/headers';
import { createToken, verifyToken } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nuansaposadmin123';

/**
 * Handles the admin login authentication.
 */
export async function loginAction(password: string) {
  if (password === ADMIN_PASSWORD) {
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const token = createToken({ role: 'admin', expiresAt });

    cookies().set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours in seconds
    });

    return { success: true };
  }

  return { success: false, error: 'Kata sandi salah' };
}

/**
 * Logs out the admin by deleting the session cookie.
 */
export async function logoutAction() {
  cookies().set('admin_session', '', {
    path: '/',
    maxAge: 0,
  });
  return { success: true };
}

/**
 * Checks if the current request is authenticated.
 */
export async function checkAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) return false;

  const payload = verifyToken(token);
  return payload !== null && payload.role === 'admin';
}

/**
 * Saves a newly generated license to the Supabase database.
 */
export async function saveLicenseAction(data: {
  licenseKey: string;
  tier: string;
  maxDevices: number;
  businessName?: string;
  customerName?: string;
}) {
  const isAuthed = await checkAuth();
  if (!isAuthed) return { success: false, error: 'Unauthorized' };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return { success: false, error: 'Kredensial Supabase (URL / Service Role Key) belum dikonfigurasi di server.' };
  }

  try {
    const { error } = await supabase.from('licenses').insert({
      license_key: data.licenseKey.trim().toUpperCase(),
      tier: data.tier,
      max_devices: data.maxDevices,
      business_name: data.businessName,
      customer_name: data.customerName,
    });

    if (error) throw new Error(error.message);
    return { success: true };
  } catch (err: any) {
    console.error('Error saving license:', err);
    return { success: false, error: err.message || 'Gagal menyimpan lisensi ke database' };
  }
}

/**
 * Lists all licenses and their activations.
 */
export async function listLicensesAction() {
  const isAuthed = await checkAuth();
  if (!isAuthed) return { success: false, error: 'Unauthorized', data: [] };

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return { success: false, error: 'Supabase URL/Key belum dikonfigurasi di server.', data: [] };
    }

    const { data: licenses, error: licensesError } = await supabase
      .from('licenses')
      .select('*')
      .order('created_at', { ascending: false });

    if (licensesError) throw new Error(licensesError.message);

    const { data: activations, error: activationsError } = await supabase
      .from('license_activations')
      .select('license_id, device_id, activated_at');

    if (activationsError) throw new Error(activationsError.message);

    const data = (licenses || []).map((lic: any) => {
      const licActivations = (activations || []).filter((act: any) => act.license_id === lic.id);
      return {
        id: lic.id,
        licenseKey: lic.license_key,
        tier: lic.tier,
        maxDevices: lic.max_devices,
        businessName: lic.business_name || '',
        customerName: lic.customer_name || '',
        createdAt: lic.created_at,
        activatedDevicesCount: licActivations.length,
        devices: licActivations.map((act: any) => ({
          deviceId: act.device_id,
          activatedAt: act.activated_at,
        })),
      };
    });

    return { success: true, data };
  } catch (err: any) {
    console.error('Error listing licenses:', err);
    return { success: false, error: err.message || 'Gagal mengambil data dari database', data: [] };
  }
}

/**
 * Resets all activations for a license.
 */
export async function resetActivationsAction(licenseId: string) {
  const isAuthed = await checkAuth();
  if (!isAuthed) return { success: false, error: 'Unauthorized' };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return { success: false, error: 'Kredensial Supabase (URL / Service Role Key) belum dikonfigurasi di server.' };
  }

  try {
    const { error } = await supabase
      .from('license_activations')
      .delete()
      .eq('license_id', licenseId);

    if (error) throw new Error(error.message);
    return { success: true };
  } catch (err: any) {
    console.error('Error resetting activations:', err);
    return { success: false, error: err.message || 'Gagal me-reset aktivasi' };
  }
}

/**
 * Lists all purchase orders (read-only, for admin visibility).
 */
export async function listOrdersAction() {
  const isAuthed = await checkAuth();
  if (!isAuthed) return { success: false, error: 'Unauthorized', data: [] };

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return { success: false, error: 'Supabase URL/Key belum dikonfigurasi di server.', data: [] };
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    const data = (orders || []).map((order: any) => ({
      id: order.id,
      midtransOrderId: order.midtrans_order_id,
      tier: order.tier,
      price: order.price,
      maxDevices: order.max_devices,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerWhatsapp: order.customer_whatsapp,
      customerAddress: order.customer_address,
      businessName: order.business_name || '',
      businessType: order.business_type || '',
      paymentStatus: order.payment_status,
      licenseId: order.license_id,
      createdAt: order.created_at,
      paidAt: order.paid_at,
    }));

    return { success: true, data };
  } catch (err: any) {
    console.error('Error listing orders:', err);
    return { success: false, error: err.message || 'Gagal mengambil data pesanan dari database', data: [] };
  }
}

/**
 * Deletes/Revokes a license key.
 */
export async function deleteLicenseAction(licenseId: string) {
  const isAuthed = await checkAuth();
  if (!isAuthed) return { success: false, error: 'Unauthorized' };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return { success: false, error: 'Kredensial Supabase (URL / Service Role Key) belum dikonfigurasi di server.' };
  }

  try {
    const { error } = await supabase
      .from('licenses')
      .delete()
      .eq('id', licenseId);

    if (error) throw new Error(error.message);
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting license:', err);
    return { success: false, error: err.message || 'Gagal menghapus lisensi' };
  }
}

