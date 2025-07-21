import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseClient';

export async function GET() {
  try {
    // 檢查重複的訂單號碼
    const { data: duplicates, error: duplicateError } = await supabaseAdmin
      .from('orders')
      .select('order_number, count')
      .select('order_number')
      .order('order_number');

    if (duplicateError) {
      console.error('查詢訂單號碼失敗:', duplicateError);
      return NextResponse.json({ error: '查詢失敗' }, { status: 500 });
    }

    // 手動計算重複
    const orderNumbers = duplicates?.map(o => o.order_number) || [];
    const duplicatesMap = new Map();
    
    orderNumbers.forEach(num => {
      duplicatesMap.set(num, (duplicatesMap.get(num) || 0) + 1);
    });

    const duplicateNumbers = Array.from(duplicatesMap.entries())
      .filter(([num, count]) => count > 1)
      .map(([num, count]) => ({ order_number: num, count }));

    return NextResponse.json({ 
      success: true,
      allOrderNumbers: orderNumbers,
      duplicateNumbers,
      totalOrders: orderNumbers.length
    });

  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
} 