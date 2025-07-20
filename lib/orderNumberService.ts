import { supabase } from './supabaseClient';

export interface OrderChannel {
  id: number;
  channel_code: string;
  channel_name: string;
  is_active: boolean;
}

export interface OrderData {
  channel_code: string;
  customer_name?: string;
  customer_phone?: string;
  total_amount: number;
  payment_method?: string;
  delivery_type?: string;
  special_notes?: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  }>;
}

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `CT${year}${month}${day}${hours}${minutes}${seconds}${random}`;
}

export class OrderNumberService {
  /**
   * 生成訂單號
   * 格式：YYYYMMDD-通道代碼-序號
   * 範例：20241201-ON-001 (線上點餐第1號)
   * 範例：20241201-WA-001 (現場點餐第1號)
   */
  static async generateOrderNumber(channelCode: string): Promise<string> {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    
    // 取得今日該通道的序號
    const { data: counterData, error: counterError } = await supabase
      .from('daily_counters')
      .select('counter')
      .eq('date', today)
      .eq('channel_code', channelCode)
      .single();

    let nextNumber = 1;
    
    if (counterData) {
      // 如果今日已有計數，則加1
      nextNumber = counterData.counter + 1;
      
      // 更新計數器
      await supabase
        .from('daily_counters')
        .update({ counter: nextNumber, updated_at: new Date().toISOString() })
        .eq('date', today)
        .eq('channel_code', channelCode);
    } else {
      // 如果今日還沒有計數，則新增
      await supabase
        .from('daily_counters')
        .insert({
          date: today,
          channel_code: channelCode,
          counter: nextNumber
        });
    }

    // 格式化序號為3位數
    const formattedNumber = nextNumber.toString().padStart(3, '0');
    return `${today}-${channelCode}-${formattedNumber}`;
  }

  /**
   * 取得所有可用的訂餐通道
   */
  static async getChannels(): Promise<OrderChannel[]> {
    const { data, error } = await supabase
      .from('order_channels')
      .select('*')
      .eq('is_active', true)
      .order('id');

    if (error) {
      console.error('取得通道失敗:', error);
      return [];
    }

    return data || [];
  }

  /**
   * 建立新訂單
   */
  static async createOrder(orderData: OrderData) {
    try {
      // 1. 生成訂單號
      const orderNumber = await this.generateOrderNumber(orderData.channel_code);

      // 2. 取得通道ID
      const { data: channelData } = await supabase
        .from('order_channels')
        .select('id')
        .eq('channel_code', orderData.channel_code)
        .single();

      if (!channelData) {
        throw new Error('找不到指定的訂餐通道');
      }

      // 3. 建立訂單主檔
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          channel_id: channelData.id,
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          total_amount: orderData.total_amount,
          payment_method: orderData.payment_method || 'cash',
          delivery_type: orderData.delivery_type || 'dine_in',
          special_notes: orderData.special_notes
        })
        .select()
        .single();

      if (orderError) {
        throw new Error(`建立訂單失敗: ${orderError.message}`);
      }

      // 4. 建立訂單明細
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        item_name: item.name,
        item_price: item.price,
        quantity: item.quantity,
        special_notes: item.notes
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error(`建立訂單明細失敗: ${itemsError.message}`);
      }

      return {
        success: true,
        order_number: orderNumber,
        order_id: order.id
      };

    } catch (error) {
      console.error('建立訂單失敗:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知錯誤'
      };
    }
  }

  /**
   * 取得今日訂單統計
   */
  static async getTodayStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: orderStats, error: orderError } = await supabase
      .from('orders')
      .select('channel_id, status, total_amount')
      .gte('created_at', today);

    if (orderError) {
      console.error('取得今日訂單統計失敗:', orderError);
      return null;
    }

    // 計算統計資料
    const stats = {
      total_orders: orderStats?.length || 0,
      total_amount: orderStats?.reduce((sum, order) => sum + order.total_amount, 0) || 0,
      online_orders: orderStats?.filter(order => order.channel_id === 1).length || 0,
      walkin_orders: orderStats?.filter(order => order.channel_id === 2).length || 0,
      pending_orders: orderStats?.filter(order => order.status === 'pending').length || 0,
      completed_orders: orderStats?.filter(order => order.status === 'completed').length || 0
    };

    return stats;
  }
} 