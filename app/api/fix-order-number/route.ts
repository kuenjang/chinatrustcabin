import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseClient';

export async function POST() {
  try {
    // 取得今日的最大訂單號碼（不限制日期，取得所有訂單的最大號碼）
    const { data: maxOrder, error: maxOrderError } = await supabaseAdmin
      .from('orders')
      .select('order_number')
      .order('order_number', { ascending: false })
      .limit(1)
      .single();
    
    if (maxOrderError) {
      console.error('查詢最大訂單號碼失敗:', maxOrderError);
      return NextResponse.json({ error: '查詢失敗' }, { status: 500 });
    }
    
    // 最大訂單號碼 + 1，格式化為4位數
    const maxNumber = parseInt(maxOrder.order_number);
    const nextOrderNumber = (maxNumber + 1).toString().padStart(4, '0');

    return NextResponse.json({ 
      success: true,
      maxOrderNumber: maxOrder.order_number,
      nextOrderNumber,
      message: `下一個訂單號碼應該是: ${nextOrderNumber}`
    });

  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
} 