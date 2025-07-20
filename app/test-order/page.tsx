'use client';

import { useState } from 'react';

export default function TestOrderPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testOrder = async () => {
    setLoading(true);
    try {
      const testData = {
        customer_name: '測試客戶',
        customer_phone: '0912345678',
        customer_address: '測試地址',
        note: '這是一個測試訂單',
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

      console.log('發送測試訂單:', testData);

      const response = await fetch('/api/debug-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      console.log('測試結果:', data);
      setResult(data);
    } catch (error) {
      console.error('測試失敗:', error);
      setResult({ error: error instanceof Error ? error.message : '未知錯誤' });
    } finally {
      setLoading(false);
    }
  };

  const testNormalOrder = async () => {
    setLoading(true);
    try {
      const testData = {
        customer_name: '現場取餐',
        customer_phone: '現場取餐',
        customer_address: '現場取餐',
        note: '這是一個正常訂單測試',
        total_amount: 100,
        items: [
          {
            name: '原味蛋餅',
            quantity: 1,
            price: 20
          },
          {
            name: '奶茶',
            quantity: 1,
            price: 25
          }
        ]
      };

      console.log('發送正常訂單:', testData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      console.log('正常訂單結果:', data);
      setResult(data);
    } catch (error) {
      console.error('正常訂單測試失敗:', error);
      setResult({ error: error instanceof Error ? error.message : '未知錯誤' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">訂單提交測試</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">除錯測試</h2>
            <p className="text-gray-600 mb-4">使用除錯 API 測試訂單提交</p>
            <button
              onClick={testOrder}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '測試中...' : '開始除錯測試'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">正常訂單測試</h2>
            <p className="text-gray-600 mb-4">使用正常 API 測試訂單提交</p>
            <button
              onClick={testNormalOrder}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '測試中...' : '開始正常測試'}
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
      </div>
    </div>
  );
} 