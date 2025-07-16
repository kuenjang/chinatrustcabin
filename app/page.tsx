'use client';
import React, { useState } from 'react';
import MenuCard from '../components/MenuCard';
import OrderSidebar from '../components/OrderSidebar';
import { useOrders } from './components/OrderStore';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';


// 分類商品資料
const menuList = [
  {
    category: '粉類（辣度：大/中/小）',
    items: [
      { name: '豪華版爆香蝦獅粉', description: '配料豐富的豪華版蝦獅粉湯，香氣浓郁。', price: 180 },
      { name: '招牌爆香蝦獅粉', description: '本店特色招牌蝦獅粉湯，經典美味。', price: 160 },
      { name: '鮮香肥腸蝦獅粉', description: '加入鮮美肥腸的蝦獅粉湯，風味獨特。', price: 150 },
      { name: '酸辣涼粉', description: '', price: 90 },
    ],
  },
  {
    category: '麵類（辣度：大/中/小）',
    items: [
      { name: '招牌爆香肥腸麵疙瘩', description: '', price: 150 },
      { name: '麻麻川香麵疙瘩', description: '', price: 140 },
      { name: '番茄雞蛋麵疙瘩', description: '', price: 120 },
    ],
  },
  {
    category: '冷飲',
    items: [
      { name: '養生菊花茶（冷/熱）', description: '', price: 50 },
      { name: '可樂（冷）', description: '', price: 50 },
      { name: '檸檬紅茶', description: '', price: 30 },
    ],
  },
  {
    category: '滷味',
    items: [
      { name: '香滷肥腸', description: '', price: 80 },
      { name: '醬大骨', description: '', price: 60 },
      { name: '雞腳', description: '', price: 15 },
      { name: '鴨胗', description: '', price: 40 },
      { name: '雞腿', description: '', price: 40 },
    ],
  },
  {
    category: '地方特色小菜類',
    items: [
      { name: '涼拌黃瓜木耳', description: '', price: 60 },
      { name: '涼拌花椰菜', description: '', price: 50 },
      { name: '涼拌豬耳朵', description: '', price: 80 },
      { name: '涼拌蓮藕', description: '', price: 80 },
      { name: '涼拌海帶', description: '', price: 60 },
    ],
  },
];

// 訂單商品型別
interface OrderItem {
  name: string;
  price: number;
  qty: number;
  note?: string;
}

export default function HomePage() {
  const [order, setOrder] = useState<OrderItem[]>([]);
  const { addOrder } = useOrders();

  // 加入訂單
  const handleAddToOrder = (item: { name: string; price: number }) => {
    setOrder(prev => {
      const exist = prev.find(i => i.name === item.name);
      if (exist) {
        return prev.map(i =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        return [...prev, { ...item, qty: 1, note: '' }];
      }
    });
  };

  // 調整數量
  const handleChangeQty = (name: string, qty: number) => {
    setOrder(prev =>
      prev.map(i => (i.name === name ? { ...i, qty: Math.max(1, qty) } : i))
    );
  };

  // 刪除商品
  const handleRemove = (name: string) => {
    setOrder(prev => prev.filter(i => i.name !== name));
  };

  // 修改特殊要求
  const handleChangeNote = (name: string, note: string) => {
    setOrder(prev =>
      prev.map(i => (i.name === name ? { ...i, note } : i))
    );
  };

  // 結帳
  const handleCheckout = async () => {
    if (order.length === 0) return;
    try {
      console.log('try insert');
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            items: order,
            status: '新訂單',
          },
        ]);
      if (error) throw error;
      setOrder([]);
      alert('訂單已送出！');
    } catch (err) {
      console.error(err);
      alert('訂單送出失敗！');
    }
  };

  return (
    <div className="min-h-screen bg-pink-100">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-xl font-bold">點餐系統</h1>
        <Link href="/admin" className="text-blue-600 underline">後台管理</Link>
      </header>
      {/* 主內容區域 */}
      <main className="max-w-7xl mx-auto py-10 px-2 md:px-8 flex flex-col md:flex-row gap-8 items-start">
        {/* 左側：單點餐品 */}
        <section className="flex-1">
          <h1 className="text-3xl font-extrabold text-pink-700 mb-8 border-b pb-2">單點餐品</h1>
          {menuList.map(group => (
            <div key={group.category} className="mb-10">
              <h2 className="text-2xl font-bold text-pink-700 mb-4">{group.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {group.items.map((item) => (
                  <MenuCard
                    key={item.name}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    onAdd={() => handleAddToOrder(item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
        {/* 右側：購物訂單 */}
        <aside className="w-full max-w-sm">
          <h1 className="text-2xl font-extrabold text-pink-700 mb-6 border-b pb-2">購物訂單</h1>
          <OrderSidebar
            order={order}
            onChangeQty={handleChangeQty}
            onRemove={handleRemove}
            onChangeNote={handleChangeNote}
          />
          <button
            className="bg-yellow-400 text-white px-4 py-2 rounded w-full text-lg font-bold mt-4"
            onClick={handleCheckout}
          >
            結帳
          </button>
        </aside>
      </main>
    </div>
  );
} 