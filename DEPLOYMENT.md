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

# Supabase 設定 (已設定完成)
NEXT_PUBLIC_SUPABASE_URL=https://rjfpddvihfolmmeqcrwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnBkZHZpaGZvbG1tZXFjcndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NzQ1MTEsImV4cCI6MjA2ODU1MDUxMX0.VBuB8vOrVKf0tIRDewoCzoayCnVTENebCGnuQIRQciw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnBkZHZpaGZvbG1tZXFjcndrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk3NDUxMSwiZXhwIjoyMDY4NTUwNTExfQ.E7n7Y-vPho_CFiG5rAW4plE_Sn_qybc52jb3E7kzz3A
```

### 3. 自動部署

設定完成後，每次推送到 `master` 分支都會自動觸發部署。

## Supabase 專案設定 (已完成)

### ✅ 專案資訊
- **專案名稱**: chinatrustcabin
- **專案 URL**: https://rjfpddvihfolmmeqcrwk.supabase.co
- **專案 ID**: rjfpddvihfolmmeqcrwk

### 設定資料庫結構

在 Supabase SQL Editor 中執行以下 SQL：

```sql
-- 創建訂單表
CREATE TABLE IF NOT EXISTS orders (
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
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 啟用 Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 創建策略（允許所有操作，實際使用時應該更嚴格）
DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on order_items" ON order_items;
CREATE POLICY "Allow all operations on order_items" ON order_items FOR ALL USING (true);

-- 創建更新時間觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 快速執行 SQL 的步驟：

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇 `chinatrustcabin` 專案
3. 點擊左側選單的 "SQL Editor"
4. 點擊 "New query"
5. 複製上面的 SQL 代碼並貼上
6. 點擊 "Run" 執行

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

創建 `.env.local` 文件並填入：

```bash
# Telegram Bot 設定
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# 應用程式基礎 URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase 設定 (已設定完成)
NEXT_PUBLIC_SUPABASE_URL=https://rjfpddvihfolmmeqcrwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnBkZHZpaGZvbG1tZXFjcndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NzQ1MTEsImV4cCI6MjA2ODU1MDUxMX0.VBuB8vOrVKf0tIRDewoCzoayCnVTENebCGnuQIRQciw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnBkZHZpaGZvbG1tZXFjcndrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk3NDUxMSwiZXhwIjoyMDY4NTUwNTExfQ.E7n7Y-vPho_CFiG5rAW4plE_Sn_qybc52jb3E7kzz3A
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