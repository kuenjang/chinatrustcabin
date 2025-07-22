'use client';

import { useState, useEffect } from 'react';
import MenuCard from '../components/MenuCard';
import OrderSidebar from '../components/OrderSidebar';
import ItemSelectionModal from '../components/ItemSelectionModal';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  specialRequest: string;
  category: string;
  sugar: string; // 新增
}

const menuItems: MenuItem[] = [
  // 蛋餅類
  { id: 1, name: '原味蛋餅', price: 25, category: '蛋餅', description: '經典原味蛋餅' },
  { id: 2, name: '玉米蛋餅', price: 35, category: '蛋餅', description: '香甜玉米蛋餅' },
  { id: 3, name: '肉鬆蛋餅', price: 35, category: '蛋餅', description: '香酥肉鬆蛋餅' },
  { id: 4, name: '熱狗蛋餅', price: 35, category: '蛋餅', description: '熱狗蛋餅' },
  { id: 5, name: '火腿蛋餅', price: 35, category: '蛋餅', description: '火腿蛋餅' },
  { id: 6, name: '起司蛋餅', price: 35, category: '蛋餅', description: '濃郁起司蛋餅' },
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
  { id: 18, name: '薯餅蔥抓餅', price: 55, category: '蔥抓餅', description: '薯餅蔥抓餅' },

  // 炒飯麵類
  { id: 19, name: '炒飯', price: 60, category: '炒飯麵類', description: '香噴噴的炒飯，配料豐富' },
  { id: 20, name: '炒泡麵', price: 50, category: '炒飯麵類', description: 'Q彈炒泡麵，香辣可口' },
  { id: 21, name: '炒意麵', price: 55, category: '炒飯麵類', description: '義大利麵炒製，口感絕佳' },

  // 鍋燒系列
  { id: 22, name: '鍋燒意麵', price: 70, category: '鍋燒系列', description: '熱騰騰的鍋燒意麵，湯頭濃郁' },
  { id: 23, name: '鍋燒雞絲', price: 75, category: '鍋燒系列', description: '鮮嫩雞絲鍋燒，營養美味' },
  { id: 24, name: '鍋燒烏龍麵', price: 70, category: '鍋燒系列', description: 'Q彈烏龍麵，湯頭鮮美' },
  { id: 25, name: '鍋燒泡麵', price: 65, category: '鍋燒系列', description: '經典鍋燒泡麵，香辣過癮' },

  // 飯類
  { id: 26, name: '雞肉飯', price: 60, category: '飯類', description: '香嫩雞肉飯，配菜豐富' },
  { id: 27, name: '肉燥飯', price: 55, category: '飯類', description: '傳統肉燥飯，香濃可口' },

  // 水餃類
  { id: 28, name: '水餃', price: 50, category: '水餃類', description: '手工水餃，皮薄餡多' },

  // 鐵板麵類
  { id: 29, name: '蘑菇麵', price: 40, category: '鐵板麵', description: '蘑菇鐵板麵' },
  { id: 30, name: '黑胡椒麵', price: 40, category: '鐵板麵', description: '黑胡椒鐵板麵' },
  { id: 31, name: '蕃茄肉醬麵', price: 40, category: '鐵板麵', description: '蕃茄肉醬鐵板麵' },

  // 厚片類
  { id: 32, name: '巧克力厚片', price: 30, category: '厚片', description: '巧克力厚片吐司' },
  { id: 33, name: '花生厚片', price: 30, category: '厚片', description: '花生厚片吐司' },
  { id: 34, name: '奶酥厚片', price: 30, category: '厚片', description: '奶酥厚片吐司' },

  // 飲料類
  { id: 35, name: '紅茶', price: 25, category: '飲料', description: '經典紅茶' },
  { id: 36, name: '綠茶', price: 25, category: '飲料', description: '清新綠茶' },
  { id: 48, name: '奶茶', price: 25, category: '飲料', description: '香濃奶茶' },
  { id: 53, name: '鮮奶茶', price: 45, category: '飲料', description: '濃醇鮮奶茶' },
  { id: 44, name: '鮮奶綠', price: 45, category: '飲料', description: '鮮奶綠茶' },
  { id: 41, name: '冬瓜茶', price: 25, category: '飲料', description: '古早味冬瓜茶' },
  { id: 43, name: '冬瓜紅', price: 25, category: '飲料', description: '冬瓜紅茶' },
  { id: 42, name: '冬瓜綠', price: 25, category: '飲料', description: '冬瓜綠茶' },
  { id: 37, name: '梅子綠', price: 25, category: '飲料', description: '梅子風味綠茶' },
  { id: 38, name: '阿華田', price: 45, category: '飲料', description: '經典阿華田' },
  { id: 39, name: '多多綠', price: 45, category: '飲料', description: '多多綠茶' },
  { id: 40, name: '多多檸檬', price: 45, category: '飲料', description: '多多檸檬茶' },
  { id: 45, name: '冬瓜檸檬', price: 45, category: '飲料', description: '冬瓜檸檬茶' },
  { id: 46, name: '薄荷綠', price: 25, category: '飲料', description: '薄荷綠茶' },
  { id: 56, name: '奶綠', price: 25, category: '飲料', description: '奶香綠茶' },
  { id: 57, name: '薄荷奶綠', price: 45, category: '飲料', description: '薄荷奶綠茶' },
  { id: 58, name: '檸檬紅', price: 30, category: '飲料', description: '檸檬紅茶' },
  { id: 59, name: '檸檬綠', price: 30, category: '飲料', description: '檸檬綠茶' },
  { id: 47, name: '蜜茶', price: 25, category: '飲料', description: '香甜蜜茶' },
  { id: 49, name: '椰果奶茶', price: 45, category: '飲料', description: '椰果奶茶' },
  { id: 50, name: '豆漿', price: 25, category: '飲料', description: '香濃豆漿' },
  { id: 51, name: '可可亞', price: 45, category: '飲料', description: '可可亞飲品' },
  { id: 54, name: '黑咖啡', price: 50, category: '飲料', description: '純粹黑咖啡' },
  { id: 55, name: '拿鐵咖啡', price: 55, category: '飲料', description: '香濃拿鐵' },
];

