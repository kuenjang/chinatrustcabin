import React, { useState } from 'react';

interface MenuCardProps {
  name: string;
  description: string;
  price: number;
  onAdd: () => void;
  quantity?: number;
}

const MenuCard: React.FC<MenuCardProps> = ({ name, description, price, onAdd, quantity = 0 }) => {
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
      onClick={onAdd}
    >
      {/* 數量指示器 */}
      {quantity > 0 && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">
            {quantity}
          </div>
        </div>
      )}

      {/* 內容區域 */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-1 truncate">
              {name}
            </h3>
            {description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {description}
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">
              NT${price}
            </span>
            
            {/* 加入按鈕 */}
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
                onAdd();
              }}
            >
              {quantity > 0 ? `已選 ${quantity}` : '加入'}
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