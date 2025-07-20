import React, { useState } from 'react';

interface MenuCardProps {
  name: string;
  description: string;
  price: number;
  onAdd: () => void;
  isSelected?: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ name, description, price, onAdd, isSelected = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`
        relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all duration-300 ease-in-out
        hover:shadow-lg hover:scale-[1.02] cursor-pointer
        ${isSelected 
          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-pink-200 dark:shadow-pink-900/30' 
          : 'border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-600'
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onAdd}
    >
      {/* 選擇指示器 */}
      <div className="absolute top-3 right-3">
        <div className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
          ${isSelected 
            ? 'border-pink-500 bg-pink-500' 
            : 'border-gray-300 dark:border-gray-600'
          }
        `}>
          {isSelected && (
            <svg 
              className="w-4 h-4 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

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
            <span className="text-pink-600 dark:text-pink-400 font-bold text-lg">
              NT${price}
            </span>
            
            {/* 加入按鈕 */}
            <button 
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${isSelected
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 dark:shadow-pink-900/30'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-pink-500 hover:text-white'
                }
              `}
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
            >
              {isSelected ? '已選擇' : '加入'}
            </button>
          </div>
        </div>
      </div>

      {/* 懸停效果 */}
      {isHovered && !isSelected && (
        <div className="absolute inset-0 bg-pink-500/5 rounded-xl pointer-events-none" />
      )}
    </div>
  );
};

export default MenuCard; 