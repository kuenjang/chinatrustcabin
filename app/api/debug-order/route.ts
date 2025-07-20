import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    console.log('=== 開始除錯訂單提交 ===');
    
    // 檢查環境變數
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabaseKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const hasTelegramToken = !!process.env.TELEGRAM_BOT_TOKEN;
    const hasTelegramChatId = !!process.env.TELEGRAM_CHAT_ID;
    
    console.log('環境變數檢查:', {
      hasSupabaseUrl,
      hasSupabaseKey,
      hasTelegramToken,
      hasTelegramChatId
    });

    const body = await request.json();
    console.log('收到的訂單資料:', body);
    
    const { customer_name, customer_phone, customer_address, note, total_amount, items } = body;

    // 檢查必要欄位
    if (!customer_name || !customer_phone || !total_amount || !items || items.length === 0) {
      console.error('缺少必要欄位:', { customer_name, customer_phone, total_amount, itemsLength: items?.length });
      return NextResponse.json({ error: '缺少必要欄位' }, { status: 400 });
    }

    // 測試資料庫連接
    console.log('測試資料庫連接...');
    const { data: testData, error: testError } = await supabaseAdmin
      .from('orders')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('資料庫連接測試失敗:', testError);
      return NextResponse.json({ error: '資料庫連接失敗', details: testError }, { status: 500 });
    }

    console.log('資料庫連接成功');

    // 生成訂單號碼
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    console.log('今日日期:', today);
    
    const { data: todayOrders, error: countError } = await supabaseAdmin
      .from('orders')
      .select('id')
      .gte('created_at', `${today.substring(0, 4)}-${today.substring(4, 6)}-${today.substring(6, 8)}`)
      .lt('created_at', `${today.substring(0, 4)}-${today.substring(4, 6)}-${parseInt(today.substring(6, 8)) + 1}`);
    
    if (countError) {
      console.error('計算今日訂單數量失敗:', countError);
      return NextResponse.json({ error: '生成訂單號碼失敗', details: countError }, { status: 500 });
    }
    
    const todayOrderCount = (todayOrders?.length || 0) + 1;
    const order_number = todayOrderCount.toString().padStart(4, '0');
    console.log('生成的訂單號碼:', order_number);

    // 準備訂單資料
    const orderData = {
      order_number,
      channel_code: 'ON',
      customer_name,
      customer_phone,
      customer_address,
      note: note || '',
      total_amount,
      status: 'pending'
    };

    console.log('準備插入的訂單資料:', orderData);

    // 插入訂單
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) {
      console.error('訂單插入錯誤:', orderError);
      return NextResponse.json({ error: '訂單創建失敗', details: orderError }, { status: 500 });
    }

    console.log('訂單插入成功:', order);

    // 準備訂單項目資料
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      menu_item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.quantity * item.price
    }));

    console.log('準備插入的訂單項目:', orderItems);

    // 插入訂單項目
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('訂單項目插入錯誤:', itemsError);
      return NextResponse.json({ error: '訂單項目創建失敗', details: itemsError }, { status: 500 });
    }

    console.log('訂單項目插入成功');

    // 測試 Telegram 通知
    if (hasTelegramToken && hasTelegramChatId) {
      try {
        const telegramMessage = `
🆕 新訂單通知 (測試)

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

        const baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://your-domain.com' 
          : 'http://localhost:3000';
        
        const telegramResponse = await fetch(`${baseUrl}/api/telegram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: telegramMessage }),
        });

        if (telegramResponse.ok) {
          console.log('Telegram 通知發送成功');
        } else {
          console.error('Telegram 通知發送失敗:', await telegramResponse.text());
        }
      } catch (telegramError) {
        console.error('Telegram 通知發送失敗:', telegramError);
      }
    } else {
      console.log('Telegram 設定不完整，跳過通知');
    }

    console.log('=== 訂單提交除錯完成 ===');

    return NextResponse.json({ 
      success: true, 
      order_number,
      order_id: order.id,
      debug: {
        environment: { hasSupabaseUrl, hasSupabaseKey, hasTelegramToken, hasTelegramChatId },
        orderData,
        orderItems
      }
    });

  } catch (error) {
    console.error('除錯 API 錯誤:', error);
    return NextResponse.json({ 
      error: '伺服器錯誤', 
      details: error instanceof Error ? error.message : '未知錯誤'
    }, { status: 500 });
  }
} 