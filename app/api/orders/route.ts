import { NextRequest, NextResponse } from 'next/server';
import { OrderNumberService } from '../../../lib/orderNumberService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 驗證必要欄位
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: '訂單項目不能為空' },
        { status: 400 }
      );
    }

    if (!body.channel_code) {
      return NextResponse.json(
        { error: '必須指定訂餐通道' },
        { status: 400 }
      );
    }

    // 驗證通道代碼
    if (!['ON', 'WA'].includes(body.channel_code)) {
      return NextResponse.json(
        { error: '不支援的訂餐通道，請使用 ON (線上點餐) 或 WA (現場點餐)' },
        { status: 400 }
      );
    }

    // 計算總金額
    const totalAmount = body.items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // 建立訂單資料
    const orderData = {
      channel_code: body.channel_code,
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      total_amount: totalAmount,
      payment_method: body.payment_method || 'cash',
      delivery_type: body.delivery_type || 'dine_in',
      special_notes: body.special_notes,
      items: body.items.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.note
      }))
    };

    // 使用 OrderNumberService 建立訂單
    const result = await OrderNumberService.createOrder(orderData);

    if (result.success) {
      // 發送 Telegram 通知
      try {
        console.log('準備發送 Telegram 通知...');
        console.log('訂單資料:', {
          order: body.items,
          order_number: result.order_number,
          total_amount: totalAmount,
          delivery_type: body.delivery_type || 'dine_in'
        });

        const telegramResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/telegram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order: body.items,
            order_number: result.order_number,
            total_amount: totalAmount,
            delivery_type: body.delivery_type || 'dine_in'
          }),
        });

        const telegramResult = await telegramResponse.json();
        console.log('Telegram 回應:', telegramResult);

        if (!telegramResponse.ok) {
          console.warn('Telegram 通知發送失敗:', telegramResult);
        } else {
          console.log('Telegram 通知發送成功');
        }
      } catch (telegramError) {
        console.warn('Telegram 通知發送失敗:', telegramError);
        // 不中斷訂單建立流程，只記錄警告
      }

      return NextResponse.json({
        success: true,
        order_number: result.order_number,
        order_id: result.order_id,
        message: '訂單建立成功'
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('建立訂單失敗:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    // 這裡可以實作訂單查詢功能
    // 目前先回傳基本資訊
    return NextResponse.json({
      message: '訂單查詢功能開發中',
      filters: { channel, status, limit },
      supported_channels: ['ON', 'WA']
    });

  } catch (error) {
    console.error('查詢訂單失敗:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
} 