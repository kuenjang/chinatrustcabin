import React from 'react';

interface OrderItem {
  name: string;
  price: number;
  qty: number;
  note?: string;
}

interface OrderSidebarProps {
  order: OrderItem[];
  onChangeQty: (name: string, qty: number) => void;
  onRemove: (name: string) => void;
  onChangeNote: (name: string, note: string) => void;
  onCheckout?: () => void;
}

const OrderSidebar: React.FC<OrderSidebarProps> = ({ order, onChangeQty, onRemove, onChangeNote, onCheckout }) => {
  const total = order.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 判斷商品類型的函數
  const getItemUnit = (itemName: string) => {
    if (itemName.includes('茶') || itemName.includes('咖啡') || itemName.includes('豆漿') || itemName.includes('可可亞') || itemName.includes('奶茶')) {
      return '杯';
    } else if (itemName.includes('蛋餅') || itemName.includes('蔥抓餅') || itemName.includes('厚片')) {
      return '份';
    } else if (itemName.includes('麵')) {
      return '份';
    } else {
      return '份';
    }
  };

  return (
    <aside className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <span className="text-2xl">🛒</span> 您的訂單
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">在結賬前查看和定制您的項目。</p>
      
      {/* 訂單商品列表 */}
      <div className="mb-2 space-y-4 max-h-96 overflow-y-auto">
        {order.length === 0 ? (
          <div className="text-gray-400 dark:text-gray-500 text-center py-8">
            <div className="text-4xl mb-2">🍽️</div>
            <div>尚未選擇商品</div>
          </div>
        ) : (
          order.map((item, index) => (
            <div 
              key={item.name} 
              className="flex flex-col gap-2 border-b border-gray-200 dark:border-gray-700 pb-4 mb-2 last:border-b-0 last:pb-0 last:mb-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 text-base">{item.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">NT${item.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getItemUnit(item.name)}
                  </span>
                  <button
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-200 flex items-center justify-center"
                    onClick={() => onChangeQty(item.name, item.qty - 1)}
                    disabled={item.qty <= 1}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-gray-700 dark:text-gray-300 font-bold w-8 text-center">{item.qty}</span>
                  <button
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-200 flex items-center justify-center"
                    onClick={() => onChangeQty(item.name, item.qty + 1)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 flex items-center justify-center"
                    onClick={() => onRemove(item.name)}
                    title="刪除"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* 特殊要求輸入框 */}
              <div className="relative">
                <textarea
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg resize-none text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                  rows={2}
                  placeholder="添加特殊要求..."
                  value={item.note || ''}
                  onChange={e => onChangeNote(item.name, e.target.value)}
                />
                <div className="absolute top-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                  💬
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <hr className="my-4 border-gray-200 dark:border-gray-700" />
      
      {/* 總計 */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">總計</span>
        <span className="font-bold text-lg text-pink-600 dark:text-pink-400">NT${total}</span>
      </div>

      {/* 結帳按鈕 */}
      {order.length > 0 && onCheckout && (
        <button
          onClick={onCheckout}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span className="text-xl">🛒</span>
          結帳
        </button>
      )}
      
      {/* 自定義動畫樣式 */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </aside>
  );
};

export default OrderSidebar; 