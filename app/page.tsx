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
            />
          </div>
        </div>
      </div>
    </div>
  );
} 