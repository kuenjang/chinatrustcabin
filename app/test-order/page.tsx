'use client';

import { useState } from 'react';

export default function TestOrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string>('');

  const testOrder = async () => {
    setIsSubmitting(true);
    setResult('測試中...');

    try {
      const orderData = {
        customer_name: '測試客戶',
        customer_phone: '0912345678',
        customer_address: '測試地址',
        note: '測試訂單',
        total_amount: 100,
        items: [
          {
            name: '原味蛋餅',
            quantity: 2,
            price: 20,
            note: '測試備註'
          }
        ]
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ 訂單提交成功！\n訂單號碼: ${data.order_number}\n訂單ID: ${data.order_id}`);
      } else {
        setResult(`❌ 訂單提交失敗！\n狀態碼: ${response.status}\n錯誤: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ 發生錯誤：${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">訂單提交測試</h1>
        
        <button
          onClick={testOrder}
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 mb-4"
        >
          {isSubmitting ? '測試中...' : '測試訂單提交'}
        </button>

        <div className="bg-gray-50 p-4 rounded">
          <h2 className="font-semibold mb-2">測試結果：</h2>
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      </div>
    </div>
  );
} 