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
  { id: 1, name: '招牌包廂蝦仁粉', price: 120, category: '主食', description: '新鮮蝦仁配特製醬料' },
  { id: 2, name: '招牌肥腸麵疙瘩', price: 130, category: '主食', description: '香嫩肥腸配手工麵疙瘩' },
  { id: 3, name: '媽媽川香麵疙瘩', price: 110, category: '主食', description: '川式香辣口味' },
  { id: 4, name: '番茄雞蛋麵疙瘩', price: 100, category: '主食', description: '經典番茄炒蛋口味' },
  { id: 5, name: '鮮香肥腸蝦仁粉', price: 140, category: '主食', description: '肥腸與蝦仁的完美結合' },
  { id: 6, name: '涼拌海帶', price: 60, category: '小菜', description: '清爽開胃' },
  { id: 7, name: '涼拌黃瓜木耳', price: 50, category: '小菜', description: '爽脆可口' },
  { id: 8, name: '涼拌花椰菜', price: 55, category: '小菜', description: '營養豐富' },
  { id: 9, name: '涼拌蓮藕', price: 65, category: '小菜', description: '清脆爽口' },
  { id: 10, name: '涼拌豬耳朵', price: 70, category: '小菜', description: '香辣有嚼勁' },
  { id: 11, name: '醬大骨', price: 80, category: '小菜', description: '濃郁醬香' },
  { id: 12, name: '雞腳', price: 75, category: '小菜', description: '膠質豐富' },
  { id: 13, name: '香爐肥腸', price: 90, category: '小菜', description: '香辣過癮' },
  { id: 14, name: '酸辣涼粉', price: 60, category: '小菜', description: '酸辣開胃' },
  { id: 15, name: '檸檬紅茶', price: 40, category: '飲品', description: '清爽解膩' },
  { id: 16, name: '養生菊花茶', price: 45, category: '飲品', description: '清熱降火' },
  { id: 17, name: '可樂', price: 35, category: '飲品', description: '經典碳酸飲料' },
];

export default function HomePage() {
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

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

  const handleCheckout = () => {
    if (getCartItems().length === 0) return;
    setShowCheckout(true);
  };

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert('請填寫姓名和電話');
      return;
    }

    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        note: customerInfo.note,
        total_amount: getTotalPrice(),
        items: getCartItems().map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price
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
        setShowOrderModal(true);
        setCart({});
        setCustomerInfo({ name: '', phone: '', address: '', note: '' });
        setShowCheckout(false);
      } else {
        throw new Error('訂單提交失敗');
      }
    } catch (error) {
      console.error('提交訂單時發生錯誤:', error);
      alert('訂單提交失敗，請稍後再試');
    }
  };

  const categories = [...new Set(menuItems.map(item => item.category))];

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
                線上訂餐系統
              </span>
            </div>
            
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
                          item={item}
                          quantity={cart[item.id] || 0}
                          onAdd={() => addToCart(item.id)}
                          onRemove={() => removeFromCart(item.id)}
                          isDarkMode={isDarkMode}
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
              cartItems={getCartItems()}
              totalPrice={getTotalPrice()}
              onCheckout={handleCheckout}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-lg shadow-xl transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <h3 className={`text-xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                填寫訂單資訊
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    姓名 *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="請輸入您的姓名"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    電話 *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="請輸入您的電話"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    地址
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="請輸入您的地址（選填）"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    備註
                  </label>
                  <textarea
                    value={customerInfo.note}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, note: e.target.value }))}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="特殊要求或備註（選填）"
                  />
                </div>

                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      總計：
                    </span>
                    <span className="text-xl font-bold text-orange-600">
                      NT$ {getTotalPrice()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCheckout(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitOrder}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                >
                  提交訂單
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-lg shadow-xl transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className={`text-xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                訂單提交成功！
              </h3>
              <p className={`mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                您的訂單號碼是：
              </p>
              <div className="text-2xl font-bold text-orange-600 mb-6">
                {orderNumber}
              </div>
              <p className={`text-sm mb-6 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                我們會透過 Telegram 通知您訂單狀態，請保持電話暢通。
              </p>
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 