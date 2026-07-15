import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('payment_status, tier, price, customer_email, customer_name, midtrans_order_id, created_at, paid_at, business_name, business_type')
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
      price: order.price,
      email: order.customer_email,
      customerName: order.customer_name,
      orderId: order.midtrans_order_id,
      createdAt: order.created_at,
      paidAt: order.paid_at,
      businessName: order.business_name,
      businessType: order.business_type,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
