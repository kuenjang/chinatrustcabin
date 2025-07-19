export async function POST(req: Request) {
  const { order, order_number, total_amount, delivery_type } = await req.json();
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  // 格式化餐點資訊，包含備註
  const itemsText = order.map((i: any) => {
    let itemText = `• ${i.name} x${i.quantity} - $${i.price}`;
    if (i.notes && i.notes.trim()) {
      itemText += `\n  📝 ${i.notes}`;
    }
    return itemText;
  }).join('\n');
  
  const deliveryText = delivery_type === 'dine_in' ? '🍽️ 內用' : '🥡 外帶';
  const currentTime = new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const message = `🆕 *新訂單通知*

📋 **訂單號：** ${order_number}
${deliveryText}
💰 **總金額：** $${total_amount}

📝 **餐點明細：**
${itemsText}

⏰ **下單時間：** ${currentTime}

---
💡 請及時處理此訂單`;

  console.log('TOKEN:', TELEGRAM_BOT_TOKEN);
  console.log('CHAT_ID:', TELEGRAM_CHAT_ID);
  console.log('MSG:', message);

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram 設定缺失：', { TELEGRAM_BOT_TOKEN: !!TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID: !!TELEGRAM_CHAT_ID });
    return new Response(JSON.stringify({ error: 'Telegram 設定不完整' }), { status: 500 });
  }

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
    console.log('TELEGRAM API RESPONSE:', data);
    
    if (!data.ok) {
      console.error('Telegram API 錯誤:', data);
      return new Response(JSON.stringify({ error: data.description }), { status: 400 });
    }
    
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Telegram 通知發送失敗:', error);
    return new Response(JSON.stringify({ error: '發送失敗' }), { status: 500 });
  }
} 