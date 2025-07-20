import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { generateOrderNumber } from '../../../lib/orderNumberService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, customer_address, note, total_amount, items } = body;

    // 生成訂單號碼
    const order_number = generateOrderNumber();

    // 插入訂單
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number,
          customer_name,
          customer_phone,
          customer_address,
          note,
          total_amount,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (orderError) {
      console.error('訂單插入錯誤:', orderError);
      return NextResponse.json({ error: '訂單創建失敗' }, { status: 500 });
    }

    // 插入訂單項目
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      menu_item_name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('訂單項目插入錯誤:', itemsError);
      return NextResponse.json({ error: '訂單項目創建失敗' }, { status: 500 });
    }

    // 發送 Telegram 通知
    try {
      const telegramMessage = `
🆕 新訂單通知

📋 訂單號碼: ${order_number}
👤 客戶姓名: ${customer_name}
📞 電話: ${customer_phone}
📍 地址: ${customer_address || '無'}
💰 總金額: NT$ ${total_amount}

📝 訂單內容:
${items.map((item: any) => `• ${item.name} x${item.quantity} = NT$ ${item.quantity * item.price}`).join('\n')}

${note ? `📌 備註: ${note}` : ''}

⏰ 下單時間: ${new Date().toLocaleString('zh-TW')}
      `;

      await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: telegramMessage }),
      });
    } catch (telegramError) {
      console.error('Telegram 通知發送失敗:', telegramError);
    }

    return NextResponse.json({ 
      success: true, 
      order_number,
      order_id: order.id 
    });

  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('查詢訂單錯誤:', error);
      return NextResponse.json({ error: '查詢訂單失敗' }, { status: 500 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
} 