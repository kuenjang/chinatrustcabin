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
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  // 新增：取餐方式顏色樣式
  const getDeliveryTypeStyle = (deliveryType: string) => {
    if (deliveryType === 'dine_in') {
      return 'bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 rounded-full text-sm font-medium border';
    } else {
      return 'bg-orange-50 text-orange-700 border-orange-200 px-3 py-1 rounded-full text-sm font-medium border';
    }
  };

  const getDeliveryTypeIcon = (deliveryType: string) => {
    if (deliveryType === 'dine_in') {
      return '🍽️';
    } else {
      return '🥡';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">載入中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🍽️ 餐廳管理後台</h1>
          <p className="text-gray-600">管理訂單、查看統計、即時監控</p>
        </div>

        {/* 分頁切換 */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('orderDetails')}
              className={`py-3 px-6 rounded-md font-medium text-sm transition-all duration-200 ${
                activeTab === 'orderDetails'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📋 訂單詳情
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-6 rounded-md font-medium text-sm transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📊 訂單管理
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-3 px-6 rounded-md font-medium text-sm transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📈 今日概覽
            </button>
          </nav>
        </div>

        {/* 訂單詳情頁面 */}
        {activeTab === 'orderDetails' && (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h2 className="text-2xl font-bold text-white">📋 訂單詳情總覽</h2>
              <p className="text-blue-100 mt-1">查看所有訂單的詳細餐品資訊</p>
            </div>
            <div className="p-8">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍽️</div>
                  <p className="text-gray-500 text-lg">目前沒有訂單</p>
                  <p className="text-gray-400 text-sm mt-2">當有新訂單時，會在這裡顯示</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                      {/* 訂單基本資訊 */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">
                              📄 {order.order_number}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">📱 通道：</span>
                              <span className="font-medium text-gray-900">{order.channel?.channel_name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">👤 客戶：</span>
                              <span className="font-medium text-gray-900">{order.customer_name || '-'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">取餐：</span>
                              <span className={`inline-flex items-center ${getDeliveryTypeStyle(order.delivery_type)}`}>
                                {getDeliveryTypeIcon(order.delivery_type)} {order.delivery_type === 'dine_in' ? '內用' : '外帶'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">💰 總計：</span>
                              <span className="font-bold text-lg text-green-600">${order.total_amount}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          👁️ 查看完整詳情
                        </button>
                      </div>

                      {/* 餐點明細 */}
                      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                          🍽️ 餐點明細
                        </h4>
                        {order.order_items && order.order_items.length > 0 ? (
                          <div className="space-y-3">
                            {order.order_items.map((item) => (
                              <div key={item.id} className="flex justify-between items-start py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3">
                                    <span className="font-semibold text-gray-900 text-lg">{item.item_name}</span>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">x{item.quantity}</span>
                                  </div>
                                  {item.special_notes && (
                                    <div className="mt-2 flex items-start space-x-2">
                                      <span className="text-yellow-600">📝</span>
                                      <p className="text-sm text-gray-600 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                                        {item.special_notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-gray-900 text-lg">${item.item_price * item.quantity}</div>
                                  <div className="text-sm text-gray-500">單價：${item.item_price}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">🍽️</div>
                            <p>無餐點明細</p>
                          </div>
                        )}
                      </div>

                      {/* 訂單時間 */}
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <span>⏰ 建立時間：{new Date(order.created_at).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}</span>
                        <span className="text-blue-600">#{order.id.slice(0, 8)}</span>
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
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-600">
              <h2 className="text-2xl font-bold text-white">📊 訂單管理</h2>
              <p className="text-green-100 mt-1">管理訂單狀態和操作</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      訂單號
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      通道
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      客戶
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      金額
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      取餐方式
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      狀態
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      時間
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.channel?.channel_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customer_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        ${order.total_amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center ${getDeliveryTypeStyle(order.delivery_type)}`}>
                          {getDeliveryTypeIcon(order.delivery_type)} {order.delivery_type === 'dine_in' ? '內用' : '外帶'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200"
                          >
                            👁️ 查看
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="pending">待處理</option>
                            <option value="processing">處理中</option>
                            <option value="completed">已完成</option>
                            <option value="cancelled">已取消</option>
                          </select>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors duration-200"
                          >
                            🗑️ 刪除
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
            <div className="bg-white overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">總訂單數</dt>
                      <dd className="text-2xl font-bold text-gray-900">{todayStats.total_orders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">總營業額</dt>
                      <dd className="text-2xl font-bold text-green-600">${todayStats.total_amount}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">線上點餐</dt>
                      <dd className="text-2xl font-bold text-gray-900">{todayStats.online_orders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">現場點餐</dt>
                      <dd className="text-2xl font-bold text-gray-900">{todayStats.walkin_orders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 訂單詳情彈出視窗 */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">📋 訂單詳情</h2>
                  <p className="text-gray-600 mt-1">訂單號：{selectedOrder.order_number}</p>
                </div>
                <button
                  onClick={closeOrderDetails}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 訂單基本資訊 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">📄 訂單號</label>
                  <p className="text-lg font-bold text-gray-900">{selectedOrder.order_number}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">📱 訂餐通道</label>
                  <p className="text-lg font-medium text-gray-900">{selectedOrder.channel?.channel_name}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">👤 客戶姓名</label>
                  <p className="text-lg font-medium text-gray-900">{selectedOrder.customer_name || '-'}</p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">取餐方式</label>
                  <span className={`inline-flex items-center ${getDeliveryTypeStyle(selectedOrder.delivery_type)}`}>
                    {getDeliveryTypeIcon(selectedOrder.delivery_type)} {selectedOrder.delivery_type === 'dine_in' ? '內用' : '外帶'}
                  </span>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">📊 訂單狀態</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">⏰ 建立時間</label>
                  <p className="text-lg font-medium text-gray-900">
                    {new Date(selectedOrder.created_at).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
                  </p>
                </div>
              </div>

              {/* 餐點明細 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  🍽️ 餐點明細
                </h3>
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6">
                    {selectedOrder.order_items.map((item, index) => (
                      <div key={item.id} className={`bg-white rounded-xl p-4 shadow-sm ${index > 0 ? 'mt-4' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-bold text-gray-900 text-lg">{item.item_name}</span>
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">x{item.quantity}</span>
                            </div>
                            {item.special_notes && (
                              <div className="mt-3 flex items-start space-x-2">
                                <span className="text-yellow-600 text-lg">📝</span>
                                <p className="text-sm text-gray-700 bg-yellow-50 px-4 py-3 rounded-lg border border-yellow-200 flex-1">
                                  {item.special_notes}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-bold text-gray-900 text-xl">${item.item_price * item.quantity}</div>
                            <div className="text-sm text-gray-500">單價：${item.item_price}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="text-6xl mb-4">🍽️</div>
                    <p className="text-gray-500 text-lg">無餐點明細</p>
                  </div>
                )}
              </div>

              {/* 總計 */}
              <div className="border-t-2 border-gray-200 pt-6">
                <div className="flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                  <span className="text-xl font-bold text-gray-900">💰 總計</span>
                  <span className="text-3xl font-bold text-green-600">${selectedOrder.total_amount}</span>
                </div>
              </div>

              {/* 關閉按鈕 */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={closeOrderDetails}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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