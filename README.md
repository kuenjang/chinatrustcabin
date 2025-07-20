# 🍽️ 早餐店線上點餐系統

一個現代化的早餐店線上點餐系統，具備前台點餐、後台管理和即時 Telegram 通知功能。

## ✨ 功能特色

### 前台功能
- 🛒 直觀的點餐介面
- 📝 餐點備註功能
- 🍽️ 內用/外帶選擇
- 💰 即時價格計算
- 📱 響應式設計，支援手機和平板
- 🎨 美觀的粉色主題設計
- 🌙 深色模式支援
- ✨ 流暢的動畫效果

### 菜單內容
- **飲料 / Drinks**: 紅茶、奶茶、豆漿、可可亞、鮮奶茶等（中杯/大杯，熱飲/冰飲）
- **研磨咖啡 / Coffee**: 熱咖啡、特調冰咖啡
- **鐵板麵**: 蘑菇麵、黑胡椒麵、蕃茄肉醬麵（可加蛋）
- **蛋餅**: 原味、蔬菜、玉米、肉鬆、熱狗、火腿、起司、薯餅、鮪魚
- **蔥抓餅**: 原味、加蛋、火腿、玉米、肉鬆、起司、鮪魚、培根、燒肉、香雞、薯餅
- **厚片**: 巧克力、花生、草莓、沙拉、奶酥

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
- **UI 組件**: 自定義組件
- **資料庫**: Supabase (PostgreSQL)
- **通知系統**: Telegram Bot API
- **開發語言**: TypeScript

## 🚀 快速開始

### 1. 克隆專案
```bash
git clone <your-repository-url>
cd chinatrustcabin
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

components/
├── MenuCard.tsx    # 菜單卡片組件
└── OrderSidebar.tsx # 購物車側邊欄

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

## 🎨 設計特色

- **現代化設計**: 條列式菜單設計，清晰的視覺層次
- **深色模式**: 支援淺色/深色模式切換，保護眼睛
- **動畫效果**: 流暢的載入動畫、懸停效果和過渡動畫
- **響應式設計**: 完美適配手機、平板和桌面
- **直觀操作**: 簡潔明瞭的點餐流程
- **即時反饋**: 即時的價格計算和訂單確認
- **視覺指示**: 選擇狀態的視覺反饋
- **無障礙設計**: 良好的鍵盤導航和螢幕閱讀器支援

## 🎯 使用者體驗

### 菜單瀏覽
- 分類清晰的菜單結構
- 即時顯示選擇狀態
- 流暢的滾動和載入動畫

### 購物車管理
- 即時數量調整
- 特殊要求備註
- 一鍵刪除功能

### 結帳流程
- 清晰的取餐方式選擇
- 即時總價計算
- 美觀的訂單確認彈窗

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License

## 📞 支援

如有問題，請提交 Issue 或聯繫開發團隊。
