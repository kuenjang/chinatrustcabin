-- 中信小屋資料庫升級腳本
-- 此腳本會保留舊資料並建立新的資料庫結構

-- 1. 備份舊資料（如果存在）
-- 建立備份表
CREATE TABLE IF NOT EXISTS orders_backup AS 
SELECT * FROM orders WHERE 1=0;

CREATE TABLE IF NOT EXISTS order_items_backup AS 
SELECT * FROM order_items WHERE 1=0;

-- 複製舊資料到備份表
INSERT INTO orders_backup SELECT * FROM orders;
INSERT INTO order_items_backup SELECT * FROM order_items;

-- 2. 刪除舊的觸發器和政策
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 3. 刪除舊的索引
DROP INDEX IF EXISTS idx_orders_order_number;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_created_at;
DROP INDEX IF EXISTS idx_order_items_order_id;

-- 4. 刪除舊表（保留備份）
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;

-- 5. 建立新的訂單表
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

-- 6. 建立新的訂單項目表
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_name VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 建立索引
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- 8. 建立更新時間的觸發器
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

-- 9. 啟用 RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 10. 建立 RLS 政策
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

-- 11. 恢復舊資料（如果需要）
-- 注意：這部分需要根據舊資料結構進行調整
-- 如果舊資料結構與新結構不同，可能需要手動轉換

-- 顯示升級完成訊息
SELECT 'Database upgrade completed successfully!' as message; 