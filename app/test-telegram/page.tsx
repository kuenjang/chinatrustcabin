'use client';

import { useState } from 'react';

export default function TestTelegramPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testTelegram = async () => {
    setLoading(true);
    try {
      console.log('🧪 開始測試 Telegram 通知...');

      const response = await fetch('/api/test-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('📊 測試結果:', data);
      setResult(data);
    } catch (error) {
      console.error('❌ 測試失敗:', error);
      setResult({ error: error instanceof Error ? error.message : '未知錯誤' });
    } finally {
      setLoading(false);
    }
  };

  const testOrder = async () => {
    setLoading(true);
    try {
      console.log('📝 開始測試訂單提交...');

      const testOrderData = {
        customer_name: 'Telegram 測試客戶',
        customer_phone: '0912345678',
        customer_address: '測試地址',
        note: '這是 Telegram 通知測試訂單',
        total_amount: 150,
        items: [
          {
            name: '原味蛋餅',
            quantity: 2,
            price: 20
          },
          {
            name: '紅茶',
            quantity: 1,
            price: 20
          }
        ]
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testOrderData),
      });

      const data = await response.json();
      console.log('📊 訂單測試結果:', data);
      setResult(data);
    } catch (error) {
      console.error('❌ 訂單測試失敗:', error);
      setResult({ error: error instanceof Error ? error.message : '未知錯誤' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Telegram 通知測試</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">直接測試 Telegram</h2>
            <p className="text-gray-600 mb-4">測試 Telegram API 連接和通知發送</p>
            <button
              onClick={testTelegram}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '測試中...' : '測試 Telegram 通知'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">測試訂單通知</h2>
            <p className="text-gray-600 mb-4">提交測試訂單來觸發 Telegram 通知</p>
            <button
              onClick={testOrder}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '測試中...' : '提交測試訂單'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">測試結果</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">測試說明</h3>
          <ul className="text-yellow-700 space-y-1">
            <li>• 第一個按鈕會直接測試 Telegram API 連接</li>
            <li>• 第二個按鈕會提交一個測試訂單來觸發通知</li>
            <li>• 如果測試成功，您應該會在 Telegram 中收到通知</li>
            <li>• 檢查瀏覽器控制台以查看詳細日誌</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 