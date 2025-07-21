import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '../../../lib/supabaseClient';

// 內建菜單資料（與前端同步）
const menuItems = [
  // 蛋餅類
  { name: '原味蛋餅', basePrice: 20, category: '蛋餅' },
  { name: '蔬菜蛋餅', basePrice: 25, category: '蛋餅' },
  { name: '玉米蛋餅', basePrice: 30, category: '蛋餅' },
  { name: '肉鬆蛋餅', basePrice: 30, category: '蛋餅' },
  { name: '熱狗蛋餅', basePrice: 30, category: '蛋餅' },
  { name: '火腿蛋餅', basePrice: 30, category: '蛋餅' },
  { name: '起司蛋餅', basePrice: 30, category: '蛋餅' },
  { name: '薯餅蛋餅', basePrice: 35, category: '蛋餅' },
  { name: '鮪魚蛋餅', basePrice: 35, category: '蛋餅' },
  // 蔥抓餅類
  { name: '原味蔥抓餅', basePrice: 30, category: '蔥抓餅' },
  { name: '加蛋蔥抓餅', basePrice: 40, category: '蔥抓餅' },
  { name: '火腿蔥抓餅', basePrice: 45, category: '蔥抓餅' },
  { name: '玉米蔥抓餅', basePrice: 45, category: '蔥抓餅' },
  { name: '肉鬆蔥抓餅', basePrice: 45, category: '蔥抓餅' },
  { name: '起司蔥抓餅', basePrice: 45, category: '蔥抓餅' },
  { name: '鮪魚蔥抓餅', basePrice: 50, category: '蔥抓餅' },
  { name: '培根蔥抓餅', basePrice: 50, category: '蔥抓餅' },
  { name: '薯餅蔥抓餅', basePrice: 55, category: '蔥抓餅' },
  // 炒飯麵類
  { name: '炒飯', basePrice: 60, category: '炒飯麵類' },
  { name: '炒泡麵', basePrice: 50, category: '炒飯麵類' },
  { name: '炒意麵', basePrice: 55, category: '炒飯麵類' },
  // 鍋燒系列
  { name: '鍋燒意麵', basePrice: 70, category: '鍋燒系列' },
  { name: '鍋燒雞絲', basePrice: 75, category: '鍋燒系列' },
  { name: '鍋燒烏龍麵', basePrice: 70, category: '鍋燒系列' },
  { name: '鍋燒泡麵', basePrice: 65, category: '鍋燒系列' },
  // 飯類
  { name: '雞肉飯', basePrice: 60, category: '飯類' },
  { name: '肉燥飯', basePrice: 55, category: '飯類' },
  // 水餃類
  { name: '水餃', basePrice: 50, category: '水餃類' },
  // 鐵板麵類
  { name: '蘑菇麵', basePrice: 40, category: '鐵板麵' },
  { name: '黑胡椒麵', basePrice: 40, category: '鐵板麵' },
  { name: '蕃茄肉醬麵', basePrice: 40, category: '鐵板麵' },
  // 厚片類
  { name: '巧克力厚片', basePrice: 30, category: '厚片' },
  { name: '花生厚片', basePrice: 30, category: '厚片' },
  { name: '奶酥厚片', basePrice: 30, category: '厚片' },
  // 飲料類
  { name: '紅茶', basePrice: 25, category: '飲料' },
  { name: '綠茶', basePrice: 25, category: '飲料' },
  { name: '奶茶', basePrice: 25, category: '飲料' },
  { name: '鮮奶茶', basePrice: 45, category: '飲料' },
  { name: '鮮奶綠', basePrice: 45, category: '飲料' },
  { name: '阿華田', basePrice: 45, category: '飲料' },
  { name: '多多綠', basePrice: 45, category: '飲料' },
  { name: '多多檸檬', basePrice: 45, category: '飲料' },
  { name: '冬瓜茶', basePrice: 25, category: '飲料' },
  { name: '冬瓜紅', basePrice: 25, category: '飲料' },
  { name: '冬瓜綠', basePrice: 25, category: '飲料' },
  { name: '冬瓜檸檬', basePrice: 45, category: '飲料' },
  { name: '薄荷綠', basePrice: 25, category: '飲料' },
  { name: '薄荷奶綠', basePrice: 45, category: '飲料' },
  { name: '奶綠', basePrice: 25, category: '飲料' },
  { name: '檸檬紅', basePrice: 30, category: '飲料' },
  { name: '檸檬綠', basePrice: 30, category: '飲料' },
  { name: '梅子綠', basePrice: 25, category: '飲料' },
  { name: '蜜茶', basePrice: 25, category: '飲料' },
  { name: '椰果奶茶', basePrice: 45, category: '飲料' },
  { name: '豆漿', basePrice: 25, category: '飲料' },
  { name: '可可亞', basePrice: 45, category: '飲料' },
  { name: '黑咖啡', basePrice: 50, category: '飲料' },
  { name: '拿鐵咖啡', basePrice: 55, category: '飲料' },
];

