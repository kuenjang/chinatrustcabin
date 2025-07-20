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
                線上訂餐系統 - 部署測試
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