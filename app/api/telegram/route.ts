import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Telegram 設定缺失:', { botToken: !!botToken, chatId: !!chatId });
      return NextResponse.json({ error: 'Telegram 設定不完整' }, { status: 500 });
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API 錯誤:', errorData);
      return NextResponse.json({ error: 'Telegram 通知發送失敗' }, { status: 500 });
    }

    const result = await response.json();
    console.log('Telegram 通知發送成功:', result);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Telegram API 錯誤:', error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
} 