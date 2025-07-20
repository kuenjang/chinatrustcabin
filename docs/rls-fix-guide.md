# 🔧 RLS 政策修復指南

## 問題診斷

根據診斷結果，問題是 **RLS (Row Level Security) 政策阻止了訂單插入操作**。

## 解決方案

### 方法 1: 在 Supabase Dashboard 中修復

1. **登入 Supabase Dashboard**
   - 前往 https://supabase.com/dashboard
   - 選擇您的專案

2. **進入 SQL Editor**
   - 點擊左側選單的 "SQL Editor"
   - 點擊 "New query"

3. **執行修復腳本**

```sql
-- 修復 RLS 政策腳本（處理政策已存在的情況）
-- 執行此腳本來解決訂單提交失敗問題

-- 1. 啟用 RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 2. 刪除所有現有的政策（包括可能存在的重複政策）
DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
DROP POLICY IF EXISTS "Allow all operations on order_items" ON order_items;
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
DROP POLICY IF EXISTS "Enable insert access for all users" ON orders;
DROP POLICY IF EXISTS "Enable update access for all users" ON orders;
DROP POLICY IF EXISTS "Enable delete access for all users" ON orders;
DROP POLICY IF EXISTS "Enable read access for all users" ON order_items;
DROP POLICY IF EXISTS "Enable insert access for all users" ON order_items;
DROP POLICY IF EXISTS "Enable update access for all users" ON order_items;
DROP POLICY IF EXISTS "Enable delete access for all users" ON order_items;

-- 3. 建立新的寬鬆政策（允許所有操作）
CREATE POLICY "Allow all operations on orders" 
ON orders FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on order_items" 
ON order_items FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. 驗證修復
SELECT 'RLS policies fixed successfully!' as status;
```

4. **點擊 "Run" 執行腳本**

### 方法 2: 檢查並修復現有政策

如果上述方法仍有問題，請檢查現有政策：

```sql
-- 檢查現有的 RLS 政策
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, policyname;
```

然後根據結果調整政策：

```sql
-- 如果發現政策設定不正確，重新建立
DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
DROP POLICY IF EXISTS "Allow all operations on order_items" ON order_items;

-- 建立正確的政策
CREATE POLICY "Allow all operations on orders" 
ON orders FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on order_items" 
ON order_items FOR ALL 
USING (true) 
WITH CHECK (true);
```

### 方法 3: 完全重新設定 RLS

如果問題持續，可以完全重新設定：

```sql
-- 完全重新設定 RLS
-- 1. 禁用 RLS
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- 2. 刪除所有政策
DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
DROP POLICY IF EXISTS "Allow all operations on order_items" ON order_items;

-- 3. 重新啟用 RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 4. 建立新政策
CREATE POLICY "Allow all operations on orders" 
ON orders FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on order_items" 
ON order_items FOR ALL 
USING (true) 
WITH CHECK (true);

-- 5. 驗證
SELECT 'RLS completely reset and fixed!' as status;
```

### 方法 4: 檢查表結構

如果上述方法無效，請檢查表結構是否正確：

```sql
-- 檢查 orders 表結構
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 檢查 order_items 表結構
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY ordinal_position;
```

### 方法 5: 重新建立表（最後手段）

如果表結構有問題，可以重新建立：

```sql
-- 刪除現有表
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;

-- 重新建立 orders 表
CREATE TABLE orders (
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

-- 重新建立 order_items 表
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_name VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立索引
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- 建立觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 設定 RLS 政策
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on orders" 
ON orders FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on order_items" 
ON order_items FOR ALL 
USING (true) 
WITH CHECK (true);
```

## 驗證修復

修復完成後，請：

1. **重新啟動開發伺服器**
   ```bash
   npm run dev
   ```

2. **測試診斷 API**
   - 訪問 `http://localhost:3000/api/diagnose`
   - 確認 RLS 狀態顯示為 "permissive"

3. **測試訂單提交**
   - 添加商品到購物車
   - 點擊結帳
   - 確認顯示訂單號碼

## 常見問題

### Q: 為什麼會出現 "policy already exists" 錯誤？
A: 這表示政策已經存在，但可能設定不正確。使用 `DROP POLICY IF EXISTS` 先刪除再重新建立。

### Q: 為什麼會出現 RLS 問題？
A: Supabase 預設啟用 RLS，如果沒有正確的政策，會阻止所有操作。

### Q: 修復後還是有問題怎麼辦？
A: 請檢查：
- 環境變數是否正確
- Supabase 專案設定
- API 金鑰權限

### Q: 可以禁用 RLS 嗎？
A: 可以，但不建議。建議使用寬鬆的政策而不是完全禁用。

---

**注意：** 執行 SQL 腳本前請備份重要資料。 