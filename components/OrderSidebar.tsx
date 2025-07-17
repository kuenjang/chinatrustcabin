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
}

const OrderSidebar: React.FC<OrderSidebarProps> = ({ order, onChangeQty, onRemove, onChangeNote }) => {
  const total = order.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <aside className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <span className="text-2xl">🛒</span> 您的訂單
      </h2>
      <p className="text-gray-500 text-sm mb-4">在結賬前查看和定制您的項目。</p>
      {/* 訂單商品列表 */}
      <div className="mb-2 space-y-4">
        {order.length === 0 ? (
          <div className="text-gray-400 text-center py-8">尚未選擇商品</div>
        ) : (
          order.map(item => (
            <div key={item.name} className="flex flex-col gap-1 border-b pb-3 mb-2 last:border-b-0 last:pb-0 last:mb-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold">{item.name}</div>
                  <div className="text-xs text-gray-500">NT${item.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 text-lg text-gray-500 hover:text-pink-600"
                    onClick={() => onChangeQty(item.name, item.qty - 1)}
                    disabled={item.qty <= 1}
                  >-</button>
                  <span className="text-gray-700 font-bold w-6 text-center">{item.qty}</span>
                  <button
                    className="px-2 text-lg text-gray-500 hover:text-pink-600"
                    onClick={() => onChangeQty(item.name, item.qty + 1)}
                  >+</button>
                  <button
                    className="text-red-400 hover:text-red-600 text-lg"
                    onClick={() => onRemove(item.name)}
                    title="刪除"
                  >移除</button>
                </div>
              </div>
              <textarea
                className="w-full mt-1 p-2 border rounded resize-none text-sm"
                rows={2}
                placeholder="添加特殊要求..."
                value={item.note || ''}
                onChange={e => onChangeNote(item.name, e.target.value)}
              />
            </div>
          ))
        )}
      </div>
      <hr className="my-4" />
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-lg">總計</span>
        <span className="font-bold text-lg text-red-700">NT${total}</span>
      </div>
      {/* <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 rounded text-lg">結帳</button> */}
    </aside>
  );
};

export default OrderSidebar; 