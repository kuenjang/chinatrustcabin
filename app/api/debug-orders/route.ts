import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseClient';

export async function GET() {
  try {
    // 取得所有訂單
    const { data: allOrders, error: allError } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (allError) {
      console.error('查詢所有訂單失敗:', allError);
      return NextResponse.json({ error: '查詢失敗' }, { status: 500 });
    }

    // 取得今日的訂單
    const today = new Date().toISOString().split('T')[0];
    const { data: todayOrders, error: todayError } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, created_at')
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`)
      .order('order_number', { ascending: false });

    if (todayError) {
      console.error('查詢今日訂單失敗:', todayError);
      return NextResponse.json({ error: '查詢失敗' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      today,
      allOrders: allOrders || [],
      todayOrders: todayOrders || [],
      todayOrderCount: todayOrders?.length || 0
    });

  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
} 