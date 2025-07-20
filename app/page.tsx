'use client';
import React, { useState, useEffect } from 'react';
import MenuCard from '../components/MenuCard';
import OrderSidebar from '../components/OrderSidebar';
import Link from 'next/link';

// 部署版本標記 - 強制重新部署
const DEPLOY_VERSION = 'v1.0.1';

// 分類商品資料
const menuList = [
  {
    category: '飲料 / Drinks',
    items: [
      { name: '紅茶 (中杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 20 },
      { name: '紅茶 (大杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 25 },
      { name: '無糖綠茶 (茶包)', description: '可選擇熱飲(H)或冰飲(I)', price: 20 },
      { name: '奶茶 (中杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 25 },
      { name: '奶茶 (大杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 30 },
      { name: '豆漿 (中杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 25 },
      { name: '豆漿 (大杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 30 },
      { name: '蘋果紅茶 (中杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 25 },
      { name: '蘋果紅茶 (大杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 30 },
      { name: '可可亞 (中杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 35 },
      { name: '可可亞 (大杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 40 },
      { name: '鮮奶茶 (中杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 35 },
      { name: '鮮奶茶 (大杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 40 },
    ],
  },
  {
    category: '研磨咖啡 / Coffee',
    items: [
      { name: '熱咖啡', description: '香醇研磨咖啡', price: 40 },
      { name: '特調冰咖啡', description: '特製冰咖啡', price: 40 },
    ],
  },
  {
    category: '鐵板麵 (+蛋10元)',
    items: [
      { name: '蘑菇麵', description: '香炒蘑菇鐵板麵', price: 40 },
      { name: '黑胡椒麵', description: '黑胡椒風味鐵板麵', price: 40 },
      { name: '蕃茄肉醬麵', description: '蕃茄肉醬鐵板麵', price: 40 },
    ],
  },
  {
    category: '蛋餅',
    items: [
      { name: '原味蛋餅', description: '經典原味蛋餅', price: 20 },
      { name: '蔬菜蛋餅', description: '新鮮蔬菜蛋餅', price: 25 },
      { name: '玉米蛋餅', description: '香甜玉米蛋餅', price: 30 },
      { name: '肉鬆蛋餅', description: '香酥肉鬆蛋餅', price: 30 },
      { name: '熱狗蛋餅', description: '熱狗蛋餅', price: 30 },
      { name: '火腿蛋餅', description: '火腿蛋餅', price: 30 },
      { name: '起司蛋餅', description: '濃郁起司蛋餅', price: 30 },
      { name: '薯餅蛋餅', description: '香脆薯餅蛋餅', price: 35 },
      { name: '鮪魚蛋餅', description: '鮮美鮪魚蛋餅', price: 35 },
    ],
  },
  {
    category: '蔥抓餅',
    items: [
      { name: '原味蔥抓餅', description: '經典原味蔥抓餅', price: 30 },
      { name: '加蛋蔥抓餅', description: '加蛋蔥抓餅', price: 40 },
      { name: '火腿蔥抓餅', description: '火腿蔥抓餅', price: 45 },
      { name: '玉米蔥抓餅', description: '玉米蔥抓餅', price: 45 },
      { name: '肉鬆蔥抓餅', description: '肉鬆蔥抓餅', price: 45 },
      { name: '起司蔥抓餅', description: '起司蔥抓餅', price: 45 },
      { name: '鮪魚蔥抓餅', description: '鮪魚蔥抓餅', price: 50 },
      { name: '培根蔥抓餅', description: '培根蔥抓餅', price: 50 },
      { name: '燒肉蔥抓餅', description: '燒肉蔥抓餅', price: 55 },
      { name: '香雞蔥抓餅', description: '香雞蔥抓餅', price: 55 },
      { name: '薯餅蔥抓餅', description: '薯餅蔥抓餅', price: 55 },
    ],
  },
  {
    category: '厚片',
    items: [
      { name: '巧克力厚片', description: '香濃巧克力厚片', price: 30 },
      { name: '花生厚片', description: '香脆花生厚片', price: 30 },
      { name: '草莓厚片', description: '香甜草莓厚片', price: 30 },
      { name: '沙拉厚片', description: '清爽沙拉厚片', price: 30 },
      { name: '奶酥厚片', description: '香酥奶酥厚片', price: 30 },
    ],
  },
];

// 訂單商品型別
interface OrderItem {
  name: string;
  price: number;
  qty: number;
  note?: string;
}

// 訂單確認彈出視窗型別
interface OrderConfirmation {
  show: boolean;
  orderNumber: string;
  deliveryType: string;
  totalAmount: number;
}

export default function HomePage() {
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation>({
    show: false,
    orderNumber: '',
    deliveryType: '',
    totalAmount: 0
  });

  // 深色模式切換
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 加入訂單
  const handleAddToOrder = (item: { name: string; price: number }) => {
    setOrder(prev => {
      const exist = prev.find(i => i.name === item.name);
      if (exist) {
        return prev.map(i =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        return [...prev, { ...item, qty: 1, note: '' }];
      }
    });
  };

  // 調整數量
  const handleChangeQty = (name: string, qty: number) => {
    setOrder(prev =>
      prev.map(i => (i.name === name ? { ...i, qty: Math.max(1, qty) } : i))
    );
  };

  // 刪除商品
  const handleRemove = (name: string) => {
    setOrder(prev => prev.filter(i => i.name !== name));
  };

  // 修改特殊要求
  const handleChangeNote = (name: string, note: string) => {
    setOrder(prev =>
      prev.map(i => (i.name === name ? { ...i, note } : i))
    );
  };

  // 計算總金額
  const totalAmount = order.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // 關閉訂單確認彈出視窗
  const closeOrderConfirmation = () => {
    setOrderConfirmation(prev => ({ ...prev, show: false }));
  };

  // 結帳
  const handleCheckout = async () => {
    if (order.length === 0) {
      alert('請先選擇餐點！');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        channel_code: 'ON', // 線上點餐
        customer_name: '線上客戶',
        customer_phone: '',
        total_amount: totalAmount,
        payment_method: 'cash',
        delivery_type: deliveryType,
        special_notes: '',
        items: order.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.qty,
          notes: item.note
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        // 顯示美觀的訂單確認彈出視窗
        setOrderConfirmation({
          show: true,
          orderNumber: result.order_number,
          deliveryType: deliveryType === 'dine_in' ? '內用' : '外帶',
          totalAmount: totalAmount
        });
        
        // 清空購物車
        setOrder([]);
        setDeliveryType('dine_in');
      } else {
        alert(`訂單建立失敗：${result.error}`);
      }
    } catch (error) {
      console.error('訂單提交失敗:', error);
      alert('訂單提交失敗，請稍後再試！');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 從完整訂單號中提取簡化號碼
  const getSimpleOrderNumber = (fullOrderNumber: string) => {
    const match = fullOrderNumber.match(/ON-(\d+)$/);
    return match ? match[1] : fullOrderNumber;
  };

  // 檢查商品是否已選擇
  const isItemSelected = (itemName: string) => {
    return order.some(item => item.name === itemName);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 導航欄 */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                🍽️ 中信小屋訂餐系統
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* 購物車指示器 */}
              <div className="relative">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-blue-700 dark:text-blue-400 font-semibold">
                    🛒 {order.length}
                  </span>
                </div>
                {order.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {order.length}
                  </div>
                )}
              </div>

              {/* 深色模式切換 */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              {/* 後台管理連結 */}
              <Link 
                href="/admin" 
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                後台管理
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左側：菜單選擇 */}
          <section className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
              📋 美味菜單
            </h2>
            
            <div className="space-y-8">
              {menuList.map((group, groupIndex) => (
                <div 
                  key={group.category} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${groupIndex * 100}ms` }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <span className="text-3xl">
                      {group.category.includes('飲料') ? '🥤' : 
                       group.category.includes('咖啡') ? '☕' :
                       group.category.includes('麵') ? '🍜' :
                       group.category.includes('蛋餅') ? '🥞' :
                       group.category.includes('蔥抓餅') ? '🫓' :
                       group.category.includes('厚片') ? '🍞' : '🍽️'}
                    </span>
                    {group.category}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {group.items.map((item, itemIndex) => (
                      <div
                        key={item.name}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${(groupIndex * 100) + (itemIndex * 50)}ms` }}
                      >
                        <MenuCard
                          name={item.name}
                          description={item.description}
                          price={item.price}
                          onAdd={() => handleAddToOrder(item)}
                          isSelected={isItemSelected(item.name)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 右側：購物車 */}
          <aside className="w-full lg:w-96 lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
              🛒 購物車
            </h2>
            
            <OrderSidebar
              order={order}
              onChangeQty={handleChangeQty}
              onRemove={handleRemove}
              onChangeNote={handleChangeNote}
            />

            {/* 取餐方式選擇 */}
            {order.length > 0 && (
              <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">取餐方式</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="dine_in"
                      checked={deliveryType === 'dine_in'}
                      onChange={(e) => setDeliveryType(e.target.value as 'dine_in' | 'takeaway')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      🍽️ 內用
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="takeaway"
                      checked={deliveryType === 'takeaway'}
                      onChange={(e) => setDeliveryType(e.target.value as 'dine_in' | 'takeaway')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      📦 外帶
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* 結帳按鈕 */}
            {order.length > 0 && (
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl text-lg font-bold mt-6 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    處理中...
                  </div>
                ) : (
                  `💳 結帳 NT$${totalAmount}`
                )}
              </button>
            )}
          </aside>
        </div>
      </main>

      {/* 訂單確認彈出視窗 */}
      {orderConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scale-in">
            {/* 成功圖示 */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">🎉 訂單建立成功！</h2>
            </div>

            {/* 訂單資訊 */}
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">完整訂單號</div>
                <div className="text-lg font-mono text-gray-900 dark:text-gray-100">{orderConfirmation.orderNumber}</div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700">
                <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">📋 請記住您的訂單號</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 text-center">
                  {getSimpleOrderNumber(orderConfirmation.orderNumber)}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400 text-center mt-1">取餐時請報此號碼</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
                  <div className="text-sm text-green-600 dark:text-green-400 mb-1">取餐方式</div>
                  <div className="font-semibold text-green-700 dark:text-green-300">{orderConfirmation.deliveryType}</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3">
                  <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">總金額</div>
                  <div className="font-bold text-orange-700 dark:text-orange-300">NT${orderConfirmation.totalAmount}</div>
                </div>
              </div>
            </div>

            {/* 溫馨提示 */}
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-600 dark:text-yellow-400 text-lg">💡</span>
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <div className="font-semibold mb-1">取餐提醒：</div>
                  <ul className="space-y-1">
                    <li>• 請記住您的訂單號：<span className="font-bold text-yellow-900 dark:text-yellow-100">{getSimpleOrderNumber(orderConfirmation.orderNumber)}</span></li>
                    <li>• 取餐時請主動報出訂單號</li>
                    <li>• 我們會盡快為您準備餐點</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 確認按鈕 */}
            <div className="text-center">
              <button
                onClick={closeOrderConfirmation}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 自定義動畫樣式 */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
} 