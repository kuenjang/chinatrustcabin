import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '../../../lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, customer_address, note, total_amount, items } = body;

    // 生成訂單號碼 - 四碼格式，使用全域最大號碼
    const { data: maxOrder, error: maxOrderError } = await supabaseAdmin
      .from('orders')
      .select('order_number')
      .order('order_number', { ascending: false })
      .limit(1)
      .single();
    
    if (maxOrderError) {
      console.error('查詢最大訂單號碼失敗:', maxOrderError);
      return NextResponse.json({ error: '生成訂單號碼失敗' }, { status: 500 });
    }
    
    // 最大訂單號碼 + 1，格式化為4位數
    const maxNumber = parseInt(maxOrder.order_number);
    const order_number = (maxNumber + 1).toString().padStart(4, '0');

    // 使用服務端 Supabase 客戶端插入訂單（繞過 RLS）
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          order_number,
          channel_code: 'ON', // 線上點餐
          customer_name,
          customer_phone,
          customer_address,
          note: note, // 使用實際的欄位名稱
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
      menu_item_name: item.name, // 使用實際的欄位名稱
      price: item.price,
      quantity: item.quantity,
      subtotal: item.quantity * item.price // 使用實際的欄位名稱
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('訂單項目插入錯誤:', itemsError);
      return NextResponse.json({ error: '訂單項目創建失敗' }, { status: 500 });
    }

    // 使用台灣時區格式化時間
    const taiwanTime = new Date().toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const orderMessage = `
🆕 新訂單通知

📋 訂單號碼: ${order_number}
👤 客戶姓名: ${customer_name}
📞 電話: ${customer_phone}
📍 地址: ${customer_address || '無'}
💰 總金額: NT$ ${total_amount}

📝 訂單內容:
${items.map((item: any) => `• ${item.name} x${item.quantity} = NT$ ${item.quantity * item.price}`).join('\n')}

${note ? `📌 備註: ${note}` : ''}

⏰ 下單時間: ${taiwanTime} (台灣時間)
    `;

    // 發送 Telegram 通知
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (botToken && chatId) {
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        const telegramResponse = await fetch(telegramUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: orderMessage,
            parse_mode: 'HTML'
          }),
        });

        if (telegramResponse.ok) {
          console.log('✅ Telegram 通知發送成功');
        } else {
          const errorData = await telegramResponse.json();
          console.error('❌ Telegram API 錯誤:', errorData);
        }
      } else {
        console.error('❌ Telegram 設定缺失:', { 
          hasBotToken: !!botToken, 
          hasChatId: !!chatId 
        });
      }
    } catch (telegramError) {
      console.error('❌ Telegram 通知發送失敗:', telegramError);
    }

    // 發送 Line 通知
    try {
      const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
      const lineUserId = process.env.LINE_USER_ID;

      if (lineToken && lineUserId) {
        const lineUrl = 'https://api.line.me/v2/bot/message/push';
        
        const lineResponse = await fetch(lineUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${lineToken}`
          },
          body: JSON.stringify({
            to: lineUserId,
            messages: [
              {
                type: 'text',
                text: orderMessage
              }
            ]
          }),
        });

        if (lineResponse.ok) {
          console.log('✅ Line 通知發送成功');
        } else {
          const errorData = await lineResponse.json();
          console.error('❌ Line API 錯誤:', errorData);
        }
      } else {
        console.error('❌ Line 設定缺失:', { 
          hasLineToken: !!lineToken, 
          hasLineUserId: !!lineUserId 
        });
      }
    } catch (lineError) {
      console.error('❌ Line 通知發送失敗:', lineError);
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
    const { data: orders, error } = await supabaseAdmin
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