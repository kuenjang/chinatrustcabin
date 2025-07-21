import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseClient';

export async function GET() {
  try {
    // 生成訂單號碼 - 四碼格式，每天重新計數
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    
    // 取得今日的最大訂單號碼
    const { data: maxOrder, error: maxOrderError } = await supabaseAdmin
      .from('orders')
      .select('order_number')
      .gte('created_at', `${today.substring(0, 4)}-${today.substring(4, 6)}-${today.substring(6, 8)}`)
      .lt('created_at', `${today.substring(0, 4)}-${today.substring(4, 6)}-${parseInt(today.substring(6, 8)) + 1}`)
      .order('order_number', { ascending: false })
      .limit(1)
      .single();
    
    if (maxOrderError && maxOrderError.code !== 'PGRST116') { // PGRST116 是沒有找到記錄的錯誤
      console.error('查詢今日最大訂單號碼失敗:', maxOrderError);
      return NextResponse.json({ error: '查詢失敗' }, { status: 500 });
    }
    
    // 今日最大訂單號碼 + 1，格式化為4位數
    const todayMaxNumber = maxOrder?.order_number ? parseInt(maxOrder.order_number) : 0;
    const order_number = (todayMaxNumber + 1).toString().padStart(4, '0');

    return NextResponse.json({ 
      success: true,
      today,
      maxOrderNumber: maxOrder?.order_number || '無',
      nextOrderNumber: order_number
    });

  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
} 