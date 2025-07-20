import React, { useState } from 'react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
}

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  quantity?: number;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onSelect, quantity = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`
        relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all duration-300 ease-in-out
        hover:shadow-lg hover:scale-[1.02] cursor-pointer
        ${quantity > 0 
          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-orange-200 dark:shadow-orange-900/30' 
          : 'border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-600'
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(item)}
    >
      {/* 數量指示器 */}
      {quantity > 0 && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {quantity}
        </div>
      )}

      {/* 內容區域 */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-1 truncate">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">
              NT${item.price}
            </span>
            
            {/* 選擇按鈕 */}
            <button 
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${quantity > 0
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/30'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white'
                }
              `}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
            >
              {quantity > 0 ? `已選 ${quantity}` : '選擇'}
            </button>
          </div>
        </div>
      </div>

      {/* 懸停效果 */}
      {isHovered && quantity === 0 && (
        <div className="absolute inset-0 bg-orange-500/5 rounded-xl pointer-events-none" />
      )}
    </div>
  );
};

export default MenuCard; 