function calcItemPrice(item) {
  const menu = menuItems.find(m => m.name === item.name);
  if (!menu) throw new Error('找不到菜單品項: ' + item.name);
  let price = menu.basePrice;
  // 飲料類特殊加減價
  if (["紅茶", "鮮奶茶", "鮮奶綠", "阿華田", "多多綠", "多多檸檬", "冬瓜檸檬", "薄荷綠", "薄荷奶綠", "奶綠", "檸檬紅", "檸檬綠", "蜜茶", "可可亞", "椰果奶茶", "黑咖啡", "拿鐵咖啡"].includes(item.name)) {
    if (item.size === '中杯') price -= 5;
    if (item.size === '小杯') price -= 10;
  } else if (["綠茶", "奶茶"].includes(item.name)) {
    if (item.size === '中杯') price -= 5;
    if (item.size === '小杯') price -= 10;
  } else {
    if (item.size === '大杯') price += 5;
    if (item.size === '大份') price += 10;
  }
  // 其他加料可依需求擴充
  return price;
}

// 產生唯一 order_number
async function generateOrderNumber() {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  let tryCount = 0;
  while (tryCount < 5) {
    const order_number = today + '-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    const { data } = await supabaseAdmin.from('orders').select('id').eq('order_number', order_number);
    if (!data || data.length === 0) return order_number;
    tryCount++;
  }
  throw new Error('無法產生唯一訂單號碼，請稍後再試');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, customer_address, note, items } = body;

    // 計算訂單總金額
    let total_amount = 0;
    const orderItems = items.map((item: any) => {
      const price = calcItemPrice(item);
      const subtotal = price * item.quantity;
      total_amount += subtotal;
      return {
        menu_item_name: item.name,
        price,
        quantity: item.quantity,
        subtotal,
        size: item.size || '',
        sugar: item.sugar || '',
        notes: item.note || item.specialRequest || ''
      };
    });

    // 產生唯一訂單號碼
    const order_number = await generateOrderNumber();

    // 插入訂單
    console.log('order insert:', { order_number, customer_name, customer_phone, customer_address, note, total_amount });
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          order_number,
          channel_code: 'ON',
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
    console.log('order insert result:', { order, orderError });
    if (orderError) {
      console.error('訂單插入錯誤:', orderError);
      return NextResponse.json({ error: '訂單創建失敗', detail: orderError }, { status: 500 });
    }

    // 插入訂單項目
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));
    console.log('orderItemsWithOrderId:', orderItemsWithOrderId);
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsWithOrderId);
    if (itemsError) {
      console.error('訂單項目插入錯誤:', itemsError);
      return NextResponse.json({ error: '訂單項目創建失敗', detail: itemsError }, { status: 500 });
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

    return NextResponse.json({ success: true, order_number });
  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error), detail: error }, { status: 500 });
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