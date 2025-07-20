import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新訂單狀態錯誤:', error);
      return NextResponse.json({ error: '更新訂單狀態失敗' }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
} 