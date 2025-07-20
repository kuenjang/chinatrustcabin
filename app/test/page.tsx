export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          ✅ Vercel 部署成功！
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          如果您看到這個頁面，表示 Next.js 應用程式已經成功部署到 Vercel。
        </p>
        <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded">
          <p className="text-green-800 dark:text-green-200">
            專案名稱: chinatrustcabin<br/>
            部署時間: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
} 