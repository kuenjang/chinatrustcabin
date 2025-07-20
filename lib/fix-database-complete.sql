-- 🚨 完整資料庫修復腳本
-- 在 Supabase SQL Editor 中執行此腳本

-- 1. 清理現有表（如果存在）
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_channels CASCADE;

-- 2. 建立 order_channels 表
CREATE TABLE order_channels (
    id SERIAL PRIMARY KEY,
    channel_code VARCHAR(10) UNIQUE NOT NULL,
    channel_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 建立 orders 表
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    channel_code VARCHAR(10) DEFAULT 'ON',
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT,
    note TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 建立 order_items 表
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 插入預設通道資料
INSERT INTO order_channels (channel_code, channel_name) VALUES
('ON', '線上點餐'),
('WA', '現場點餐')
ON CONFLICT (channel_code) DO NOTHING;

-- 6. 建立索引
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- 7. 設定 RLS 政策
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_channels ENABLE ROW LEVEL SECURITY;

-- 刪除現有政策（如果存在）
DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
DROP POLICY IF EXISTS "Allow all operations on order_items" ON order_items;
DROP POLICY IF EXISTS "Allow all operations on order_channels" ON order_channels;

-- 建立新政策
CREATE POLICY "Allow all operations on orders" 
ON orders FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on order_items" 
ON order_items FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on order_channels" 
ON order_channels FOR ALL 
USING (true) 
WITH CHECK (true);

-- 8. 插入測試資料
INSERT INTO orders (order_number, channel_code, customer_name, customer_phone, customer_address, note, total_amount, status) VALUES
('TEST-001', 'ON', '測試客戶1', '0912345678', '測試地址1', '測試訂單1', 150.00, 'pending'),
('TEST-002', 'ON', '測試客戶2', '0923456789', '測試地址2', '測試訂單2', 200.00, 'completed');

-- 9. 插入測試訂單項目
INSERT INTO order_items (order_id, menu_item_name, quantity, price, subtotal) VALUES
(1, '原味蛋餅', 2, 20.00, 40.00),
(1, '蔬菜蛋餅', 1, 25.00, 25.00),
(1, '熱狗蛋餅', 1, 30.00, 30.00),
(1, '起司蛋餅', 1, 35.00, 35.00),
(1, '鮪魚蛋餅', 1, 40.00, 40.00),
(2, '蔥抓餅', 2, 30.00, 60.00),
(2, '加蛋蔥抓餅', 2, 40.00, 80.00),
(2, '原味蛋餅', 1, 20.00, 20.00),
(2, '蔬菜蛋餅', 1, 25.00, 25.00);

-- 10. 驗證修復
SELECT 'Database fix completed successfully!' as status;
SELECT COUNT(*) as orders_count FROM orders;
SELECT COUNT(*) as order_items_count FROM order_items;
SELECT COUNT(*) as channels_count FROM order_channels; 