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
  { id: 1, name: '蛋餅', price: 35, category: '早餐', description: '新鮮雞蛋配蔥花' },
  { id: 2, name: '蔥抓餅', price: 30, category: '早餐', description: '香酥蔥抓餅' },
  { id: 3, name: '燒餅油條', price: 25, category: '早餐', description: '傳統燒餅配油條' },
  { id: 4, name: '豆漿', price: 20, category: '飲品', description: '濃郁豆漿' },
  { id: 5, name: '米漿', price: 20, category: '飲品', description: '香甜米漿' },
  { id: 6, name: '奶茶', price: 25, category: '飲品', description: '香濃奶茶' },
  { id: 7, name: '紅茶', price: 20, category: '飲品', description: '清爽紅茶' },
  { id: 8, name: '綠茶', price: 20, category: '飲品', description: '清香綠茶' },
  { id: 9, name: '三明治', price: 40, category: '早餐', description: '火腿蛋三明治' },
  { id: 10, name: '漢堡', price: 45, category: '早餐', description: '牛肉漢堡' },
  { id: 11, name: '吐司', price: 15, category: '早餐', description: '烤吐司' },
  { id: 12, name: '饅頭', price: 10, category: '早餐', description: '白饅頭' },
  { id: 13, name: '包子', price: 20, category: '早餐', description: '肉包' },
  { id: 14, name: '小籠包', price: 60, category: '早餐', description: '鮮肉小籠包' },
  { id: 15, name: '煎餃', price: 50, category: '早餐', description: '韭菜煎餃' },
  { id: 16, name: '鍋貼', price: 45, category: '早餐', description: '豬肉鍋貼' },
  { id: 17, name: '蘿蔔糕', price: 35, category: '早餐', description: '港式蘿蔔糕' },
  { id: 18, name: '腸粉', price: 40, category: '早餐', description: '蝦仁腸粉' },
  { id: 19, name: '粥品', price: 30, category: '早餐', description: '皮蛋瘦肉粥' },
  { id: 20, name: '油條', price: 15, category: '早餐', description: '酥脆油條' },
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
                          isSelected={(cart[item.id] || 0) > 0}
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