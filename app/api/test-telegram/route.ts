import { NextResponse } from 'next/server';

export async function GET() {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  console.log('測試 Telegram 設定:');
  console.log('TOKEN:', TELEGRAM_BOT_TOKEN ? '已設定' : '未設定');
  console.log('CHAT_ID:', TELEGRAM_CHAT_ID ? '已設定' : '未設定');

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return NextResponse.json({ 
      error: 'Telegram 設定不完整',
      token: !!TELEGRAM_BOT_TOKEN,
      chatId: !!TELEGRAM_CHAT_ID
    }, { status: 500 });
  }

  // 模擬一個真實的訂單
  const testOrder = {
    order: [
      { name: '酸辣涼粉', price: 90, quantity: 2, notes: '不要太辣' },
      { name: '涼拌海帶', price: 80, quantity: 1, notes: '' },
      { name: '招牌包廂蝦仁粉', price: 120, quantity: 1, notes: '加辣' }
    ],
    order_number: 'TEST-20250719-001',
    total_amount: 380,
    delivery_type: 'dine_in'
  };

  // 格式化餐點資訊，包含備註
  const itemsText = testOrder.order.map((i: any) => {
    let itemText = `• ${i.name} x${i.quantity} - $${i.price}`;
    if (i.notes && i.notes.trim()) {
      itemText += `\n  📝 ${i.notes}`;
    }
    return itemText;
  }).join('\n');
  
  const deliveryText = testOrder.delivery_type === 'dine_in' ? '🍽️ 內用' : '🥡 外帶';
  
  // 修正時區問題：使用台灣時區
  const currentTime = new Date().toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const message = `🧪 *測試訂單通知*

📋 **訂單號：** ${testOrder.order_number}
${deliveryText}
💰 **總金額：** $${testOrder.total_amount}

📝 **餐點明細：**
${itemsText}

⏰ **下單時間：** ${currentTime}

---
💡 這是一個測試訂單，請確認 Telegram 通知功能正常運作`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const data = await res.json();
    
    if (!data.ok) {
      console.error('Telegram API 錯誤:', data);
      return NextResponse.json({ error: data.description }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '測試訂單已發送到 Telegram',
      order: testOrder
    });
  } catch (error) {
    console.error('Telegram 測試發送失敗:', error);
    return NextResponse.json({ error: '發送失敗' }, { status: 500 });
  }
} 