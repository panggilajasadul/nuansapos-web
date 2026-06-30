import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('payment_status, tier, customer_email')
      .eq('midtrans_order_id', params.orderId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order tidak ditemukan' }, { status: 404 });
    }

    // Catatan: endpoint ini sengaja tidak pernah mengembalikan license key - lisensi hanya dikirim via email.
    return NextResponse.json({
      success: true,
      status: order.payment_status,
      tier: order.tier,
      email: order.customer_email,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