export default function HomePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
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
  
  // 選擇視窗狀態
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showSelectionModal, setShowSelectionModal] = useState(false);

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

  // 處理餐品選擇
  const handleItemSelect = (item: MenuItem) => {
    setSelectedItem(item);
    setShowSelectionModal(true);
  };

  // 將 handleAddToCart 改為直接用傳進來的 price，不再根據 size 加價，並支援 sugar
  const handleAddToCart = (item: MenuItem, quantity: number, size: string, specialRequest: string, price: number, sugar: string) => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price, // 直接用 modal 算好的單價
      quantity,
      size,
      specialRequest,
      sugar,
      category: item.category
    };
    setCart(prev => [...prev, cartItem]);
  };

  // 從購物車移除項目
  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // 更新購物車項目數量
  const updateCartItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
    } else {
      setCart(prev => prev.map((item, i) => 
        i === index ? { ...item, quantity } : item
      ));
    }
  };

  // 獲取購物車總價
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // 獲取每個餐品的總數量（用於顯示在卡片上）
  const getItemTotalQuantity = (itemId: number) => {
    return cart
      .filter(item => item.id === itemId)
      .reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    try {
      // 將購物車項目轉換為訂單格式
      const orderItems = cart.map(item => ({
        name: item.name, // 純品名
        quantity: item.quantity,
        size: item.size,
        sugar: item.sugar,
        note: item.specialRequest || ''
      }));
      const orderData = {
        customer_name: '現場取餐',
        customer_phone: '現場取餐',
        customer_address: '現場取餐',
        note: cart.map(item => item.specialRequest).filter(note => note.trim()).join('; '),
        items: orderItems
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
        setPickupNumber(result.order_number);
        setOrderDetails({
          pickupMethod: '內用',
          totalAmount: getTotalPrice()
        });
        setShowOrderModal(true);
        setCart([]); // 清空購物車
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
    return cart.map(item => ({
      name: item.name, // 只傳純品名
      size: item.size, // 額外傳 size
      price: item.price,
      qty: item.quantity,
      note: item.specialRequest || '',
      sugar: item.sugar || ''
    }));
  };

  const handleChangeQty = (name: string, size: string, qty: number) => {
    const index = cart.findIndex(item => item.name === name && item.size === size);
    if (index !== -1) {
      updateCartItemQuantity(index, qty);
    }
  };

  const handleRemove = (name: string, size: string) => {
    const index = cart.findIndex(item => item.name === name && item.size === size);
    if (index !== -1) {
      removeFromCart(index);
    }
  };

  const handleChangeNote = (name: string, size: string, note: string) => {
    const index = cart.findIndex(item => item.name === name && item.size === size);
    if (index !== -1) {
      setCart(prev => prev.map((item, i) => 
        i === index ? { ...item, specialRequest: note } : item
      ));
    }
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
                          item={item}
                          onSelect={handleItemSelect}
                          quantity={getItemTotalQuantity(item.id)}
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
              onChangeQty={(name, size, qty) => handleChangeQty(name, size, qty)}
              onRemove={(name, size) => handleRemove(name, size)}
              onChangeNote={(name, size, note) => handleChangeNote(name, size, note)}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {/* 餐品選擇視窗 */}
      <ItemSelectionModal
        item={selectedItem}
        isOpen={showSelectionModal}
        onClose={() => {
          setShowSelectionModal(false);
          setSelectedItem(null);
        }}
        onAddToCart={handleAddToCart}
      />

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

              {/* Close Button */}
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                管理員登入
              </h3>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="請輸入管理員密碼"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
              {adminError && (
                <p className="text-red-500 text-sm mt-2">{adminError}</p>
              )}
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  登入
                </button>
                <button
                  onClick={() => {
                    setShowAdminModal(false);
                    setAdminPassword('');
                    setAdminError('');
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 