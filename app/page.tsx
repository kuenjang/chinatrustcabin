'use client';

import { useState, useEffect } from 'react';
import MenuCard from '../components/MenuCard';
import OrderSidebar from '../components/OrderSidebar';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
}

const menuItems: MenuItem[] = [
  // 蛋餅類
  { id: 1, name: '原味蛋餅', price: 20, category: '蛋餅', description: '經典原味蛋餅' },
  { id: 2, name: '蔬菜蛋餅', price: 25, category: '蛋餅', description: '新鮮蔬菜蛋餅' },
  { id: 3, name: '玉米蛋餅', price: 30, category: '蛋餅', description: '香甜玉米蛋餅' },
  { id: 4, name: '肉鬆蛋餅', price: 30, category: '蛋餅', description: '香酥肉鬆蛋餅' },
  { id: 5, name: '熱狗蛋餅', price: 30, category: '蛋餅', description: '熱狗蛋餅' },
  { id: 6, name: '火腿蛋餅', price: 30, category: '蛋餅', description: '火腿蛋餅' },
  { id: 7, name: '起司蛋餅', price: 30, category: '蛋餅', description: '濃郁起司蛋餅' },
  { id: 8, name: '薯餅蛋餅', price: 35, category: '蛋餅', description: '香脆薯餅蛋餅' },
  { id: 9, name: '鮪魚蛋餅', price: 35, category: '蛋餅', description: '鮮美鮪魚蛋餅' },

  // 蔥抓餅類
  { id: 10, name: '原味蔥抓餅', price: 30, category: '蔥抓餅', description: '經典原味蔥抓餅' },
  { id: 11, name: '加蛋蔥抓餅', price: 40, category: '蔥抓餅', description: '加蛋蔥抓餅' },
  { id: 12, name: '火腿蔥抓餅', price: 45, category: '蔥抓餅', description: '火腿蔥抓餅' },
  { id: 13, name: '玉米蔥抓餅', price: 45, category: '蔥抓餅', description: '玉米蔥抓餅' },
  { id: 14, name: '肉鬆蔥抓餅', price: 45, category: '蔥抓餅', description: '肉鬆蔥抓餅' },
  { id: 15, name: '起司蔥抓餅', price: 45, category: '蔥抓餅', description: '起司蔥抓餅' },
  { id: 16, name: '鮪魚蔥抓餅', price: 50, category: '蔥抓餅', description: '鮪魚蔥抓餅' },
  { id: 17, name: '培根蔥抓餅', price: 50, category: '蔥抓餅', description: '培根蔥抓餅' },
  { id: 18, name: '燒肉蔥抓餅', price: 55, category: '蔥抓餅', description: '燒肉蔥抓餅' },
  { id: 19, name: '香雞蔥抓餅', price: 55, category: '蔥抓餅', description: '香雞蔥抓餅' },
  { id: 20, name: '薯餅蔥抓餅', price: 55, category: '蔥抓餅', description: '薯餅蔥抓餅' },

  // 炒飯麵類
  { id: 21, name: '炒飯', price: 60, category: '炒飯麵類', description: '香噴噴的炒飯，配料豐富' },
  { id: 22, name: '炒泡麵', price: 50, category: '炒飯麵類', description: 'Q彈炒泡麵，香辣可口' },
  { id: 23, name: '炒意麵', price: 55, category: '炒飯麵類', description: '義大利麵炒製，口感絕佳' },

  // 鐵板麵類
  { id: 24, name: '蘑菇麵', price: 40, category: '鐵板麵', description: '蘑菇鐵板麵 (+蛋10元)' },
  { id: 25, name: '黑胡椒麵', price: 40, category: '鐵板麵', description: '黑胡椒鐵板麵 (+蛋10元)' },
  { id: 26, name: '蕃茄肉醬麵', price: 40, category: '鐵板麵', description: '蕃茄肉醬鐵板麵 (+蛋10元)' },

  // 厚片類
  { id: 27, name: '巧克力厚片', price: 30, category: '厚片', description: '巧克力厚片吐司' },
  { id: 28, name: '花生厚片', price: 30, category: '厚片', description: '花生厚片吐司' },
  { id: 29, name: '草莓厚片', price: 30, category: '厚片', description: '草莓厚片吐司' },
  { id: 30, name: '沙拉厚片', price: 30, category: '厚片', description: '沙拉厚片吐司' },
  { id: 31, name: '奶酥厚片', price: 30, category: '厚片', description: '奶酥厚片吐司' },

  // 飲料類
  { id: 32, name: '紅茶', price: 20, category: '飲料', description: '中杯紅茶 (可選熱/冰)' },
  { id: 33, name: '無糖綠茶', price: 20, category: '飲料', description: '中杯無糖綠茶 (可選熱/冰)' },
  { id: 34, name: '奶茶', price: 25, category: '飲料', description: '中杯奶茶 (可選熱/冰)' },
  { id: 35, name: '豆漿', price: 25, category: '飲料', description: '中杯豆漿 (可選熱/冰)' },
  { id: 36, name: '蘋果紅茶', price: 25, category: '飲料', description: '中杯蘋果紅茶 (可選熱/冰)' },
  { id: 37, name: '可可亞', price: 35, category: '飲料', description: '中杯可可亞 (可選熱/冰)' },
  { id: 38, name: '鮮奶茶', price: 35, category: '飲料', description: '中杯鮮奶茶 (可選熱/冰)' },

  // 大杯飲料
  { id: 39, name: '大杯紅茶', price: 25, category: '大杯飲料', description: '大杯紅茶 (可選熱/冰)' },
  { id: 40, name: '大杯奶茶', price: 30, category: '大杯飲料', description: '大杯奶茶 (可選熱/冰)' },
  { id: 41, name: '大杯豆漿', price: 30, category: '大杯飲料', description: '大杯豆漿 (可選熱/冰)' },
  { id: 42, name: '大杯蘋果紅茶', price: 30, category: '大杯飲料', description: '大杯蘋果紅茶 (可選熱/冰)' },
  { id: 43, name: '大杯可可亞', price: 40, category: '大杯飲料', description: '大杯可可亞 (可選熱/冰)' },
  { id: 44, name: '大杯鮮奶茶', price: 40, category: '大杯飲料', description: '大杯鮮奶茶 (可選熱/冰)' },

  // 咖啡類
  { id: 45, name: '熱咖啡', price: 40, category: '咖啡', description: '研磨咖啡' },
  { id: 46, name: '特調冰咖啡', price: 40, category: '咖啡', description: '特調冰咖啡' },
];

