import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseClient';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', parseInt(id));

    if (error) {
      console.error('更新訂單狀態失敗:', error);
      return NextResponse.json({ error: '更新訂單狀態失敗' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 先刪除訂單項目
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .delete()
      .eq('order_id', parseInt(id));

    if (itemsError) {
      console.error('刪除訂單項目失敗:', itemsError);
      return NextResponse.json({ error: '刪除訂單項目失敗' }, { status: 500 });
    }

    // 再刪除訂單
    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', parseInt(id));

    if (orderError) {
      console.error('刪除訂單失敗:', orderError);
      return NextResponse.json({ error: '刪除訂單失敗' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
} 