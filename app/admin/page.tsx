'use client';

import React, { useState, useEffect } from 'react';
import { OrderNumberService } from '../../lib/orderNumberService';
import { supabase } from '../../lib/supabaseClient';

interface OrderItem {
  id: number;
  item_name: string;
  item_price: number;
  quantity: number;
  special_notes?: string;
}

interface Order {
  id: string; // 改為 string 類型 (UUID)
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  delivery_type: string;
  created_at: string;
  channel: {
    channel_name: string;
  };
  order_items?: OrderItem[];
}

interface TodayStats {
  total_orders: number;
  total_amount: number;
  online_orders: number;
  walkin_orders: number;
  pending_orders: number;
  completed_orders: number;
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orderDetails' | 'orders' | 'dashboard'>('orderDetails');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // 載入訂單資料
  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          channel:order_channels(channel_name),
          order_items(id, item_name, item_price, quantity, special_notes)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('載入訂單失敗:', error);
    }
  };

  // 載入今日統計
  const loadTodayStats = async () => {
    try {
      const stats = await OrderNumberService.getTodayStats();
      setTodayStats(stats);
    } catch (error) {
      console.error('載入今日統計失敗:', error);
    }
  };

  // 更新訂單狀態
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      await Promise.all([loadOrders(), loadTodayStats()]);
    } catch (error) {
      console.error('更新訂單狀態失敗:', error);
    }
  };

  // 查看訂單詳情
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // 關閉訂單詳情
  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setShowOrderDetails(false);
  };

  // 刪除訂單
  const deleteOrder = async (orderId: string) => {
    if (!confirm('確定要刪除這個訂單嗎？此操作無法復原。')) {
      return;
    }

    try {
      // 1. 先刪除叫號記錄（如果存在）
      const { error: queueError } = await supabase
        .from('queue_numbers')
        .delete()
        .eq('order_id', orderId);

      if (queueError) {
        console.warn('刪除叫號記錄時出現警告:', queueError);
        // 不中斷執行，繼續刪除其他資料
      }

      // 2. 刪除訂單明細
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (itemsError) {
        console.error('刪除訂單明細失敗:', itemsError);
        throw itemsError;
      }

      // 3. 最後刪除訂單主檔
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (orderError) {
        console.error('刪除訂單主檔失敗:', orderError);
        throw orderError;
      }

      await Promise.all([loadOrders(), loadTodayStats()]);
      alert('訂單已成功刪除');
    } catch (error) {
      console.error('刪除訂單失敗:', error);
      alert(`刪除訂單失敗：${error instanceof Error ? error.message : '未知錯誤'}`);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadOrders(), loadTodayStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待處理';
      case 'processing': return '處理中';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">餐廳管理後台</h1>

        {/* 分頁切換 */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('orderDetails')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orderDetails'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              訂單詳情
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              訂單管理
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              今日概覽
            </button>
          </nav>
        </div>

        {/* 訂單詳情頁面 */}
        {activeTab === 'orderDetails' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">訂單詳情總覽</h2>
              <p className="text-sm text-gray-600 mt-1">查看所有訂單的詳細餐品資訊</p>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  目前沒有訂單
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      {/* 訂單基本資訊 */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            訂單號：{order.order_number}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <span>通道：{order.channel?.channel_name}</span>
                            <span>客戶：{order.customer_name || '-'}</span>
                            <span>取餐：{order.delivery_type === 'dine_in' ? '內用' : '外帶'}</span>
                            <span>總計：${order.total_amount}</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          查看完整詳情
                        </button>
                      </div>

                      {/* 餐點明細 */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">餐點明細</h4>
                        {order.order_items && order.order_items.length > 0 ? (
                          <div className="space-y-2">
                            {order.order_items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-900">{item.item_name}</span>
                                    <span className="text-sm text-gray-500">x{item.quantity}</span>
                                  </div>
                                  {item.special_notes && (
                                    <p className="text-sm text-gray-600 mt-1">備註：{item.special_notes}</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span className="font-medium text-gray-900">${item.item_price * item.quantity}</span>
                                  <div className="text-sm text-gray-500">單價：${item.item_price}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">無餐點明細</p>
                        )}
                      </div>

                      {/* 訂單時間 */}
                      <div className="mt-3 text-sm text-gray-500">
                        建立時間：{new Date(order.created_at).toLocaleString('zh-TW')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 訂單管理 */}
        {activeTab === 'orders' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">訂單列表</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      訂單號
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      通道
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      客戶
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      金額
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      取餐方式
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      狀態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      時間
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.channel?.channel_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customer_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.total_amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.delivery_type === 'dine_in' ? '內用' : '外帶'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString('zh-TW')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            查看詳情
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="pending">待處理</option>
                            <option value="processing">處理中</option>
                            <option value="completed">已完成</option>
                            <option value="cancelled">已取消</option>
                          </select>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 今日概覽 */}
        {activeTab === 'dashboard' && todayStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">總訂單數</dt>
                      <dd className="text-lg font-medium text-gray-900">{todayStats.total_orders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">總營業額</dt>
                      <dd className="text-lg font-medium text-gray-900">${todayStats.total_amount}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">線上點餐</dt>
                      <dd className="text-lg font-medium text-gray-900">{todayStats.online_orders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">現場點餐</dt>
                      <dd className="text-lg font-medium text-gray-900">{todayStats.walkin_orders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 訂單詳情彈出視窗 */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">訂單詳情</h2>
                <button
                  onClick={closeOrderDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 訂單基本資訊 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">訂單號</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedOrder.order_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">訂餐通道</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedOrder.channel?.channel_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">客戶姓名</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedOrder.customer_name || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">取餐方式</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedOrder.delivery_type === 'dine_in' ? '內用' : '外帶'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">訂單狀態</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">建立時間</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedOrder.created_at).toLocaleString('zh-TW')}
                  </p>
                </div>
              </div>

              {/* 餐點明細 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">餐點明細</h3>
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    {selectedOrder.order_items.map((item, index) => (
                      <div key={item.id} className={`flex justify-between items-start py-2 ${index > 0 ? 'border-t border-gray-200' : ''}`}>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{item.item_name}</span>
                            <span className="text-sm text-gray-500">x{item.quantity}</span>
                          </div>
                          {item.special_notes && (
                            <p className="text-sm text-gray-600 mt-1">備註：{item.special_notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-gray-900">${item.item_price * item.quantity}</span>
                          <div className="text-sm text-gray-500">單價：${item.item_price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">無餐點明細</p>
                )}
              </div>

              {/* 總計 */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">總計</span>
                  <span className="text-xl font-bold text-gray-900">${selectedOrder.total_amount}</span>
                </div>
              </div>

              {/* 關閉按鈕 */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeOrderDetails}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 