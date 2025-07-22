'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: number;
  order_number: string;
  channel_code: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  created_at: string;
  note?: string;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: number;
  order_id: number;
  menu_item_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  size?: string; // Added for size option
  notes?: string; // Added for notes option
}

interface TodayStats {
  total_orders: number;
  total_revenue: number;
  online_orders: number;
  walkin_orders: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'details' | 'management' | 'overview'>('details');
  const [orders, setOrders] = useState<Order[]>([]);
  const [todayStats, setTodayStats] = useState<TodayStats>({
    total_orders: 0,
    total_revenue: 0,
    online_orders: 0,
    walkin_orders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('開始載入後台資料...');
      
      // 使用 API 路由載入資料
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const ordersData = data.orders || [];
      
      console.log('訂單載入成功:', ordersData.length, '筆');
      
      setOrders(ordersData);

      // 計算今日統計
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = ordersData.filter((order: Order) => 
        order.created_at.startsWith(today)
      );

      console.log('今日訂單:', todayOrders.length, '筆');

      const stats: TodayStats = {
        total_orders: todayOrders.length,
        total_revenue: todayOrders.reduce((sum: number, order: Order) => sum + order.total_amount, 0),
        online_orders: todayOrders.filter((order: Order) => order.channel_code === 'ON').length,
        walkin_orders: todayOrders.filter((order: Order) => order.channel_code === 'WA').length
      };

      setTodayStats(stats);
      console.log('統計資料計算完成:', stats);
      
    } catch (error) {
      console.error('載入資料失敗:', error);
      setError(error instanceof Error ? error.message : '載入資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('更新失敗');
      }
      
      // 重新載入資料
      loadData();
    } catch (error) {
      console.error('更新訂單狀態失敗:', error);
      alert('更新訂單狀態失敗');
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm('確定要刪除此訂單嗎？')) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('刪除失敗');
      }
      
      loadData();
    } catch (error) {
      console.error('刪除訂單失敗:', error);
      alert('刪除訂單失敗');
    }
  };

  const getOrderItems = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    return order?.order_items || [];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? '下午' : '上午';
    const displayHours = hours % 12 || 12;
    
    return `${year}/${month}/${day} ${ampm}${displayHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">載入失敗</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={loadData}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              重新載入
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">餐廳管理後台</h1>
                <p className="text-sm text-gray-600">管理訂單、查看統計、即時監控</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">共 {orders.length} 筆訂單</span>
              <button
                onClick={loadData}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                重新載入
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              訂單詳情
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'management'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              訂單管理
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              今日概覽
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">今日概覽</h2>
              <p className="text-gray-600">查看今日的訂單統計和營運狀況</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 總訂單數 */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">總訂單數</p>
                    <p className="text-2xl font-semibold text-gray-900">{todayStats.total_orders}</p>
                  </div>
                </div>
              </div>

              {/* 總營業額 */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">總營業額</p>
                    <p className="text-2xl font-semibold text-gray-900">${todayStats.total_revenue}</p>
                  </div>
                </div>
              </div>

              {/* 線上點餐 */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">線上點餐</p>
                    <p className="text-2xl font-semibold text-gray-900">{todayStats.online_orders}</p>
                  </div>
                </div>
              </div>

              {/* 現場點餐 */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">現場點餐</p>
                    <p className="text-2xl font-semibold text-gray-900">{todayStats.walkin_orders}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'management' && (
          <div>
            <div className="mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-green-800">訂單管理</h2>
                <p className="text-green-700">管理訂單狀態和操作</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">尚無訂單</h3>
                <p className="text-gray-500">目前沒有任何訂單資料</p>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">訂單號</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">通道</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客戶</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">取餐方式</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時間</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.order_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.channel_code === 'ON' ? '線上點餐' : '現場點餐'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.customer_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            ${order.total_amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              內用
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value="pending">待處理</option>
                              <option value="preparing">製作中</option>
                              <option value="ready">已完成</option>
                              <option value="completed">已取餐</option>
                              <option value="cancelled">已取消</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-xs"
                            >
                              查看
                            </button>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-xs"
                            >
                              刪除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div>
            <div className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-blue-800">訂單詳情總覽</h2>
                <p className="text-blue-700">查看所有訂單的詳細餐品資訊</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">尚無訂單</h3>
                <p className="text-gray-500">目前沒有任何訂單資料</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{order.order_number}</h3>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        查看完整詳情
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">通道:</span>
                        <p className="font-medium">{order.channel_code === 'ON' ? '線上點餐' : '現場點餐'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">客戶:</span>
                        <p className="font-medium">{order.customer_name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">取餐:</span>
                        <p className="font-medium">內用</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">總計:</span>
                        <p className="font-medium text-lg text-green-600">${order.total_amount}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">餐點明細:</h4>
                      <div className="space-y-2">
                        {getOrderItems(order.id).map((item) => {
                          const options = [item.size, item.notes].filter(Boolean).join(', ');
                          const displayName = options ? `${item.menu_item_name}（${options}）` : item.menu_item_name;
                          return (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                              <span>{displayName} x{item.quantity}</span>
                              <span className="text-gray-500">單價: ${item.price}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                      建立時間: {formatDate(order.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">訂單詳情 - {selectedOrder.order_number}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">訂單號碼:</span>
                    <p className="font-medium">{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">客戶姓名:</span>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">客戶電話:</span>
                    <p className="font-medium">{selectedOrder.customer_phone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">訂單狀態:</span>
                    <p className="font-medium">{selectedOrder.status || '待處理'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">總金額:</span>
                    <p className="font-medium text-lg text-green-600">${selectedOrder.total_amount}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">建立時間:</span>
                    <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                </div>

                {selectedOrder.note && (
                  <div>
                    <span className="text-sm text-gray-500">備註:</span>
                    <p className="font-medium">{selectedOrder.note}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">餐點明細:</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">餐品名稱</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">數量</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">單價</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">小計</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getOrderItems(selectedOrder.id).map((item) => {
                          const options = [item.size, item.notes].filter(Boolean).join(', ');
                          const displayName = options ? `${item.menu_item_name}（${options}）` : item.menu_item_name;
                          return (
                            <tr key={item.id}>
                              <td className="px-4 py-2 text-sm text-gray-900">{displayName}</td>
                              <td className="px-4 py-2 text-sm text-gray-500">{item.quantity}</td>
                              <td className="px-4 py-2 text-sm text-gray-500">${item.price}</td>
                              <td className="px-4 py-2 text-sm text-gray-900 font-medium">${item.subtotal}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 