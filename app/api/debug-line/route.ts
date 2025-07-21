import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const lineUserId = process.env.LINE_USER_ID;

    console.log('Line Token:', lineToken ? '已設定' : '未設定');
    console.log('Line User ID:', lineUserId);

    if (!lineToken || !lineUserId) {
      return NextResponse.json({
        error: 'Line 設定缺失',
        hasLineToken: !!lineToken,
        hasLineUserId: !!lineUserId,
        lineTokenLength: lineToken?.length || 0,
        lineUserId: lineUserId
      }, { status: 400 });
    }

    const testMessage = '🧪 Line 通知測試 - 如果您收到這則訊息，表示設定成功！';

    const lineUrl = 'https://api.line.me/v2/bot/message/push';
    
    console.log('發送 Line 訊息到:', lineUserId);
    console.log('Line API URL:', lineUrl);
    
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

    console.log('Line API 回應狀態:', lineResponse.status);
    
    if (lineResponse.ok) {
      const responseData = await lineResponse.json();
      console.log('Line API 成功回應:', responseData);
      return NextResponse.json({ 
        success: true, 
        message: 'Line 測試訊息發送成功',
        response: responseData
      });
    } else {
      const errorData = await lineResponse.json();
      console.error('Line API 錯誤:', errorData);
      return NextResponse.json({ 
        error: 'Line API 錯誤',
        status: lineResponse.status,
        details: errorData
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Line 測試失敗:', error);
    return NextResponse.json({ 
      error: 'Line 測試失敗',
      details: error instanceof Error ? error.message : '未知錯誤'
    }, { status: 500 });
  }
} 