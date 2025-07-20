import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseClient';

export async function GET() {
  try {
    console.log('=== 檢查資料庫結構 ===');
    
    // 檢查 orders 表結構
    const { data: ordersData, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .limit(1);

    console.log('Orders 表查詢結果:', { 
      success: !ordersError, 
      error: ordersError?.message || null,
      sample: ordersData?.[0] || null
    });

    // 檢查 order_items 表結構
    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .limit(1);

    console.log('Order_items 表查詢結果:', { 
      success: !itemsError, 
      error: itemsError?.message || null,
      sample: itemsData?.[0] || null
    });

    // 嘗試插入測試資料
    const testOrderData = {
      order_number: 'TEST-001',
      customer_name: '測試客戶',
      customer_phone: '0912345678',
      customer_address: '測試地址',
      note: '測試訂單',
      total_amount: 100
    };

    console.log('嘗試插入測試訂單:', testOrderData);

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('orders')
      .insert([testOrderData])
      .select()
      .single();

    if (insertError) {
      console.error('插入測試訂單失敗:', insertError);
    } else {
      console.log('插入測試訂單成功:', insertData);
      
      // 嘗試插入測試訂單項目
      const testItemData = {
        order_id: insertData.id,
        menu_item_name: '測試餐點',
        quantity: 1,
        price: 100,
        subtotal: 100
      };

      console.log('嘗試插入測試訂單項目:', testItemData);

      const { data: itemInsertData, error: itemInsertError } = await supabaseAdmin
        .from('order_items')
        .insert([testItemData])
        .select()
        .single();

      if (itemInsertError) {
        console.error('插入測試訂單項目失敗:', itemInsertError);
      } else {
        console.log('插入測試訂單項目成功:', itemInsertData);
      }
    }

    return NextResponse.json({
      success: true,
      orders: {
        success: !ordersError,
        error: ordersError?.message || null,
        sample: ordersData?.[0] || null
      },
      items: {
        success: !itemsError,
        error: itemsError?.message || null,
        sample: itemsData?.[0] || null
      },
      testInsert: {
        success: !insertError,
        error: insertError?.message || null,
        data: insertData || null
      }
    });
  } catch (error) {
    console.error('資料庫結構檢查失敗:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : '未知錯誤' 
    }, { status: 500 });
  }
} 