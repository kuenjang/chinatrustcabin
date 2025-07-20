import React, { useState, useEffect } from 'react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
}

interface ItemSelectionModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, size: string, specialRequest: string) => void;
}

const ItemSelectionModal: React.FC<ItemSelectionModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');

  // 根據餐品類別設定預設大小選項
  const getSizeOptions = () => {
    if (!item) return [];
    
    switch (item.category) {
      case '飲料':
        return [
          { value: '中杯', label: '中杯' },
          { value: '大杯', label: '大杯 (+5元)' }
        ];
      case '蛋餅':
      case '炒飯麵類':
      case '鐵板麵類':
      case '鍋燒系列':
      case '飯類':
      case '水餃類':
        return [
          { value: '小份', label: '小份' },
          { value: '大份', label: '大份 (+10元)' }
        ];
      default:
        return []; // 蔥抓餅、厚片等不需要大小選擇
    }
  };

  const sizeOptions = getSizeOptions();
  const hasSizeOptions = sizeOptions.length > 0;

  // 計算價格（包含大小加價）
  const calculatePrice = () => {
    if (!item) return 0;
    
    let basePrice = item.price;
    if (size === '大杯') basePrice += 5;
    if (size === '大份') basePrice += 10;
    
    return basePrice * quantity;
  };

  // 重置表單
  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
      setSize(hasSizeOptions ? sizeOptions[0].value : '');
      setSpecialRequest('');
    }
  }, [isOpen, item, hasSizeOptions]);

  // 處理加入購物車
  const handleAddToCart = () => {
    if (!item) return;
    
    onAddToCart(item, quantity, size, specialRequest);
    onClose();
  };

  // 處理繼續點餐
  const handleContinueOrdering = () => {
    if (!item) return;
    
    onAddToCart(item, quantity, size, specialRequest);
    onClose();
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 標題欄 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            選擇 {item.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 內容區域 */}
        <div className="p-6 space-y-6">
          {/* 餐品資訊 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-2">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {item.description}
              </p>
            )}
            <p className="text-orange-600 dark:text-orange-400 font-bold text-lg">
              NT$ {item.price}
            </p>
          </div>

          {/* 數量選擇 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              數量
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100 min-w-[3rem] text-center">
                {quantity}
              </span>
              
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* 大小選擇 */}
          {hasSizeOptions && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                大小選擇
              </label>
              <div className="grid grid-cols-2 gap-3">
                {sizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSize(option.value)}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
                      ${size === option.value
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-600'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 特殊需求 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              特殊需求 (選填)
            </label>
            <textarea
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="例如：不要太辣、加蛋、去蔥..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* 總價 */}
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300 font-medium">總價</span>
              <span className="text-orange-600 dark:text-orange-400 font-bold text-xl">
                NT$ {calculatePrice()}
              </span>
            </div>
          </div>
        </div>

        {/* 按鈕區域 */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            加入購物車
          </button>
          
          <button
            onClick={handleContinueOrdering}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            加入購物車並繼續點餐
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemSelectionModal; 