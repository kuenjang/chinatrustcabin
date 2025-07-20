'use client';
import React, { useState, useEffect } from 'react';
import MenuCard from '../components/MenuCard';
import OrderSidebar from '../components/OrderSidebar';
import Link from 'next/link';

// 部署版本標記 - 強制重新部署
const DEPLOY_VERSION = 'v1.0.2';

// 分類商品資料
const menuList = [
  {
    category: '飲料 / Drinks',
    items: [
      { name: '紅茶 (中杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 20 },
      { name: '紅茶 (大杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 25 },
      { name: '無糖綠茶 (茶包)', description: '可選擇熱飲(H)或冰飲(I)', price: 20 },
      { name: '奶茶 (中杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 25 },
      { name: '奶茶 (大杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 30 },
      { name: '豆漿 (中杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 25 },
      { name: '豆漿 (大杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 30 },
      { name: '蘋果紅茶 (中杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 25 },
      { name: '蘋果紅茶 (大杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 30 },
      { name: '可可亞 (中杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 35 },
      { name: '可可亞 (大杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 40 },
      { name: '鮮奶茶 (中杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 35 },
      { name: '鮮奶茶 (大杯)', description: '可選擇熱飲(H)或冰飲(I)', price: 40 },
    ],
  },
  {
    category: '研磨咖啡 / Coffee',
    items: [
      { name: '熱咖啡', description: '香醇研磨咖啡', price: 40 },
      { name: '特調冰咖啡', description: '特製冰咖啡', price: 40 },
    ],
  },
  {
    category: '鐵板麵 (+蛋10元)',
    items: [
      { name: '蘑菇麵', description: '香炒蘑菇鐵板麵', price: 40 },
      { name: '黑胡椒麵', description: '黑胡椒風味鐵板麵', price: 40 },
      { name: '蕃茄肉醬麵', description: '蕃茄肉醬鐵板麵', price: 40 },
    ],
  },
  {
    category: '蛋餅',
    items: [
      { name: '原味蛋餅', description: '經典原味蛋餅', price: 20 },
      { name: '蔬菜蛋餅', description: '新鮮蔬菜蛋餅', price: 25 },
      { name: '玉米蛋餅', description: '香甜玉米蛋餅', price: 30 },
      { name: '肉鬆蛋餅', description: '香酥肉鬆蛋餅', price: 30 },
      { name: '熱狗蛋餅', description: '熱狗蛋餅', price: 30 },
      { name: '火腿蛋餅', description: '火腿蛋餅', price: 30 },
      { name: '起司蛋餅', description: '濃郁起司蛋餅', price: 30 },
      { name: '薯餅蛋餅', description: '香脆薯餅蛋餅', price: 35 },
      { name: '鮪魚蛋餅', description: '鮮美鮪魚蛋餅', price: 35 },
    ],
  },
  {
    category: '蔥抓餅',
    items: [
      { name: '原味蔥抓餅', description: '經典原味蔥抓餅', price: 30 },
      { name: '加蛋蔥抓餅', description: '加蛋蔥抓餅', price: 40 },
      { name: '火腿蔥抓餅', description: '火腿蔥抓餅', price: 45 },
      { name: '玉米蔥抓餅', description: '玉米蔥抓餅', price: 45 },
      { name: '肉鬆蔥抓餅', description: '肉鬆蔥抓餅', price: 45 },
      { name: '起司蔥抓餅', description: '起司蔥抓餅', price: 45 },
      { name: '鮪魚蔥抓餅', description: '鮪魚蔥抓餅', price: 50 },
      { name: '培根蔥抓餅', description: '培根蔥抓餅', price: 50 },
      { name: '燒肉蔥抓餅', description: '燒肉蔥抓餅', price: 55 },
      { name: '香雞蔥抓餅', description: '香雞蔥抓餅', price: 55 },
      { name: '薯餅蔥抓餅', description: '薯餅蔥抓餅', price: 55 },
    ],
  },
  {
    category: '厚片',
    items: [
      { name: '巧克力厚片', description: '香濃巧克力厚片', price: 30 },
      { name: '花生厚片', description: '香脆花生厚片', price: 30 },
      { name: '草莓厚片', description: '香甜草莓厚片', price: 30 },
      { name: '沙拉厚片', description: '清爽沙拉厚片', price: 30 },
      { name: '奶酥厚片', description: '香酥奶酥厚片', price: 30 },
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

// 訂單確認彈出視窗型別
interface OrderConfirmation {
  show: boolean;
  orderNumber: string;
  deliveryType: string;
  totalAmount: number;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          🍽️ 中信小屋訂餐系統
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              ✅ 部署成功
            </h2>
            <p className="text-green-700 dark:text-green-300 text-sm">
              系統已成功部署到 Vercel
            </p>
          </div>
          
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              🔧 系統狀態
            </h2>
            <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
              <li>• Next.js 應用程式 ✅</li>
              <li>• Tailwind CSS 樣式 ✅</li>
              <li>• 深色模式支援 ✅</li>
              <li>• 響應式設計 ✅</li>
            </ul>
          </div>
          
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              📋 下一步
            </h2>
            <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
              <li>• 設定 Supabase 資料庫</li>
              <li>• 配置環境變數</li>
              <li>• 恢復完整功能</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <a 
            href="/test" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            查看測試頁面
          </a>
        </div>
      </div>
    </div>
  );
} 