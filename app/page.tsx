'use client';
import React, { useState } from 'react';
import MenuCard from '../components/MenuCard';
import OrderSidebar from '../components/OrderSidebar';
import Link from 'next/link';

// 分類商品資料
const menuList = [
  {
    category: '粉類（辣度：大/中/小）',
    items: [
      { name: '豪華版爆香蝦獅粉', description: '配料豐富的豪華版蝦獅粉湯，香氣浓郁。', price: 180, image: '/img/haohuaban_baoxiang_xiashifen.jpg' },
      { name: '招牌爆香蝦獅粉', description: '本店特色招牌蝦獅粉湯，經典美味。', price: 160, image: '/img/zhaopai_baoxiang_xiashifen.jpg' },
      { name: '鮮香肥腸蝦獅粉', description: '加入鮮美肥腸的蝦獅粉湯，風味獨特。', price: 150, image: '/img/xianxiang_feichang_xiashifen.jpg' },
      { name: '酸辣涼粉', description: '', price: 90, image: '/img/suanla_liangfen.jpg' },
    ],
  },
  {
    category: '麵類（辣度：大/中/小）',
    items: [
      { name: '招牌爆香肥腸麵疙瘩', description: '', price: 150, image: '/img/zhaopai_feichang_miangeda.jpg' },
      { name: '麻麻川香麵疙瘩', description: '', price: 140, image: '/img/mama_chuanxiang_miangeda.jpg' },
      { name: '番茄雞蛋麵疙瘩', description: '', price: 120, image: '/img/fanqie_jidan_miangeda.jpg' },
    ],
  },
  {
    category: '冷飲',
    items: [
      { name: '養生菊花茶（冷/熱）', description: '', price: 50, image: '/img/yangsheng_juhua_cha.jpg' },
      { name: '可樂（冷）', description: '', price: 50, image: '/img/kele.jpg' },
      { name: '檸檬紅茶', description: '', price: 30, image: '/img/ningmeng_hongcha.jpg' },
    ],
  },
  {
    category: '滷味',
    items: [
      { name: '香滷肥腸', description: '', price: 80, image: '/img/xianglu_feichang.jpg' },
      { name: '醬大骨', description: '', price: 60, image: '/img/jiang_dagu.jpg' },
      { name: '雞腳', description: '', price: 15, image: '/img/jijiao.jpg' },
      { name: '鴨胗', description: '', price: 40, image: '/img/yazhen.jpg' },
      { name: '雞腿', description: '', price: 40, image: '/img/jitui.jpg' },
    ],
  },
  {
    category: '地方特色小菜類',
    items: [
      { name: '涼拌黃瓜木耳', description: '', price: 60, image: '/img/liangban_huanggua_muer.jpg' },
      { name: '涼拌花椰菜', description: '', price: 50, image: '/img/liangban_huayecai.jpg' },
      { name: '涼拌豬耳朵', description: '', price: 80, image: '/img/liangban_zhuerduo.jpg' },
      { name: '涼拌蓮藕', description: '', price: 80, image: '/img/liangban_lianou.jpg' },
      { name: '涼拌海帶', description: '', price: 60, image: '/img/liangban_haidai.jpg' },
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
  const [deliveryType, setDeliveryType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // 計算總金額
  const totalAmount = order.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // 結帳
  const handleCheckout = async () => {
    if (order.length === 0) {
      alert('請先選擇餐點！');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        channel_code: 'ON', // 線上點餐
        customer_name: '線上客戶',
        customer_phone: '',
        total_amount: totalAmount,
        payment_method: 'cash',
        delivery_type: deliveryType,
        special_notes: '',
        items: order.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.qty,
          notes: item.note
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        alert(`訂單建立成功！\n訂單號：${result.order_number}\n取餐方式：${deliveryType === 'dine_in' ? '內用' : '外帶'}`);
        setOrder([]);
        setDeliveryType('dine_in');
      } else {
        alert(`訂單建立失敗：${result.error}`);
      }
    } catch (error) {
      console.error('訂單提交失敗:', error);
      alert('訂單提交失敗，請稍後再試！');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-100">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-xl font-bold">線上點餐系統</h1>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {group.items.map((item) => (
                  <MenuCard
                    key={item.name}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    image={item.image}
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

          {/* 取餐方式選擇 */}
          {order.length > 0 && (
            <div className="mt-6 bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">取餐方式</h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="dine_in"
                    checked={deliveryType === 'dine_in'}
                    onChange={(e) => setDeliveryType(e.target.value as 'dine_in' | 'takeaway')}
                    className="text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-gray-700">內用</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="takeaway"
                    checked={deliveryType === 'takeaway'}
                    onChange={(e) => setDeliveryType(e.target.value as 'dine_in' | 'takeaway')}
                    className="text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-gray-700">外帶</span>
                </label>
              </div>
            </div>
          )}

          {/* 結帳按鈕 */}
          {order.length > 0 && (
            <button
              className="bg-yellow-400 text-white px-4 py-2 rounded w-full text-lg font-bold mt-4 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCheckout}
              disabled={isSubmitting}
            >
              {isSubmitting ? '處理中...' : `結帳 $${totalAmount}`}
            </button>
          )}
        </aside>
      </main>
    </div>
  );
} 