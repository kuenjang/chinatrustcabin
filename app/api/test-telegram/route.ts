import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    console.log('🔍 檢查 Telegram 設定:', {
      hasBotToken: !!botToken,
      hasChatId: !!chatId,
      botTokenLength: botToken?.length || 0,
      chatId: chatId
    });

    if (!botToken || !chatId) {
      return NextResponse.json({ 
        error: 'Telegram 設定不完整',
        details: { hasBotToken: !!botToken, hasChatId: !!chatId }
      }, { status: 500 });
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

    const testMessage = `
🧪 Telegram 通知測試

📱 來源: ${process.env.NODE_ENV === 'production' ? 'Vercel 生產環境' : '本地開發環境'}
⏰ 時間: ${taiwanTime} (台灣時間)
🌐 環境: ${process.env.NODE_ENV || 'development'}

✅ 如果看到這則訊息，表示 Telegram 通知功能正常運作！
    `;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    console.log('📤 發送測試訊息到:', telegramUrl);
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage,
        parse_mode: 'HTML'
      }),
    });

    console.log('📊 Telegram API 回應狀態:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Telegram API 錯誤:', errorData);
      return NextResponse.json({ 
        error: 'Telegram 通知發送失敗',
        details: errorData,
        status: response.status
      }, { status: 500 });
    }

    const result = await response.json();
    console.log('✅ Telegram 通知發送成功:', result);

    return NextResponse.json({ 
      success: true, 
      result,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      taiwanTime: taiwanTime
    });
  } catch (error) {
    console.error('❌ Telegram 測試 API 錯誤:', error);
    return NextResponse.json({ 
      error: '伺服器錯誤',
      details: error instanceof Error ? error.message : '未知錯誤'
    }, { status: 500 });
  }
}

export async function GET() {
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

  return NextResponse.json({
    message: 'Telegram 測試 API',
    usage: 'POST /api/test-telegram 來測試 Telegram 通知功能',
    environment: process.env.NODE_ENV,
    hasBotToken: !!process.env.TELEGRAM_BOT_TOKEN,
    hasChatId: !!process.env.TELEGRAM_CHAT_ID,
    currentTime: {
      utc: new Date().toISOString(),
      taiwan: taiwanTime
    }
  });
} 