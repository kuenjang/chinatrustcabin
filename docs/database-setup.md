# 🗄️ 資料庫設定指南

## 問題診斷

如果遇到「訂單提交失敗」錯誤，可能是資料庫表結構或 RLS 政策問題。

## 解決方案

### 1. 執行資料庫升級腳本

在 Supabase SQL Editor 中執行以下腳本：

```sql
-- 中信小屋資料庫修復腳本
-- 此腳本會確保資料庫結構與 API 匹配

-- 1. 檢查並建立訂單表（如果不存在）
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address TEXT,
  note TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 檢查並建立訂單項目表（如果不存在）
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_name VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 建立必要的索引
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 4. 建立更新時間觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. 建立觸發器（如果不存在）
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. 啟用 Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 7. 建立 RLS 政策（允許所有操作）
DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on order_items" ON order_items;
CREATE POLICY "Allow all operations on order_items" ON order_items FOR ALL USING (true);

-- 8. 檢查結果
SELECT 'Database upgrade completed successfully!' as status;
```

### 2. 檢查環境變數

確保 `.env.local` 檔案包含正確的 Supabase 設定：

```env
# Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Telegram Bot 設定
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### 3. 測試資料庫連接

訪問 `http://localhost:3000/api/simple-test` 檢查基本連接。

### 4. 常見問題

#### 問題 1: RLS 政策阻止插入
**解決方案：** 執行上述資料庫升級腳本

#### 問題 2: 表結構不匹配
**解決方案：** 檢查表結構是否與 API 期望的欄位一致

#### 問題 3: 權限不足
**解決方案：** 確保使用正確的 Supabase 金鑰

### 5. 驗證步驟

1. 執行資料庫升級腳本
2. 重新啟動開發伺服器
3. 測試訂單提交功能
4. 檢查後台管理頁面

---

**注意：** 如果問題持續存在，請檢查 Supabase 專案設定和 API 金鑰權限。 