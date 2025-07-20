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

  // 鐵板麵類
  { id: 21, name: '蘑菇麵', price: 40, category: '鐵板麵', description: '蘑菇鐵板麵 (+蛋10元)' },
  { id: 22, name: '黑胡椒麵', price: 40, category: '鐵板麵', description: '黑胡椒鐵板麵 (+蛋10元)' },
  { id: 23, name: '蕃茄肉醬麵', price: 40, category: '鐵板麵', description: '蕃茄肉醬鐵板麵 (+蛋10元)' },

  // 厚片類
  { id: 24, name: '巧克力厚片', price: 30, category: '厚片', description: '巧克力厚片吐司' },
  { id: 25, name: '花生厚片', price: 30, category: '厚片', description: '花生厚片吐司' },
  { id: 26, name: '草莓厚片', price: 30, category: '厚片', description: '草莓厚片吐司' },
  { id: 27, name: '沙拉厚片', price: 30, category: '厚片', description: '沙拉厚片吐司' },
  { id: 28, name: '奶酥厚片', price: 30, category: '厚片', description: '奶酥厚片吐司' },

  // 飲料類
  { id: 29, name: '紅茶', price: 20, category: '飲料', description: '中杯紅茶 (可選熱/冰)' },
  { id: 30, name: '無糖綠茶', price: 20, category: '飲料', description: '中杯無糖綠茶 (可選熱/冰)' },
  { id: 31, name: '奶茶', price: 25, category: '飲料', description: '中杯奶茶 (可選熱/冰)' },
  { id: 32, name: '豆漿', price: 25, category: '飲料', description: '中杯豆漿 (可選熱/冰)' },
  { id: 33, name: '蘋果紅茶', price: 25, category: '飲料', description: '中杯蘋果紅茶 (可選熱/冰)' },
  { id: 34, name: '可可亞', price: 35, category: '飲料', description: '中杯可可亞 (可選熱/冰)' },
  { id: 35, name: '鮮奶茶', price: 35, category: '飲料', description: '中杯鮮奶茶 (可選熱/冰)' },

  // 大杯飲料
  { id: 36, name: '大杯紅茶', price: 25, category: '大杯飲料', description: '大杯紅茶 (可選熱/冰)' },
  { id: 37, name: '大杯奶茶', price: 30, category: '大杯飲料', description: '大杯奶茶 (可選熱/冰)' },
  { id: 38, name: '大杯豆漿', price: 30, category: '大杯飲料', description: '大杯豆漿 (可選熱/冰)' },
  { id: 39, name: '大杯蘋果紅茶', price: 30, category: '大杯飲料', description: '大杯蘋果紅茶 (可選熱/冰)' },
  { id: 40, name: '大杯可可亞', price: 40, category: '大杯飲料', description: '大杯可可亞 (可選熱/冰)' },
  { id: 41, name: '大杯鮮奶茶', price: 40, category: '大杯飲料', description: '大杯鮮奶茶 (可選熱/冰)' },

  // 咖啡類
  { id: 42, name: '熱咖啡', price: 40, category: '咖啡', description: '研磨咖啡' },
  { id: 43, name: '特調冰咖啡', price: 40, category: '咖啡', description: '特調冰咖啡' },
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        note: customerInfo.note,
        total_amount: getTotalPrice(),
        items: getCartItems().map(item => ({
          name: item.name,
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
      note: ''
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

  const handleChangeNote = (name: string, note: string) => {
    // 這裡可以實現備註功能
    console.log(`Note for ${name}: ${note}`);
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
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? '提交中...' : '提交訂單'}
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