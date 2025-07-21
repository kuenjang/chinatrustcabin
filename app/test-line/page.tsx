'use client';

import { useState } from 'react';

export default function TestLinePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    details?: any;
  } | null>(null);

  const testLineNotification = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-line', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message
        });
      } else {
        setResult({
          success: false,
          error: data.error,
          details: data.details
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: '網路錯誤',
        details: error instanceof Error ? error.message : '未知錯誤'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Line 通知測試
          </h1>
          <p className="text-gray-600">
            測試您的 Line Bot 設定是否正確
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              📱 Line Bot 測試
            </h2>
            <p className="text-gray-600">
              點擊下方按鈕發送測試訊息到您的 Line
            </p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={testLineNotification}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  發送中...
                </>
              ) : (
                <>
                  📱 發送測試訊息
                </>
              )}
            </button>

            {result && (
              <div className={`p-4 rounded-lg border ${
                result.success 
                  ? 'border-green-200 bg-green-50 text-green-800' 
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  <span>{result.success ? '✅' : '❌'}</span>
                  <span>{result.success ? result.message : result.error}</span>
                </div>
                {result.details && (
                  <div className="mt-2 text-sm text-gray-600">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              設定檢查清單
            </h2>
            <p className="text-gray-600">
              請確認以下項目都已正確設定
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>已建立 Line Bot 並取得 Channel Access Token</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>已取得您的 Line User ID</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>已將 Bot 加入好友</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>已在 .env.local 中設定環境變數</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>已重新啟動開發伺服器</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              環境變數設定
            </h2>
            <p className="text-gray-600">
              請在 .env.local 檔案中加入以下設定
            </p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm">
{`# Line Bot 設定
LINE_CHANNEL_ACCESS_TOKEN=您的_Channel_Access_Token
LINE_USER_ID=您的_Line_User_ID`}
            </pre>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            如果測試失敗，請參考{' '}
            <a 
              href="/docs/line-setup.md" 
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Line 設定指南
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 