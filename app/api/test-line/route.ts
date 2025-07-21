import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const lineUserId = process.env.LINE_USER_ID;

    if (!lineToken || !lineUserId) {
      return NextResponse.json({ 
        error: 'Line 設定缺失',
        hasLineToken: !!lineToken,
        hasLineUserId: !!lineUserId
      }, { status: 400 });
    }

    const testMessage = `
🧪 Line 通知測試

✅ 恭喜！您的 Line Bot 設定成功！

📱 如果您收到這則訊息，表示：
• Channel Access Token 正確
• Line User ID 正確
• Bot 已成功加入好友

⏰ 測試時間: ${new Date().toLocaleString('zh-TW', {
  timeZone: 'Asia/Taipei',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
})} (台灣時間)

🎉 現在您可以開始接收訂餐通知了！
    `;

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
            text: testMessage
          }
        ]
      }),
    });

    if (lineResponse.ok) {
      console.log('✅ Line 測試訊息發送成功');
      return NextResponse.json({ 
        success: true, 
        message: 'Line 測試訊息發送成功' 
      });
    } else {
      const errorData = await lineResponse.json();
      console.error('❌ Line API 錯誤:', errorData);
      return NextResponse.json({ 
        error: 'Line API 錯誤',
        details: errorData
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Line 測試失敗:', error);
    return NextResponse.json({ 
      error: 'Line 測試失敗',
      details: error instanceof Error ? error.message : '未知錯誤'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: '請使用 POST 方法來測試 Line 通知',
    usage: 'POST /api/test-line'
  });
} 