# 🚀 部署指南

## Vercel 自動部署設定

### 1. 連接 GitHub 倉庫到 Vercel

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 "New Project"
3. 選擇 "Import Git Repository"
4. 選擇您的 `chinatrustcabin` 倉庫
5. 點擊 "Deploy"

### 2. 設定環境變數

在 Vercel 專案設定中，添加以下環境變數：

```bash
# Telegram Bot 設定
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# 應用程式基礎 URL (Vercel 會自動設定)
NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app

# Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. 自動部署

設定完成後，每次推送到 `master` 分支都會自動觸發部署。

## Supabase 新專案設定

### 1. 創建新的 Supabase 專案

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 點擊 "New Project"
3. 選擇組織
4. 輸入專案名稱：`chinatrustcabin`
5. 設定資料庫密碼
6. 選擇地區（建議選擇離您最近的）
7. 點擊 "Create new project"

### 2. 獲取專案設定

專案創建完成後，在 Settings > API 中獲取：

- Project URL
- anon public key
- service_role key

### 3. 設定資料庫結構

在 Supabase SQL Editor 中執行以下 SQL：

```sql
-- 創建訂單表
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  channel_code VARCHAR(10) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  delivery_type VARCHAR(20) NOT NULL,
  special_notes TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建訂單項目表
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- 啟用 Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 創建策略（允許所有操作，實際使用時應該更嚴格）
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on order_items" ON order_items FOR ALL USING (true);
```

### 4. 更新 Supabase 客戶端設定

確保 `lib/supabaseClient.ts` 使用新的專案設定：

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Telegram Bot 設定

### 1. 創建 Telegram Bot

1. 在 Telegram 中找到 @BotFather
2. 發送 `/newbot` 命令
3. 輸入 Bot 名稱和用戶名
4. 獲取 Bot Token

### 2. 獲取 Chat ID

1. 在 Telegram 中找到 @userinfobot
2. 發送任意訊息
3. 獲取您的 Chat ID

## 本地開發

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

```bash
cp env.example .env.local
# 編輯 .env.local 填入實際值
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

## 故障排除

### 常見問題

1. **Vercel 部署失敗**
   - 檢查環境變數是否正確設定
   - 確認所有依賴都已安裝

2. **Supabase 連接失敗**
   - 確認專案 URL 和 Key 是否正確
   - 檢查資料庫是否已創建

3. **Telegram 通知不工作**
   - 確認 Bot Token 和 Chat ID 是否正確
   - 檢查 Bot 是否有發送訊息的權限

### 支援

如有問題，請檢查：
- Vercel 部署日誌
- Supabase 專案日誌
- 瀏覽器開發者工具 