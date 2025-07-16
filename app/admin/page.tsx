'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const ADMIN_PASSWORD = '1234';
const statusList = ['新訂單', '已處理', '已完成'];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 查詢所有訂單
  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      console.log('supabase orders:', data, error);
    if (!error) setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 5000); // 每5秒自動刷新
      return () => clearInterval(interval); // 離開頁面時清除計時器
    }
  }, [authed]);

  // 修改訂單狀態
  const updateOrderStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };

  // 刪除訂單
  const deleteOrder = async (id) => {
    await supabase.from('orders').delete().eq('id', id);
    fetchOrders();
  };

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded shadow w-80">
          <h2 className="text-xl font-bold mb-4">管理員登入</h2>
          <input
            type="password"
            className="border px-3 py-2 w-full mb-4"
            placeholder="請輸入管理密碼"
            value={pw}
            onChange={e => setPw(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            onClick={() => {
              if (pw === ADMIN_PASSWORD) setAuthed(true);
              else alert('密碼錯誤');
            }}
          >登入</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">訂單清單</h1>
      {loading ? (
        <div>載入中...</div>
      ) : orders.length === 0 ? (
        <div>目前沒有訂單。</div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded p-4 bg-white shadow">
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-500 text-sm">
                  {(() => {
                    const date = new Date(order.created_at);
                    const yyyy = date.getFullYear();
                    const MM = String(date.getMonth() + 1).padStart(2, '0');
                    const dd = String(date.getDate()).padStart(2, '0');
                    const HH = String(date.getHours()).padStart(2, '0');
                    const mm = String(date.getMinutes()).padStart(2, '0');
                    const ss = String(date.getSeconds()).padStart(2, '0');
                    return `${yyyy}/${MM}/${dd} ${HH}:${mm}:${ss}`;
                  })()}
                </div>
                <button
                  className="text-red-500 hover:underline text-sm"
                  onClick={() => { deleteOrder(order.id); }}
                >刪除</button>
              </div>
              <ul className="mb-2">
                {(order.items || []).map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.name} x {item.qty}</span>
                    <span>${item.price * item.qty}</span>
                    {item.note && <span className="ml-2 text-xs text-gray-400">({item.note})</span>}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2">
                <span className="text-sm">狀態：</span>
                <select
                  className="border px-2 py-1 rounded"
                  value={order.status}
                  onChange={e => { updateOrderStatus(order.id, e.target.value); }}
                >
                  {statusList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 