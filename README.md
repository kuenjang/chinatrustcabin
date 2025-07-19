# 🍽️ 餐廳訂單管理系統

一個現代化的餐廳訂單管理系統，具備前台點餐、後台管理和即時 Telegram 通知功能。

## ✨ 功能特色

### 前台功能
- 🛒 直觀的點餐介面
- 📝 餐點備註功能
- 🍽️ 內用/外帶選擇
- 💰 即時價格計算
- 📱 響應式設計，支援手機和平板

### 後台管理
- 📊 訂單總覽和詳細資訊
- 🔄 訂單狀態管理
- 🗑️ 訂單刪除功能
- 📋 訂單明細查看
- 📈 每日訂單統計

### 即時通知
- 📱 Telegram 即時通知
- 📋 詳細的訂單資訊
- ⏰ 自動時間戳記
- 🎨 美觀的 Markdown 格式

## 🛠️ 技術架構

- **前端框架**: Next.js 14 + React 18
- **樣式框架**: Tailwind CSS
- **UI 組件**: ShadCN UI
- **資料庫**: Supabase (PostgreSQL)
- **通知系統**: Telegram Bot API
- **開發語言**: TypeScript

## 🚀 快速開始

### 1. 克隆專案
```bash
git clone <your-repository-url>
cd food-order
```

### 2. 安裝依賴
```bash
npm install
```

### 3. 環境設定
```bash
# 複製環境變數範例檔案
cp env.example .env.local

# 編輯 .env.local 檔案，填入你的設定
```

### 4. 設定 Telegram Bot
1. 在 Telegram 中找到 @BotFather
2. 建立新的 Bot 並獲得 Token
3. 在 @userinfobot 中獲得你的 Chat ID
4. 將這些資訊填入 `.env.local`

### 5. 啟動開發伺服器
```bash
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000) 查看應用程式。

## 📁 專案結構

```
app/
├── admin/           # 後台管理頁面
├── api/            # API 路由
│   ├── orders/     # 訂單 API
│   ├── telegram/   # Telegram 通知 API
│   └── test-telegram/ # 測試 API
├── components/     # React 組件
└── globals.css     # 全域樣式

lib/
├── supabaseClient.ts    # Supabase 客戶端
└── orderNumberService.ts # 訂單編號服務

docs/              # 文件
public/            # 靜態資源
```

## 🔧 環境變數

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token | `123456789:ABCdefGHIjklMNOpqrsTUVwxyz` |
| `TELEGRAM_CHAT_ID` | Telegram Chat ID | `123456789` |
| `NEXT_PUBLIC_BASE_URL` | 應用程式基礎 URL | `http://localhost:3000` |

## 📱 Telegram 設定

詳細的 Telegram Bot 設定指南請參考 [docs/telegram-setup.md](docs/telegram-setup.md)

## 🧪 測試

### 測試 Telegram 通知
訪問 `http://localhost:3000/api/test-telegram` 來測試 Telegram 通知功能。

## 📦 部署

### Vercel 部署
1. 將專案推送到 GitHub
2. 在 Vercel 中連接 GitHub 倉庫
3. 設定環境變數
4. 部署

### 其他平台
確保設定正確的環境變數，並遵循 Next.js 的部署指南。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License

## 📞 支援

如有問題，請提交 Issue 或聯繫開發團隊。
