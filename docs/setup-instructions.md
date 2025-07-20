# 中信小屋點餐系統 - 完整設定指南

## 🚀 快速開始

### 1. 環境變數設定

複製 `env.example` 為 `.env.local` 並填入以下資訊：

```bash
# Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Telegram Bot 設定
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here

# 應用程式設定
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Supabase 設定

#### 建立 Supabase 專案
1. 前往 [Supabase](https://supabase.com) 建立新專案
2. 複製專案 URL 和 API 金鑰
3. 在 SQL Editor 中執行 `lib/database-schema.sql` 建立資料表

#### 設定 RLS (Row Level Security)
```sql
-- 啟用 RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 允許匿名用戶插入訂單
CREATE POLICY "Allow anonymous insert" ON orders
  FOR INSERT WITH CHECK (true);

-- 允許匿名用戶插入訂單項目
CREATE POLICY "Allow anonymous insert" ON order_items
  FOR INSERT WITH CHECK (true);

-- 允許服務角色完整存取
CREATE POLICY "Service role full access" ON orders
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON order_items
  FOR ALL USING (auth.role() = 'service_role');
```

### 3. Telegram Bot 設定

#### 建立 Bot
1. 在 Telegram 中搜尋 `@BotFather`
2. 發送 `/newbot` 指令
3. 設定 Bot 名稱和用戶名
4. 複製 Bot Token

#### 獲取 Chat ID
1. 在 Telegram 中搜尋 `@userinfobot`
2. 發送 `/start` 指令
3. 複製你的 Chat ID

### 4. 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

### 5. Vercel 部署

#### 自動部署
1. 將程式碼推送到 GitHub
2. 在 Vercel 中連接 GitHub 專案
3. 設定環境變數
4. 部署完成

#### 環境變數設定
在 Vercel 專案設定中新增以下環境變數：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `NEXT_PUBLIC_BASE_URL` (設為你的 Vercel 網址)

## 📱 功能特色

### 客戶端功能
- ✅ 現代化響應式設計
- ✅ 深色模式支援
- ✅ 購物車功能
- ✅ 訂單提交
- ✅ 訂單號碼顯示
- ✅ 客戶資訊收集

### 後台管理功能
- ✅ 訂單列表查看
- ✅ 訂單狀態管理
- ✅ 訂單詳情查看
- ✅ 即時更新
- ✅ 深色模式支援

### 通知系統
- ✅ Telegram 即時通知
- ✅ 訂單狀態更新
- ✅ 客戶資訊顯示

## 🔧 技術架構

- **前端**: Next.js 14 + React 18 + TypeScript
- **樣式**: Tailwind CSS + 深色模式
- **後端**: Supabase (PostgreSQL)
- **通知**: Telegram Bot API
- **部署**: Vercel

## 📁 專案結構

```
chinatrustcabin/
├── app/
│   ├── admin/          # 後台管理頁面
│   ├── api/            # API 路由
│   └── page.tsx        # 主頁面
├── components/         # React 組件
├── lib/               # 工具函數和配置
├── public/            # 靜態資源
└── docs/              # 文件
```

## 🛠️ 故障排除

### 常見問題

1. **Supabase 連接失敗**
   - 檢查環境變數是否正確
   - 確認 Supabase 專案狀態

2. **Telegram 通知不工作**
   - 檢查 Bot Token 是否正確
   - 確認 Chat ID 是否正確
   - 檢查 Bot 是否有發送訊息權限

3. **訂單提交失敗**
   - 檢查資料庫結構是否正確
   - 確認 RLS 政策設定
   - 查看瀏覽器開發者工具錯誤

4. **部署問題**
   - 確認所有環境變數已設定
   - 檢查 Vercel 部署日誌
   - 確認 GitHub 分支正確

## 📞 支援

如有問題，請檢查：
1. 環境變數設定
2. Supabase 資料庫結構
3. Telegram Bot 設定
4. Vercel 部署日誌 