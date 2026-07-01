import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ success: false, message: 'orderId diperlukan' }, { status: 400 });
  }

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('payment_status, snap_token')
      .eq('midtrans_order_id', orderId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order tidak ditemukan' }, { status: 404 });
    }
    if (order.payment_status !== 'pending') {
      return NextResponse.json(
        { success: false, message: 'Order ini sudah tidak dalam status menunggu pembayaran' },
        { status: 400 }
      );
    }
    if (!order.snap_token) {
      return NextResponse.json(
        { success: false, message: 'Token pembayaran tidak tersedia' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, token: order.snap_token });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
