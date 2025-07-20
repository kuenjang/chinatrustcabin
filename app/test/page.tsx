'use client';

import { useState } from 'react';

export default function TestPage() {
  const [testResult, setTestResult] = useState<string>('');

  const testCheckout = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: '測試客戶',
          customer_phone: '0912345678',
          customer_address: '測試地址',
          note: '測試備註',
          total_amount: 100,
          items: [
            { name: '測試餐點', quantity: 1, price: 100 }
          ]
        }),
      });

      const result = await response.json();
      setTestResult(`結帳測試結果: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setTestResult(`結帳測試錯誤: ${error}`);
    }
  };

  const testAdmin = async () => {
    try {
      const response = await fetch('/api/orders');
      const result = await response.json();
      setTestResult(`後台管理測試結果: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setTestResult(`後台管理測試錯誤: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">功能測試頁面</h1>
        
        <div className="space-y-4">
          <button
            onClick={testCheckout}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            測試結帳功能
          </button>
          
          <button
            onClick={testAdmin}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-4"
          >
            測試後台管理
          </button>
        </div>

        {testResult && (
          <div className="mt-8 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">測試結果:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {testResult}
            </pre>
          </div>
        )}

        <div className="mt-8 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-4">功能連結:</h2>
          <div className="space-y-2">
            <a 
              href="/" 
              className="block text-blue-500 hover:underline"
            >
              🏠 主頁面 (點餐系統)
            </a>
            <a 
              href="/admin" 
              className="block text-blue-500 hover:underline"
            >
              📊 後台管理
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 