export default function HomePage() {
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  // 移除結帳模態視窗相關狀態
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [pickupNumber, setPickupNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState({
    pickupMethod: '內用',
    totalAmount: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [itemNotes, setItemNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // 檢查系統深色模式偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // 應用深色模式
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addToCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartItems = () => {
    return Object.entries(cart).map(([itemId, quantity]) => {
      const item = menuItems.find(item => item.id === parseInt(itemId));
      return { ...item!, quantity };
    });
  };

  const getTotalPrice = () => {
    return getCartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (getCartItems().length === 0) return;
    
    setIsSubmitting(true);
    try {
      const orderData = {
        customer_name: '現場取餐',
        customer_phone: '現場取餐',
        customer_address: '現場取餐',
        note: Object.values(itemNotes).filter(note => note.trim()).join('; '),
        total_amount: getTotalPrice(),
        items: getCartItems().map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          note: itemNotes[item.name] || ''
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        setOrderNumber(result.order_number);
        // 生成取餐號碼（現在訂單號碼就是四碼）
        const orderNum = result.order_number;
        setPickupNumber(orderNum);
        setOrderDetails({
          pickupMethod: '內用',
          totalAmount: getTotalPrice()
        });
        setShowOrderModal(true);
        setCart({});
        setItemNotes({});
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API 錯誤詳情:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`訂單提交失敗 (${response.status}): ${errorData.error || '未知錯誤'}`);
      }
    } catch (error) {
      console.error('提交訂單時發生錯誤:', error);
      alert(`訂單提交失敗：${error instanceof Error ? error.message : '請稍後再試'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 轉換為 OrderSidebar 需要的格式
  const getOrderItems = () => {
    return getCartItems().map(item => ({
      name: item.name,
      price: item.price,
      qty: item.quantity,
      note: itemNotes[item.name] || ''
    }));
  };

  const handleChangeQty = (name: string, qty: number) => {
    const item = menuItems.find(item => item.name === name);
    if (item) {
      if (qty <= 0) {
        removeFromCart(item.id);
      } else {
        setCart(prev => ({
          ...prev,
          [item.id]: qty
        }));
      }
    }
  };

  const handleRemove = (name: string) => {
    const item = menuItems.find(item => item.name === name);
    if (item) {
      removeFromCart(item.id);
    }
  };

  // 備註狀態已在上面定義

  const handleChangeNote = (name: string, note: string) => {
    setItemNotes(prev => ({
      ...prev,
      [name]: note
    }));
  };

  const handleAdminLogin = () => {
    if (adminPassword === '1234') {
      setShowAdminModal(false);
      setAdminPassword('');
      setAdminError('');
      window.open('/admin', '_blank');
    } else {
      setAdminError('密碼錯誤，請重新輸入');
    }
  };

  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
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
                早餐店線上訂餐系統
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
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
              <button
                onClick={() => setShowAdminModal(true)}
                className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                📊 管理
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {categories.map(category => (
                <div key={category} className="space-y-4">
                  <h2 className={`text-2xl font-bold border-b-2 border-orange-500 pb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems
                      .filter(item => item.category === category)
                      .map(item => (
                        <MenuCard
                          key={item.id}
                          name={item.name}
                          description={item.description || ''}
                          price={item.price}
                          onAdd={() => addToCart(item.id)}
                          quantity={cart[item.id] || 0}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Sidebar */}
          <div className="lg:col-span-1">
            <OrderSidebar
              order={getOrderItems()}
              onChangeQty={handleChangeQty}
              onRemove={handleRemove}
              onChangeNote={handleChangeNote}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {/* 移除結帳模態視窗 */}

            {/* Order Confirmation Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 text-center border-b border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">訂單建立成功!</h3>
                </div>
              </div>
            </div>

                          {/* Order Number Section */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">訂單號碼</p>
                  <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
                </div>

                {/* Pickup Number Section */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm text-blue-600">請記住您的訂單號</p>
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-2">{pickupNumber}</div>
                  <p className="text-xs text-blue-700">取餐時請報此號碼</p>
                </div>

              {/* Order Details */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 mb-1">取餐方式</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetails.pickupMethod}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-orange-600 mb-1">總金額</p>
                  <p className="text-sm font-semibold text-gray-900">${orderDetails.totalAmount}</p>
                </div>
              </div>

              {/* Pickup Reminders */}
              <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-3">
                  <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-sm font-semibold text-yellow-800">取餐提醒:</p>
                </div>
                <ul className="space-y-1">
                  <li className="text-xs text-red-600 flex items-start">
                    <span className="mr-2">•</span>
                    請記住您的訂單號: {pickupNumber}
                  </li>
                  <li className="text-xs text-red-600 flex items-start">
                    <span className="mr-2">•</span>
                    取餐時請主動報出訂單號
                  </li>
                  <li className="text-xs text-red-600 flex items-start">
                    <span className="mr-2">•</span>
                    我們會盡快為您準備餐點
                  </li>
                </ul>
              </div>

              {/* Confirm Button */}
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-lg shadow-xl transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <h3 className={`text-xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                🔐 後台管理登入
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    管理密碼
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminError('');
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAdminLogin();
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${adminError ? 'border-red-500' : ''}`}
                    placeholder="請輸入管理密碼"
                    autoFocus
                  />
                  {adminError && (
                    <p className="text-red-500 text-sm mt-1">{adminError}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAdminModal(false);
                    setAdminPassword('');
                    setAdminError('');
                  }}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  取消
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                >
                  登入
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 