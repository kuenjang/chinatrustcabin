'use client';
import React, { useState } from 'react';

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  // 深色模式切換
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 導航欄 */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                中信小屋訂餐系統
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* 深色模式切換 */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🎉 Vercel 部署成功！
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            您的訂餐系統已經成功部署到 Vercel
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              系統狀態
            </h3>
            <div className="space-y-2 text-left">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                <span className="text-gray-700 dark:text-gray-300">Next.js 應用程式</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                <span className="text-gray-700 dark:text-gray-300">Tailwind CSS 樣式</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                <span className="text-gray-700 dark:text-gray-300">深色模式支援</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                <span className="text-gray-700 dark:text-gray-300">Supabase 資料庫</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <a
              href="/test"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              查看測試頁面
            </a>
          </div>
        </div>
      </main>
    </div>
  );
} 