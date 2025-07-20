'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
  id: number;
  menu_item_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  note: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('獲取訂單失敗:', error);
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

      if (response.ok) {
        fetchOrders(); // 重新獲取訂單
      }
    } catch (error) {
      console.error('更新訂單狀態失敗:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待處理';
      case 'preparing': return '製作中';
      case 'ready': return '已完成';
      case 'completed': return '已交付';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-xl">載入中...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 shadow-lg transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-orange-600">
                🍽️ 中信小屋
              </h1>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                後台管理系統
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchOrders}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                🔄 重新整理
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 訂單列表 */}
          <div className="lg:col-span-2">
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              訂單列表 ({orders.length})
            </h2>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`p-6 rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 hover:border-orange-500' 
                      : 'bg-white border-gray-200 hover:border-orange-500'
                  } ${selectedOrder?.id === order.id ? 'border-orange-500' : ''}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-orange-600">
                        {order.order_number}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {new Date(order.created_at).toLocaleString('zh-TW')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      👤 {order.customer_name} | 📞 {order.customer_phone}
                    </p>
                    {order.customer_address && (
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        📍 {order.customer_address}
                      </p>
                    )}
                    <p className="font-bold text-lg text-orange-600">
                      💰 NT$ {order.total_amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 訂單詳情 */}
          <div className="lg:col-span-1">
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              訂單詳情
            </h2>
            
            {selectedOrder ? (
              <div className={`p-6 rounded-lg shadow-sm border-2 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-xl text-orange-600 mb-2">
                      {selectedOrder.order_number}
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {new Date(selectedOrder.created_at).toLocaleString('zh-TW')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <strong>客戶姓名:</strong> {selectedOrder.customer_name}
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <strong>電話:</strong> {selectedOrder.customer_phone}
                    </p>
                    {selectedOrder.customer_address && (
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <strong>地址:</strong> {selectedOrder.customer_address}
                      </p>
                    )}
                    {selectedOrder.note && (
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <strong>備註:</strong> {selectedOrder.note}
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className={`font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      訂單內容:
                    </h4>
                    <div className="space-y-2">
                      {selectedOrder.order_items.map((item, index) => (
                        <div key={index} className={`flex justify-between text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <span>{item.menu_item_name} x{item.quantity}</span>
                          <span>NT$ {item.subtotal}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`border-t mt-4 pt-4 flex justify-between font-bold ${
                      isDarkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-800'
                    }`}>
                      <span>總計:</span>
                      <span className="text-orange-600">NT$ {selectedOrder.total_amount}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      更新狀態:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['pending', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(selectedOrder.id, status)}
                          className={`px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                            selectedOrder.status === status
                              ? 'bg-orange-500 text-white'
                              : isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {getStatusText(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-lg shadow-sm border-2 text-center ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'
              }`}>
                請選擇一個訂單查看詳情
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 